import React, { useState } from 'react';
import { BillItem } from '../types/bill';
import { COMMON_BUYERS, COMMON_PROCESSES } from '../data/defaultBills';
import { formatCurrencyAmount, formatQtyNumber } from '../utils/numberToWords';
import { Plus, X, Calculator, Sparkles } from 'lucide-react';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: Omit<BillItem, 'id' | 'slNo'>) => void;
  defaultBuyer?: string;
  nextSlNo: number;
}

export const AddItemModal: React.FC<AddItemModalProps> = ({
  isOpen,
  onClose,
  onAddItem,
  defaultBuyer = 'BANKOTEX',
  nextSlNo,
}) => {
  const [description, setDescription] = useState('Linking to Mending Complete');
  const [buyer, setBuyer] = useState(defaultBuyer);
  const [styleNo, setStyleNo] = useState('');
  const [qty, setQty] = useState<number | ''>('');
  const [poNo, setPoNo] = useState('');
  const [rate, setRate] = useState<number | ''>(38);

  if (!isOpen) return null;

  const currentQty = typeof qty === 'number' ? qty : 0;
  const currentRate = typeof rate === 'number' ? rate : 0;
  const calculatedAmount = currentQty * currentRate;

  const handleSubmit = (e: React.FormEvent, addAnother = false) => {
    e.preventDefault();
    if (!styleNo.trim() || currentQty <= 0) return;

    onAddItem({
      description: description.trim() || 'Linking to Mending Complete',
      buyer: buyer.trim() || 'BANKOTEX',
      styleNo: styleNo.trim(),
      qty: currentQty,
      poNo: poNo.trim(),
      rate: currentRate,
      amount: calculatedAmount,
    });

    if (addAnother) {
      setStyleNo('');
      setQty('');
      setPoNo('');
    } else {
      onClose();
    }
  };

  const applyPreset = (presetStyle: string, presetQty: number, presetRate: number) => {
    setStyleNo(presetStyle);
    setQty(presetQty);
    setRate(presetRate);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-neutral-200 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50/70">
          <div>
            <h2 className="text-base font-semibold text-neutral-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-600" />
              Add Line Item (Item #{nextSlNo})
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Enter garment style, quantity, rate, and production details
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={(e) => handleSubmit(e, false)} className="p-6 space-y-4">
          {/* Quick Presets Bar */}
          <div>
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Quick Presets
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => applyPreset('672', 4907, 38)}
                className="text-xs px-2.5 py-1 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-medium transition-colors border border-neutral-300"
              >
                Style 672 · 4,907 Pcs @ 38 TK
              </button>
              <button
                type="button"
                onClick={() => applyPreset('673', 2950, 38)}
                className="text-xs px-2.5 py-1 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-medium transition-colors border border-neutral-300"
              >
                Style 673 · 2,950 Pcs @ 38 TK
              </button>
              <button
                type="button"
                onClick={() => applyPreset('674', 3500, 42)}
                className="text-xs px-2.5 py-1 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-medium transition-colors border border-neutral-300"
              >
                Style 674 · 3,500 Pcs @ 42 TK
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Description / Operation *
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-800 focus:border-neutral-800"
              placeholder="e.g. Linking to Mending Complete"
              required
            />
            {/* Quick Process Chips */}
            <div className="flex flex-wrap gap-1 mt-1.5">
              {COMMON_PROCESSES.slice(0, 4).map((proc) => (
                <button
                  key={proc}
                  type="button"
                  onClick={() => setDescription(proc)}
                  className="text-[11px] text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 px-2 py-0.5 rounded transition-colors"
                >
                  {proc}
                </button>
              ))}
            </div>
          </div>

          {/* Style No & Buyer Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Style No *
              </label>
              <input
                type="text"
                value={styleNo}
                onChange={(e) => setStyleNo(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-800 focus:border-neutral-800 font-semibold"
                placeholder="e.g. 672"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Buyer Name *
              </label>
              <input
                type="text"
                value={buyer}
                onChange={(e) => setBuyer(e.target.value)}
                list="buyer-options"
                className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-800 focus:border-neutral-800 uppercase"
                placeholder="e.g. BANKOTEX"
                required
              />
              <datalist id="buyer-options">
                {COMMON_BUYERS.map((b) => (
                  <option key={b} value={b} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Qty, Rate & PO No */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Qty in Pics *
              </label>
              <input
                type="number"
                min="1"
                step="1"
                value={qty}
                onChange={(e) => setQty(e.target.value ? parseFloat(e.target.value) : '')}
                className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-800 focus:border-neutral-800 font-mono-num font-semibold"
                placeholder="e.g. 4907"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Rate/Par Pics (TK) *
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={rate}
                onChange={(e) => setRate(e.target.value ? parseFloat(e.target.value) : '')}
                className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-800 focus:border-neutral-800 font-mono-num font-semibold"
                placeholder="e.g. 38.00"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                PO No (Optional)
              </label>
              <input
                type="text"
                value={poNo}
                onChange={(e) => setPoNo(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-800 focus:border-neutral-800"
                placeholder="PO#"
              />
            </div>
          </div>

          {/* Live Calculation Preview Banner */}
          <div className="p-3.5 bg-neutral-50 rounded-lg border border-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-2 text-neutral-600">
              <Calculator className="w-4 h-4 text-neutral-700" />
              <span className="text-xs font-medium">Row Subtotal:</span>
              <span className="text-xs font-mono-num text-neutral-500">
                {currentQty ? formatQtyNumber(currentQty) : '0'} × {currentRate.toFixed(2)} TK
              </span>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold font-mono-num text-neutral-900">
                {formatCurrencyAmount(calculatedAmount)} TK.
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              disabled={!styleNo.trim() || currentQty <= 0}
              className="px-3.5 py-2 text-xs font-medium text-neutral-800 bg-neutral-200 hover:bg-neutral-300 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              Add & Next
            </button>
            <button
              type="submit"
              disabled={!styleNo.trim() || currentQty <= 0}
              className="px-5 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors shadow-xs"
            >
              Add to Bill
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
