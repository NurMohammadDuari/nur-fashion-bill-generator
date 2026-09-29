import { useState, useEffect } from 'react';
import { BillData, BillItem } from './types/bill';
import { INITIAL_BILL_107 } from './data/defaultBills';
import { TopNav } from './components/TopNav';
import { BillDocument } from './components/BillDocument';
import { BillEditor } from './components/BillEditor';
import { AddItemModal } from './components/AddItemModal';
import { HtmlExportModal } from './components/HtmlExportModal';
import { SavedBillsModal } from './components/SavedBillsModal';
import { formatCurrencyAmount, formatQtyNumber, numberToBangladeshiTakaWords } from './utils/numberToWords';
import { downloadBillPdf, printOrDownloadBill } from './utils/pdfExport';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Columns,
  Eye,
  Edit3,
  CheckCircle2,
  Sparkles,
  Printer,
  Download,
  Plus,
  Loader2,
} from 'lucide-react';

const STORAGE_KEY_CURRENT_BILL = 'nur_fashion_current_bill_v1';
const STORAGE_KEY_SAVED_BILLS = 'nur_fashion_saved_bills_v1';

export default function App() {
  const [bill, setBill] = useState<BillData>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CURRENT_BILL);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load bill from localStorage', e);
    }
    return INITIAL_BILL_107;
  });

  const [savedBills, setSavedBills] = useState<BillData[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SAVED_BILLS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load saved bills', e);
    }
    return [INITIAL_BILL_107];
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // View modes: 'split' (side-by-side on desktop), 'editor', 'preview'
  const [viewMode, setViewMode] = useState<'split' | 'editor' | 'preview'>('split');
  const [previewZoom, setPreviewZoom] = useState<number>(1);

  // Modals
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isExportHtmlOpen, setIsExportHtmlOpen] = useState(false);
  const [isSavedBillsOpen, setIsSavedBillsOpen] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Save current bill to localStorage automatically
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CURRENT_BILL, JSON.stringify(bill));
    } catch (e) {
      console.error('LocalStorage write error', e);
    }
  }, [bill]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleBillChange = (updatedBill: BillData) => {
    setBill(updatedBill);
    setHasUnsavedChanges(true);
  };

  const handleManualSave = () => {
    try {
      const updatedList = [...savedBills];
      const existingIdx = updatedList.findIndex((b) => b.id === bill.id);
      if (existingIdx >= 0) {
        updatedList[existingIdx] = bill;
      } else {
        updatedList.unshift(bill);
      }
      setSavedBills(updatedList);
      localStorage.setItem(STORAGE_KEY_SAVED_BILLS, JSON.stringify(updatedList));
      setHasUnsavedChanges(false);
      showToast(`Bill No- ${bill.billNo} saved successfully!`);
    } catch (e) {
      console.error('Save failed', e);
      showToast('Error saving bill.');
    }
  };

  const handleAddItem = (newItemData: Omit<BillItem, 'id' | 'slNo'>) => {
    const newItem: BillItem = {
      ...newItemData,
      id: 'item-' + Date.now(),
      slNo: bill.items.length + 1,
      amount: Math.round(newItemData.qty * newItemData.rate * 100) / 100,
    };

    const newItems = [...bill.items, newItem].map((it, idx) => ({
      ...it,
      slNo: idx + 1,
    }));

    const totalQty = newItems.reduce((acc, it) => acc + (it.qty || 0), 0);
    const totalAmount = newItems.reduce((acc, it) => acc + (it.amount || 0), 0);
    const inWords = bill.isAutoInWords
      ? numberToBangladeshiTakaWords(totalAmount)
      : bill.inWords;

    const updated = {
      ...bill,
      items: newItems,
      totalQty,
      totalAmount,
      inWords,
      updatedAt: new Date().toISOString(),
    };

    setBill(updated);
    setHasUnsavedChanges(true);
    showToast(`Added Style ${newItem.styleNo} (${formatQtyNumber(newItem.qty)} Pics)`);
  };

  const handleSelectSavedBill = (selected: BillData) => {
    setBill(selected);
    setHasUnsavedChanges(false);
    showToast(`Loaded Bill No- ${selected.billNo}`);
  };

  const handleDeleteSavedBill = (id: string) => {
    const updated = savedBills.filter((b) => b.id !== id);
    setSavedBills(updated);
    localStorage.setItem(STORAGE_KEY_SAVED_BILLS, JSON.stringify(updated));
    showToast('Deleted bill from archives.');
  };

  const handleCreateNewBlankBill = () => {
    const nextBillNo = (parseInt(bill.billNo, 10) || 107) + 1;
    const now = new Date();
    const dateFormatted = `${String(now.getDate()).padStart(2, '0')}.${String(
      now.getMonth() + 1
    ).padStart(2, '0')}.${now.getFullYear()}`;

    const newBill: BillData = {
      id: 'bill-' + Date.now(),
      billNo: String(nextBillNo),
      billTitle: 'Bill',
      date: dateFormatted,
      company: { ...bill.company },
      customer: { ...bill.customer },
      items: [
        {
          id: 'item-1',
          slNo: 1,
          description: 'Linking to Mending Complete',
          buyer: 'BANKOTEX',
          styleNo: '',
          qty: 0,
          poNo: '',
          rate: 38,
          amount: 0,
        },
      ],
      totalQty: 0,
      totalAmount: 0,
      inWords: 'Zero Taka Only.',
      isAutoInWords: true,
      emptyRowsHeight: 340,
      showReceiverSignature: false,
      showPreparedBySignature: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setBill(newBill);
    setHasUnsavedChanges(true);
    showToast(`Created New Blank Bill No- ${nextBillNo}`);
  };

  const handleDownloadPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      showToast('Generating high-resolution A4 PDF...');
      const success = await downloadBillPdf(bill);
      if (success) {
        showToast(`Bill No- ${bill.billNo} PDF downloaded successfully!`);
      } else {
        showToast('Could not generate PDF. Please try again.');
      }
    } catch (e) {
      console.error(e);
      showToast('Failed to download PDF.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleTriggerPrint = async () => {
    try {
      showToast('Preparing document...');
      const result = await printOrDownloadBill(bill, (msg) => showToast(msg));
      if (result.fellBackToPdf) {
        showToast(`Downloaded Bill No- ${bill.billNo} as PDF (browser print was blocked in iframe).`);
      }
    } catch (e) {
      console.error(e);
      handleDownloadPdf();
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col font-sans">
      {/* Top Bar Navigation */}
      <TopNav
        onPrint={handleTriggerPrint}
        onDownloadPdf={handleDownloadPdf}
        isGeneratingPdf={isGeneratingPdf}
        onSave={handleManualSave}
        onOpenExportHtml={() => setIsExportHtmlOpen(true)}
        onOpenSavedBills={() => setIsSavedBillsOpen(true)}
        onOpenAddItem={() => setIsAddItemOpen(true)}
        hasUnsavedChanges={hasUnsavedChanges}
      />

      {/* Sub Header Utility Bar */}
      <div className="no-print bg-white border-b border-neutral-200 px-4 sm:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Document metadata summary */}
          <div className="flex items-center gap-2 text-xs text-neutral-600">
            <span className="font-bold text-neutral-900">Bill No- {bill.billNo}</span>
            <span>·</span>
            <span>Date: {bill.date}</span>
            <span>·</span>
            <span>{bill.customer.name}</span>
            <span>·</span>
            <span className="font-semibold text-emerald-700 font-mono-num">
              {formatCurrencyAmount(bill.totalAmount)} TK. ({formatQtyNumber(bill.totalQty)} Pics)
            </span>
          </div>

          {/* View Mode & Zoom Controls */}
          <div className="flex items-center gap-2">
            {/* View switcher */}
            <div className="flex items-center bg-neutral-100 p-0.5 rounded-lg border border-neutral-200">
              <button
                onClick={() => setViewMode('split')}
                title="Split Screen (Editor & Preview)"
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  viewMode === 'split'
                    ? 'bg-white text-neutral-900 shadow-2xs font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <Columns className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Split</span>
              </button>
              <button
                onClick={() => setViewMode('editor')}
                title="Editor Only"
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  viewMode === 'editor'
                    ? 'bg-white text-neutral-900 shadow-2xs font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Editor</span>
              </button>
              <button
                onClick={() => setViewMode('preview')}
                title="Print Document Preview Only"
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  viewMode === 'preview'
                    ? 'bg-white text-neutral-900 shadow-2xs font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Preview</span>
              </button>
            </div>

            {/* Zoom controls for preview */}
            {(viewMode === 'split' || viewMode === 'preview') && (
              <div className="hidden lg:flex items-center gap-1 bg-neutral-100 p-0.5 rounded-lg border border-neutral-200 text-xs">
                <button
                  onClick={() => setPreviewZoom((z) => Math.max(0.7, Math.round((z - 0.1) * 10) / 10))}
                  title="Zoom Out Preview"
                  className="p-1 text-neutral-600 hover:text-neutral-900 rounded"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="px-1.5 font-mono-num text-[11px] text-neutral-600">
                  {Math.round(previewZoom * 100)}%
                </span>
                <button
                  onClick={() => setPreviewZoom((z) => Math.min(1.3, Math.round((z + 0.1) * 10) / 10))}
                  title="Zoom In Preview"
                  className="p-1 text-neutral-600 hover:text-neutral-900 rounded"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                {previewZoom !== 1 && (
                  <button
                    onClick={() => setPreviewZoom(1)}
                    title="Reset Zoom"
                    className="p-1 text-neutral-600 hover:text-neutral-900 rounded"
                  >
                    <Maximize2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        <div
          className={`grid gap-6 ${
            viewMode === 'split'
              ? 'grid-cols-1 lg:grid-cols-12'
              : 'grid-cols-1'
          }`}
        >
          {/* Left Column: Interactive Editor */}
          {(viewMode === 'split' || viewMode === 'editor') && (
            <div
              className={`no-print ${
                viewMode === 'split' ? 'lg:col-span-6 xl:col-span-5' : 'max-w-4xl mx-auto w-full'
              }`}
            >
              <BillEditor
                bill={bill}
                onChange={handleBillChange}
                onOpenAddItem={() => setIsAddItemOpen(true)}
              />
            </div>
          )}

          {/* Right Column: Live Printable Sheet Preview */}
          {(viewMode === 'split' || viewMode === 'preview') && (
            <div
              className={`${
                viewMode === 'split' ? 'lg:col-span-6 xl:col-span-7' : 'w-full'
              } flex flex-col items-center`}
            >
              {/* Top toolbar over document preview */}
              <div className="no-print w-full max-w-[820px] flex items-center justify-between mb-3 text-xs text-neutral-600 px-1">
                <span className="font-semibold flex items-center gap-1.5 text-neutral-800">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Live A4 Document Preview
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAddItemOpen(true)}
                    className="text-neutral-700 hover:text-neutral-950 font-medium flex items-center gap-1 hover:underline"
                  >
                    <Plus className="w-3 h-3" /> Add Row
                  </button>
                  <span>·</span>
                  <button
                    onClick={handleDownloadPdf}
                    disabled={isGeneratingPdf}
                    title="Directly download high-resolution A4 PDF document"
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-neutral-900 rounded-md transition-colors shadow-2xs"
                  >
                    {isGeneratingPdf ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Download className="w-3 h-3" />
                    )}
                    <span>Save PDF</span>
                  </button>
                  <button
                    onClick={handleTriggerPrint}
                    title="Print document via system print dialog"
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-white rounded-md transition-colors shadow-2xs"
                  >
                    <Printer className="w-3 h-3" />
                    <span>Print</span>
                  </button>
                </div>
              </div>

              {/* Document Container */}
              <div className="w-full flex justify-center overflow-x-auto pb-8">
                <BillDocument bill={bill} scale={previewZoom} />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Floating Action for Quick Item Addition on mobile */}
      <div className="no-print fixed bottom-6 right-6 lg:hidden z-30">
        <button
          onClick={() => setIsAddItemOpen(true)}
          className="flex items-center gap-2 px-4 py-3 bg-neutral-900 text-white rounded-full shadow-lg hover:bg-neutral-800 transition-colors font-semibold text-xs"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="no-print fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-neutral-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 border border-neutral-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modals */}
      <AddItemModal
        isOpen={isAddItemOpen}
        onClose={() => setIsAddItemOpen(false)}
        onAddItem={handleAddItem}
        defaultBuyer={bill.items[0]?.buyer || 'BANKOTEX'}
        nextSlNo={bill.items.length + 1}
      />

      <HtmlExportModal
        isOpen={isExportHtmlOpen}
        onClose={() => setIsExportHtmlOpen(false)}
        bill={bill}
        onPrint={handleTriggerPrint}
      />

      <SavedBillsModal
        isOpen={isSavedBillsOpen}
        onClose={() => setIsSavedBillsOpen(false)}
        currentBillId={bill.id}
        savedBills={savedBills}
        onSelectBill={handleSelectSavedBill}
        onDeleteBill={handleDeleteSavedBill}
        onCreateNewBill={handleCreateNewBlankBill}
      />
    </div>
  );
}
