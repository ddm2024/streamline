import { pgTable, uuid, text, decimal, integer, timestamp } from 'drizzle-orm/pg-core'
import { organizations } from './organizations'
import { clients } from './clients'
import { properties } from './properties'
import { jobs } from './jobs'
import { quotes } from './quotes'
import { invoiceStatusEnum } from './enums'

export const invoices = pgTable('invoices', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  jobId: uuid('job_id').references(() => jobs.id, { onDelete: 'set null' }),
  quoteId: uuid('quote_id').references(() => quotes.id, { onDelete: 'set null' }),
  clientId: uuid('client_id').notNull().references(() => clients.id, { onDelete: 'restrict' }),
  propertyId: uuid('property_id').references(() => properties.id, { onDelete: 'set null' }),
  invoiceNumber: text('invoice_number').notNull(),
  title: text('title'),
  status: invoiceStatusEnum('status').default('draft'),
  subtotal: decimal('subtotal', { precision: 12, scale: 2 }).default('0'),
  taxRate: decimal('tax_rate', { precision: 5, scale: 3 }).default('0'),
  taxAmount: decimal('tax_amount', { precision: 12, scale: 2 }).default('0'),
  discountAmount: decimal('discount_amount', { precision: 12, scale: 2 }).default('0'),
  grandTotal: decimal('grand_total', { precision: 12, scale: 2 }).default('0'),
  amountPaid: decimal('amount_paid', { precision: 12, scale: 2 }).default('0'),
  amountDue: decimal('amount_due', { precision: 12, scale: 2 }).default('0'),
  notes: text('notes'),
  paymentTerms: text('payment_terms').default('Due on receipt'),
  stripeInvoiceId: text('stripe_invoice_id'),
  stripePaymentIntentId: text('stripe_payment_intent_id'),
  issueDate: timestamp('issue_date', { withTimezone: true }).defaultNow(),
  dueDate: timestamp('due_date', { withTimezone: true }),
  sentAt: timestamp('sent_at', { withTimezone: true }),
  paidAt: timestamp('paid_at', { withTimezone: true }),
  createdBy: uuid('created_by').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})

export const invoiceLineItems = pgTable('invoice_line_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  invoiceId: uuid('invoice_id').notNull().references(() => invoices.id, { onDelete: 'cascade' }),
  orgId: uuid('org_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  sortOrder: integer('sort_order').default(0),
  name: text('name').notNull(),
  description: text('description'),
  qty: decimal('qty', { precision: 12, scale: 3 }).default('1'),
  unit: text('unit').default('each'),
  unitPrice: decimal('unit_price', { precision: 12, scale: 2 }).default('0'),
  lineTotal: decimal('line_total', { precision: 12, scale: 2 }).default('0'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
})
