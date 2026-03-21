import { CredentialType } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { PAGINATION } from "@/config/constant";
import prisma from "@/lib/db";
import { encrypt } from "@/lib/encryption";
import { polarClient } from "@/lib/polar";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const credentialsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required"),
        type: z.enum(CredentialType),
        value: z.string().min(1, "Value is required"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { name, value, type } = input;

      const customer = await polarClient.customers.getStateExternal({
        externalId: ctx.auth.user.id,
      });
      const hasActiveSubscription = !!customer.activeSubscriptions?.length;

      if (!hasActiveSubscription) {
        const credentialCount = await prisma.credential.count({
          where: {
            userId: ctx.auth.user.id,
          },
        });

        if (credentialCount >= 1) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You need a premium subscription to access this feature",
          });
        }
      }

      return prisma.credential.create({
        data: {
          name,
          userId: ctx.auth.user.id,
          type,
          value: encrypt(value),
        },
      });
    }),

  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return prisma.credential.delete({
        where: {
          id: input.id,
          userId: ctx.auth.user.id,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1, "Name is required"),
        type: z.enum(CredentialType),
        value: z.string().min(1, "Value is required"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, name, type, value } = input;

      return prisma.credential.update({
        where: {
          id,
          userId: ctx.auth.user.id,
        },
        data: {
          name,
          type,
          value: encrypt(value),
        },
      });
    }),

  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await prisma.credential.findUniqueOrThrow({
        where: {
          id: input.id,
          userId: ctx.auth.user.id,
        },
      });
    }),

  getAll: protectedProcedure
    .input(
      z.object({
        page: z.number().default(PAGINATION.DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(PAGINATION.MIN_PAGE_SIZE)
          .max(PAGINATION.MAX_PAGE_SIZE)
          .default(PAGINATION.DEFAULT_PAGE_SIZE),
        search: z.string().default(""),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, search } = input;

      const [items, totalCount] = await Promise.all([
        prisma.credential.findMany({
          where: {
            userId: ctx.auth.user.id,
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
          take: pageSize,
          skip: (page - 1) * pageSize,
          orderBy: {
            updatedAt: "desc",
          },
          select: {
            id: true,
            name: true,
            type: true,
            createdAt: true,
            updatedAt: true,
          },
        }),
        prisma.credential.count({
          where: {
            userId: ctx.auth.user.id,
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        }),
      ]);

      const totalPages = Math.ceil(totalCount / pageSize);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;
      return {
        items,
        totalCount,
        page,
        pageSize,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      };
    }),

  getByType: protectedProcedure
    .input(z.object({ type: z.enum(CredentialType) }))
    .query(async ({ ctx, input }) => {
      return await prisma.credential.findMany({
        where: {
          userId: ctx.auth.user.id,
          type: input.type,
        },
        orderBy: {
          updatedAt: "desc",
        },
        select: {
          id: true,
          name: true,
          type: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    }),
});
