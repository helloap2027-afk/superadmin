const fs = require('fs');

function standardizeHeader(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes('DesktopHeader') && content.includes('<header')) {
    content = content.replace(
      'import { DesktopFooter } from "@/components/DesktopFooter";',
      'import { DesktopHeader } from "@/components/DesktopHeader";\nimport { DesktopFooter } from "@/components/DesktopFooter";'
    );
    content = content.replace(
      /\{\/\* Top Navbar \*\/[\s\S]*?<\/header>/,
      `      {/* Authoritative Homepage Header */}
      <DesktopHeader
        selectedCity="Hyderabad"
        onSelectCity={() => {}}
        selectedCategory={null}
        onSelectCategory={() => {}}
        searchQuery=""
        onSearchChange={() => {}}
        onOpenAddBusiness={() => {}}
        onOpenLogin={() => {}}
        isLoggedIn={false}
      />`
    );
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Standardized header in', filePath);
  }
}

standardizeHeader('apps/website/src/app/about/page.tsx');
standardizeHeader('apps/website/src/app/faq/page.tsx');
standardizeHeader('apps/website/src/app/contact/page.tsx');
standardizeHeader('apps/website/src/app/terms/page.tsx');

// Also update vendor profile and manage-business to reuse BusinessPartnerHeader
function standardizeVendorHeader(filePath, activeNav) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes('BusinessPartnerHeader') && content.includes('<header')) {
    content = content.replace(
      'import { Store,',
      'import { BusinessPartnerHeader } from "@/components/vendor/BusinessPartnerHeader";\nimport { Store,'
    );
    content = content.replace(
      /\{\/\* Top Navbar \*\/[\s\S]*?<\/header>/,
      `      {/* Shared Business Partner Header */}
      <BusinessPartnerHeader activeNav="${activeNav}" />`
    );
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Standardized vendor header in', filePath);
  }
}

standardizeVendorHeader('apps/website/src/app/vendor/profile/page.tsx', 'Profile & Compliance');
standardizeVendorHeader('apps/website/src/components/vendor/BusinessProfileEditor.tsx', 'My Business');

