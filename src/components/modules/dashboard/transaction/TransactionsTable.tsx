import { useState, useMemo } from "react";
import { useLocation } from "react-router";
import { Pencil, Trash2, Search, Filter, ArrowUpDown, X } from "lucide-react";

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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useTransactions } from "@/context/TransactionsContext";
import { AddTransactionDialog } from "./AddTransactionDialog";
import { Skeleton } from "@/components/ui/skeleton";
import type { ITransaction } from "@/types";

type SortField = "date" | "amount" | "category";
type SortOrder = "asc" | "desc";

export default function TransactionsTable() {
  const location = useLocation();
  const isAdmin = location.pathname.split("/")[1] === "admin";

  const [open, setOpen] = useState(false);

  const { data, remove, setEditing, loading } = useTransactions();

  // Filtering & Sorting State
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "Income" | "Expense">("all");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  // Get unique categories for filter
  const categories = useMemo(() => {
    const unique = new Set(data.map(t => t.category));
    return Array.from(unique).sort();
  }, [data]);

  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Filter and Sort Data
  const filteredAndSortedData = useMemo(() => {
    let filtered = [...data];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.category.toLowerCase().includes(query) ||
          t.date.toLowerCase().includes(query) ||
          t.amount.toString().includes(query)
      );
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((t) => t.type === typeFilter);
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((t) => t.category === categoryFilter);
    }

    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "date":
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case "amount":
          comparison = a.amount - b.amount;
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
        default:
          comparison = 0;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [data, searchQuery, typeFilter, categoryFilter, sortField, sortOrder]);

  const clearFilters = () => {
    setSearchQuery("");
    setTypeFilter("all");
    setCategoryFilter("all");
    setSortField("date");
    setSortOrder("desc");
  };

  const hasActiveFilters = searchQuery !== "" || typeFilter !== "all" || categoryFilter !== "all";

  const filteredExportData = filteredAndSortedData.map((t) => ({
    Date: t.date,
    Category: t.category,
    Type: t.type,
    Amount: t.amount,
  }));

  const downloadFile = (content: BlobPart, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const exportToJSON = () => {
    const json = JSON.stringify(filteredExportData, null, 2);
    downloadFile(json, `transactions-${new Date().toISOString().slice(0, 10)}.json`, "application/json");
  };

  const exportToCSV = () => {
    const escapeValue = (value: string | number) => {
      const stringValue = String(value);
      return `"${stringValue.replace(/"/g, '""')}"`;
    };

    const header = ["Date", "Category", "Type", "Amount"];
    const rows = filteredExportData.map((row) => [
      escapeValue(row.Date),
      escapeValue(row.Category),
      escapeValue(row.Type),
      escapeValue(row.Amount),
    ]);

    const csvContent = [header.join(","), ...rows.map((row) => row.join(","))].join("\n");
    downloadFile(csvContent, `transactions-${new Date().toISOString().slice(0, 10)}.csv`, "text/csv;charset=utf-8;");
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };


  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Transactions</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and track all your financial activities
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={exportToCSV}
            disabled={filteredAndSortedData.length === 0}
          >
            Export CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportToJSON}
            disabled={filteredAndSortedData.length === 0}
          >
            Export JSON
          </Button>
          <AddTransactionDialog isAdmin={isAdmin} open={open} setOpen={setOpen} />
        </div>
      </div>

      {/* Filters Section - Responsive */}
      <Card className="mb-6">
        <CardContent className="p-4">
          {/* Filter Row - Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search - Full width on mobile, spans 2 cols on tablet */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by date, category or amount..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full"
                />
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as any)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Income">Income</SelectItem>
                  <SelectItem value="Expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category Filter */}
            <div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <div>
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="gap-2 w-full sm:w-auto"
                >
                  <X className="w-4 h-4" />
                  Clear Filters
                </Button>
              </div>
            )}
          </div>

          {/* Active Filters Indicator & Results Count */}
          {(hasActiveFilters || (!loading && data.length > 0)) && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-3 pt-3 border-t border-border">
              <div className="flex items-center gap-2">
                {hasActiveFilters && (
                  <Badge variant="secondary" className="gap-1">
                    <Filter className="w-3 h-3" />
                    Filters Applied
                  </Badge>
                )}
              </div>
              {!loading && data.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  Showing <span className="font-medium text-foreground">{filteredAndSortedData.length}</span> of{" "}
                  <span className="font-medium text-foreground">{data.length}</span> transactions
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Table Section - Equal Column Widths */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[20%] min-w-25">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSort("date")}
                    className="h-8 px-2 -ml-2 font-medium"
                  >
                    Date
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="w-[35%] min-w-30">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSort("category")}
                    className="h-8 px-2 -ml-2 font-medium"
                  >
                    Category
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="w-[20%] min-w-30">Type</TableHead>
                <TableHead className={`w-[25%] min-w-30 text-right ${isAdmin ? '' : 'rounded-tr-xl'}`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSort("amount")}
                    className="h-8 px-2 font-medium ml-auto"
                  >
                    Amount
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </TableHead>
                {isAdmin && (
                  <TableHead className="w-25 text-right rounded-tr-xl">
                    Actions
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
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
              ) : filteredAndSortedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={isAdmin ? 5 : 4} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <div className="p-3 rounded-full bg-muted/50">
                        <Search className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-medium">No transactions found</p>
                      <p className="text-xs">
                        {hasActiveFilters 
                          ? "Try adjusting your search or filters" 
                          : "Click 'Add Transaction' to get started"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedData.map((t: ITransaction) => (
                  <TableRow key={t.id} className="hover:bg-muted/30">
                    <TableCell className="whitespace-nowrap">{t.date}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-normal">
                        {t.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={t.type === "Income" ? "default" : "destructive"}
                        className="font-normal"
                      >
                        {t.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={`font-semibold ${
                          t.type === "Income" 
                            ? "text-emerald-600" 
                            : "text-rose-600"
                        }`}
                      >
                        {t.type === "Income" ? "+" : "-"}
                        ₹{t.amount.toLocaleString('en-IN')}
                      </span>
                    </TableCell>
                    {isAdmin && (
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setEditing(t)}
                            className="h-8 w-8"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => remove(t.id)}
                            className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}