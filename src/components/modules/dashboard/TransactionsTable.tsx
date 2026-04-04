import { useLocation } from "react-router";
import { Pencil, Trash2 } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTransactions } from "@/context/TransactionsContext";
import { AddTransactionDialog } from "./AddTransactionDialog";
import { Skeleton } from "@/components/ui/skeleton";
import type { ITransaction } from "@/types";

export default function TransactionsTable() {
  const location = useLocation();
  const isAdmin = location.pathname.split("/")[1] === "admin";

  const { data, remove, setEditing, loading } = useTransactions();

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <AddTransactionDialog isAdmin={isAdmin} />
      </div>

      <div className="rounded-2xl border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted rounded-2xl">
              <TableHead className="rounded-tl-2xl">Date</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className={`text-right ${isAdmin ? '' : 'rounded-tr-2xl'}`}>Amount</TableHead>
              {isAdmin && <TableHead className="text-right rounded-tr-2xl">Action</TableHead>}
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              //LOADING STATE (Skeleton Rows)
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>

                  <TableCell>
                    <Skeleton className="h-4 w-25" />
                  </TableCell>

                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>

                  <TableCell className="text-right">
                    <Skeleton className="h-4 w-17.5 ml-auto" />
                  </TableCell>

                  {isAdmin && (
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              //EMPTY STATE
              <TableRow>
                <TableCell
                  colSpan={isAdmin ? 5 : 4}
                  className="text-center py-12"
                >
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <p className="text-sm font-medium">No transactions found</p>
                    <p className="text-xs">
                      Start by adding your first transaction
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              // DATA STATE
              data.map((t: ITransaction) => (
                <TableRow key={t.id}>
                  <TableCell>{t.date}</TableCell>

                  <TableCell>
                    <Badge variant="secondary">{t.category}</Badge>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={t.type === "Income" ? "default" : "destructive"}
                    >
                      {t.type}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <span
                      className={
                        t.amount > 0 ? "text-green-600" : "text-red-600"
                      }
                    >
                      {t.amount > 0 ? "+" : "-"}
                      {t.amount}₹
                    </span>
                  </TableCell>

                  {isAdmin && (
                    <TableCell className="text-right space-x-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setEditing(t)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>

                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => remove(t.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
