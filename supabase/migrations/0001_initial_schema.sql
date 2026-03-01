-- ============================================================================
-- STREAMLINE: Complete Database Schema + RLS Policies
-- Multi-tenant SaaS for Home Service Businesses
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- CUSTOM TYPES
-- ============================================================================

-- User roles within an organization
CREATE TYPE user_role AS ENUM ('owner', 'admin', 'tech', 'office');

-- Quote lifecycle
CREATE TYPE quote_status AS ENUM ('draft', 'awaiting', 'changes_requested', 'approved', 'declined', 'converted', 'archived');

-- Job lifecycle
CREATE TYPE job_status AS ENUM ('scheduled', 'in_progress', 'on_hold', 'completed', 'cancelled');

-- Invoice lifecycle
CREATE TYPE invoice_status AS ENUM ('draft', 'sent', 'viewed', 'paid', 'partially_paid', 'overdue', 'void');

-- Job priority
CREATE TYPE job_priority AS ENUM ('low', 'medium', 'high', 'urgent');

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- Organizations (tenants)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  owner_id UUID NOT NULL, -- references auth.users
  logo_url TEXT,
  phone TEXT,
  email TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  tax_rate DECIMAL(5,3) DEFAULT 0, -- default tax rate as percentage e.g. 8.250
  default_disclaimer TEXT DEFAULT 'This quote is valid for 30 days from the date issued. Prices may vary based on actual site conditions.',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles (org membership + role)
-- A user can belong to multiple orgs via multiple profile rows
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL, -- references auth.users
  role user_role NOT NULL DEFAULT 'tech',
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(org_id, user_id) -- one profile per org per user
);

-- Clients
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  company_name TEXT,
  email TEXT,
  phone TEXT,
  secondary_phone TEXT,
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  source TEXT, -- e.g. 'angi', 'google', 'referral', 'website'
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Properties (multiple per client)
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT, -- e.g. "Main Residence", "Rental Property"
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip TEXT NOT NULL,
  lat DECIMAL(10,7),
  lng DECIMAL(10,7),
  notes TEXT,
  property_type TEXT, -- 'residential', 'commercial'
  lot_size TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Property Annotations (street view / plan annotations)
CREATE TABLE property_annotations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL, -- stored in Supabase Storage
  annotation_type TEXT DEFAULT 'street_view', -- 'street_view', 'blueprint', 'photo'
  metadata JSONB DEFAULT '{}', -- {panoId, heading, pitch, annotations: [...]}
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service Catalog
CREATE TABLE service_catalog (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT, -- 'landscaping', 'plumbing', 'hvac', 'electrical', etc.
  unit TEXT DEFAULT 'each', -- 'each', 'sqft', 'lnft', 'hour', 'day'
  unit_cost DECIMAL(12,2) DEFAULT 0, -- what it costs us
  unit_price DECIMAL(12,2) NOT NULL, -- what we charge
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- QUOTES (The Hero Feature)
-- ============================================================================

CREATE TABLE quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  quote_number TEXT NOT NULL,
  title TEXT NOT NULL,
  status quote_status DEFAULT 'draft',
  -- Financial
  subtotal DECIMAL(12,2) DEFAULT 0,
  tax_rate DECIMAL(5,3) DEFAULT 0,
  tax_amount DECIMAL(12,2) DEFAULT 0,
  discount_amount DECIMAL(12,2) DEFAULT 0,
  discount_type TEXT DEFAULT 'fixed', -- 'fixed' or 'percent'
  deposit_amount DECIMAL(12,2) DEFAULT 0,
  deposit_percent DECIMAL(5,2) DEFAULT 0,
  grand_total DECIMAL(12,2) DEFAULT 0,
  -- Content
  client_message TEXT, -- personal message to client
  internal_notes TEXT, -- team-only notes
  disclaimer TEXT,
  -- Relationships
  created_by UUID NOT NULL, -- profile.user_id who created
  salesperson_id UUID, -- assigned salesperson profile.id
  -- Timestamps
  valid_until TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  viewed_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  declined_at TIMESTAMPTZ,
  converted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quote Line Items
CREATE TABLE quote_line_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote_id UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  service_catalog_id UUID REFERENCES service_catalog(id) ON DELETE SET NULL,
  sort_order INTEGER DEFAULT 0,
  -- Content
  name TEXT NOT NULL,
  description TEXT,
  -- Quantities & Pricing
  qty DECIMAL(12,3) DEFAULT 1,
  unit TEXT DEFAULT 'each',
  unit_cost DECIMAL(12,2) DEFAULT 0, -- our cost
  unit_price DECIMAL(12,2) DEFAULT 0, -- client price
  line_total DECIMAL(12,2) DEFAULT 0,
  markup_percent DECIMAL(5,2) DEFAULT 0,
  -- Optional fields
  image_url TEXT,
  annotation_url TEXT, -- linked annotation image
  is_optional BOOLEAN DEFAULT FALSE, -- optional line items client can toggle
  -- Measurement fields (for takeoff/blueprint integration)
  measurement_length DECIMAL(12,3),
  measurement_width DECIMAL(12,3),
  measurement_height DECIMAL(12,3),
  measurement_area DECIMAL(12,3),
  measurement_formula TEXT, -- e.g. 'length * width', user-defined
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quote sections/groups for organizing line items
CREATE TABLE quote_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote_id UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  is_collapsed BOOLEAN DEFAULT FALSE,
  subtotal DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- JOBS
-- ============================================================================

CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  quote_id UUID REFERENCES quotes(id) ON DELETE SET NULL,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  job_number TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status job_status DEFAULT 'scheduled',
  priority job_priority DEFAULT 'medium',
  -- Scheduling
  scheduled_start TIMESTAMPTZ,
  scheduled_end TIMESTAMPTZ,
  actual_start TIMESTAMPTZ,
  actual_end TIMESTAMPTZ,
  -- Costing
  estimated_cost DECIMAL(12,2) DEFAULT 0,
  actual_cost DECIMAL(12,2) DEFAULT 0,
  estimated_revenue DECIMAL(12,2) DEFAULT 0,
  -- Assignment
  assigned_to UUID[], -- array of profile IDs
  -- Notes
  notes TEXT,
  internal_notes TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INVOICES
-- ============================================================================

CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  quote_id UUID REFERENCES quotes(id) ON DELETE SET NULL,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  invoice_number TEXT NOT NULL,
  title TEXT,
  status invoice_status DEFAULT 'draft',
  -- Financial
  subtotal DECIMAL(12,2) DEFAULT 0,
  tax_rate DECIMAL(5,3) DEFAULT 0,
  tax_amount DECIMAL(12,2) DEFAULT 0,
  discount_amount DECIMAL(12,2) DEFAULT 0,
  grand_total DECIMAL(12,2) DEFAULT 0,
  amount_paid DECIMAL(12,2) DEFAULT 0,
  amount_due DECIMAL(12,2) DEFAULT 0,
  -- Content
  notes TEXT,
  payment_terms TEXT DEFAULT 'Due on receipt',
  -- Stripe
  stripe_invoice_id TEXT,
  stripe_payment_intent_id TEXT,
  -- Timestamps
  issue_date TIMESTAMPTZ DEFAULT NOW(),
  due_date TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoice Line Items
CREATE TABLE invoice_line_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  sort_order INTEGER DEFAULT 0,
  name TEXT NOT NULL,
  description TEXT,
  qty DECIMAL(12,3) DEFAULT 1,
  unit TEXT DEFAULT 'each',
  unit_price DECIMAL(12,2) DEFAULT 0,
  line_total DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TIME TRACKING
-- ============================================================================

CREATE TABLE time_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL, -- the tech who clocked in
  clock_in TIMESTAMPTZ NOT NULL,
  clock_out TIMESTAMPTZ,
  duration_minutes INTEGER, -- computed on clock-out
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ACTIVITY LOG (for dashboard feed + client portal)
-- ============================================================================

CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  actor_id UUID, -- who did it (user_id or null for system)
  entity_type TEXT NOT NULL, -- 'quote', 'job', 'invoice', 'client', 'payment'
  entity_id UUID NOT NULL,
  action TEXT NOT NULL, -- 'created', 'updated', 'sent', 'approved', 'paid', etc.
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TEAM INVITATIONS
-- ============================================================================

CREATE TABLE team_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role user_role DEFAULT 'tech',
  invited_by UUID NOT NULL,
  token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES (Performance)
-- ============================================================================

CREATE INDEX idx_profiles_org_id ON profiles(org_id);
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_clients_org_id ON clients(org_id);
CREATE INDEX idx_clients_org_name ON clients(org_id, last_name, first_name);
CREATE INDEX idx_properties_client_id ON properties(client_id);
CREATE INDEX idx_properties_org_id ON properties(org_id);
CREATE INDEX idx_service_catalog_org_id ON service_catalog(org_id);
CREATE INDEX idx_service_catalog_category ON service_catalog(org_id, category);
CREATE INDEX idx_quotes_org_id ON quotes(org_id);
CREATE INDEX idx_quotes_client_id ON quotes(client_id);
CREATE INDEX idx_quotes_status ON quotes(org_id, status);
CREATE INDEX idx_quote_line_items_quote_id ON quote_line_items(quote_id);
CREATE INDEX idx_quote_sections_quote_id ON quote_sections(quote_id);
CREATE INDEX idx_jobs_org_id ON jobs(org_id);
CREATE INDEX idx_jobs_client_id ON jobs(client_id);
CREATE INDEX idx_jobs_status ON jobs(org_id, status);
CREATE INDEX idx_jobs_scheduled ON jobs(org_id, scheduled_start);
CREATE INDEX idx_invoices_org_id ON invoices(org_id);
CREATE INDEX idx_invoices_client_id ON invoices(client_id);
CREATE INDEX idx_invoices_status ON invoices(org_id, status);
CREATE INDEX idx_time_entries_org_id ON time_entries(org_id);
CREATE INDEX idx_time_entries_job_id ON time_entries(job_id);
CREATE INDEX idx_time_entries_user ON time_entries(org_id, user_id);
CREATE INDEX idx_activity_log_org_id ON activity_log(org_id);
CREATE INDEX idx_activity_log_entity ON activity_log(entity_type, entity_id);
CREATE INDEX idx_activity_log_created ON activity_log(org_id, created_at DESC);
CREATE INDEX idx_team_invitations_token ON team_invitations(token);
CREATE INDEX idx_team_invitations_email ON team_invitations(org_id, email);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_annotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_invitations ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Helper: get the org_id for the current user (from JWT claims)
-- ============================================================================
CREATE OR REPLACE FUNCTION auth.org_id() RETURNS UUID AS $$
  SELECT (auth.jwt() -> 'user_metadata' ->> 'org_id')::UUID
$$ LANGUAGE sql STABLE;

-- ============================================================================
-- ORGANIZATIONS
-- ============================================================================
-- Users can only see their own organization
CREATE POLICY "org_select" ON organizations
  FOR SELECT USING (id = auth.org_id());

-- Only the owner can update org settings
CREATE POLICY "org_update" ON organizations
  FOR UPDATE USING (owner_id = auth.uid());

-- New orgs created on sign-up (handled by service role in Server Action)
-- No INSERT policy needed for authenticated users

-- ============================================================================
-- PROFILES
-- ============================================================================
CREATE POLICY "profiles_select" ON profiles
  FOR SELECT USING (org_id = auth.org_id());

CREATE POLICY "profiles_insert" ON profiles
  FOR INSERT WITH CHECK (org_id = auth.org_id());

CREATE POLICY "profiles_update" ON profiles
  FOR UPDATE USING (
    org_id = auth.org_id() AND (
      user_id = auth.uid() -- self-update
      OR EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.org_id = auth.org_id()
          AND p.user_id = auth.uid()
          AND p.role IN ('owner', 'admin')
      )
    )
  );

-- ============================================================================
-- CLIENTS
-- ============================================================================
CREATE POLICY "clients_select" ON clients
  FOR SELECT USING (org_id = auth.org_id());

CREATE POLICY "clients_insert" ON clients
  FOR INSERT WITH CHECK (org_id = auth.org_id());

CREATE POLICY "clients_update" ON clients
  FOR UPDATE USING (org_id = auth.org_id());

CREATE POLICY "clients_delete" ON clients
  FOR DELETE USING (
    org_id = auth.org_id() AND
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.org_id = auth.org_id()
        AND p.user_id = auth.uid()
        AND p.role IN ('owner', 'admin')
    )
  );

-- ============================================================================
-- PROPERTIES
-- ============================================================================
CREATE POLICY "properties_select" ON properties
  FOR SELECT USING (org_id = auth.org_id());

CREATE POLICY "properties_insert" ON properties
  FOR INSERT WITH CHECK (org_id = auth.org_id());

CREATE POLICY "properties_update" ON properties
  FOR UPDATE USING (org_id = auth.org_id());

CREATE POLICY "properties_delete" ON properties
  FOR DELETE USING (org_id = auth.org_id());

-- PROPERTY ANNOTATIONS
CREATE POLICY "annotations_select" ON property_annotations
  FOR SELECT USING (org_id = auth.org_id());

CREATE POLICY "annotations_insert" ON property_annotations
  FOR INSERT WITH CHECK (org_id = auth.org_id());

CREATE POLICY "annotations_update" ON property_annotations
  FOR UPDATE USING (org_id = auth.org_id());

CREATE POLICY "annotations_delete" ON property_annotations
  FOR DELETE USING (org_id = auth.org_id());

-- ============================================================================
-- SERVICE CATALOG
-- ============================================================================
CREATE POLICY "service_catalog_select" ON service_catalog
  FOR SELECT USING (org_id = auth.org_id());

CREATE POLICY "service_catalog_insert" ON service_catalog
  FOR INSERT WITH CHECK (
    org_id = auth.org_id() AND
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.org_id = auth.org_id()
        AND p.user_id = auth.uid()
        AND p.role IN ('owner', 'admin', 'office')
    )
  );

CREATE POLICY "service_catalog_update" ON service_catalog
  FOR UPDATE USING (
    org_id = auth.org_id() AND
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.org_id = auth.org_id()
        AND p.user_id = auth.uid()
        AND p.role IN ('owner', 'admin', 'office')
    )
  );

CREATE POLICY "service_catalog_delete" ON service_catalog
  FOR DELETE USING (
    org_id = auth.org_id() AND
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.org_id = auth.org_id()
        AND p.user_id = auth.uid()
        AND p.role IN ('owner', 'admin')
    )
  );

-- ============================================================================
-- QUOTES
-- ============================================================================
CREATE POLICY "quotes_select" ON quotes
  FOR SELECT USING (org_id = auth.org_id());

CREATE POLICY "quotes_insert" ON quotes
  FOR INSERT WITH CHECK (org_id = auth.org_id());

CREATE POLICY "quotes_update" ON quotes
  FOR UPDATE USING (org_id = auth.org_id());

CREATE POLICY "quotes_delete" ON quotes
  FOR DELETE USING (
    org_id = auth.org_id() AND
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.org_id = auth.org_id()
        AND p.user_id = auth.uid()
        AND p.role IN ('owner', 'admin')
    )
  );

-- QUOTE LINE ITEMS (inherits quote access)
CREATE POLICY "quote_line_items_select" ON quote_line_items
  FOR SELECT USING (org_id = auth.org_id());

CREATE POLICY "quote_line_items_insert" ON quote_line_items
  FOR INSERT WITH CHECK (org_id = auth.org_id());

CREATE POLICY "quote_line_items_update" ON quote_line_items
  FOR UPDATE USING (org_id = auth.org_id());

CREATE POLICY "quote_line_items_delete" ON quote_line_items
  FOR DELETE USING (org_id = auth.org_id());

-- QUOTE SECTIONS
CREATE POLICY "quote_sections_select" ON quote_sections
  FOR SELECT USING (org_id = auth.org_id());

CREATE POLICY "quote_sections_insert" ON quote_sections
  FOR INSERT WITH CHECK (org_id = auth.org_id());

CREATE POLICY "quote_sections_update" ON quote_sections
  FOR UPDATE USING (org_id = auth.org_id());

CREATE POLICY "quote_sections_delete" ON quote_sections
  FOR DELETE USING (org_id = auth.org_id());

-- ============================================================================
-- JOBS
-- ============================================================================
CREATE POLICY "jobs_select" ON jobs
  FOR SELECT USING (org_id = auth.org_id());

CREATE POLICY "jobs_insert" ON jobs
  FOR INSERT WITH CHECK (org_id = auth.org_id());

CREATE POLICY "jobs_update" ON jobs
  FOR UPDATE USING (org_id = auth.org_id());

CREATE POLICY "jobs_delete" ON jobs
  FOR DELETE USING (
    org_id = auth.org_id() AND
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.org_id = auth.org_id()
        AND p.user_id = auth.uid()
        AND p.role IN ('owner', 'admin')
    )
  );

-- ============================================================================
-- INVOICES
-- ============================================================================
CREATE POLICY "invoices_select" ON invoices
  FOR SELECT USING (org_id = auth.org_id());

CREATE POLICY "invoices_insert" ON invoices
  FOR INSERT WITH CHECK (org_id = auth.org_id());

CREATE POLICY "invoices_update" ON invoices
  FOR UPDATE USING (org_id = auth.org_id());

CREATE POLICY "invoices_delete" ON invoices
  FOR DELETE USING (
    org_id = auth.org_id() AND
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.org_id = auth.org_id()
        AND p.user_id = auth.uid()
        AND p.role IN ('owner', 'admin')
    )
  );

-- INVOICE LINE ITEMS
CREATE POLICY "invoice_line_items_select" ON invoice_line_items
  FOR SELECT USING (org_id = auth.org_id());

CREATE POLICY "invoice_line_items_insert" ON invoice_line_items
  FOR INSERT WITH CHECK (org_id = auth.org_id());

CREATE POLICY "invoice_line_items_update" ON invoice_line_items
  FOR UPDATE USING (org_id = auth.org_id());

CREATE POLICY "invoice_line_items_delete" ON invoice_line_items
  FOR DELETE USING (org_id = auth.org_id());

-- ============================================================================
-- TIME ENTRIES
-- ============================================================================
-- Techs can only see their own entries; admins can see all
CREATE POLICY "time_entries_select" ON time_entries
  FOR SELECT USING (
    org_id = auth.org_id() AND (
      user_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.org_id = auth.org_id()
          AND p.user_id = auth.uid()
          AND p.role IN ('owner', 'admin', 'office')
      )
    )
  );

CREATE POLICY "time_entries_insert" ON time_entries
  FOR INSERT WITH CHECK (org_id = auth.org_id() AND user_id = auth.uid());

CREATE POLICY "time_entries_update" ON time_entries
  FOR UPDATE USING (
    org_id = auth.org_id() AND (
      user_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.org_id = auth.org_id()
          AND p.user_id = auth.uid()
          AND p.role IN ('owner', 'admin')
      )
    )
  );

-- ============================================================================
-- ACTIVITY LOG
-- ============================================================================
CREATE POLICY "activity_log_select" ON activity_log
  FOR SELECT USING (org_id = auth.org_id());

CREATE POLICY "activity_log_insert" ON activity_log
  FOR INSERT WITH CHECK (org_id = auth.org_id());

-- ============================================================================
-- TEAM INVITATIONS
-- ============================================================================
CREATE POLICY "invitations_select" ON team_invitations
  FOR SELECT USING (
    org_id = auth.org_id() OR
    email = (auth.jwt() ->> 'email')
  );

CREATE POLICY "invitations_insert" ON team_invitations
  FOR INSERT WITH CHECK (
    org_id = auth.org_id() AND
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.org_id = auth.org_id()
        AND p.user_id = auth.uid()
        AND p.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "invitations_update" ON team_invitations
  FOR UPDATE USING (
    org_id = auth.org_id() OR
    email = (auth.jwt() ->> 'email')
  );

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_properties_updated_at BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_service_catalog_updated_at BEFORE UPDATE ON service_catalog FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_quotes_updated_at BEFORE UPDATE ON quotes FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_quote_line_items_updated_at BEFORE UPDATE ON quote_line_items FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_jobs_updated_at BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-generate quote_number
CREATE OR REPLACE FUNCTION generate_quote_number()
RETURNS TRIGGER AS $$
DECLARE
  next_num INTEGER;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(quote_number FROM 3) AS INTEGER)), 0) + 1
  INTO next_num
  FROM quotes WHERE org_id = NEW.org_id;
  NEW.quote_number := 'Q-' || LPAD(next_num::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_quotes_number BEFORE INSERT ON quotes FOR EACH ROW EXECUTE FUNCTION generate_quote_number();

-- Auto-generate job_number
CREATE OR REPLACE FUNCTION generate_job_number()
RETURNS TRIGGER AS $$
DECLARE
  next_num INTEGER;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(job_number FROM 3) AS INTEGER)), 0) + 1
  INTO next_num
  FROM jobs WHERE org_id = NEW.org_id;
  NEW.job_number := 'J-' || LPAD(next_num::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_jobs_number BEFORE INSERT ON jobs FOR EACH ROW EXECUTE FUNCTION generate_job_number();

-- Auto-generate invoice_number
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TRIGGER AS $$
DECLARE
  next_num INTEGER;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 4) AS INTEGER)), 0) + 1
  INTO next_num
  FROM invoices WHERE org_id = NEW.org_id;
  NEW.invoice_number := 'INV-' || LPAD(next_num::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_invoices_number BEFORE INSERT ON invoices FOR EACH ROW EXECUTE FUNCTION generate_invoice_number();

-- Sync invoice amount_due when grand_total or amount_paid changes
CREATE OR REPLACE FUNCTION sync_invoice_amount_due()
RETURNS TRIGGER AS $$
BEGIN
  NEW.amount_due := NEW.grand_total - NEW.amount_paid;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_invoice_amount_due BEFORE INSERT OR UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION sync_invoice_amount_due();
