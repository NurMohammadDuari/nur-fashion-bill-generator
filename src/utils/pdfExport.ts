import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { BillData } from '../types/bill';
import { generatePrintReadyHtml } from './exportHtml';

/**
 * Downloads a high-resolution, pixel-perfect A4 PDF directly to user's device.
 * Uses an isolated sandbox iframe with pure RGB/Hex styles to prevent Tailwind v4 'oklch' errors.
 */
export async function downloadBillPdf(
  bill: BillData,
  onProgress?: (message: string) => void
): Promise<boolean> {
  let iframe: HTMLIFrameElement | null = null;
  try {
    onProgress?.('Preparing document for PDF...');

    // Create an isolated iframe so that Tailwind v4's oklch variables and modern color functions
    // are not present in the document parsed by html2canvas
    iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.left = '-9999px';
    iframe.style.top = '0';
    iframe.style.width = '800px';
    iframe.style.height = '1130px';
    iframe.style.border = 'none';
    iframe.style.opacity = '0';
    iframe.style.pointerEvents = 'none';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) {
      throw new Error('Cannot access iframe document');
    }

    const html = generatePrintReadyHtml(bill);
    doc.open();
    doc.write(html);
    doc.close();

    // Allow browser time to parse DOM, layout fonts and tables
    await new Promise((resolve) => setTimeout(resolve, 350));

    const sheetElement = (doc.querySelector('.sheet') as HTMLElement) || doc.body;

    onProgress?.('Rendering high-resolution A4 PDF...');

    const canvas = await html2canvas(sheetElement, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Fills the exact A4 page (210mm x 297mm) with the 15mm margins built into the sheet
    pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);

    const safeCustomer = (bill.customer.name || 'Customer').replace(/[^a-zA-Z0-9]/g, '_');
    const fileName = `Bill_${bill.billNo || 'document'}_${safeCustomer}.pdf`;
    pdf.save(fileName);
    return true;
  } catch (err) {
    console.error('Failed to generate PDF:', err);
    return false;
  } finally {
    if (iframe && document.body.contains(iframe)) {
      document.body.removeChild(iframe);
    }
  }
}

/**
 * Attempts to print using a clean iframe, falling back to direct PDF download
 * if the browser sandbox blocks window.print().
 */
export async function printOrDownloadBill(
  bill: BillData,
  onNotify?: (msg: string) => void
): Promise<{ success: boolean; fellBackToPdf: boolean }> {
  try {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) {
      throw new Error('Cannot access iframe document');
    }

    const html = generatePrintReadyHtml(bill);
    doc.open();
    doc.write(html);
    doc.close();

    // Give browser a moment to layout font and tables
    await new Promise((resolve) => setTimeout(resolve, 350));

    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();

      // Clean up after print dialog finishes
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 30000);

      onNotify?.('Print dialog opened.');
      return { success: true, fellBackToPdf: false };
    } catch (dialogErr) {
      console.warn('iframe.print blocked by iframe sandbox, falling back to direct PDF download', dialogErr);
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
      onNotify?.('Print blocked by sandbox; downloading A4 PDF directly...');
      const ok = await downloadBillPdf(bill);
      return { success: ok, fellBackToPdf: true };
    }
  } catch (err) {
    console.warn('Print routine threw error; falling back to direct PDF download', err);
    onNotify?.('Downloading A4 PDF directly...');
    const ok = await downloadBillPdf(bill);
    return { success: ok, fellBackToPdf: true };
  }
}
