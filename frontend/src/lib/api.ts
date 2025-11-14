import { trpc } from "../utils/trpc";

export const useProducts = () => {
  return trpc.products.list.useQuery();
};

export const useProductById = (id: number) => {
  return trpc.products.getById.useQuery({ id });
};

export const useCreateOrder = () => {
  return trpc.orders.create.useMutation();
};

// Add other API hooks as needed
