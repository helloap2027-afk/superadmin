export interface CMSMenuItem {
  slug: string;
  title: string;
  description: string;
}

export const CMS_SUBMENUS: CMSMenuItem[] = [
  {
    slug: "terms-and-conditions",
    title: "Terms & Conditions",
    description: "Manage the Terms & Conditions content for the Hello-Hi platform. This page is publicly visible to all users."
  },
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    description: "Manage DPDP Act 2023 compliant data protection and privacy policies for all users."
  },
  {
    slug: "faqs",
    title: "FAQs",
    description: "Manage frequently asked questions, customer answers, and merchant onboarding guides."
  },
  {
    slug: "about-us",
    title: "About Us",
    description: "Manage the company overview, Andhra Pradesh pilot milestones, and corporate identity."
  },
  {
    slug: "refund-cancellation-policy",
    title: "Refund & Cancellation Policy",
    description: "Manage subscription cancellation terms, lead credit refunds, and billing resolutions."
  },
  {
    slug: "contact-support",
    title: "Contact & Support",
    description: "Manage official grievance emails, phone lines, and regional Andhra Pradesh headquarters."
  },
  {
    slug: "cookie-policy",
    title: "Cookie Policy",
    description: "Manage cookies and tracking consent preferences according to global privacy standards."
  },
  {
    slug: "community-guidelines",
    title: "Community Guidelines",
    description: "Manage codes of conduct, content moderation rules, and merchant integrity standards."
  }
];
