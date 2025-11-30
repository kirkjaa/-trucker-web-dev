import { IOrganization } from "../organization/organizationType";

export interface ITemplate {
  id: number;
  template_type: string;
  organization: Omit<
    IOrganization,
    | "type"
    | "business_type"
    | "package"
    | "documents"
    | "addresses"
    | "owner_user"
  >;
  fields: [
    {
      id: number;
      match_field: string;
      field: {
        id: number;
        type: string;
        field_name: string;
      };
    },
  ];
}

export interface ITemplateRequest {
  organization_id: string;
  template_type: string;
  fields: {
    field_id: number;
    match_field: string;
  }[];
}
