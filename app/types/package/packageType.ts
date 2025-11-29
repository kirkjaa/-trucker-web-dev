export interface IPackage {
  id: number;
  code: string;
  name_th: string;
  name_en: string;
  description_th: string;
  description_en: string;
  period: number;
  price: number;
  is_active: string;
  created_date: Date;
  start_date: Date;
  end_date: Date;
}
