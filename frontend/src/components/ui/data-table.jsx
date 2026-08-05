import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Search, ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ─── Sort Icon ─────────────────────────────────────────────────────────── */
function SortIcon({ direction }) {
  if (direction === 'asc') return <ChevronUp className="w-3 h-3 ml-1 text-indigo-500" />;
  if (direction === 'desc') return <ChevronDown className="w-3 h-3 ml-1 text-indigo-500" />;
  return <ChevronsUpDown className="w-3 h-3 ml-1 text-slate-300 dark:text-slate-600" />;
}

/* ─── DataTable ──────────────────────────────────────────────────────────── */
/**
 * columns: Array of { key, label, sortable?, className?, render? }
 * data: Array of row objects
 * searchKeys: Array of string keys to search within
 * searchPlaceholder: string
 * emptyIcon: ReactNode
 * emptyLabel: string
 * loading: boolean
 * extraFilters: ReactNode (additional filter controls rendered next to search)
 * rowKey: string (default '_id')
 */
export function DataTable({
  columns = [],
  data = [],
  searchKeys = [],
  searchPlaceholder = 'Search...',
  emptyIcon = null,
  emptyLabel = 'No records found',
  loading = false,
  extraFilters = null,
  rowKey = '_id',
}) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('');
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState('10');

  /* Search */
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return data;
    return data.filter((row) =>
      searchKeys.some((k) => {
        const val = k.split('.').reduce((obj, part) => obj?.[part], row);
        return String(val ?? '').toLowerCase().includes(q);
      })
    );
  }, [data, search, searchKeys]);

  /* Sort — uses column.sortValue(row) if defined, else resolves nested key */
  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    const col = columns.find((c) => c.key === sortKey);
    return [...filtered].sort((a, b) => {
      let av, bv;
      if (col?.sortValue) {
        av = col.sortValue(a);
        bv = col.sortValue(b);
      } else {
        av = sortKey.split('.').reduce((o, p) => o?.[p], a) ?? '';
        bv = sortKey.split('.').reduce((o, p) => o?.[p], b) ?? '';
      }
      // Numeric comparison
      if (typeof av === 'number' && typeof bv === 'number') {
        return sortDir === 'asc' ? av - bv : bv - av;
      }
      // String comparison
      const as = String(av ?? '').toLowerCase();
      const bs = String(bv ?? '').toLowerCase();
      const cmp = as < bs ? -1 : as > bs ? 1 : 0;
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir, columns]);

  /* Paginate */
  const pp = Number(perPage);
  const totalPages = Math.max(1, Math.ceil(sorted.length / pp));
  const currentPage = Math.min(page, totalPages);
  const pageData = sorted.slice((currentPage - 1) * pp, currentPage * pp);

  /* Reset to page 1 on search/sort change */
  React.useEffect(() => { setPage(1); }, [search, sortKey, sortDir, perPage]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  /* Page number buttons */
  const pageNumbers = useMemo(() => {
    const pages = [];
    const delta = 1;
    for (let i = Math.max(1, currentPage - delta); i <= Math.min(totalPages, currentPage + delta); i++) {
      pages.push(i);
    }
    if (pages[0] > 1) { if (pages[0] > 2) pages.unshift('...'); pages.unshift(1); }
    if (pages[pages.length - 1] < totalPages) {
      if (pages[pages.length - 1] < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  }, [currentPage, totalPages]);

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        {extraFilters}
        <div className="w-full sm:w-36">
          <Select
            value={perPage}
            onChange={(e) => setPerPage(e.target.value)}
          >
            <option value="10">10 / page</option>
            <option value="25">25 / page</option>
            <option value="50">50 / page</option>
            <option value="100">100 / page</option>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[600px]">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={cn(
                      "px-5 py-3.5 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap",
                      col.sortable && "cursor-pointer select-none hover:text-slate-700 dark:hover:text-slate-200 transition-colors",
                      col.className
                    )}
                    onClick={col.sortable ? () => handleSort(col.key) : undefined}
                  >
                    <span className="flex items-center">
                      {col.label}
                      {col.sortable && (
                        <SortIcon direction={sortKey === col.key ? sortDir : null} />
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {columns.map((col) => (
                      <td key={col.key} className="px-5 py-4">
                        <div className="h-3.5 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" style={{ width: `${40 + Math.random() * 40}%` }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : pageData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-14 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400 dark:text-slate-500">
                      {emptyIcon && <div className="opacity-30">{emptyIcon}</div>}
                      <p className="text-xs font-medium">{emptyLabel}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                pageData.map((row) => (
                  <tr
                    key={row[rowKey]}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={cn("px-5 py-3.5 text-slate-700 dark:text-slate-200", col.className)}
                      >
                        {col.render
                          ? col.render(row)
                          : col.key.split('.').reduce((o, p) => o?.[p], row) ?? '—'}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && sorted.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Showing <span className="font-bold text-slate-700 dark:text-slate-200">{(currentPage - 1) * pp + 1}–{Math.min(currentPage * pp, sorted.length)}</span> of{' '}
              <span className="font-bold text-slate-700 dark:text-slate-200">{sorted.length}</span> results
            </p>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="xs"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </Button>

              {pageNumbers.map((p, i) =>
                p === '...' ? (
                  <span key={`ellipsis-${i}`} className="px-1.5 text-[11px] text-slate-400">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={cn(
                      "h-6 min-w-[24px] px-2 rounded-lg text-[11px] font-semibold transition-all",
                      currentPage === p
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    )}
                  >
                    {p}
                  </button>
                )
              )}

              <Button
                variant="outline"
                size="xs"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
