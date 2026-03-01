import { pgTable, uuid, text, decimal, timestamp } from 'drizzle-orm/pg-core'
import { organizations } from './organizations'
import { clients } from './clients'
import { properties } from './properties'
import { quotes } from './quotes'
import { jobStatusEnum, jobPriorityEnum } from './enums'

export const jobs = pgTable('jobs', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  quoteId: uuid('quote_id').references(() => quotes.id, { onDelete: 'set null' }),
  clientId: uuid('client_id').notNull().references(() => clients.id, { onDelete: 'restrict' }),
  propertyId: uuid('property_id').references(() => properties.id, { onDelete: 'set null' }),
  jobNumber: text('job_number').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  status: jobStatusEnum('status').default('scheduled'),
  priority: jobPriorityEnum('priority').default('medium'),
  scheduledStart: timestamp('scheduled_start', { withTimezone: true }),
  scheduledEnd: timestamp('scheduled_end', { withTimezone: true }),
  actualStart: timestamp('actual_start', { withTimezone: true }),
  actualEnd: timestamp('actual_end', { withTimezone: true }),
  estimatedCost: decimal('estimated_cost', { precision: 12, scale: 2 }).default('0'),
  actualCost: decimal('actual_cost', { precision: 12, scale: 2 }).default('0'),
  estimatedRevenue: decimal('estimated_revenue', { precision: 12, scale: 2 }).default('0'),
  assignedTo: uuid('assigned_to').array(),
  notes: text('notes'),
  internalNotes: text('internal_notes'),
  createdBy: uuid('created_by').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})
