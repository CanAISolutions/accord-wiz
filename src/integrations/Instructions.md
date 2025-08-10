Simplifying the accord‑wiz Rental Agreement Experience
Overview
accord‑wiz is a React/TypeScript application that guides landlords through creating rental agreements. It enforces province‑specific rules – for example, Ontario prohibits security deposits while other provinces cap them
raw.githubusercontent.com
 – and generates a PDF with landlord and tenant signatures. The current design includes a multi‑step wizard, autosave and a dual preview (readable summary and legal PDF). While feature rich, the platform can be overwhelming for users who just want a quick, solid lease.

The goal of this simplification is to make the process short, intuitive and delightful: users sign up, complete a guided form, pay once, sign digitally and immediately receive a province‑compliant lease. All other enhancements should support, not distract from, this core journey.

Detailed UX audit & defects
To design an exceptional experience you must first remove friction. I signed up and completed the existing wizard on the live CANai site and found several critical usability flaws. These issues drag down trust and make it nearly impossible to complete the lease without frustration. Below is an end‑to‑end audit.

Landing and onboarding
Brand mismatch and outdated copy – The hero still refers to “RentalWiz” and mentions “state and federal rental laws.” This is incorrect for Canadian users and undermines credibility. The tagline should clearly state that agreements are province‑specific. Also, there are trust badges (“Trusted by thousands”) without evidence, which feel hollow.

Province selection modal – On entering the wizard, a modal forces the user to pick a province but provides no feedback once selected. There is no persistent indicator of the active province until later in the flow, so users might not realise they are locked into a jurisdiction.

Step 1: Jurisdiction
Good – Selecting a province immediately hides irrelevant fields later on. The right rule panel summarises deposit caps and standard terms.

Need improvement – The province chip in the header appears only at this step; it should persist throughout the wizard so users always know which jurisdiction they’re in. Also, there is no explanation of why this choice matters.

Step 2: Landlord information
Required fields not enforced consistently – The phone field is labelled as required (*) yet the note says “either phone or email is required.” If the email is filled, the phone asterisk should disappear. The error messages (“String must contain at least 1 character(s)”) are generic and aren’t tied to the offending field

canai.so
.

Mailing address input – There is no address autocomplete despite text suggesting it will auto‑populate. Users must type the full address manually. This slows data entry and increases the chance of mistakes. (This issue persisted on later steps as well

canai.so
.)

Step 3: Tenant information
Emergency contact confusion – The emergency contact section initially shows error messages even before the user interacts with the fields

canai.so
. This creates anxiety and makes the form feel broken.

Required flags mismatch – Similar to the landlord form, some fields show asterisks but aren’t actually required, while others are required without an asterisk. Better consistency and dynamic validation are needed.

Step 4: Property details
Address autocomplete not working – The property address field claims it is powered by OpenStreetMap/Photon and should suggest addresses, but no suggestions appear when typing

canai.so
. This should either be removed or fixed.

Missing property description field – A note encourages landlords to provide a detailed description of the property, but there is no input field. Because of this missing field, the validation logic still requires a non‑empty string and throws two generic errors (“String must contain at least 1 character(s)”) at the bottom of the page

canai.so
. The user cannot progress until the hidden field is filled (which is impossible). This is a blocker.

Drop‑down menus – Selecting bedrooms, bathrooms, furnished status and parking works well. However, some options have overlapping language (e.g. “Fully Furnished” vs. “Partially Furnished”) without any guidance, and the default values are empty so the step appears incomplete even though there is no error message.

Step 5: Rental terms
Date picker bug – The lease end date field is read‑only and clicking the calendar icon does nothing. The user cannot type a date nor open a calendar. Without an end date, the Next button remains disabled and the form shows generic errors

canai.so
. This is a major blocker and should be fixed by making the input editable and adding a working date picker.

Validation messages – When the date is missing or other fields are invalid, the generic error messages do not specify which fields need correction. The error box at the bottom simply lists “String must contain at least 1 character(s)” twice

canai.so
.

Default deposit values – The security deposit defaults to the same amount as rent. In provinces that cap deposits, this might exceed the legal limit (e.g. BC allows only 0.5 months’ rent
raw.githubusercontent.com
). The wizard should prefill deposits based on the province’s legal maximum or leave them blank.

Quick help panel – A help panel at the bottom lists pre‑defined questions (e.g. “Why no security deposit in Ontario?”), but there is no search functionality and the content isn’t context‑specific. This panel takes up valuable space and distracts from completing the form.

Step 6: Legal clauses
Incomplete defaults injection – The code injects default human rights and “Act prevails” clauses. However, the initial insertion can occur while the user is typing, causing text to be overwritten. It should only run once on first mount to prevent disrupting user input.

Dense clauses – Several paragraphs of legalese are displayed without structure. Breaking them into short toggle cards with plain‑language summaries would improve readability.

Step 7: Preview, payment and signing
Multiple imports and navigation inconsistencies – The preview component imports FeedbackWidget multiple times and uses direct hash changes (e.g. location.hash = '#/pay') instead of the router for navigation. This can break browser history and cause unexpected refreshes.

Lack of loading indicators – When generating the PDF, there is no visual feedback. Users might click the button multiple times or assume it failed.

Payment gating – Payment is required before downloading, but the “Pay” link is hidden behind a hash route. There is no clear message indicating that payment is needed or explaining what happens after payment.

General issues
Consistency and copy – The UI oscillates between dark and light backgrounds unexpectedly. Some text is US‑centric (“state and federal laws”), which damages trust. The brand name RentalWiz appears on the site even though the product is marketed as CANai.

Accessibility – Form inputs lack aria labels and grouping. Error messages are not announced to screen readers. Color contrast is acceptable but the focus ring is hard to see.

Performance – Heavy 3D visuals and charts load on the landing page even though they aren’t needed for the simplified flow. These should be lazily loaded or removed.

Revised recommendations
Based on the above audit, the simplified vision remains valid, but the implementation needs to address critical defects before adding polish. Here are revised recommendations:

Fix critical blockers – Implement a functional date picker for the lease end date. Add the missing property description field or remove the validation rule entirely. Provide clear, field‑specific validation messages instead of generic strings.

Ensure address autocomplete works – Either integrate Photon properly or remove the promise of auto‑complete from the UI. Auto‑complete dramatically speeds up address entry and is worth prioritising, but it must function reliably.

Consistent required markers and dynamic validation – Show asterisks only on truly required fields. If either phone or email suffices, remove the asterisk once one is filled. Display inline errors next to the offending field.

Persistent province indicator – After selecting a province, display it in the header as a chip (e.g. “AB • Act‑aligned”). Make this clickable to change provinces and show why it matters.

Simplify help and clauses – Replace the Quick Help panel with contextual tooltips or a minimal FAQ accessible via a help icon. Break legal clauses into collapsible sections with plain‑language summaries. Use a one‑time default injection of mandatory clauses.

Clarify payment and PDF generation – Combine preview, payment and signing into a single “Finalize” page. Clearly indicate when payment is required and disable the PDF button until payment is complete. Add a spinner or progress bar when generating the PDF.

Clean up navigation and imports – Use the React Router for navigation instead of manipulating window.location.hash. Import components only once and remove duplicate imports to reduce bundle size.

Improve accessibility – Add aria-label to inputs, group related fields with <fieldset> and <legend>, and ensure error messages are announced via aria-live regions. Provide a keyboard‑accessible date picker and maintain a visible focus ring.

Polish UI copy and brand – Replace all instances of “RentalWiz” and US‑centric language with CANai and Canadian provinces. Remove unsubstantiated claims like “trusted by thousands” until you can back them up with customer testimonials or official statistics. Ensure the design feels cohesive with consistent spacing and a clear visual hierarchy.

Lazy‑load heavy assets – Defer loading of 3D models, charts or non‑essential visuals until the user interacts with them. Prioritise quick time to first input for the wizard.

Competitor landscape
Competitors like SingleKey, SignHouse and LawDepot offer rental agreements bundled with screening, insurance, rent collection or legal advice. These extras add complexity and cost. accord‑wiz differentiates itself by focusing on the essentials: it enforces provincial regulations, provides a modern interface and delivers a polished agreement quickly. Keeping the scope narrow will attract landlords who value speed and simplicity.

Simplified vision
Core journey
Frictionless sign‑up – Use Supabase magic links or social logins to keep registration minimal. Once authenticated, users should be taken directly to their last saved draft thanks to autosave.

Guided wizard – Collect information step by step: jurisdiction first, then landlord and tenant details, property description, rental terms and optional clauses. Hide or disable fields that don’t apply (e.g., remove the security‑deposit input when the user selects Ontario
raw.githubusercontent.com
). Display a clear progress indicator and use micro‑animations to show progress or celebrate completion
theedigital.com
.

Payment step – Place a single checkout page after the last form. Integrate Stripe or another trusted provider for a one‑time payment. Avoid subscription tiers until the core product is established.

Generate and sign – Immediately after payment, produce the PDF. Present a final preview with signature boxes for landlord and tenant. Capture their signatures in the browser and embed them in the PDF. Offer download and email options without forcing the user off the site.

Guidance and clarity
Human‑written tooltips – Provide concise explanations next to fields that commonly confuse users (e.g. deposit and late fee rules). Avoid full chatbots or AI until later phases; instead anticipate questions with micro‑copy.

Curated clause toggles – Offer a small set of optional clauses (pets, smoking, maintenance) as toggles with plain‑language summaries. This keeps the interface simple while still offering flexibility.

Polished user interface
Province‑first onboarding – Ask for the province immediately so the form can tailor itself. Use cards or a modal with subtle animations to make the choice engaging.

Responsive dual preview – Retain the idea of a summary view and a legal PDF view, but simplify interactions: allow toggling between them on desktop and stack them on mobile. Avoid complex scroll syncing.

Micro‑interactions – Use small animations to provide feedback and make the site feel alive (e.g. progress bars easing into place, buttons gently scaling on click)
theedigital.com
. Keep animations purposeful and light so they don’t hinder performance.

Accessibility & bilingual support – Meet WCAG guidelines, support keyboard navigation and screen readers, and ship translations for English and French. Provide dark mode and large‑text options for comfort.

Address autocomplete – Integrate a free API like Photon (based on OpenStreetMap) to suggest addresses as users type. This speeds up data entry without added cost.

Implementation roadmap (simplified)
Phase 1 – Core MVP (1‑2 months)
Streamline the wizard – Implement province‑first onboarding, hide irrelevant fields and add clear progress indicators. Finish French translation and accessibility tweaks.

Payment and e‑signature – Add a simple Stripe checkout at the end of the form. Capture signatures using an open‑source signature pad and embed them into the PDF.

Autosave & vault – Continue using local storage for autosave. Use Supabase authentication and provide a minimalist vault page where users can resume drafts or download completed agreements.

Clause toggles and tooltips – Implement curated clause toggles and add concise tooltips for complex fields.

Phase 2 – Enhanced UX (2‑3 months)
Micro‑interactions & dark mode – Refine animations and transitions. Add a dark/light mode toggle and remember the user’s choice.

Inline help & address autocomplete – Provide a lightweight FAQ or help panel with pre‑written answers. Add Photon address autocomplete to speed up property entry.

Responsive preview improvements – Ensure the summary/PDF toggle works seamlessly across devices. Optimise for thumb‑friendly navigation on mobile.

Feedback & analytics – Prompt users for quick feedback after they download the agreement. Track basic completion metrics to identify drop‑off points.

Phase 3 – Optional extensions (3‑4 months)
Rent collection – If demand exists, integrate recurring rent payments after the core workflow is stable.

APIs and integrations – Provide simple APIs or webhooks so property management software can pull completed agreements.

Advanced guidance – Explore AI‑driven clause explanations or tenant screening only when the simplified product has a strong user base.

Additional enhancements (optional)
Even within the simplified scope there are free improvements that can make the experience delightful:

Micro‑interactions – Use animation libraries like Framer Motion to animate buttons and progress bars
theedigital.com
.

Address autocomplete – Use Photon for free address suggestions.

Dark mode & themes – Offer a dark/light toggle and persist the preference in local storage.

Quick feedback – After PDF generation, prompt the user for a short rating and comments to iterate on the design.

Conclusion
By stripping away non‑essential features and perfecting the core flow, accord‑wiz can become Canada’s easiest and most trustworthy rental agreement generator. The product should lead users from sign‑up to signed PDF in as few steps as possible while maintaining compliance with provincial laws and providing a polished, accessible interface. Once this foundation is rock solid, optional enhancements like rent collection, APIs and AI‑powered guidance can be layered on without compromising simplicity.

Finishing touches for delight
If you want to exceed expectations without adding complexity, consider these small but impactful enhancements:

Smart reuse for returning users – Store previous properties and tenant details in the vault so that repeat landlords can duplicate a prior agreement with just a few clicks. Auto‑filling known data saves time and encourages loyalty.

Shareable draft links – Give landlords the option to generate a private preview link early in the process. Tenants can review terms and propose edits before payment, fostering transparency and reducing back‑and‑forth via email.

Soft save confirmation – Whenever a user completes a field, show a subtle toast confirming that their progress is saved and can be resumed later. Pair this with a prominent “Resume my draft” button in the header so users feel safe leaving and coming back.

Humanised microcopy – Replace generic error strings with clear, empathetic messages (e.g., “Please enter a lease end date to continue”). A friendly tone builds confidence and reduces frustration.

Polished empty states – Design empty screens (such as the vault before a user creates their first agreement) with illustrations and helpful prompts instead of blank lists. Good empty states guide users to the next action.

Subtle celebrations – Celebrate milestones like completing a step or finalising an agreement with a small animation or badge. These micro‑moments add delight without turning the process into a game.

Tenant invite flow – After generating the PDF, offer a one‑click option to email the tenant a secure link to review and sign. Keeping both parties within the same system simplifies coordination.

Contextual legal tips – Surface short, province‑specific tips when users hover over certain fields. For example, a tooltip on the deposit field might read “In BC, security deposits can’t exceed half a month’s rent.” These targeted notes build trust without cluttering the UI.

Enhanced accessibility toggles – Add controls in the header for larger text and high‑contrast themes. Allow users to customise their viewing experience beyond dark mode, making the platform inclusive to a wider audience.

Visible legal update dates – Show a “Last updated” date next to the compliance chip or rule panel to reassure users that the guidance reflects the latest regulations. Commit to regular updates and display the commitment publicly.