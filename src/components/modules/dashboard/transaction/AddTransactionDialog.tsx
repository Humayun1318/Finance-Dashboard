import { useState, useEffect } from "react";
import { Plus, AlertCircle } from "lucide-react";

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
import { MONTHS } from "@/constants/month";
import { CATEGORIES } from "@/constants/category";
import { validateDateFormat } from "@/utils/validateDateFormat";

export function AddTransactionDialog({ isAdmin , open, setOpen }: { isAdmin: boolean; open: boolean; setOpen: (open: boolean) => void }) {
  const { create, update, editing, setEditing } = useTransactions();

  const [form, setForm] = useState({
    date: "",
    category: "",
    type: "Income",
    amount: "",
  });
  const [errors, setErrors] = useState<{
    date?: string;
    category?: string;
    amount?: string;
  }>({});

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

  const getCurrentDateExample = (): string => {
    const now = new Date();
    const month = MONTHS[now.getMonth()];
    const day = now.getDate();
    const year = now.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    if (!form.date.trim()) {
      newErrors.date = "Date is required";
    } else if (!validateDateFormat(form.date.trim())) {
      newErrors.date = `Date must be in format: "Apr 30, 2026" (Example: ${getCurrentDateExample()})`;
    }
    
    if (!form.category.trim()) {
      newErrors.category = "Category is required";
    }
    
    if (!form.amount) {
      newErrors.amount = "Amount is required";
    } else if (isNaN(Number(form.amount)) || Number(form.amount) <= 0) {
      newErrors.amount = "Enter a valid positive amount";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    const payload = {
      id: editing ? editing.id : Date.now().toString(),
      date: form.date.trim(),
      category: form.category.trim(),
      type: form.type as "Income" | "Expense",
      amount: Math.abs(Number(form.amount)),
    };

    if (editing) {
      update(payload);
      setEditing(null);
    } else {
      create(payload);
    }

    setOpen(false);
    setForm({ date: "", category: "", type: "Income", amount: "" });
    setErrors({});
  };

  if (!isAdmin) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-1" /> Add
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>
            {editing ? "Edit Transaction" : "Add Transaction"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Date Input */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Date <span className="text-rose-500">*</span>
            </label>
            <Input
              placeholder={`Example: ${getCurrentDateExample()}`}
              value={form.date}
              onChange={(e) => {
                setForm((p) => ({ ...p, date: e.target.value }));
                if (errors.date) setErrors((p) => ({ ...p, date: undefined }));
              }}
              className={errors.date ? "border-rose-500" : ""}
            />
            <p className="text-xs text-muted-foreground">
              Format: Month Day, Year (e.g., Apr 30, 2026)
            </p>
            {errors.date && (
              <p className="text-xs text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.date}
              </p>
            )}
          </div>

          {/* Category Select */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Category <span className="text-rose-500">*</span>
            </label>
            <Select
              value={form.category}
              onValueChange={(val) => {
                setForm((p) => ({ ...p, category: val }));
                if (errors.category) setErrors((p) => ({ ...p, category: undefined }));
              }}
            >
              <SelectTrigger className={errors.category ? "border-rose-500" : ""}>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-xs text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.category}
              </p>
            )}
          </div>

          {/* Type Select */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Type <span className="text-rose-500">*</span>
            </label>
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
          </div>

          {/* Amount Input */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Amount (₹) <span className="text-rose-500">*</span>
            </label>
            <Input
              type="number"
              placeholder="Enter amount"
              value={form.amount}
              onChange={(e) => {
                setForm((p) => ({ ...p, amount: e.target.value }));
                if (errors.amount) setErrors((p) => ({ ...p, amount: undefined }));
              }}
              className={errors.amount ? "border-rose-500" : ""}
            />
            {errors.amount && (
              <p className="text-xs text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.amount}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="flex-1">
              {editing ? "Update" : "Create"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}