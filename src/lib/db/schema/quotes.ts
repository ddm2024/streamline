import { pgTable, uuid, text, decimal, boolean, integer, timestamp } from 'drizzle-orm/pg-core'
import { organizations } from './organizations'
import { clients } from './clients'
import { properties } from './properties'
import { serviceCatalog } from './service-catalog'
import { quoteStatusEnum } from './enums'

export const quotes = pgTable('quotes', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  clientId: uuid('client_id').notNull().references(() => clients.id, { onDelete: 'restrict' }),
  propertyId: uuid('property_id').references(() => properties.id, { onDelete: 'set null' }),
  quoteNumber: text('quote_number').notNull(),
  title: text('title').notNull(),
  status: quoteStatusEnum('status').default('draft'),
  subtotal: decimal('subtotal', { precision: 12, scale: 2 }).default('0'),
  taxRate: decimal('tax_rate', { precision: 5, scale: 3 }).default('0'),
  taxAmount: decimal('tax_amount', { precision: 12, scale: 2 }).default('0'),
  discountAmount: decimal('discount_amount', { precision: 12, scale: 2 }).default('0'),
  discountType: text('discount_type').default('fixed'),
  depositAmount: decimal('deposit_amount', { precision: 12, scale: 2 }).default('0'),
  depositPercent: decimal('deposit_percent', { precision: 5, scale: 2 }).default('0'),
  grandTotal: decimal('grand_total', { precision: 12, scale: 2 }).default('0'),
  clientMessage: text('client_message'),
  internalNotes: text('internal_notes'),
  disclaimer: text('disclaimer'),
  createdBy: uuid('created_by').notNull(),
  salespersonId: uuid('salesperson_id'),
  validUntil: timestamp('valid_until', { withTimezone: true }),
  sentAt: timestamp('sent_at', { withTimezone: true }),
  viewedAt: timestamp('viewed_at', { withTimezone: true }),
  approvedAt: timestamp('approved_at', { withTimezone: true }),
  declinedAt: timestamp('declined_at', { withTimezone: true }),
  convertedAt: timestamp('converted_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})

export const quoteLineItems = pgTable('quote_line_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  quoteId: uuid('quote_id').notNull().references(() => quotes.id, { onDelete: 'cascade' }),
  orgId: uuid('org_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  serviceCatalogId: uuid('service_catalog_id').references(() => serviceCatalog.id, { onDelete: 'set null' }),
  sortOrder: integer('sort_order').default(0),
  name: text('name').notNull(),
  description: text('description'),
  qty: decimal('qty', { precision: 12, scale: 3 }).default('1'),
  unit: text('unit').default('each'),
  unitCost: decimal('unit_cost', { precision: 12, scale: 2 }).default('0'),
  unitPrice: decimal('unit_price', { precision: 12, scale: 2 }).default('0'),
  lineTotal: decimal('line_total', { precision: 12, scale: 2 }).default('0'),
  markupPercent: decimal('markup_percent', { precision: 5, scale: 2 }).default('0'),
  imageUrl: text('image_url'),
  annotationUrl: text('annotation_url'),
  isOptional: boolean('is_optional').default(false),
  measurementLength: decimal('measurement_length', { precision: 12, scale: 3 }),
  measurementWidth: decimal('measurement_width', { precision: 12, scale: 3 }),
  measurementHeight: decimal('measurement_height', { precision: 12, scale: 3 }),
  measurementArea: decimal('measurement_area', { precision: 12, scale: 3 }),
  measurementFormula: text('measurement_formula'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})
