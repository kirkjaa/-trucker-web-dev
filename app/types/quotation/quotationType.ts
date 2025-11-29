import { IOffer, IOfferBase, IRouteQuotationOffer } from "../offer/offerType";
import { IRfqById } from "../rfq/rfqType";

interface IQuotationBase<TRfq, UOffer> {
  id: number;
  display_code: string;
  status: string;
  contract_file_url: string;
  contract_fuel_price_url: string;
  is_renewal: string;
  quotation_rfq: TRfq;
  offer: UOffer;
  created_date: Date;
}

export type IQuotationList = IQuotationBase<
  Omit<IRfqById, "is_active" | "signature" | "rfq_organizations" | "offers">,
  Omit<IOffer, "rfq" | "signature" | "price_columns" | "routes">
>;

export type IQuotationById = IQuotationBase<
  Omit<IRfqById, "rfq_organizations" | "offers">,
  Omit<IOfferBase<IRouteQuotationOffer>, "rfq">
>;
