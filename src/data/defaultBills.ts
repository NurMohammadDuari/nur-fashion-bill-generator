import { BillData } from '../types/bill';

export const INITIAL_BILL_107: BillData = {
  id: 'bill-107',
  billNo: '107',
  billTitle: 'Bill',
  date: '28.09.2026',
  company: {
    name: 'NUR FASHION SWEATER',
    address: 'MC Bazar, Sreepur, Gazipur',
    mobile: 'Mob: 01978-5498',
    signatoryTitle: 'Managing Director',
    signatoryCompany: 'Nur Fashion Sweater',
  },
  customer: {
    name: 'RAIDHA COLLECTION LTD.',
    factoryAddress: 'Jamirdia, Valuka, Mymensingh.',
  },
  items: [
    {
      id: 'item-1',
      slNo: 1,
      description: 'Linking to Mending Complete',
      buyer: 'BANKOTEX',
      styleNo: '672',
      qty: 4907,
      poNo: '',
      rate: 38.0,
      amount: 186466.0,
    },
  ],
  totalQty: 4907,
  totalAmount: 186466.0,
  inWords: 'One Lac Eighty Six Thousand Four Hundred Sixty Six Taka Only.',
  isAutoInWords: true,
  emptyRowsHeight: 340,
  showItemRowBorders: false,
  showReceiverSignature: false,
  showPreparedBySignature: false,
  createdAt: '2026-09-28T09:00:00.000Z',
  updatedAt: '2026-09-28T21:25:00.000Z',
};

export const INITIAL_BILL_106: BillData = {
  id: 'bill-106',
  billNo: '106',
  billTitle: 'Bill',
  date: '06.09.2026',
  company: {
    name: 'NUR FASHION SWEATER',
    address: 'MC Bazar, Sreepur, Gazipur',
    mobile: 'Mob: 01978-5498',
    signatoryTitle: 'Managing Director',
    signatoryCompany: 'Nur Fashion Sweater',
  },
  customer: {
    name: 'RAIDHA COLLECTION LTD.',
    factoryAddress: 'Jamirdia, Valuka, Mymensingh.',
  },
  items: [
    {
      id: 'item-1',
      slNo: 1,
      description: 'Linking to Mending Complete',
      buyer: 'BANKOTEX',
      styleNo: '673',
      qty: 2950,
      poNo: '',
      rate: 38.0,
      amount: 112100.0,
    },
  ],
  totalQty: 2950,
  totalAmount: 112100.0,
  inWords: 'One Lac Twelve Thousand One Hundred Taka Only.',
  isAutoInWords: true,
  emptyRowsHeight: 340,
  showReceiverSignature: false,
  showPreparedBySignature: false,
  createdAt: '2026-09-06T09:00:00.000Z',
  updatedAt: '2026-09-06T10:00:00.000Z',
};

export const COMMON_PROCESSES = [
  'Linking to Mending Complete',
  'Body Knitting Complete',
  'Collar & Cuff Knitting',
  'Mending & Inspection',
  'Washing & Softening Process',
  'Overlock & Neck Joining',
  'Ironing, Folding & Poly Packing',
  'Sample Development & Linking',
  'Re-linking & Repair Work',
];

export const COMMON_BUYERS = [
  'BANKOTEX',
  'H&M',
  'ZARA',
  'PRIMARK',
  'TARGET',
  'C&A',
  'NEXT',
  'WALMART',
  'LC WAIKIKI',
  'MANGO',
];
