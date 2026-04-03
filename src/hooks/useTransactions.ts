import { transactionAPI } from "@/lib/transactionAPI";
import type { ITransaction } from "@/types";
import { useEffect, useState } from "react";

export const useTransactions = () => {
  const [data, setData] = useState<ITransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    setLoading(true);
    const res = await transactionAPI.getAll();
    setData(res);
    setLoading(false);
  };

  const createTransaction = async (item: ITransaction) => {
    const created = await transactionAPI.create(item);
    setData((prev) => [created, ...prev]);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return {
    data,
    loading,
    createTransaction,
  };
};