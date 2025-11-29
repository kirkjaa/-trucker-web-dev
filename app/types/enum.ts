export enum EHttpStatusCode {
  SUCCESS = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  CONFLICT = 409,
  SERVER_ERROR = 500,
}

export enum ERoles {
  ADMIN = "SUPERADMIN",
  ORGANIZATION = "ORGANIZATION",
  FACTORY = "FACTORY",
  COMPANY = "COMPANY",
  DRIVER = "Driver",
}

export enum ESortDirection {
  ASC = "asc",
  DESC = "desc",
}

export enum EAdminPathName {
  FACTORIES = "/admin/factories",
  COMPANIES = "/admin/companies",
  SYSTEMUSERSFACTORIES = "/admin/system-users/factories",
  CREATESYSTEMUSERSFACTORIES = "/admin/system-users/factories/create",
  SYSTEMUSERSCOMPANIES = "/admin/system-users/companies",
  CREATESYSTEMUSERSCOMPANIES = "/admin/system-users/companies/create",
  DRIVERSINTERNAL = "/admin/drivers/internal",
  DRIVERSFREELANCE = "/admin/drivers/freelance",
  DRIVERSREVIEWFREELANCE = "/admin/drivers/review/freelance",
  COINS = "/admin/coins",
  PACKAGES = "/admin/packages",
  DOMESTICROUTE = "/admin/route/domestic",
  CONFIRMDOMESTICROUTE = "/admin/route/confirm/domestic",
  CONFIRMINTERNATIONALROUTE = "/admin/route/confirm/international",
  CREATEDOMESTICROUTE = "/admin/route/domestic/create",
  CREATEINTERNATIONALROUTE = "/admin/route/international/create",
  INTERNATIONALROUTE = "/admin/route/international",
  UPLOADTEMPLATECSV = "/admin/upload-template/csv",
  CHAT = "/admin/chat",
  TRUCKTYPES = "/admin/truck/types",
  TRUCKSIZES = "/admin/truck/sizes",
  DATAUSERS = "/admin/data-users",
  PLUGIN = "/admin/plugin",
}

export enum EFacPathName {
  RFQLIST = "/factory/list-of-rfq",
  QUOPENDING = "/factory/quotation-pending",
  QUOAPPROVED = "/factory/quotation-approved",
  QUOEXPIRED = "/factory/quotation-expired",
  TRUCK = "/factory/truck",
  USERSPOSITION = "/factory/position/users",
  USERS = "/factory/users",
  SHIPPINGCOMPANY = "/factory/shipping-company",
  CHAT = "/factory/chat",
  PACKAGE = "/factory/package",
  CREATE_RFQ_ONEWAY = "/factory/list-of-rfq/create/one-way",
  CREATE_RFQ_MULTIWAY = "/factory/list-of-rfq/create/multi-way",
  CREATE_RFQ_ABROAD = "/factory/list-of-rfq/create/abroad",
  COMPANY_SELECTED = "/factory/list-of-rfq/company-selected",
  DOMESTIC_ROUTE = "/factory/route-code/domestic",
  INTERNATIONAL_ROUTE = "/factory/route-code/international",
  DASHBOARD_SUMMARY = "/factory/dashboard/summary",
  DASHBOARD_FINANCIAL = "/factory/dashboard/financial",
  DASHBOARD_QUOTATION = "/factory/dashboard/quotation",
  DASHBOARD_ORDER = "/factory/dashboard/order",
  NOTIFICATION = "/factory/notification",
  DISBURSEMENTEMPLOYEE = "/factory/employee/disbursement",
  DISBURSEMENTTRANSPORTATION = "/factory/transportation/disbursement",
  ORDERS_PUBLISHED = "/factory/orders/published",
  ORDERS_MATCHED = "/factory/orders/matched",
  ORDERS_START_SHIP = "/factory/orders/start-ship",
  ORDERS_SHIPPED = "/factory/orders/shipped",
  ORDERS_COMPLETED = "/factory/orders/completed",
  CREATE_ORDER_ONEWAY = "/factory/orders/published/create/one-way",
  CREATE_ORDER_MULTIWAY = "/factory/orders/published/create/multi-way",
  CREATE_ORDER_ABROAD = "/factory/orders/published/create/abroad",
}

export enum EComPathName {
  QUOFAC = "/company/quotation-factory",
  QUOFAC_OFFERED = "/company/quotation-factory/bid-offered",
  QUOFAC_REJECTED = "/company/quotation-factory/bid-rejected",
  QUOFAC_CANCELED = "/company/quotation-factory/bid-canceled",
  QUOMAR = "/company/quotation-market",
  QUOMAR_OFFERED = "/company/quotation-market/bid-offered",
  QUOMAR_REJECTED = "/company/quotation-market/bid-rejected",
  QUOMAR_CANCELED = "/company/quotation-market/bid-canceled",
  QUOPENDING = "/company/quotation-pending",
  QUOAPPROVED = "/company/quotation-approved",
  QUOEXPIRED = "/company/quotation-expired",
  TRUCK = "/company/truck",
  RENTALTRUCK = "/company/rental/truck",
  PRICEENTRYDOMESTIC = "/company/domestic/price-entry",
  PRICEENTRYABROAD = "/company/abroad/price-entry",
  PACKAGE = "/company/package",
  USERSPOSITION = "/company/position/users",
  USERS = "/company/users",
  CREATEUSERS = "/company/users/create",
  USERSDRIVER = "/company/driver/users",
  CHAT = "/company/chat",
  DASHBOARD_SUMMARY = "/company/dashboard/summary",
  DASHBOARD_FINANCIAL = "/company/dashboard/financial",
  DASHBOARD_QUOTATION = "/company/dashboard/quotation",
  DASHBOARD_ORDER = "/company/dashboard/order",
  NOTIFICATION = "/company/notification",
  DISBURSEMENTFACTORY = "/company/factory/disbursement",
  DISBURSEMENTEMPLOYEE = "/company/employee/disbursement",
  DISBURSEMENTFREELANCE = "/company/freelance/disbursement",
  ORDERS_PUBLISHED = "/company/orders/published",
  ORDERS_START_SHIP = "/company/orders/start-ship",
  ORDERS_SHIPPED = "/company/orders/shipped",
}

export enum ERfqStatus {
  DRAFT = "Draft",
  PUBLISHED = "Published",
  EXPIRED = "Expired",
  CANCELED = "Canceled",
}

export enum EQuotationStatus {
  PENDING = "Pending",
  APPROVED = "Approved",
  EXPIRED = "Expired",
}

export enum ERfqActive {
  ACTIVE = "Active",
  DISABLED = "Disabled",
}

export enum ESendRfqTo {
  ALL = "all",
  ONLYCOMPANY = "only",
}

export enum EBidStatus {
  SUBMITTED = "Submitted",
  APPROVED = "Approved",
  REJECTED = "Rejected",
  CANCELED = "Canceled",
}

export enum PackageType {
  TEST = "Test",
  MONTHLY = "Monthly",
  YEARLY = "Yearly",
}

export enum Routers {
  NOTIFICATION = "/notification",
}

export enum ESignatureType {
  TEXT = "text",
  IMAGE = "image",
}

export enum DriversType {
  FREELANCE = "freelance",
  INTERNAL = "internal",
  REVIEWFREELANCE = "freelance-review",
}

export enum DriversStatus {
  PENDING = "PENDING",
  APPROVE = "APPROVED",
  BAN = "Ban",
  REJECTED = "REJECTED",
  CANCELLED = "Cancelled",
  DRAFT = "Draft",
}

export enum ReviewDriverReason {
  ประวัติการขับขี่ไม่ผ่าน = "ประวัติการขับขี่ไม่ผ่าน",
  คุณสมบัติไม่ตรงกับความต้องการของบริษัท = "คุณสมบัติไม่ตรงกับความต้องการของบริษัท",
  มีประสบการณ์ไม่เพียงพอ = "มีประสบการณ์ไม่เพียงพอ",
  ไม่มีความพร้อมในการทำงานในเวลาปกติ = "ไม่มีความพร้อมในการทำงานในเวลาปกติ",
  อื่นๆ = "อื่นๆ",
}

export enum CoinsType {
  TOPUP = "topUp",
  WITHDRAW = "withdraw",
  PAID = "paid",
  RECEIVED = "received",
}

export enum ERouteShippingType {
  LANDFREIGHT = "landFreight",
  AIRFREIGHT = "airFreight",
  SEAFREIGHT = "seaFreight",
}

export enum ERouteStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  REJECTED = "rejected",
}

export enum ERouteType {
  ONEWAY = "oneWay",
  MULTIWAY = "multiWay",
  ABROAD = "abroad",
}

export enum EUploadTemplateType {
  CREATEROUTE = "createRoute",
  CREATERFQ = "createRfq",
}
export enum ECreateRouteTemplate {
  ROUTE_FACTORY_CODE = "routeFactoryCode",
  ORIGIN = "origin",
  ORIGIN_PROVINCE = "originProvince",
  ORIGIN_DISTRICT = "originDistrict",
  ORIGIN_LAT_LONG = "originLatLong",
  DESTINATION = "destination",
  DESTINATION_PROVINCE = "destinationProvince",
  DESTINATION_DISTRICT = "destinationDistrict",
  DESTINATION_LAT_LONG = "destinationLatLong",
  RETURN_POINT = "returnPoint",
  RETURN_POINT_PROVINCE = "returnPointProvince",
  RETURN_POINT_DISTRICT = "returnPointDistrict",
  RETURN_POINT_LAT_LONG = "returnPointLatLong",
  DISTANCE = "distance",
  PRICE = "price",
  UNIT = "unit",
}

export enum ECreateRouteTemplateRequried {
  ROUTE_FACTORY_CODE = "routeFactoryCode",
}

export enum EPackagesType {
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  ANNUAL = "annual",
}

export enum EChatMessageType {
  TEXT = "txt",
  IMAGE = "img",
  AUDIO = "audio",
  FILE = "file",
  LOC = "loc",
  CMD = "cmd",
  CUSTOME = "custome",
}

export enum EKeyCode {
  ENTER = 13,
}

export enum ESearchKey {
  DISPLAYCODE = "displayCode",
  NAME = "name",
  FIRSTNAME = "firstName",
  LASTNAME = "lastName",
  COMPANYNAME = "company.name",
  USEREMAIL = "user.email",
  TRUCKCODE = "truckCode",
  BRAND = "brand",
  LICENSEPLATE = "licensePlate.value",
  CONTRACTCOMPANYNAME = "contractCompany.name",
  CONTRACTCOMPANYDISPLAYCODE = "contractCompany.displayCode",
}

export const searchKeyLabels: Record<ESearchKey, string> = {
  [ESearchKey.DISPLAYCODE]: "รหัส",
  [ESearchKey.NAME]: "ชื่อ",
  [ESearchKey.FIRSTNAME]: "ชื่อ",
  [ESearchKey.LASTNAME]: "นามสกุล",
  [ESearchKey.COMPANYNAME]: "ชื่อบริษัท",
  [ESearchKey.TRUCKCODE]: "รหัสรถ",
  [ESearchKey.BRAND]: "ยี่ห้อ",
  [ESearchKey.LICENSEPLATE]: "ป้ายทะเบียน",
  [ESearchKey.CONTRACTCOMPANYNAME]: "ชื่อบริษัท",
  [ESearchKey.CONTRACTCOMPANYDISPLAYCODE]: "รหัส",
  [ESearchKey.USEREMAIL]: "อีเมล",
};

export enum ETruckDepartmentType {
  FACTORY = "factory",
  COMPANY = "company",
  FREELANCE = "freelance",
}

export enum ETruckContainers {
  TWENTY_FEET = "20FT",
  FOURTY_FEET = "40FT",
  FOURTY_FIVE_FEET = "45FT",
  FIVETY_FEET = "50FT",
}

export enum ETruckFuelType {
  DIESEL = "DIESEL",
  BENZINE = "BENZINE",
  GASOLINE = "GASOLINE",
  GASOHOL = "GASOHOL",
  CNG = "CNG",
  LNG = "LNG",
  HYDROGEN = "HYDROGEN",
  BIODIESEL = "BIODIESEL",
  ELECTRICT = "ELECTRICT",
  HYBRID_DIESEL = "HYBRID_DIESEL",
  HYBRID_GASOLINE = "HYBRID_GASOLINE",
}

export enum ETruckSize {
  FOUR_WHEEL = "4_WHEEL",
  SIX_WHEEL = "6_WHEEL",
  EIGHT_WHEEL = "8_WHEEL",
  TEN_WHEEL = "10_WHEEL",
  TWELVE_WHEEL = "12_WHEEL",
  FOURTEEN_WHEEL = "14_WHEEL",
  SIXTEEN_WHEEL = "16_WHEEL",
  EIGHTTEEN_WHEEL = "18_WHEEL",
  TWELVE_WHEEL_WHEEL = "20_WHEEL",
}

export enum ETruckType {
  PICKUP_TRUCK = "PICKUP_TRUCK", // รถกระบะบรรทุก,
  CARGO_VAN = "CARGO_VAN", // รถตู้บรรทุก,
  TANKER_TRUCK = "TANKER_TRUCK", // รถบรรทุกของเหลว
  HAZARDOUS_MATERITAL_TRUCK = "HAZARDOUS_MATERITAL_TRUCK", // รถบรรทุกวัสดุอันตราย ,
  SPECIFIC_TRUCK = "SPECIFIC_TRUCK", // รถบรรทุกเฉพาะกิจ
  TRAILER = "TRAILER", // รถพ่วง
  SEMI_TRAILER = "SEMI_TRAILER", // รถกึ่งพ่วง
  SEMI_TRAILER_CARRYING_LONG_MATERIAL = "SEMI_TRAILER_CARRYING_LONG_MATERIAL", // รถกึ่งพ่วงบรรทุกวัสดุยาว
  TOWING_TRUCK = "TOWING_TRUCK", // รถลากจูง
}

export enum EUsersPosition {
  IS_MANAGE_DASHBOARD = "isManageDashboard",
  IS_MANAGE_COMPANY = "isManageCompany",
  IS_MANAGE_USER = "isManageUser",
  IS_MANAGE_CHAT = "isManageChat",
  IS_MANAGE_QUOTATION = "isManageQuotaion",
  IS_MANAGE_ORDER = "isManageOrder",
  IS_MANAGE_TRUCK = "isManageTruck",
  IS_MANAGE_PACKAGE = "isManagePackage",
  IS_MANAGE_PROFILE = "isManageProfile",
}

export const truckTypeLabel: Record<ETruckType, string> = {
  [ETruckType.PICKUP_TRUCK]: "รถกระบะบรรทุก",
  [ETruckType.CARGO_VAN]: "รถตู้บรรทุก",
  [ETruckType.TANKER_TRUCK]: "รถบรรทุกของเหลว",
  [ETruckType.HAZARDOUS_MATERITAL_TRUCK]: "รถบรรทุกวัสดุอันตราย",
  [ETruckType.SPECIFIC_TRUCK]: "รถบรรทุกเฉพาะกิจ",
  [ETruckType.TRAILER]: "รถพ่วง",
  [ETruckType.SEMI_TRAILER]: "รถกึ่งพ่วง",
  [ETruckType.SEMI_TRAILER_CARRYING_LONG_MATERIAL]: "รถกึ่งพ่วงบรรทุกวัสดุยาว",
  [ETruckType.TOWING_TRUCK]: "รถลากจูง",
};

export const usersPositionLabel: Record<EUsersPosition, string> = {
  [EUsersPosition.IS_MANAGE_DASHBOARD]: "แผงควบคุม",
  [EUsersPosition.IS_MANAGE_COMPANY]: "รายชื่อบริษัทขนส่ง",
  [EUsersPosition.IS_MANAGE_USER]: "จัดการผู้ใช้",
  [EUsersPosition.IS_MANAGE_CHAT]: "แชท",
  [EUsersPosition.IS_MANAGE_QUOTATION]: "เสนอราคา",
  [EUsersPosition.IS_MANAGE_ORDER]: "การขนส่ง",
  [EUsersPosition.IS_MANAGE_TRUCK]: "รถบรรทุกโรงงาน",
  [EUsersPosition.IS_MANAGE_PACKAGE]: "แพ็คเกจ",
  [EUsersPosition.IS_MANAGE_PROFILE]: "โปรไฟล์",
};
export const truckSizeLabel: Record<ETruckSize, string> = {
  [ETruckSize.FOUR_WHEEL]: "4 ล้อ",
  [ETruckSize.SIX_WHEEL]: "6 ล้อ",
  [ETruckSize.EIGHT_WHEEL]: "8 ล้อ",
  [ETruckSize.TEN_WHEEL]: "10 ล้อ",
  [ETruckSize.TWELVE_WHEEL]: "12 ล้อ",
  [ETruckSize.FOURTEEN_WHEEL]: "14 ล้อ",
  [ETruckSize.SIXTEEN_WHEEL]: "16 ล้อ",
  [ETruckSize.EIGHTTEEN_WHEEL]: "18 ล้อ",
  [ETruckSize.TWELVE_WHEEL_WHEEL]: "20 ล้อ",
};

export enum EPoolType {
  NORMAL = "NORMAL",
  QUICK = "QUICK",
  OFFER = "OFFER",
}

export const poolTypeLabel: Record<EPoolType, string> = {
  [EPoolType.NORMAL]: "เช่ารถแบบรายเดือน",
  [EPoolType.QUICK]: "เช่ารถแบบด่วน",
  [EPoolType.OFFER]: "เสนอราคา",
};

export enum EPostOfferStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

export enum EPostOfferType {
  COMPANY = "COMPANY",
  DRIVER_FREELANCE = "DRIVER_FREELANCE",
}

export enum EFrequency {
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY",
}

export enum EOrderStatus {
  PUBLISHED = "Published",
  MATCHED = "Matched",
  START_SHIP = "StartShipping",
  SHIPPED = "Shipped",
  COMPLETED = "Completed",
}

export enum PaymentStatus {
  Unpaid = "Unpaid",
  Paid = "Paid",
}

export enum PaymentType {
  Cash = "Cash",
  Credit = "Credit",
}

export enum DeliveryType {
  Standard = "Standard",
  Express = "Express",
}
