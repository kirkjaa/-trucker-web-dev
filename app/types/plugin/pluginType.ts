export interface IPluginFeature {
  id: number;
  feature_name: string;
  description?: string | null;
  limited_price?: number | null;
  monthly_price?: number | null;
  yearly_price?: number | null;
}

export interface IPlugin {
  id: number;
  code: string;
  name: string;
  description?: string | null;
  company_name: string;
  company_location?: string | null;
  plugin_type?: string | null;
  available_credit: number;
  status: string;
  created_at: string;
  created_by: {
    id: string;
    first_name: string;
    last_name: string;
  } | null;
  features: IPluginFeature[];
}

export interface IPluginPayload {
  name: string;
  companyName: string;
  companyLocation?: string;
  pluginType?: string;
  description?: string;
  contactFirstName?: string;
  contactLastName?: string;
  contactPhone?: string;
  contactEmail?: string;
  accountUsername?: string;
  accountPassword?: string;
  limitedOrderQuota?: number | null;
  limitedPrice?: number | null;
  monthlyDurationDays?: number | null;
  monthlyPrice?: number | null;
  yearlyDurationDays?: number | null;
  yearlyPrice?: number | null;
  availableCredit?: number | null;
  status?: "draft" | "active" | "inactive";
  features?: Array<{
    featureName: string;
    description?: string;
    limitedPrice?: number | null;
    monthlyPrice?: number | null;
    yearlyPrice?: number | null;
  }>;
}


