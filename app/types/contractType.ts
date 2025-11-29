export interface IContract {
  id: string;
  factoryId: string; // id factory from mongo
  companyId: string; // id company from mongo
  contractFiles: {
    status: string; // enum Sending === ส่งออโต้ให้ company, Pending === company sign เสร็จแล้ว ให้ฝั่ง Factory Sign ต่อ, Submitted === factory sign เสร็จแล้ว
    fileUrl: string; // from s3
  };
}
