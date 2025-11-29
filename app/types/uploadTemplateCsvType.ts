export interface IUploadTemplateCsvData {
  id: string;
  factory: IUploadTemplateCsvFactory;
  type: string;
  customerColumns: string[];
  mappedColumns: string[];
}

export interface IUploadTemplateCsvFactory {
  id: string;
  name: string;
}
