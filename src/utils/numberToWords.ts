/**
 * Convert number to words in Bangladeshi / South Asian format (Lac / Crore)
 * e.g., 186466 => "One Lac Eighty Six Thousand Four Hundred Sixty Six Taka Only."
 */

const ones = [
  '',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
  'Eleven',
  'Twelve',
  'Thirteen',
  'Fourteen',
  'Fifteen',
  'Sixteen',
  'Seventeen',
  'Eighteen',
  'Nineteen',
];

const tens = [
  '',
  '',
  'Twenty',
  'Thirty',
  'Forty',
  'Fifty',
  'Sixty',
  'Seventy',
  'Eighty',
  'Ninety',
];

function twoDigitsToWords(n: number): string {
  if (n < 20) return ones[n];
  const t = Math.floor(n / 10);
  const u = n % 10;
  return (tens[t] + (u ? ' ' + ones[u] : '')).trim();
}

function threeDigitsToWords(n: number): string {
  const h = Math.floor(n / 100);
  const rem = n % 100;
  let res = '';
  if (h > 0) {
    res += ones[h] + ' Hundred';
  }
  if (rem > 0) {
    if (res) res += ' ';
    res += twoDigitsToWords(rem);
  }
  return res;
}

export function numberToBangladeshiTakaWords(num: number): string {
  if (isNaN(num) || num <= 0) {
    return 'Zero Taka Only.';
  }

  const integerPart = Math.floor(num);
  const decimalPart = Math.round((num - integerPart) * 100);

  let n = integerPart;
  const parts: string[] = [];

  // South Asian numbering:
  // Crores (1,00,00,000)
  const crores = Math.floor(n / 10000000);
  n = n % 10000000;

  // Lacs (1,00,000)
  const lacs = Math.floor(n / 100000);
  n = n % 100000;

  // Thousands (1,000)
  const thousands = Math.floor(n / 1000);
  n = n % 1000;

  // Hundreds & units
  const hundreds = Math.floor(n / 100);
  const remainder = n % 100;

  if (crores > 0) {
    parts.push(numberToBangladeshiTakaWords(crores).replace(' Taka Only.', '') + ' Crore');
  }

  if (lacs > 0) {
    parts.push(twoDigitsToWords(lacs) + ' Lac');
  }

  if (thousands > 0) {
    parts.push(twoDigitsToWords(thousands) + ' Thousand');
  }

  if (hundreds > 0) {
    parts.push(ones[hundreds] + ' Hundred');
  }

  if (remainder > 0) {
    parts.push(twoDigitsToWords(remainder));
  }

  let words = parts.join(' ').trim();
  if (!words) {
    words = 'Zero';
  }

  let result = words + ' Taka';
  if (decimalPart > 0) {
    result += ' and ' + twoDigitsToWords(decimalPart) + ' Paisa';
  }
  result += ' Only.';

  return result;
}

/**
 * Format number into South Asian Lakh / Crore comma style
 * e.g., 186466 => "1,86,466"
 */
export function formatSouthAsianNumber(val: number): string {
  if (isNaN(val)) return '0';
  const isNegative = val < 0;
  const absVal = Math.abs(val);
  const parts = absVal.toFixed(2).split('.');
  let numStr = parts[0];
  const dec = parts[1];

  if (numStr.length <= 3) {
    return (isNegative ? '-' : '') + numStr + (dec !== '00' ? '.' + dec : '');
  }

  // Last 3 digits
  const lastThree = numStr.slice(-3);
  let otherDigits = numStr.slice(0, -3);

  // Group rest by 2s
  const paired = otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  const res = paired + ',' + lastThree;

  return (isNegative ? '-' : '') + res;
}

/**
 * Format currency with 2 decimal places e.g., 186466 => "1,86,466.00"
 */
export function formatCurrencyAmount(val: number): string {
  if (isNaN(val)) return '0.00';
  const absVal = Math.abs(val);
  const parts = absVal.toFixed(2).split('.');
  const numStr = parts[0];
  const dec = parts[1];

  let formattedNum = numStr;
  if (numStr.length > 3) {
    const lastThree = numStr.slice(-3);
    const otherDigits = numStr.slice(0, -3);
    formattedNum = otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
  }

  return (val < 0 ? '-' : '') + formattedNum + '.' + dec;
}

/**
 * Format quantity with integer commas e.g., 4907 => "4,907"
 */
export function formatQtyNumber(val: number): string {
  if (isNaN(val)) return '0';
  const numStr = Math.round(val).toString();
  if (numStr.length <= 3) return numStr;
  const lastThree = numStr.slice(-3);
  const otherDigits = numStr.slice(0, -3);
  return otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
}
