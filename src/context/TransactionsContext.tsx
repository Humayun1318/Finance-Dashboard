import type { ITransaction } from "@/types";
import type { Dispatch, SetStateAction } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { transactionAPI } from "@/lib/transactionAPI";

type TransactionsContextValue = {
  data: ITransaction[];
  loading: boolean;
  editing: ITransaction | null;
  setEditing: Dispatch<SetStateAction<ITransaction | null>>;
  create: (item: ITransaction) => Promise<void>;
  update: (item: ITransaction) => Promise<void>;
  remove: (id: string) => Promise<void>;
};

const TransactionsContext = createContext<TransactionsContextValue | null>(
  null,
);

export const TransactionsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [data, setData] = useState<ITransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ITransaction | null>(null);

  const loadTransactions = async () => {
    setLoading(true);
    const stored = await transactionAPI.getAll();
    setData(stored);
    setLoading(false);
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const create = async (item: ITransaction) => {
    setLoading(true);
    const created = await transactionAPI.create(item);
    setData((prev) => [created, ...prev]);
    setLoading(false);
  };

  const update = async (item: ITransaction) => {
    setLoading(true);
    const updated = await transactionAPI.update(item);
    setData((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    setLoading(false);
  };

  const remove = async (id: string) => {
    setLoading(true);
    await transactionAPI.remove(id);
    setData((prev) => prev.filter((t) => t.id !== id));
    setLoading(false);
  };

  return (
    <TransactionsContext.Provider
      value={{ data, create, update, remove, editing, setEditing, loading }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionsContext);

  if (!context) {
    throw new Error(
      "useTransactions must be used within a TransactionsProvider",
    );
  }

  return context;
};
