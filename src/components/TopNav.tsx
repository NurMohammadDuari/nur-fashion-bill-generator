import React from 'react';
import { Printer, Save, FileCode, FolderOpen, Plus, Download, Loader2 } from 'lucide-react';

interface TopNavProps {
  onPrint: () => void;
  onDownloadPdf: () => void;
  isGeneratingPdf?: boolean;
  onSave: () => void;
  onOpenExportHtml: () => void;
  onOpenSavedBills: () => void;
  onOpenAddItem: () => void;
  hasUnsavedChanges?: boolean;
}

export const TopNav: React.FC<TopNavProps> = ({
  onPrint,
  onDownloadPdf,
  isGeneratingPdf = false,
  onSave,
  onOpenExportHtml,
  onOpenSavedBills,
  onOpenAddItem,
  hasUnsavedChanges = false,
}) => {
  return (
    <header className="no-print bg-white border-b border-neutral-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <span className="text-base sm:text-lg font-bold tracking-tight text-neutral-900 whitespace-nowrap">
            Nur Fashion Sweater
          </span>
          <span className="hidden md:inline-block text-neutral-300">|</span>
          <span className="hidden md:inline-block text-xs text-neutral-500 font-medium">
            Garment Bill & Challan System
          </span>
        </div>

        {/* Zone 2: Clean text navigation links / action triggers */}
        <nav className="hidden sm:flex items-center gap-1 md:gap-2">
          <button
            onClick={onOpenAddItem}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 rounded-lg transition-colors whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-600" />
            Add Item
          </button>

          <button
            onClick={onOpenSavedBills}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 rounded-lg transition-colors whitespace-nowrap"
          >
            <FolderOpen className="w-3.5 h-3.5 text-neutral-600" />
            Bills Archive
          </button>

          <button
            onClick={onOpenExportHtml}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 rounded-lg transition-colors whitespace-nowrap"
          >
            <FileCode className="w-3.5 h-3.5 text-neutral-600" />
            HTML / Code
          </button>
        </nav>

        {/* Zone 3: Primary actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onSave}
            title="Save current bill changes"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded-lg transition-colors whitespace-nowrap"
          >
            <Save className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Save</span>
            {hasUnsavedChanges && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            )}
          </button>

          {/* Download PDF button */}
          <button
            onClick={onDownloadPdf}
            disabled={isGeneratingPdf}
            title="Directly download high-resolution A4 PDF document"
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-neutral-900 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 rounded-lg transition-colors shadow-2xs whitespace-nowrap"
          >
            {isGeneratingPdf ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Save PDF</span>
              </>
            )}
          </button>

          {/* Print button */}
          <button
            onClick={onPrint}
            title="Open browser print dialog"
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors shadow-xs whitespace-nowrap"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
        </div>
      </div>
    </header>
  );
};
