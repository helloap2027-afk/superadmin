export type CMSPageStatus = "DRAFT" | "IN_REVIEW" | "PUBLISHED" | "ARCHIVED";
export type CMSVisibility = "PUBLIC" | "PRIVATE" | "UNLISTED";
export type CMSLanguage = "en" | "te" | "hi";

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  order: number;
}

export interface CMSSEOMetadata {
  metaTitle: string;
  metaDescription: string;
  canonicalUrl?: string;
  robotsIndex: boolean;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
}

export interface CMSPage {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  content: string;
  faqItems?: FAQItem[];
  language: CMSLanguage;
  status: CMSPageStatus;
  visibility: CMSVisibility;
  publishedRevisionId?: string | null;
  seo: CMSSEOMetadata;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface CMSRevision {
  id: string;
  pageId: string;
  pageSlug: string;
  revisionNumber: number;
  title: string;
  shortDescription: string;
  content: string;
  faqItems?: FAQItem[];
  seo: CMSSEOMetadata;
  language: CMSLanguage;
  status: CMSPageStatus;
  createdBy: string;
  createdAt: string;
  changeSummary: string;
}

export interface CMSAuditLog {
  id: string;
  pageSlug: string;
  language: CMSLanguage;
  action: "CREATE" | "UPDATE_DRAFT" | "SUBMIT_REVIEW" | "APPROVE" | "PUBLISH" | "UNPUBLISH" | "ARCHIVE" | "RESTORE_REVISION" | "UPDATE_VISIBILITY";
  previousStatus?: CMSPageStatus;
  newStatus?: CMSPageStatus;
  performedBy: string;
  performedByRole: string;
  timestamp: string;
  details: string;
}

export interface CMSPageSummary {
  slug: string;
  title: string;
  shortDescription: string;
  status: CMSPageStatus;
  visibility: CMSVisibility;
  language: CMSLanguage;
  updatedAt: string;
  updatedBy: string;
}
