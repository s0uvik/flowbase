import { PAGINATION } from "@/config/constant";
import prisma from "@/lib/db";
import { protectedProcedure, createTRPCRouter } from "@/trpc/init";
import z from "zod";

export const executionsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await prisma.execution.findUniqueOrThrow({
        where: {
          id: input.id,
          workflow: {
            userId: ctx.auth.user.id,
          },
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
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize } = input;

      const [items, totalCount] = await Promise.all([
        prisma.execution.findMany({
          where: {
            workflow: {
              userId: ctx.auth.user.id,
            },
          },
          take: pageSize,
          skip: (page - 1) * pageSize,
          orderBy: {
            startedAt: "desc",
          },
          include: {
            workflow: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        }),
        prisma.execution.count({
          where: {
            workflow: {
              userId: ctx.auth.user.id,
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
});
