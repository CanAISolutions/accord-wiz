-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.documents (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  landlord_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  storage_path text NOT NULL,
  property_id uuid,
  tenant_id uuid,
  lease_id uuid,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT documents_pkey PRIMARY KEY (id),
  CONSTRAINT documents_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id),
  CONSTRAINT documents_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(id),
  CONSTRAINT documents_landlord_id_fkey FOREIGN KEY (landlord_id) REFERENCES public.profiles(user_id),
  CONSTRAINT documents_lease_id_fkey FOREIGN KEY (lease_id) REFERENCES public.leases(id)
);
CREATE TABLE public.lease_documents (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  lease_id uuid NOT NULL,
  storage_path text NOT NULL,
  version text,
  signed_by_landlord_at timestamp with time zone,
  signed_by_tenant_at timestamp with time zone,
  hash text CHECK (hash IS NULL OR hash ~ '^[0-9a-f]{64}$'::text),
  status text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT lease_documents_pkey PRIMARY KEY (id),
  CONSTRAINT lease_documents_lease_id_fkey FOREIGN KEY (lease_id) REFERENCES public.leases(id)
);
CREATE TABLE public.lease_payments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  lease_id uuid NOT NULL,
  due_date date NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0::numeric),
  currency character varying NOT NULL DEFAULT 'CAD'::character varying,
  status USER-DEFINED NOT NULL DEFAULT 'due'::payment_status,
  paid_at timestamp with time zone,
  method text,
  external_ref text UNIQUE,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT lease_payments_pkey PRIMARY KEY (id),
  CONSTRAINT lease_payments_lease_id_fkey FOREIGN KEY (lease_id) REFERENCES public.leases(id)
);
CREATE TABLE public.leases (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  landlord_id uuid NOT NULL,
  property_id uuid NOT NULL,
  tenant_id uuid NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  rent_amount numeric NOT NULL CHECK (rent_amount > 0::numeric),
  deposit_amount numeric NOT NULL DEFAULT 0,
  currency character varying NOT NULL DEFAULT 'CAD'::character varying,
  payment_day integer NOT NULL DEFAULT 1,
  late_fee_rules jsonb NOT NULL DEFAULT '{}'::jsonb,
  status USER-DEFINED NOT NULL DEFAULT 'draft'::lease_status,
  clauses jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  jurisdiction character varying CHECK (jurisdiction::text = ANY (ARRAY['AB'::character varying::text, 'BC'::character varying::text, 'MB'::character varying::text, 'NB'::character varying::text, 'NL'::character varying::text, 'NS'::character varying::text, 'NT'::character varying::text, 'NU'::character varying::text, 'ON'::character varying::text, 'PE'::character varying::text, 'QC'::character varying::text, 'SK'::character varying::text, 'YT'::character varying::text])),
  rent_deposit_amount numeric,
  security_deposit_amount numeric,
  CONSTRAINT leases_pkey PRIMARY KEY (id),
  CONSTRAINT leases_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id),
  CONSTRAINT leases_landlord_id_fkey FOREIGN KEY (landlord_id) REFERENCES public.profiles(user_id),
  CONSTRAINT leases_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(id)
);
CREATE TABLE public.legal_clauses (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL,
  jurisdiction text,
  version text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  source_url text,
  last_updated date,
  CONSTRAINT legal_clauses_pkey PRIMARY KEY (id)
);
CREATE TABLE public.maintenance_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL,
  tenant_id uuid NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  status text NOT NULL DEFAULT 'pending'::text,
  priority text NOT NULL DEFAULT 'normal'::text,
  assigned_to uuid,
  completed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT maintenance_requests_pkey PRIMARY KEY (id),
  CONSTRAINT maintenance_requests_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(id),
  CONSTRAINT maintenance_requests_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id),
  CONSTRAINT maintenance_requests_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES public.profiles(user_id)
);
CREATE TABLE public.notification_logs (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  type text NOT NULL CHECK (type = ANY (ARRAY['payment_reminder'::text, 'maintenance_update'::text, 'lease_expiry'::text, 'document_uploaded'::text])),
  recipient_id uuid,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'sent'::text, 'failed'::text])),
  sent_at timestamp with time zone,
  CONSTRAINT notification_logs_pkey PRIMARY KEY (id),
  CONSTRAINT notification_logs_recipient_id_fkey FOREIGN KEY (recipient_id) REFERENCES public.profiles(user_id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  display_name text,
  phone text,
  org_name text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id)
);
CREATE TABLE public.properties (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  landlord_id uuid NOT NULL,
  address1 text NOT NULL,
  address2 text,
  city text NOT NULL,
  province_code character varying CHECK (province_code::text = ANY (ARRAY['AB'::character varying::text, 'BC'::character varying::text, 'MB'::character varying::text, 'NB'::character varying::text, 'NL'::character varying::text, 'NS'::character varying::text, 'NT'::character varying::text, 'NU'::character varying::text, 'ON'::character varying::text, 'PE'::character varying::text, 'QC'::character varying::text, 'SK'::character varying::text, 'YT'::character varying::text])),
  postal_code text,
  country text DEFAULT 'CA'::text,
  allowed_pets boolean,
  furnished boolean,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT properties_pkey PRIMARY KEY (id),
  CONSTRAINT fk_properties_landlord FOREIGN KEY (landlord_id) REFERENCES public.profiles(user_id)
);
CREATE TABLE public.tenants (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  landlord_id uuid NOT NULL,
  name text NOT NULL,
  email text,
  phone text,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT tenants_pkey PRIMARY KEY (id),
  CONSTRAINT fk_tenants_landlord FOREIGN KEY (landlord_id) REFERENCES public.profiles(user_id)
);
CREATE TABLE public.user_roles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role USER-DEFINED NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT user_roles_pkey PRIMARY KEY (id),
  CONSTRAINT fk_user_roles_profile_user FOREIGN KEY (user_id) REFERENCES public.profiles(user_id)
);

