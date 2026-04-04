import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTransactions } from "@/context/TransactionsContext";

export function AddTransactionDialog({ isAdmin }: { isAdmin: boolean }) {
  const { create, update, editing, setEditing } = useTransactions();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    date: "",
    category: "",
    type: "Income",
    amount: "",
  });

  useEffect(() => {
    if (editing) {
      setForm({
        date: editing.date,
        category: editing.category,
        type: editing.type,
        amount: Math.abs(editing.amount).toString(),
      });
      setOpen(true);
    }
  }, [editing]);

  const handleSubmit = () => {
    const payload = {
      id: editing ? editing.id : Date.now().toString(),
      date: form.date,
      category: form.category,
      type: form.type as "Income" | "Expense",
      amount:
        form.type === "Expense"
          ? Math.abs(Number(form.amount))
          : Math.abs(Number(form.amount)),
    };

    if (editing) {
      update(payload);
      setEditing(null);
    } else {
      create(payload);
    }

    setOpen(false);
    setForm({ date: "", category: "", type: "Income", amount: "" });
  };

  if (!isAdmin) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>+ Add</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editing ? "Edit Transaction" : "Add Transaction"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <Input
            placeholder="Date (e.g. Aug 20)"
            value={form.date}
            onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
          />

          <Input
            placeholder="Category"
            value={form.category}
            onChange={(e) =>
              setForm((p) => ({ ...p, category: e.target.value }))
            }
          />

          <Select
            value={form.type}
            onValueChange={(val) => setForm((p) => ({ ...p, type: val }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Income">Income</SelectItem>
              <SelectItem value="Expense">Expense</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
          />

          <Button className="w-full" onClick={handleSubmit}>
            {editing ? "Update" : "Create"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
