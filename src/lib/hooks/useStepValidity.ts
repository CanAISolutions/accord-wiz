import { useMemo } from "react";
import { z } from "zod";
import type { WizardData } from "@/components/RentalWizard";
import { getProvinceRules, validateTerms } from "@/lib/canadaRentalRules";

export interface StepValidity {
  isValid: boolean;
  errors: string[];
}

const personBaseSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1).optional().or(z.literal("")),
  phone: z.string().min(1).optional().or(z.literal("")),
  email: z.string().email().optional().or(z.literal("")),
});

const landlordSchema = personBaseSchema.refine((v) => Boolean(v.phone) || Boolean(v.email), {
  message: "Either phone or email is required",
});

const tenantSchema = personBaseSchema
  .extend({
    emergencyContact: z.string().min(1),
    emergencyPhone: z.string().min(1),
  })
  .refine((v) => Boolean(v.phone) || Boolean(v.email), {
    message: "Either phone or email is required",
  });

const propertySchema = z.object({
  address: z.string().min(1),
  type: z.string().min(1),
  bedrooms: z.string().min(1),
  bathrooms: z.string().min(1),
  furnished: z.string().min(1),
  parking: z.string().min(1),
});

const baseTermsSchema = z.object({
  rentAmount: z.string().min(1),
  leaseStart: z.string().min(1),
  leaseEnd: z.string().min(1),
  rentDueDate: z.string().min(1),
  securityDeposit: z.string().optional().or(z.literal("")),
  rentDeposit: z.string().optional().or(z.literal("")),
  petDeposit: z.string().optional().or(z.literal("")),
  lateFeesAmount: z.string().optional().or(z.literal("")),
  lateFeesGracePeriod: z.string().optional().or(z.literal("")),
});

export function useStepValidity(data: WizardData, currentStep: number): StepValidity {
  return useMemo(() => getStepValidity(data, currentStep), [data, currentStep]);
}

export function getStepValidity(data: WizardData, step: number): StepValidity {
  const errors: string[] = [];

  if (step === 1) {
    if (!data.jurisdiction?.provinceCode) {
      errors.push("Select a province or territory");
    }
    return { isValid: errors.length === 0, errors };
  }

  if (step === 2) {
    const r = landlordSchema.safeParse(data.landlord);
    if (!r.success) errors.push(...r.error.errors.map((e) => e.message));
    return { isValid: errors.length === 0, errors };
  }

  if (step === 3) {
    const r = tenantSchema.safeParse(data.tenant);
    if (!r.success) errors.push(...r.error.errors.map((e) => e.message));
    return { isValid: errors.length === 0, errors };
  }

  if (step === 4) {
    const r = propertySchema.safeParse(data.property);
    if (!r.success) errors.push(...r.error.errors.map((e) => e.message));
    return { isValid: errors.length === 0, errors };
  }

  if (step === 5) {
    const rules = getProvinceRules(data.jurisdiction?.provinceCode || "");
    const r = baseTermsSchema.safeParse(data.terms);
    if (!r.success) errors.push(...r.error.errors.map((e) => e.message));

    // Province-aware requirements
    if (rules) {
      if (rules.securityDeposit.allowed) {
        // If allowed and user entered value, ensure numeric
        const sd = parseFloat(data.terms.securityDeposit || "0");
        if (data.terms.securityDeposit && !Number.isFinite(sd)) errors.push("Security deposit must be a number");
      } else if (data.terms.securityDeposit && parseFloat(data.terms.securityDeposit) > 0) {
        errors.push(`${rules.name}: Security/damage deposits are not permitted.`);
      }
      if (rules.lateFees?.allowed === false) {
        if (data.terms.lateFeesAmount && parseFloat(data.terms.lateFeesAmount) > 0) {
          errors.push(`${rules.name}: Late fees are restricted; avoid setting a flat late fee.`);
        }
      }
    }

    const rent = parseFloat(data.terms.rentAmount || "0");
    const security = parseFloat(data.terms.securityDeposit || "0");
    const late = parseFloat(data.terms.lateFeesAmount || "0");
    const v = validateTerms(data.jurisdiction?.provinceCode as any, Number.isFinite(rent) ? rent : undefined, Number.isFinite(security) ? security : undefined, Number.isFinite(late) ? late : undefined);
    errors.push(...v.errors);
    return { isValid: errors.length === 0, errors };
  }

  if (step === 6) {
    // Clauses: ensure minimum selections
    const { clauses } = data;
    if (!clauses.petsAllowed || !clauses.smokingAllowed || !clauses.sublettingAllowed || !clauses.earlyTermination) {
      errors.push("Complete required clause selections");
    }
    // Mandatory ON clause presence check for ON preview
    if (!clauses["actPrevailsClause" as any] || !clauses["humanRightsClause" as any]) {
      errors.push("Mandatory clauses must be filled: Act Prevails and Human Rights/Service Animals");
    }
    return { isValid: errors.length === 0, errors };
  }

  // Step 7 (Preview) is always valid if prior steps are valid
  return { isValid: true, errors: [] };
}

