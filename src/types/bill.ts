export interface BillItem {
  id: string;
  slNo: number;
  description: string;
  buyer: string;
  styleNo: string;
  qty: number;
  poNo: string;
  rate: number;
  amount: number;
}

export interface CompanyProfile {
  name: string;
  address: string;
  mobile: string;
  signatoryTitle: string;
  signatoryCompany: string;
}

export interface CustomerProfile {
  name: string;
  factoryAddress: string;
  attention?: string;
  mobile?: string;
}

export interface BillData {
  id: string;
  billNo: string;
  billTitle: string;
  date: string;
  company: CompanyProfile;
  customer: CustomerProfile;
  items: BillItem[];
  totalQty: number;
  totalAmount: number;
  inWords: string;
  isAutoInWords: boolean;
  emptyRowsHeight: number;
  showItemRowBorders?: boolean;
  showPicsInItemRow?: boolean;
  showReceiverSignature: boolean;
  showPreparedBySignature: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
