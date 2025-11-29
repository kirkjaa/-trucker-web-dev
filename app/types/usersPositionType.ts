export interface IUsersPositionListTable {
  id: string;
  name: string;
  title: string;
  isActive: boolean;
  permission: IUsersPositionPermission;
}

export interface IUsersPositionPermission {
  isManageDashboard: boolean;
  isManageCompany: boolean;
  isManageUser: boolean;
  isManageChat: boolean;
  isManageQuotaion: boolean;
  isManageOrder: boolean;
  isManageTruck: boolean;
  isManagePackage: boolean;
  isManageProfile: boolean;
}

export interface IUsersPositionId {
  id: string;
}
