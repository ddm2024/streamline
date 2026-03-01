import { pgTable, uuid, text, decimal, boolean, integer, timestamp } from 'drizzle-orm/pg-core'
import { organizations } from './organizations'

export const serviceCatalog = pgTable('service_catalog', {
  id: uuid('id').primaryKey().defaultRandom(),
  orgId: uuid('org_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  category: text('category'),
  unit: text('unit').default('each'),
  unitCost: decimal('unit_cost', { precision: 12, scale: 2 }).default('0'),
  unitPrice: decimal('unit_price', { precision: 12, scale: 2 }).notNull(),
  imageUrl: text('image_url'),
  isActive: boolean('is_active').default(true),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
})
