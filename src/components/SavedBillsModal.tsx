import React from 'react';
import { BillData } from '../types/bill';
import { INITIAL_BILL_106, INITIAL_BILL_107 } from '../data/defaultBills';
import { formatCurrencyAmount, formatQtyNumber } from '../utils/numberToWords';
import { FolderOpen, FileText, Plus, Trash2, X, Check } from 'lucide-react';

interface SavedBillsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBillId: string;
  savedBills: BillData[];
  onSelectBill: (bill: BillData) => void;
  onDeleteBill: (id: string) => void;
  onCreateNewBill: () => void;
}

export const SavedBillsModal: React.FC<SavedBillsModalProps> = ({
  isOpen,
  onClose,
  currentBillId,
  savedBills,
  onSelectBill,
  onDeleteBill,
  onCreateNewBill,
}) => {
  if (!isOpen) return null;

  // Combine defaults and saved bills ensuring unique IDs
  const allBills = [...savedBills];
  if (!allBills.some((b) => b.id === 'bill-107')) {
    allBills.unshift(INITIAL_BILL_107);
  }
  if (!allBills.some((b) => b.id === 'bill-106')) {
    allBills.push(INITIAL_BILL_106);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-neutral-200 overflow-hidden my-8 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50/70">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-neutral-800" />
            <div>
              <h2 className="text-base font-semibold text-neutral-900">
                Bill Archives & Presets
              </h2>
              <p className="text-xs text-neutral-500">
                Switch between bills, compare changes, or create a new delivery bill
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

        {/* Content list */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Available Bills ({allBills.length})
            </span>
            <button
              onClick={() => {
                onCreateNewBill();
                onClose();
              }}
              className="flex items-center gap-1 text-xs font-semibold text-neutral-900 hover:text-neutral-600 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Create Blank Bill
            </button>
          </div>

          {allBills.map((b) => {
            const isCurrent = b.id === currentBillId;
            const primaryItem = b.items[0];

            return (
              <div
                key={b.id}
                className={`p-4 rounded-lg border transition-all flex items-center justify-between ${
                  isCurrent
                    ? 'border-neutral-900 bg-neutral-50/80 ring-1 ring-neutral-900'
                    : 'border-neutral-200 hover:border-neutral-400 bg-white'
                }`}
              >
                <div
                  className="flex items-start gap-3 cursor-pointer flex-1"
                  onClick={() => {
                    onSelectBill(b);
                    onClose();
                  }}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      isCurrent
                        ? 'bg-neutral-900 text-white'
                        : 'bg-neutral-100 text-neutral-700'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-neutral-900">
                        Bill No- {b.billNo}
                      </span>
                      <span className="text-xs text-neutral-500">· Date: {b.date}</span>
                      {isCurrent && (
                        <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-600 mt-0.5">
                      Customer: <strong>{b.customer.name}</strong> ·{' '}
                      {primaryItem
                        ? `Style ${primaryItem.styleNo} (${formatQtyNumber(
                            b.totalQty
                          )} Pics @ ${primaryItem.rate} TK)`
                        : `${b.items.length} items`}
                    </p>
                    <p className="text-xs font-bold font-mono-num text-neutral-900 mt-1">
                      Total: {formatCurrencyAmount(b.totalAmount)} TK.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  {isCurrent ? (
                    <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                      <Check className="w-4 h-4" /> Selected
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        onSelectBill(b);
                        onClose();
                      }}
                      className="px-3 py-1.5 text-xs font-medium text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                    >
                      Load
                    </button>
                  )}

                  {b.id !== 'bill-107' && b.id !== 'bill-106' && (
                    <button
                      onClick={() => onDeleteBill(b.id)}
                      className="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg transition-colors"
                      title="Delete saved bill"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
