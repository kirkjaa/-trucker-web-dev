import { pgTable, text, integer, boolean, timestamp, decimal, uuid, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ============================================================================
// ENUMS (matching mobile_schema.sql)
// ============================================================================

export const mobileUserRoleEnum = pgEnum('mobile_user_role', ['admin', 'company', 'customer', 'shipping']);
export const mobileJobStatusEnum = pgEnum('mobile_job_status', ['pending', 'in_progress', 'completed', 'cancelled']);
export const mobileBidStatusEnum = pgEnum('mobile_bid_status', ['open', 'submitted', 'accepted', 'rejected', 'expired']);
export const mobileVehicleStatusEnum = pgEnum('mobile_vehicle_status', ['available', 'in_use', 'maintenance', 'unavailable']);
export const mobileStopStatusEnum = pgEnum('mobile_stop_status', ['pending', 'ready', 'completed']);
export const mobileConversationTypeEnum = pgEnum('mobile_conversation_type', ['private', 'group']);

// ============================================================================
// MOBILE USER PROFILES
// ============================================================================

export const users = pgTable('mobile_user_profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  desktopUserId: uuid('desktop_user_id'),
  username: text('username').unique().notNull(),
  email: text('email').unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  role: mobileUserRoleEnum('role').notNull().default('shipping'),
  displayName: text('display_name').notNull(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  phone: text('phone'),
  avatar: text('avatar'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ============================================================================
// MOBILE CUSTOMERS
// ============================================================================

export const customers = pgTable('mobile_customers', {
  id: uuid('id').defaultRandom().primaryKey(),
  desktopOrganizationId: uuid('desktop_organization_id'),
  name: text('name').notNull(),
  email: text('email'),
  phone: text('phone'),
  address: text('address'),
  city: text('city'),
  region: text('region'),
  country: text('country').default('Thailand'),
  contactPerson: text('contact_person'),
  totalOrders: integer('total_orders').default(0),
  totalRevenue: decimal('total_revenue', { precision: 12, scale: 2 }).default('0'),
  avatar: text('avatar'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ============================================================================
// MOBILE PRODUCTS
// ============================================================================

export const products = pgTable('mobile_products', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  description: text('description'),
  unit: text('unit').default('units'),
  weight: decimal('weight', { precision: 10, scale: 2 }),
  dimensions: text('dimensions'),
  requiresRefrigeration: boolean('requires_refrigeration').default(false),
  isHazardous: boolean('is_hazardous').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ============================================================================
// MOBILE VEHICLES
// ============================================================================

export const vehicles = pgTable('mobile_vehicles', {
  id: uuid('id').defaultRandom().primaryKey(),
  registrationNumber: text('registration_number').unique().notNull(),
  registrationProvince: text('registration_province'),
  vin: text('vin'),
  brand: text('brand'),
  model: text('model'),
  color: text('color'),
  bodyType: text('body_type'),
  plateType: text('plate_type'),
  payload: decimal('payload', { precision: 10, scale: 2 }),
  serviceYears: integer('service_years'),
  status: mobileVehicleStatusEnum('status').default('available'),
  driverId: uuid('driver_id').references(() => users.id),
  hasTrailer: boolean('has_trailer').default(false),
  trailerRegistration: text('trailer_registration'),
  insuranceValue: decimal('insurance_value', { precision: 12, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ============================================================================
// MOBILE JOBS
// ============================================================================

export const jobs = pgTable('mobile_jobs', {
  id: uuid('id').defaultRandom().primaryKey(),
  jobNumber: text('job_number').unique().notNull(),
  customerId: uuid('customer_id').references(() => customers.id),
  vehicleId: uuid('vehicle_id').references(() => vehicles.id),
  driverId: uuid('driver_id').references(() => users.id),
  status: mobileJobStatusEnum('status').default('pending'),
  origin: text('origin').notNull(),
  destination: text('destination').notNull(),
  distance: decimal('distance', { precision: 10, scale: 2 }),
  estimatedDuration: text('estimated_duration'),
  cargo: text('cargo'),
  cargoWeight: decimal('cargo_weight', { precision: 10, scale: 2 }),
  temperature: text('temperature'),
  price: decimal('price', { precision: 12, scale: 2 }),
  progress: integer('progress').default(0),
  notes: text('notes'),
  pickupDate: timestamp('pickup_date'),
  deliveryDate: timestamp('delivery_date'),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ============================================================================
// MOBILE JOB STOPS
// ============================================================================

export const jobStops = pgTable('mobile_job_stops', {
  id: uuid('id').defaultRandom().primaryKey(),
  jobId: uuid('job_id').references(() => jobs.id).notNull(),
  sequence: integer('sequence').notNull(),
  name: text('name').notNull(),
  address: text('address'),
  contact: text('contact'),
  phone: text('phone'),
  cargo: text('cargo'),
  arrivalTime: timestamp('arrival_time'),
  departureTime: timestamp('departure_time'),
  status: mobileStopStatusEnum('status').default('pending'),
  checkedIn: boolean('checked_in').default(false),
  checkedInAt: timestamp('checked_in_at'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// ============================================================================
// MOBILE EXPENSES
// ============================================================================

export const expenses = pgTable('mobile_expenses', {
  id: uuid('id').defaultRandom().primaryKey(),
  jobId: uuid('job_id').references(() => jobs.id),
  stopId: uuid('stop_id').references(() => jobStops.id),
  userId: uuid('user_id').references(() => users.id),
  title: text('title').notNull(),
  category: text('category').notNull(),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  currency: text('currency').default('THB'),
  description: text('description'),
  receiptUrl: text('receipt_url'),
  date: timestamp('date').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
});

// ============================================================================
// MOBILE REVENUES
// ============================================================================

export const revenues = pgTable('mobile_revenues', {
  id: uuid('id').defaultRandom().primaryKey(),
  jobId: uuid('job_id').references(() => jobs.id),
  customerId: uuid('customer_id').references(() => customers.id),
  invoiceNumber: text('invoice_number'),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  currency: text('currency').default('THB'),
  status: text('status').default('pending'),
  dueDate: timestamp('due_date'),
  paidAt: timestamp('paid_at'),
  paymentMethod: text('payment_method'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// ============================================================================
// MOBILE BIDS
// ============================================================================

export const bids = pgTable('mobile_bids', {
  id: uuid('id').defaultRandom().primaryKey(),
  bidNumber: text('bid_number').unique().notNull(),
  customerId: uuid('customer_id').references(() => customers.id),
  origin: text('origin').notNull(),
  destination: text('destination').notNull(),
  cargo: text('cargo'),
  cargoWeight: decimal('cargo_weight', { precision: 10, scale: 2 }),
  requestedPrice: decimal('requested_price', { precision: 12, scale: 2 }),
  submittedPrice: decimal('submitted_price', { precision: 12, scale: 2 }),
  minimumBid: decimal('minimum_bid', { precision: 12, scale: 2 }),
  status: mobileBidStatusEnum('status').default('open'),
  pickupDate: timestamp('pickup_date'),
  expiresAt: timestamp('expires_at'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ============================================================================
// MOBILE CONVERSATIONS
// ============================================================================

export const conversations = pgTable('mobile_conversations', {
  id: uuid('id').defaultRandom().primaryKey(),
  type: mobileConversationTypeEnum('type').default('private'),
  name: text('name'),
  avatar: text('avatar'),
  createdById: uuid('created_by_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ============================================================================
// MOBILE CONVERSATION PARTICIPANTS
// ============================================================================

export const conversationParticipants = pgTable('mobile_conversation_participants', {
  id: uuid('id').defaultRandom().primaryKey(),
  conversationId: uuid('conversation_id').references(() => conversations.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  joinedAt: timestamp('joined_at').defaultNow(),
  isAdmin: boolean('is_admin').default(false),
  isMuted: boolean('is_muted').default(false),
});

// ============================================================================
// MOBILE MESSAGES
// ============================================================================

export const messages = pgTable('mobile_messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  conversationId: uuid('conversation_id').references(() => conversations.id).notNull(),
  senderId: uuid('sender_id').references(() => users.id).notNull(),
  content: text('content'),
  messageType: text('message_type').default('text'),
  attachmentUrl: text('attachment_url'),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// ============================================================================
// RELATIONS
// ============================================================================

export const usersRelations = relations(users, ({ many }) => ({
  jobs: many(jobs),
  vehicles: many(vehicles),
  expenses: many(expenses),
  messages: many(messages),
  conversationParticipants: many(conversationParticipants),
}));

export const customersRelations = relations(customers, ({ many }) => ({
  jobs: many(jobs),
  bids: many(bids),
  revenues: many(revenues),
}));

export const jobsRelations = relations(jobs, ({ one, many }) => ({
  customer: one(customers, { fields: [jobs.customerId], references: [customers.id] }),
  vehicle: one(vehicles, { fields: [jobs.vehicleId], references: [vehicles.id] }),
  driver: one(users, { fields: [jobs.driverId], references: [users.id] }),
  stops: many(jobStops),
  expenses: many(expenses),
  revenues: many(revenues),
}));

export const jobStopsRelations = relations(jobStops, ({ one, many }) => ({
  job: one(jobs, { fields: [jobStops.jobId], references: [jobs.id] }),
  expenses: many(expenses),
}));

export const vehiclesRelations = relations(vehicles, ({ one, many }) => ({
  driver: one(users, { fields: [vehicles.driverId], references: [users.id] }),
  jobs: many(jobs),
}));

export const bidsRelations = relations(bids, ({ one }) => ({
  customer: one(customers, { fields: [bids.customerId], references: [customers.id] }),
}));

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  createdBy: one(users, { fields: [conversations.createdById], references: [users.id] }),
  participants: many(conversationParticipants),
  messages: many(messages),
}));

export const conversationParticipantsRelations = relations(conversationParticipants, ({ one }) => ({
  conversation: one(conversations, { fields: [conversationParticipants.conversationId], references: [conversations.id] }),
  user: one(users, { fields: [conversationParticipants.userId], references: [users.id] }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, { fields: [messages.conversationId], references: [conversations.id] }),
  sender: one(users, { fields: [messages.senderId], references: [users.id] }),
}));
