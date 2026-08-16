'use client';

import { useRef, useState } from 'react';
import { X, Upload, Download, FileSpreadsheet, CheckCircle2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetClose } from '@/components/ui/sheet';

export interface ImportResult {
  created: number;
  total: number;
  failed: number;
  results: { row: number; status: string; name?: string; message?: string }[];
}

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Column headers the CSV should contain (first ones required). */
  columns: string[];
  /** A sample data row (same length as columns) for the template. */
  sample: string[];
  filename: string;
  onImport: (csv: string) => Promise<ImportResult>;
}

export function ImportCsvDrawer({ open, onClose, title, columns, sample, filename, onImport }: Props) {
  const [csv, setCsv] = useState('');
  const [fileName, setFileName] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const reset = () => { setCsv(''); setFileName(''); setResult(null); };

  const downloadTemplate = () => {
    const content = `${columns.join(',')}\n${sample.join(',')}\n`;
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setResult(null);
    setCsv(await file.text());
  };

  const runImport = async () => {
    if (!csv.trim()) { toast.error('Choose a CSV file first'); return; }
    setBusy(true);
    try {
      const res = await onImport(csv);
      setResult(res);
      if (res.created > 0) toast.success(`${res.created} of ${res.total} imported`);
      else toast.error('Nothing imported — check the errors');
    } catch (e: any) {
      toast.error(e?.data?.error?.message || 'Import failed');
    } finally {
      setBusy(false);
    }
  };

  const errors = result?.results.filter((r) => r.status === 'error') ?? [];

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) { reset(); onClose(); } }}>
      <SheetContent side="right" hideClose className="w-full bg-card text-card-foreground sm:w-[480px]">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="text-lg font-semibold">{title}</h2>
            <SheetClose className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"><X size={18} /></SheetClose>
          </div>

          <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
            <div className="rounded-xl border border-border p-4">
              <p className="text-sm font-medium text-foreground">Required columns</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {columns.map((c) => (
                  <span key={c} className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">{c}</span>
                ))}
              </div>
              <Button variant="secondary" size="sm" className="mt-3" onClick={downloadTemplate}>
                <Download size={15} /> Download template
              </Button>
            </div>

            <div>
              <input ref={inputRef} type="file" accept=".csv,text/csv" onChange={onFile} className="hidden" />
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="flex w-full flex-col items-center gap-2 rounded-xl border border-dashed border-border px-4 py-8 text-center transition-colors hover:bg-muted"
              >
                <FileSpreadsheet size={26} className="text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">{fileName || 'Choose a CSV file'}</span>
                <span className="text-xs text-muted-foreground">Click to browse</span>
              </button>
            </div>

            {result && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2.5 text-sm">
                  <CheckCircle2 size={16} className="text-success" />
                  <span className="text-foreground">{result.created} created</span>
                  {result.failed > 0 && (
                    <>
                      <span className="text-muted-foreground">·</span>
                      <AlertCircle size={16} className="text-danger" />
                      <span className="text-foreground">{result.failed} failed</span>
                    </>
                  )}
                </div>
                {errors.length > 0 && (
                  <div>
                    <p className="mb-1.5 text-xs font-medium text-foreground">
                      {errors.length} row{errors.length === 1 ? '' : 's'} couldn&apos;t be imported — row numbers match your spreadsheet (including the header row):
                    </p>
                    <div className="max-h-56 space-y-2 overflow-y-auto rounded-lg border border-border p-3">
                      {errors.map((e, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs">
                          <Badge variant="danger" className="mt-0.5 shrink-0">Row {e.row}</Badge>
                          <span className="text-foreground">{e.message}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-4">
            <SheetClose asChild><Button type="button" variant="secondary">Close</Button></SheetClose>
            <Button onClick={runImport} loading={busy} disabled={!csv.trim()}>
              <Upload size={16} /> Import
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
