import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";

export const useSubscription = (enabled = true) => {
  return useQuery({
    queryKey: ["subscription"],
    enabled,
    queryFn: async () => {
      const { data } = await authClient.customer.state();
      return data;
    },
  });
};

export const useHasActiveSubscription = (enabled = true) => {
  const { data: customerState, isLoading, ...rest } = useSubscription(enabled);
  const hasActiveSubscription =
    customerState?.activeSubscriptions &&
    customerState.activeSubscriptions.length > 0;

  return {
    hasActiveSubscription,
    subscription: customerState?.activeSubscriptions?.[0],
    isLoading,
    ...rest,
  };
};
