import { pgTable, uuid, text, boolean, timestamp } from 'drizzle-orm/pg-core'
import { organizations } from './organizations'

export const clients = pgTable('clients', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  companyName: text('company_name'),
  email: text('email'),
  phone: text('phone'),
  secondaryPhone: text('secondary_phone'),
  notes: text('notes'),
  tags: text('tags').array().default([]),
  source: text('source'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})
