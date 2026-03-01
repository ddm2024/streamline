import type { InferSelectModel, InferInsertModel } from 'drizzle-orm'
import type {
  organizations,
  profiles,
  clients,
  properties,
  serviceCatalog,
  quotes,
  quoteLineItems,
  jobs,
  invoices,
  invoiceLineItems,
  activityLog,
} from './schema'

export type Organization = InferSelectModel<typeof organizations>
export type NewOrganization = InferInsertModel<typeof organizations>

export type Profile = InferSelectModel<typeof profiles>
export type NewProfile = InferInsertModel<typeof profiles>

export type Client = InferSelectModel<typeof clients>
export type NewClient = InferInsertModel<typeof clients>

export type Property = InferSelectModel<typeof properties>
export type NewProperty = InferInsertModel<typeof properties>

export type ServiceCatalogItem = InferSelectModel<typeof serviceCatalog>
export type NewServiceCatalogItem = InferInsertModel<typeof serviceCatalog>

export type Quote = InferSelectModel<typeof quotes>
export type NewQuote = InferInsertModel<typeof quotes>

export type QuoteLineItem = InferSelectModel<typeof quoteLineItems>
export type NewQuoteLineItem = InferInsertModel<typeof quoteLineItems>

export type Job = InferSelectModel<typeof jobs>
export type NewJob = InferInsertModel<typeof jobs>

export type Invoice = InferSelectModel<typeof invoices>
export type NewInvoice = InferInsertModel<typeof invoices>

export type InvoiceLineItem = InferSelectModel<typeof invoiceLineItems>
export type NewInvoiceLineItem = InferInsertModel<typeof invoiceLineItems>

export type ActivityLog = InferSelectModel<typeof activityLog>
export type NewActivityLog = InferInsertModel<typeof activityLog>

// Enums
export type UserRole = 'owner' | 'admin' | 'tech' | 'office'
export type QuoteStatus = 'draft' | 'awaiting' | 'changes_requested' | 'approved' | 'declined' | 'converted' | 'archived'
export type JobStatus = 'scheduled' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled'
export type InvoiceStatus = 'draft' | 'sent' | 'viewed' | 'paid' | 'partially_paid' | 'overdue' | 'void'
export type JobPriority = 'low' | 'medium' | 'high' | 'urgent'
