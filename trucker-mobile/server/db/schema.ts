import { pgTable, uuid, varchar, text, timestamp, boolean, decimal, integer, pgEnum } from "drizzle-orm/pg-core";

// ============================================================================
// ENUMS (matching desktop database)
// ============================================================================

export const userRoleEnum = pgEnum("user_role", ["SUPERADMIN", "ORGANIZATION", "DRIVER"]);
export const userStatusEnum = pgEnum("user_status", ["ACTIVE", "INACTIVE", "PENDING", "BANNED", "REJECTED", "CANCELLED", "DRAFT"]);
export const routeStatusEnum = pgEnum("route_status", ["pending", "confirmed", "rejected"]);
export const routeTypeEnum = pgEnum("route_type", ["oneWay", "multiWay", "abroad"]);
export const driverStatusEnum = pgEnum("driver_status", ["PENDING", "APPROVED", "BAN", "REJECTED", "CANCELLED", "DRAFT"]);
export const organizationTypeEnum = pgEnum("organization_type", ["FACTORY", "COMPANY"]);
export const bidStatusEnum = pgEnum("bid_status", ["Draft", "Submitted", "Approved", "Rejected", "Canceled"]);
export const orderStatusEnum = pgEnum("order_status", ["Published", "Matched", "StartShipping", "Shipped", "Completed"]);

// ============================================================================
// TABLES (matching actual desktop database schema from init.sql)
// ============================================================================

// Users table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  displayCode: varchar("display_code", { length: 50 }).unique().notNull(),
  username: varchar("username", { length: 100 }).unique().notNull(),
  email: varchar("email", { length: 255 }).unique(),
  passwordHash: text("password_hash"),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  dialCode: varchar("dial_code", { length: 10 }),
  phone: varchar("phone", { length: 20 }),
  idCard: varchar("id_card", { length: 50 }),
  imageUrl: text("image_url"),
  role: userRoleEnum("role").notNull(),
  positionId: integer("position_id"),
  organizationId: uuid("organization_id"),
  status: userStatusEnum("status").default("PENDING"),
  truckerId: varchar("trucker_id", { length: 100 }),
  deleted: boolean("deleted").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: uuid("created_by"),
  updatedBy: uuid("updated_by"),
});

// Organizations (Factories and Companies)
export const organizations = pgTable("organizations", {
  id: uuid("id").primaryKey().defaultRandom(),
  displayCode: varchar("display_code", { length: 50 }).unique().notNull(),
  name: varchar("name", { length: 255 }).notNull(), // actual column is 'name' not 'business_name'
  type: organizationTypeEnum("type").notNull(),
  businessTypeId: integer("business_type_id"),
  dialCode: varchar("dial_code", { length: 10 }),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 255 }),
  taxId: varchar("tax_id", { length: 50 }),
  imageUrl: text("image_url"),
  logoImageUrl: text("logo_image_url"),
  truckerId: varchar("trucker_id", { length: 100 }),
  status: varchar("status", { length: 50 }).default("ACTIVE"),
  deleted: boolean("deleted").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: uuid("created_by"),
  updatedBy: uuid("updated_by"),
});

// Master Routes (actual schema from init.sql)
export const masterRoutes = pgTable("master_routes", {
  id: uuid("id").primaryKey().defaultRandom(),
  displayCode: varchar("display_code", { length: 50 }).unique().notNull(),
  originProvince: varchar("origin_province", { length: 100 }),
  originDistrict: varchar("origin_district", { length: 100 }),
  originLatitude: decimal("origin_latitude", { precision: 10, scale: 8 }),
  originLongitude: decimal("origin_longitude", { precision: 11, scale: 8 }),
  destinationProvince: varchar("destination_province", { length: 100 }),
  destinationDistrict: varchar("destination_district", { length: 100 }),
  destinationLatitude: decimal("destination_latitude", { precision: 10, scale: 8 }),
  destinationLongitude: decimal("destination_longitude", { precision: 11, scale: 8 }),
  returnPointProvince: varchar("return_point_province", { length: 100 }),
  returnPointDistrict: varchar("return_point_district", { length: 100 }),
  returnPointLatitude: decimal("return_point_latitude", { precision: 10, scale: 8 }),
  returnPointLongitude: decimal("return_point_longitude", { precision: 11, scale: 8 }),
  distanceValue: decimal("distance_value", { precision: 10, scale: 2 }),
  distanceUnit: varchar("distance_unit", { length: 10 }).default("km"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Factory Routes (Jobs)
export const factoryRoutes = pgTable("factory_routes", {
  id: uuid("id").primaryKey().defaultRandom(),
  factoryId: uuid("factory_id"),
  masterRouteId: uuid("master_route_id"),
  routeFactoryCode: varchar("route_factory_code", { length: 50 }).notNull(),
  shippingType: varchar("shipping_type", { length: 50 }),
  type: routeTypeEnum("type").notNull(),
  distanceValue: decimal("distance_value", { precision: 10, scale: 2 }),
  distanceUnit: varchar("distance_unit", { length: 10 }).default("km"),
  status: routeStatusEnum("status").default("pending"),
  offerPrice: decimal("offer_price", { precision: 12, scale: 2 }),
  unit: varchar("unit", { length: 20 }),
  displayCode: varchar("display_code", { length: 50 }),
  deleted: boolean("deleted").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Trucks
export const trucks = pgTable("trucks", {
  id: uuid("id").primaryKey().defaultRandom(),
  displayCode: varchar("display_code", { length: 50 }).unique().notNull(),
  organizationId: uuid("organization_id"),
  driverId: uuid("driver_id"),
  licensePlate: varchar("license_plate", { length: 50 }),
  province: varchar("province", { length: 100 }),
  brandModel: varchar("brand_model", { length: 100 }),
  deleted: boolean("deleted").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Drivers
export const drivers = pgTable("drivers", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id"),
  displayCode: varchar("display_code", { length: 50 }).unique().notNull(),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 255 }),
  idCard: varchar("id_card", { length: 50 }),
  organizationId: uuid("organization_id"),
  status: driverStatusEnum("status").default("PENDING"),
  imageUrl: text("image_url"),
  deleted: boolean("deleted").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Chat Rooms
export const chatRooms = pgTable("chat_rooms", {
  id: uuid("id").primaryKey().defaultRandom(),
  participant1Id: uuid("participant1_id"),
  participant2Id: uuid("participant2_id"),
  lastMessageAt: timestamp("last_message_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Chat Messages
export const chatMessages = pgTable("chat_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  roomId: uuid("room_id"),
  senderId: uuid("sender_id"),
  messageType: varchar("message_type", { length: 20 }).default("txt"),
  content: text("content"),
  fileUrl: text("file_url"),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Bids (actual schema from init.sql)
export const bids = pgTable("bids", {
  id: uuid("id").primaryKey().defaultRandom(),
  displayCode: varchar("display_code", { length: 50 }).unique().notNull(),
  rfqId: uuid("rfq_id"),
  companyId: uuid("company_id"),
  bidStatus: bidStatusEnum("bid_status").default("Draft"),
  oilRange: integer("oil_range").default(2),
  bidReason: text("bid_reason"),
  signatureCompanyType: varchar("signature_company_type", { length: 50 }),
  signatureCompanySign: text("signature_company_sign"),
  deleted: boolean("deleted").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: uuid("created_by"),
});

// Orders (actual schema from init.sql)
export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  displayCode: varchar("display_code", { length: 50 }).unique().notNull(),
  factoryId: uuid("factory_id"),
  factoryName: varchar("factory_name", { length: 255 }),
  orderType: varchar("order_type", { length: 20 }), // 'oneWay', 'multiWay', 'csvImport', 'abroad'
  vehicleType: varchar("vehicle_type", { length: 50 }),
  items: text("items"),
  startDestination: text("start_destination"),
  destination: text("destination"),
  distance: decimal("distance", { precision: 10, scale: 2 }),
  originProvince: varchar("origin_province", { length: 100 }),
  masterRouteType: varchar("master_route_type", { length: 50 }),
  orderStatus: orderStatusEnum("order_status").default("Published"), // actual column is 'order_status'
  paymentStatus: varchar("payment_status", { length: 50 }).default("Unpaid"),
  paymentType: varchar("payment_type", { length: 50 }),
  deliveryType: varchar("delivery_type", { length: 50 }).default("Standard"),
  price: decimal("price", { precision: 12, scale: 2 }),
  fuelCost: decimal("fuel_cost", { precision: 10, scale: 2 }),
  fuelRate: varchar("fuel_rate", { length: 50 }),
  deleted: boolean("deleted").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Export types
export type User = typeof users.$inferSelect;
export type Organization = typeof organizations.$inferSelect;
export type MasterRoute = typeof masterRoutes.$inferSelect;
export type FactoryRoute = typeof factoryRoutes.$inferSelect;
export type Truck = typeof trucks.$inferSelect;
export type Driver = typeof drivers.$inferSelect;
export type ChatRoom = typeof chatRooms.$inferSelect;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type Bid = typeof bids.$inferSelect;
export type Order = typeof orders.$inferSelect;
