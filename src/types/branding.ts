export interface BrandingSettings {
  companyName: string;
  logoUrl?: string;
  colorScheme: {
    primary: string;
    secondary: string;
  };
  templateId: 'modern' | 'classic';
}

export interface BrandedReportRequest {
  planId?: string;
  examplePlanSlug?: string;
  branding: BrandingSettings;
}
