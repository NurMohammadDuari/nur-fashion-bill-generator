import { BillData } from '../types/bill';
import { formatCurrencyAmount, formatQtyNumber } from './numberToWords';

export function generatePrintReadyHtml(bill: BillData): string {
  const itemsHtml = bill.items
    .map((item, idx) => {
      const isLast = idx === bill.items.length - 1;
      const heightAttr = isLast
        ? `style="height: ${Math.max(140, (bill.emptyRowsHeight || 380) - (bill.items.length - 1) * 36)}px;"`
        : '';
      return `
            <tr class="items-row" ${heightAttr}>
                <td class="text-center">${item.slNo}.</td>
                <td style="white-space: nowrap;">${escapeHtml(item.description)}</td>
                <td class="text-center">${escapeHtml(item.buyer)}</td>
                <td class="text-center">${escapeHtml(item.styleNo)}</td>
                <td class="text-center" style="white-space: nowrap;">${formatQtyNumber(item.qty)}${bill.showPicsInItemRow ? ' Pics' : ''}</td>
                <td class="text-center">${escapeHtml(item.poNo || '')}</td>
                <td class="text-center" style="white-space: nowrap;">${item.rate.toFixed(2)} TK.</td>
                <td class="text-right" style="white-space: nowrap;">${formatCurrencyAmount(item.amount)} TK.</td>
            </tr>`;
    })
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Bill - ${escapeHtml(bill.company.name)}</title>
<style>
    @page {
        size: A4 portrait;
        margin: 0;
    }
    * {
        box-sizing: border-box;
    }
    html, body {
        width: 210mm;
        height: 297mm;
        margin: 0 auto;
        padding: 0;
        background-color: #fff;
        font-family: "Times New Roman", Times, serif;
        color: #000;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
    }
    .sheet {
        width: 210mm;
        height: 297mm;
        max-height: 297mm;
        box-sizing: border-box;
        padding: 12mm 15mm 14mm 15mm;
        margin: 0 auto;
        background: #fff;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    .header {
        text-align: center;
        margin-bottom: 8px;
    }
    .header h1 {
        margin: 0;
        font-size: 32px;
        font-weight: 900;
        letter-spacing: 1px;
    }
    .header p {
        margin: 2px 0;
        font-size: 14px;
    }
    .thick-line {
        border-bottom: 3px solid #000;
        margin-bottom: 12px;
    }
    .bill-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: bold;
        font-size: 16px;
        margin-bottom: 15px;
    }
    .bill-title {
        font-size: 20px;
        text-decoration: underline;
        font-weight: bold;
    }
    .customer-info {
        font-size: 14px;
        font-weight: bold;
        margin-bottom: 15px;
        line-height: 1.6;
    }
    .customer-info span {
        display: inline-block;
        width: 140px;
    }
    table {
        width: 100%;
        table-layout: fixed;
        border-collapse: collapse;
        font-size: 12.5px;
        box-sizing: border-box;
    }
    th {
        border-top: 1px solid #000;
        border-bottom: 1px solid #000;
        border-left: 1px solid #000;
        padding: 6px 2px;
        text-align: center;
        font-weight: bold;
        background-color: #fff;
        box-sizing: border-box;
        font-size: 11.5px;
    }
    th:last-child {
        border-right: 1px solid #000;
    }
    .items-row td {
        border-left: 1px solid #000;
        border-bottom: 1px solid #000;
        padding: 6px 4px;
        vertical-align: top;
        box-sizing: border-box;
        font-size: 11.5px;
    }
    .items-row td:last-child {
        border-right: 1px solid #000;
    }
    .total-row td {
        padding: 8px 4px;
        font-weight: bold;
        box-sizing: border-box;
        font-size: 12px;
        line-height: 1.25;
        vertical-align: middle;
    }
    .total-row td.bordered-cell {
        border-right: 1px solid #000;
        border-bottom: 1px solid #000;
    }
    .total-row td.first-total-cell {
        border-left: 1px solid #000;
        border-right: 1px solid #000;
        border-bottom: 1px solid #000;
    }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .in-words {
        margin-top: 30px;
        font-size: 14px;
    }
    .signatures-row {
        margin-top: 90px;
        display: flex;
        justify-content: ${bill.showReceiverSignature ? 'space-between' : 'flex-end'};
        align-items: flex-end;
    }
    .signature-area {
        text-align: center;
    }
    .signature-area .line {
        width: 180px;
        border-top: 1px dotted #000;
        margin-bottom: 6px;
    }
    .signature-area .title {
        font-weight: bold;
        font-size: 16px;
    }
    .signature-area .company {
        font-size: 14px;
    }
</style>
</head>
<body>
<div class="sheet">
    <div>
        <div class="header">
            <h1>${escapeHtml(bill.company.name)}</h1>
            <p>${escapeHtml(bill.company.address)}</p>
            <p>${escapeHtml(bill.company.mobile)}</p>
        </div>

        <div class="thick-line"></div>

        <div class="bill-meta">
            <div>Bill No- ${escapeHtml(bill.billNo)}</div>
            <div class="bill-title">${escapeHtml(bill.billTitle)}</div>
            <div>Date: ${escapeHtml(bill.date)}</div>
        </div>

        <div class="customer-info">
            <div><span>Customer Name&nbsp;&nbsp;:</span> ${escapeHtml(bill.customer.name)}</div>
            <div><span>Factory Address&nbsp;:</span> ${escapeHtml(bill.customer.factoryAddress)}</div>
        </div>

        <table>
            <thead>
                <tr>
                    <th style="width: 4%;">SL<br>No</th>
                    <th style="width: 28%; white-space: nowrap;">Description</th>
                    <th style="width: 12%;">Buyer</th>
                    <th style="width: 8%;">Style No</th>
                    <th style="width: 13%; white-space: nowrap;">Qty in<br>Pics</th>
                    <th style="width: 5%;">Po<br>No</th>
                    <th style="width: 12%;">Rate/Par Pics</th>
                    <th style="width: 18%;">Amount@ BD Tk</th>
                </tr>
            </thead>
            <tbody>
                ${itemsHtml}
                <tr class="total-row">
                    <td colspan="3" style="border: none;"></td>
                    <td class="text-center first-total-cell">Total=</td>
                    <td class="text-center bordered-cell" style="white-space: nowrap;">${formatQtyNumber(bill.totalQty)} Pics</td>
                    <td class="bordered-cell"></td>
                    <td class="text-center bordered-cell">Total=</td>
                    <td class="text-right bordered-cell" style="white-space: nowrap;">${formatCurrencyAmount(bill.totalAmount)} TK.</td>
                </tr>
            </tbody>
        </table>

        <div class="in-words">
            <b>In Word:</b> ${escapeHtml(bill.inWords)}
        </div>
    </div>

    <div class="signatures-row">
        ${
          bill.showReceiverSignature
            ? `<div class="signature-area">
                <div class="line"></div>
                <div class="title">Receiver's Signature</div>
                <div class="company">${escapeHtml(bill.customer.name)}</div>
              </div>`
            : ''
        }
        <div class="signature-area">
            <div class="title">${escapeHtml(bill.company.signatoryTitle)}</div>
            <div class="company">${escapeHtml(bill.company.signatoryCompany)}</div>
        </div>
    </div>
</div>
</body>
</html>`;
}

function escapeHtml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
