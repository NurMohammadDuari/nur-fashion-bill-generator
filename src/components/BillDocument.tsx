import React from 'react';
import { BillData } from '../types/bill';
import { formatCurrencyAmount, formatQtyNumber } from '../utils/numberToWords';

interface BillDocumentProps {
  bill: BillData;
  scale?: number;
}

export const BillDocument: React.FC<BillDocumentProps> = ({ bill, scale = 1 }) => {
  return (
    <div
      id="printable-bill-document"
      className="print-area font-serif-doc bg-white text-black border border-neutral-300 shadow-xl mx-auto transition-transform origin-top flex flex-col justify-between"
      style={{
        width: '210mm',
        minHeight: '297mm',
        boxSizing: 'border-box',
        padding: '12mm 15mm 14mm 15mm',
        transform: scale !== 1 ? `scale(${scale})` : undefined,
      }}
    >
      <div>
      {/* Header */}
      <div className="text-center mb-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wide uppercase m-0 leading-tight">
          {bill.company.name}
        </h1>
        <p className="text-xs sm:text-sm my-0.5 font-medium">{bill.company.address}</p>
        <p className="text-xs sm:text-sm my-0.5 font-medium">{bill.company.mobile}</p>
      </div>

      {/* Thick Divider */}
      <div className="border-b-[3px] border-black mb-3.5"></div>

      {/* Meta Row: Bill No, Title, Date */}
      <div className="flex justify-between items-center font-bold text-sm sm:text-base mb-3.5 px-0.5">
        <div>Bill No- {bill.billNo}</div>
        <div className="text-lg sm:text-xl underline font-bold tracking-wider uppercase">
          {bill.billTitle}
        </div>
        <div>Date: {bill.date}</div>
      </div>

      {/* Customer Information */}
      <div className="text-xs sm:text-sm font-bold mb-3.5 leading-relaxed space-y-0.5">
        <div className="flex items-start">
          <span className="w-36 shrink-0">Customer Name&nbsp;&nbsp;:</span>
          <span className="uppercase">{bill.customer.name}</span>
        </div>
        <div className="flex items-start">
          <span className="w-36 shrink-0">Factory Address&nbsp;:</span>
          <span>{bill.customer.factoryAddress}</span>
        </div>
        {bill.customer.attention && (
          <div className="flex items-start">
            <span className="w-36 shrink-0">Attention&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span>
            <span>{bill.customer.attention}</span>
          </div>
        )}
      </div>

      {/* Main Table */}
      <table className="w-full table-fixed border-collapse text-[11px] sm:text-xs box-border shrink-0">
        <thead>
          <tr className="bg-white">
            <th className="border-t border-b border-l border-black p-1 text-center font-bold w-[4%]">
              SL<br />No
            </th>
            <th className="border-t border-b border-l border-black px-1.5 py-1 text-center font-bold w-[28%] whitespace-nowrap">
              Description
            </th>
            <th className="border-t border-b border-l border-black px-1 py-1 text-center font-bold w-[12%]">
              Buyer
            </th>
            <th className="border-t border-b border-l border-black px-1 py-1 text-center font-bold w-[8%]">
              Style No
            </th>
            <th className="border-t border-b border-l border-black px-1 py-1 text-center font-bold w-[13%] whitespace-nowrap">
              Qty in<br />Pics
            </th>
            <th className="border-t border-b border-l border-black px-0.5 py-1 text-center font-bold w-[5%]">
              Po<br />No
            </th>
            <th className="border-t border-b border-l border-black px-1 py-1 text-center font-bold w-[12%]">
              Rate/Par Pics
            </th>
            <th className="border-t border-b border-l border-r border-black px-1 py-1 text-center font-bold w-[18%]">
              Amount@ BD Tk
            </th>
          </tr>
        </thead>
        <tbody>
          {bill.items.map((item, idx) => {
            const isLast = idx === bill.items.length - 1;
            const rowHeight = isLast
              ? Math.max(90, (bill.emptyRowsHeight || 280) - (bill.items.length - 1) * 32)
              : undefined;

            return (
              <tr
                key={item.id}
                style={{ height: rowHeight ? `${rowHeight}px` : undefined }}
                className={
                  bill.showItemRowBorders
                    ? 'border-b border-black'
                    : isLast
                    ? ''
                    : 'border-b border-dashed border-neutral-300'
                }
              >
                <td className="border-l border-b border-black p-1 text-center align-top">
                  {item.slNo}.
                </td>
                <td className="border-l border-b border-black px-2 py-1.5 align-top font-medium whitespace-nowrap">
                  {item.description}
                </td>
                <td className="border-l border-b border-black px-1 py-1.5 text-center align-top font-medium">
                  {item.buyer}
                </td>
                <td className="border-l border-b border-black px-1 py-1.5 text-center align-top font-medium">
                  {item.styleNo}
                </td>
                <td className="border-l border-b border-black px-1 py-1.5 text-center align-top font-medium whitespace-nowrap">
                  {formatQtyNumber(item.qty)}
                  {bill.showPicsInItemRow ? ' Pics' : ''}
                </td>
                <td className="border-l border-b border-black px-0.5 py-1.5 text-center align-top">
                  {item.poNo || ''}
                </td>
                <td className="border-l border-b border-black px-1 py-1.5 text-center align-top whitespace-nowrap">
                  {item.rate.toFixed(2)} TK.
                </td>
                <td className="border-l border-r border-b border-black pr-2 pl-1 py-1.5 text-right align-top font-semibold whitespace-nowrap">
                  {formatCurrencyAmount(item.amount)} TK.
                </td>
              </tr>
            );
          })}

          {/* Total Summary Row: Columns 1, 2, 3 have NO borders. Total= starts at Column 4 (Style No) */}
          <tr className="font-bold text-xs sm:text-sm leading-normal">
            <td colSpan={3} className="border-none p-0 bg-transparent"></td>
            <td className="border-l border-r border-b border-black px-1.5 py-2.5 text-center font-bold whitespace-nowrap align-middle">
              Total=
            </td>
            <td className="border-r border-b border-black px-1.5 py-2.5 text-center font-bold whitespace-nowrap align-middle">
              {formatQtyNumber(bill.totalQty)} Pics
            </td>
            <td className="border-r border-b border-black p-0 align-middle"></td>
            <td className="border-r border-b border-black px-1.5 py-2.5 text-center font-bold whitespace-nowrap align-middle">
              Total=
            </td>
            <td className="border-r border-b border-black pr-2.5 pl-1 py-2.5 text-right font-bold whitespace-nowrap align-middle">
              {formatCurrencyAmount(bill.totalAmount)} TK.
            </td>
          </tr>
        </tbody>
      </table>

      {/* In Words Section */}
      <div className="mt-6 text-xs sm:text-sm font-serif-doc leading-relaxed">
        <span className="font-bold">In Word:</span> {bill.inWords}
      </div>

      {bill.notes && (
        <div className="mt-3 text-xs text-neutral-600 font-serif-doc italic">
          <span className="font-semibold not-italic">Note:</span> {bill.notes}
        </div>
      )}
      </div>

      {/* Signature Section */}
      <div className="mt-6 flex justify-between items-end pt-2 pb-1">
        {bill.showReceiverSignature ? (
          <div className="text-center">
            <div className="w-40 border-t border-dotted border-black mb-1.5 mx-auto"></div>
            <div className="font-bold text-sm">Receiver's Signature</div>
            <div className="text-xs">{bill.customer.name}</div>
          </div>
        ) : (
          <div></div>
        )}

        {bill.showPreparedBySignature && (
          <div className="text-center">
            <div className="w-36 border-t border-dotted border-black mb-1.5 mx-auto"></div>
            <div className="font-bold text-xs sm:text-sm">Prepared By</div>
            <div className="text-xs">Accounts / Commercial</div>
          </div>
        )}

        <div className="text-center">
          <div className="w-44 border-t border-black mb-1.5 mx-auto"></div>
          <div className="font-bold text-sm sm:text-base leading-tight">
            {bill.company.signatoryTitle}
          </div>
          <div className="text-xs sm:text-sm font-medium">{bill.company.signatoryCompany}</div>
        </div>
      </div>
    </div>
  );
};
