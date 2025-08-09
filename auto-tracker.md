# Auto Tracker

This file records all autonomous changes made to the codebase for the UX redesign and compliance upgrade.

## Entries

- [x] Add compliance UI primitives and dual-view preview
  - Files: `src/components/compliance/ComplianceChip.tsx`, `src/components/compliance/RightRulePanel.tsx`, `src/components/compliance/ClauseExplainer.tsx`, `src/components/wizard/RentalTermsStep.tsx`, `src/components/wizard/PreviewStep.tsx`, `src/components/RentalWizard.tsx`, `index.html`, `UX-DesignGuide.md`
  - Notes: Persistent province chip, per-step rule panel, inline explainers, preview Tabs with ON SFL link and compliance caption; Google Fonts added.

- [x] Make UX-DesignGuide.md the living tracker
  - Files: `UX-DesignGuide.md`
  - Notes: Added landing trust row, QC/TAL blocker, autosave/defaults, optional split-pane dual-view, DOCX export phase.

- [x] Landing trust row and “Why this is safe” popover
  - Files: `src/pages/Index.tsx`
  - Notes: Adds official-source links (ON SFL, QC TAL, BC RTB) and safety popover to increase trust.

- [x] QC/TAL blocker in Preview
  - Files: `src/components/wizard/PreviewStep.tsx`
  - Notes: For Quebec, shows blocking guidance, disables generation, links to TAL.

- [x] Autosave + province-safe defaults
  - Files: `src/components/RentalWizard.tsx`, `src/components/wizard/RentalTermsStep.tsx`
  - Notes: LocalStorage autosave with toast; one-click recommended defaults per province.

- [x] Auth + Pay skeleton (lean MVP)
  - Files: `src/pages/SignIn.tsx`, `src/pages/Pay.tsx`, `src/App.tsx`
  - Notes: Magic-link sign-in via Supabase client; plan selection stub that proceeds to wizard.

- [x] Vault (no DB changes)
  - Files: `src/lib/drafts.ts`, `src/pages/Vault.tsx`, `src/App.tsx`
  - Notes: LocalStorage-backed drafts list with export/import, rename, duplicate, delete.


