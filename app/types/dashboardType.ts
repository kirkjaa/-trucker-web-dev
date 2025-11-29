export interface IEachMonth {
  month: number;
  total: number;
}

export interface IEachDay {
  day: number;
  total: number;
}

export interface IGetSummaryForFactoryYearlyResponse {
  orderSummary: {
    total: number;
    completedOrder: number;
    canceledOrder: number;
    failedOrder: number;
  };
  truckSummary: {
    total: number;
    available: number;
    notAvailable: number;
  };
  expensesSummaryGroupByMonth: {
    total: number;
    eachMonth: IEachMonth[];
  };
  expensesSummaryGroupByCompany: {
    eachCompany: Array<{
      companyName: string;
      orders: Array<{
        displayCode: string;
        price: number;
      }>;
    }>;
  };
}

export interface IGetSummaryForFactoryMonthlyResponse {
  orderSummary: {
    total: number;
    completedOrder: number;
    canceledOrder: number;
    failedOrder: number;
  };
  truckSummary: {
    total: number;
    available: number;
    notAvailable: number;
  };
  expensesSummaryGroupByDay: {
    total: number;
    eachDay: IEachDay[];
  };
  expensesSummaryGroupByCompany: {
    eachCompany: Array<{
      companyName: string;
      orders: Array<{
        displayCode: string;
        price: number;
      }>;
    }>;
  };
}

export type TGetSummaryForFactoryResponse =
  | IGetSummaryForFactoryYearlyResponse
  | IGetSummaryForFactoryMonthlyResponse;
