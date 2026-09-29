import React, { useState } from 'react';
import { BillData, BillItem } from '../types/bill';
import { formatCurrencyAmount, formatQtyNumber, numberToBangladeshiTakaWords } from '../utils/numberToWords';
import {
  Plus,
  Trash2,
  Copy,
  Calendar,
  Building2,
  User,
  Sliders,
  Sparkles,
  ArrowUp,
  ArrowDown,
  RotateCcw,
} from 'lucide-react';

interface BillEditorProps {
  bill: BillData;
  onChange: (updatedBill: BillData) => void;
  onOpenAddItem: () => void;
}

export const BillEditor: React.FC<BillEditorProps> = ({
  bill,
  onChange,
  onOpenAddItem,
}) => {
  const [activeTab, setActiveTab] = useState<'items' | 'parties' | 'settings'>('items');

  // Helper to re-calculate totals and in-words
  const recalculate = (items: BillItem[], isAutoWords = bill.isAutoInWords): {
    items: BillItem[];
    totalQty: number;
    totalAmount: number;
    inWords: string;
  } => {
    const updatedItems = items.map((it, idx) => ({
      ...it,
      slNo: idx + 1,
      amount: Math.round(it.qty * it.rate * 100) / 100,
    }));

    const totalQty = updatedItems.reduce((acc, it) => acc + (it.qty || 0), 0);
    const totalAmount = updatedItems.reduce((acc, it) => acc + (it.amount || 0), 0);
    const inWords = isAutoWords ? numberToBangladeshiTakaWords(totalAmount) : bill.inWords;

    return { items: updatedItems, totalQty, totalAmount, inWords };
  };

  const handleUpdateItem = (index: number, field: keyof BillItem, value: any) => {
    const newItems = [...bill.items];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
    };
    const { items, totalQty, totalAmount, inWords } = recalculate(newItems);
    onChange({
      ...bill,
      items,
      totalQty,
      totalAmount,
      inWords,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleDeleteItem = (index: number) => {
    if (bill.items.length <= 1) {
      alert('At least one line item is required in the bill.');
      return;
    }
    const newItems = bill.items.filter((_, idx) => idx !== index);
    const { items, totalQty, totalAmount, inWords } = recalculate(newItems);
    onChange({
      ...bill,
      items,
      totalQty,
      totalAmount,
      inWords,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleDuplicateItem = (index: number) => {
    const itemToDup = bill.items[index];
    const duplicated: BillItem = {
      ...itemToDup,
      id: 'item-' + Date.now(),
      styleNo: itemToDup.styleNo + '-B',
    };
    const newItems = [...bill.items];
    newItems.splice(index + 1, 0, duplicated);
    const { items, totalQty, totalAmount, inWords } = recalculate(newItems);
    onChange({
      ...bill,
      items,
      totalQty,
      totalAmount,
      inWords,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleMoveItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= bill.items.length) return;
    const newItems = [...bill.items];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    const { items, totalQty, totalAmount, inWords } = recalculate(newItems);
    onChange({
      ...bill,
      items,
      totalQty,
      totalAmount,
      inWords,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleSetTodayDate = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const dateFormatted = `${day}.${month}.${year}`;
    onChange({
      ...bill,
      date: dateFormatted,
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-xs flex flex-col h-full overflow-hidden">
      {/* Tab Navigation */}
      <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-2 bg-neutral-50/60">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('items')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'items'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            Items & Rates ({bill.items.length})
          </button>
          <button
            onClick={() => setActiveTab('parties')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'parties'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            Client & Factory
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            Bill Settings & Words
          </button>
        </div>

        {activeTab === 'items' && (
          <button
            onClick={onOpenAddItem}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Item
          </button>
        )}
      </div>

      {/* Tab Content */}
      <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-5">
        {/* TAB 1: ITEMS */}
        {activeTab === 'items' && (
          <div className="space-y-4">
            {/* Quick Bill Meta Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-neutral-50 p-3 rounded-lg border border-neutral-200">
              <div>
                <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
                  Bill No
                </label>
                <input
                  type="text"
                  value={bill.billNo}
                  onChange={(e) => onChange({ ...bill, billNo: e.target.value })}
                  className="w-full px-2.5 py-1 text-xs border border-neutral-300 rounded bg-white font-semibold text-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-800"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
                  Date
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={bill.date}
                    onChange={(e) => onChange({ ...bill, date: e.target.value })}
                    className="w-full px-2.5 py-1 text-xs border border-neutral-300 rounded bg-white font-medium text-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-800"
                    placeholder="DD.MM.YYYY"
                  />
                  <button
                    type="button"
                    onClick={handleSetTodayDate}
                    title="Set Today's Date"
                    className="p-1 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-200 rounded transition-colors"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
                  Bill Document Title
                </label>
                <input
                  type="text"
                  value={bill.billTitle}
                  onChange={(e) => onChange({ ...bill, billTitle: e.target.value })}
                  className="w-full px-2.5 py-1 text-xs border border-neutral-300 rounded bg-white font-semibold text-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-800"
                />
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-neutral-500 px-1 font-medium">
                <span>Garment Items ({bill.items.length})</span>
                <span>Click values to edit directly</span>
              </div>

              {bill.items.map((item, index) => (
                <div
                  key={item.id}
                  className="p-3.5 bg-white border border-neutral-200 rounded-lg hover:border-neutral-300 transition-colors shadow-2xs space-y-3"
                >
                  {/* Row 1: Header & Controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 flex items-center justify-center text-xs font-bold rounded bg-neutral-100 text-neutral-700">
                        {item.slNo}
                      </span>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleUpdateItem(index, 'description', e.target.value)}
                        className="text-xs font-semibold text-neutral-900 border-b border-transparent hover:border-neutral-300 focus:border-neutral-800 px-1 py-0.5 focus:outline-none w-48 sm:w-64"
                        placeholder="Operation Description"
                      />
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMoveItem(index, 'up')}
                        disabled={index === 0}
                        title="Move Up"
                        className="p-1 text-neutral-400 hover:text-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed rounded"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveItem(index, 'down')}
                        disabled={index === bill.items.length - 1}
                        title="Move Down"
                        className="p-1 text-neutral-400 hover:text-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed rounded"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDuplicateItem(index)}
                        title="Duplicate Row"
                        className="p-1 text-neutral-400 hover:text-neutral-700 rounded"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(index)}
                        title="Delete Item"
                        className="p-1 text-neutral-400 hover:text-red-600 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Row 2: Grid Inputs */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    <div>
                      <label className="text-[10px] font-semibold text-neutral-500 uppercase block mb-0.5">
                        Style No
                      </label>
                      <input
                        type="text"
                        value={item.styleNo}
                        onChange={(e) => handleUpdateItem(index, 'styleNo', e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-neutral-300 rounded font-semibold text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-800"
                        placeholder="Style No"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-semibold text-neutral-500 uppercase block mb-0.5">
                        Buyer
                      </label>
                      <input
                        type="text"
                        value={item.buyer}
                        onChange={(e) => handleUpdateItem(index, 'buyer', e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-neutral-300 rounded text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-800 uppercase"
                        placeholder="Buyer"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-semibold text-neutral-500 uppercase block mb-0.5">
                        Qty (Pics)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={item.qty || ''}
                        onChange={(e) =>
                          handleUpdateItem(index, 'qty', e.target.value ? parseFloat(e.target.value) : 0)
                        }
                        className="w-full px-2 py-1 text-xs border border-neutral-300 rounded font-mono-num font-semibold text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-800"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-semibold text-neutral-500 uppercase block mb-0.5">
                        Rate (TK)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.rate || ''}
                        onChange={(e) =>
                          handleUpdateItem(index, 'rate', e.target.value ? parseFloat(e.target.value) : 0)
                        }
                        className="w-full px-2 py-1 text-xs border border-neutral-300 rounded font-mono-num font-semibold text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-800"
                        placeholder="0.00"
                      />
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                      <label className="text-[10px] font-semibold text-neutral-500 uppercase block mb-0.5">
                        Amount (BD TK)
                      </label>
                      <div className="px-2 py-1 text-xs bg-neutral-100 rounded font-mono-num font-bold text-neutral-900 border border-neutral-200 text-right">
                        {formatCurrencyAmount(item.amount)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bill Summary Banner */}
            <div className="bg-neutral-900 text-white rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] text-neutral-400 uppercase tracking-wider block">
                  Grand Total Summary
                </span>
                <span className="text-xs text-neutral-300">
                  Total Items: {bill.items.length} · Total Quantity:{' '}
                  <strong className="text-white font-mono-num">{formatQtyNumber(bill.totalQty)} Pics</strong>
                </span>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-xl font-bold font-mono-num text-emerald-400">
                  {formatCurrencyAmount(bill.totalAmount)} TK.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PARTIES */}
        {activeTab === 'parties' && (
          <div className="space-y-5">
            {/* Customer Details */}
            <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 space-y-3">
              <div className="flex items-center gap-2 border-b border-neutral-200 pb-2">
                <User className="w-4 h-4 text-neutral-700" />
                <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wide">
                  Customer / Buyer Factory
                </h3>
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  value={bill.customer.name}
                  onChange={(e) =>
                    onChange({
                      ...bill,
                      customer: { ...bill.customer, name: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded font-semibold text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-800"
                  placeholder="e.g. RAIDHA COLLECTION LTD."
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  Factory Address *
                </label>
                <input
                  type="text"
                  value={bill.customer.factoryAddress}
                  onChange={(e) =>
                    onChange({
                      ...bill,
                      customer: { ...bill.customer, factoryAddress: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-800"
                  placeholder="e.g. Jamirdia, Valuka, Mymensingh."
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  Attention / Contact Person (Optional)
                </label>
                <input
                  type="text"
                  value={bill.customer.attention || ''}
                  onChange={(e) =>
                    onChange({
                      ...bill,
                      customer: { ...bill.customer, attention: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-800"
                  placeholder="e.g. Merchandiser / Factory Manager"
                />
              </div>
            </div>

            {/* Company / Supplier Details */}
            <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 space-y-3">
              <div className="flex items-center gap-2 border-b border-neutral-200 pb-2">
                <Building2 className="w-4 h-4 text-neutral-700" />
                <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wide">
                  Factory / Supplier Profile
                </h3>
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={bill.company.name}
                  onChange={(e) =>
                    onChange({
                      ...bill,
                      company: { ...bill.company, name: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded font-bold text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-800"
                  placeholder="e.g. NUR FASHION SWEATER"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">
                    Address *
                  </label>
                  <input
                    type="text"
                    value={bill.company.address}
                    onChange={(e) =>
                      onChange({
                        ...bill,
                        company: { ...bill.company, address: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-800"
                    placeholder="e.g. MC Bazar, Sreepur, Gazipur"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">
                    Mobile / Contact *
                  </label>
                  <input
                    type="text"
                    value={bill.company.mobile}
                    onChange={(e) =>
                      onChange({
                        ...bill,
                        company: { ...bill.company, mobile: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-800"
                    placeholder="e.g. Mob: 01978-5498"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">
                    Signatory Title
                  </label>
                  <input
                    type="text"
                    value={bill.company.signatoryTitle}
                    onChange={(e) =>
                      onChange({
                        ...bill,
                        company: { ...bill.company, signatoryTitle: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-800"
                    placeholder="e.g. Managing Director"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">
                    Signatory Company Name
                  </label>
                  <input
                    type="text"
                    value={bill.company.signatoryCompany}
                    onChange={(e) =>
                      onChange({
                        ...bill,
                        company: { ...bill.company, signatoryCompany: e.target.value },
                      })
                    }
                    className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-800"
                    placeholder="e.g. Nur Fashion Sweater"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SETTINGS & IN WORDS */}
        {activeTab === 'settings' && (
          <div className="space-y-4">
            {/* In Word Section */}
            <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Amount in Words (Bangladeshi Taka / Lac)
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const words = numberToBangladeshiTakaWords(bill.totalAmount);
                    onChange({
                      ...bill,
                      inWords: words,
                      isAutoInWords: true,
                    });
                  }}
                  className="text-[11px] text-neutral-600 hover:text-neutral-900 flex items-center gap-1 hover:underline"
                >
                  <RotateCcw className="w-3 h-3" />
                  Auto Regenerate
                </button>
              </div>

              <textarea
                rows={2}
                value={bill.inWords}
                onChange={(e) =>
                  onChange({
                    ...bill,
                    inWords: e.target.value,
                    isAutoInWords: false,
                  })
                }
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded focus:outline-none focus:ring-1 focus:ring-neutral-800 font-serif-doc"
                placeholder="In words..."
              />
              <p className="text-[11px] text-neutral-500">
                Formula: Converts automatically to Bengali/Indian format: Lac / Thousand / Hundred / Taka Only.
              </p>
            </div>

            {/* Layout & Spacer Adjustments */}
            <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200 space-y-3">
              <div className="flex items-center gap-2 border-b border-neutral-200 pb-2">
                <Sliders className="w-4 h-4 text-neutral-700" />
                <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wide">
                  Print Layout & White Space
                </h3>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-neutral-700 mb-1">
                  <span>Table Empty Row Height (Pad Spacing)</span>
                  <span className="font-mono-num">{bill.emptyRowsHeight}px</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="500"
                  step="10"
                  value={bill.emptyRowsHeight}
                  onChange={(e) =>
                    onChange({
                      ...bill,
                      emptyRowsHeight: parseInt(e.target.value, 10),
                    })
                  }
                  className="w-full accent-neutral-800 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-neutral-400 mt-0.5">
                  <span>Compact (Multi-item)</span>
                  <span>Default (Original Pad ~340px)</span>
                  <span>Tall</span>
                </div>
              </div>

              {/* Table style options & Signature Checkboxes */}
              <div className="space-y-2 pt-2 border-t border-neutral-200">
                <label className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bill.showPicsInItemRow || false}
                    onChange={(e) =>
                      onChange({
                        ...bill,
                        showPicsInItemRow: e.target.checked,
                      })
                    }
                    className="rounded text-neutral-800 focus:ring-neutral-800"
                  />
                  <span>Include "Pics" word inside item row (default: unchecked / pure number in item, "Pics" in Total)</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bill.showItemRowBorders || false}
                    onChange={(e) =>
                      onChange({
                        ...bill,
                        showItemRowBorders: e.target.checked,
                      })
                    }
                    className="rounded text-neutral-800 focus:ring-neutral-800"
                  />
                  <span>Show horizontal row border line between items</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bill.showReceiverSignature}
                    onChange={(e) =>
                      onChange({
                        ...bill,
                        showReceiverSignature: e.target.checked,
                      })
                    }
                    className="rounded text-neutral-800 focus:ring-neutral-800"
                  />
                  <span>Include "Receiver's Signature" line</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bill.showPreparedBySignature}
                    onChange={(e) =>
                      onChange({
                        ...bill,
                        showPreparedBySignature: e.target.checked,
                      })
                    }
                    className="rounded text-neutral-800 focus:ring-neutral-800"
                  />
                  <span>Include "Prepared By" signature line</span>
                </label>
              </div>

              {/* Optional Bill Notes */}
              <div className="pt-2 border-t border-neutral-200">
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  Optional Notes / Remarks (Bottom of Bill)
                </label>
                <input
                  type="text"
                  value={bill.notes || ''}
                  onChange={(e) => onChange({ ...bill, notes: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded text-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-800"
                  placeholder="e.g. Work completed as per approved specimen & QC."
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
