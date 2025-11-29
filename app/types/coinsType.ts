export interface ICoinsData {
  userId: string;
  targetTruckerId: string;
  amount: number;
  type: string;
  imageUrl?: string;
  createdByTruckerId: string;
  approvedBy: string;
  remark: string;
  createdBy: string;
  userRole: string;
  companyName: string;
  factoryName: string;
  driverType: string;
}

export interface ICoinsByTruckerId {
  currentCoin: number;
  transactions: ITransactionCoins[];
}

export interface ITransactionCoins {
  id: string;
  userId: string;
  targetTruckerId: string;
  amount: number;
  type: string;
  imageUrl: string;
  createdByTruckerId: string;
  approvedBy: string;
  remark: string;
  createdBy: string;
  createdAt: string;
  userDepartment: string;
  userRole: string;
  referenceItem: IReferenceItemTransactionCoins;
}

export interface IReferenceItemTransactionCoins {}
