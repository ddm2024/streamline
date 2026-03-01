import { pgTable, uuid, text, decimal, jsonb, timestamp } from 'drizzle-orm/pg-core'

export const organizations = pgTable('organizations', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  ownerId: uuid('owner_id').notNull(),
  logoUrl: text('logo_url'),
  phone: text('phone'),
  email: text('email'),
  addressLine1: text('address_line1'),
  addressLine2: text('address_line2'),
  city: text('city'),
  state: text('state'),
  zip: text('zip'),
  taxRate: decimal('tax_rate', { precision: 5, scale: 3 }).default('0'),
  defaultDisclaimer: text('default_disclaimer').default(
    'This quote is valid for 30 days from the date issued. Prices may vary based on actual site conditions.'
  ),
  settings: jsonb('settings').default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})
