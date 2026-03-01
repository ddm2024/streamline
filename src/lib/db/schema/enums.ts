import { pgEnum } from 'drizzle-orm/pg-core'

export const userRoleEnum = pgEnum('user_role', ['owner', 'admin', 'tech', 'office'])

export const quoteStatusEnum = pgEnum('quote_status', [
  'draft',
  'awaiting',
  'changes_requested',
  'approved',
  'declined',
  'converted',
  'archived',
])

export const jobStatusEnum = pgEnum('job_status', [
  'scheduled',
  'in_progress',
  'on_hold',
  'completed',
  'cancelled',
])

export const invoiceStatusEnum = pgEnum('invoice_status', [
  'draft',
  'sent',
  'viewed',
  'paid',
  'partially_paid',
  'overdue',
  'void',
])

export const jobPriorityEnum = pgEnum('job_priority', ['low', 'medium', 'high', 'urgent'])
