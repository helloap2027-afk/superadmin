export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billing_interval: string;
  features: string[];
  status: string;
  active_subscribers?: number;
  total_subscribers?: number;
  created_at?: string;
  updated_at?: string;
}

export interface BenefitDefinition {
  id: string;
  benefit_key: string;
  name: string;
  description: string;
  category: string;
  data_type: 'BOOLEAN' | 'INTEGER' | 'QUOTA' | 'DURATION' | 'PERCENTAGE' | 'ENUM' | 'FEATURE_ACCESS';
  unit: string | null;
  default_value: string | null;
  min_value: number | null;
  max_value: number | null;
  allowed_values: string[] | string | null;
  reset_period: string | null;
  supported_audiences: string[] | string | null;
  capability_binding: string | null;
  enforcement_status: 'ENFORCED' | 'UNVERIFIED' | 'DISPLAY_ONLY';
  is_active: number;
  display_order: number;
  icon: string | null;
  usage_count?: number;
  created_at: string;
  updated_at: string;
}

export interface BackendCapability {
  id: string;
  capability_key: string;
  name: string;
  description: string;
  data_type: string;
  supported_audience: string;
  enforcement_handler: string | null;
  enforcement_status: 'ENFORCED' | 'UNVERIFIED' | 'DISPLAY_ONLY';
  validation_rules: any;
  is_active: number;
}

export interface PlanBenefitAssignment {
  id: string;
  plan_id: string;
  benefit_id: string;
  assigned_value: any;
  display_order: number;
  is_visible: number;
  is_highlighted: number;
  name?: string;
  benefit_key?: string;
  data_type?: string;
  category?: string;
  enforcement_status?: 'ENFORCED' | 'UNVERIFIED' | 'DISPLAY_ONLY';
  unit?: string | null;
  reset_period?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface PlanVersion {
  id: string;
  plan_id: string;
  version_number: number;
  name: string;
  plan_code: string;
  price: number;
  currency: string;
  billing_interval: string;
  features_snapshot: string[] | string;
  benefits_snapshot: PlanBenefitAssignment[] | string;
  published_by: string;
  change_summary: string;
  created_at: string;
}

export interface PlanDetailsResponse {
  plan: SubscriptionPlan;
  benefits: PlanBenefitAssignment[];
  versions: PlanVersion[];
  subscribers_count: {
    active: number;
    total: number;
  };
}

