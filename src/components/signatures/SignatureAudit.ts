import { supabase } from "@/integrations/supabase/client";

export interface SignatureAuditEntry {
  role: "landlord" | "tenant";
  name: string;
  signedAtIso: string;
  ip?: string;
  userAgent?: string;
}

export async function recordSignatureAudit(agreementId: string, entries: SignatureAuditEntry[]) {
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id || null;
  const ip = undefined; // If reverse-proxy/header available, pass along from server in future
  const ua = typeof navigator !== "undefined" ? navigator.userAgent : undefined;
  const payload = { agreementId, entries: entries.map(e => ({ ...e, ip: e.ip || ip, userAgent: e.userAgent || ua })) };
  await supabase.from("audit_logs").insert({
    action: "signature",
    table_name: "agreements",
    record_id: agreementId,
    new_data: payload as any,
    user_id: userId || undefined,
  });
}


