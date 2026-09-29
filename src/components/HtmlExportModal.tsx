import React, { useState } from 'react';
import { BillData } from '../types/bill';
import { generatePrintReadyHtml } from '../utils/exportHtml';
import { Copy, Check, Download, Printer, X, Code2 } from 'lucide-react';

interface HtmlExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  bill: BillData;
  onPrint: () => void;
}

export const HtmlExportModal: React.FC<HtmlExportModalProps> = ({
  isOpen,
  onClose,
  bill,
  onPrint,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const htmlContent = generatePrintReadyHtml(bill);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(htmlContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bill-${bill.billNo || 'invoice'}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full border border-neutral-200 overflow-hidden my-8 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50/70 shrink-0">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-neutral-800" />
            <div>
              <h2 className="text-base font-semibold text-neutral-900">
                Print-Ready HTML / PDF Code
              </h2>
              <p className="text-xs text-neutral-500">
                Standalone HTML template for Bill No- {bill.billNo}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3 bg-neutral-100/60 border-b border-neutral-200 shrink-0">
          <span className="text-xs text-neutral-600 font-medium">
            Copy code to Notepad, save as <code className="text-neutral-900 font-bold bg-neutral-200 px-1 py-0.5 rounded">bill.html</code>, and open in any browser.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-neutral-300 text-neutral-800 hover:bg-neutral-50 transition-colors shadow-2xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy HTML
                </>
              )}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              Download .html
            </button>
            <button
              onClick={() => {
                onClose();
                onPrint();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              Direct Print
            </button>
          </div>
        </div>

        {/* Code Preview Box */}
        <div className="p-6 overflow-y-auto flex-1 bg-neutral-950 font-mono text-xs text-neutral-200">
          <pre className="whitespace-pre-wrap break-all leading-relaxed">
            {htmlContent}
          </pre>
        </div>
      </div>
    </div>
  );
};
