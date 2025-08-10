import Stripe from 'stripe';
import OpenAI from 'openai';
import { PDFDocument, StandardFonts } from 'pdf-lib';

const stripe = new Stripe(process.env.STRIPE_SECRET as string, { apiVersion: '2024-06-20' });
const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY as string });

export default async function handler(req: Request) {
  const { searchParams } = new URL(req.url);
  const sid = searchParams.get('session_id');
  if (!sid) return new Response('Missing session_id', { status: 400 });

  const session = await stripe.checkout.sessions.retrieve(sid);
  if (session.payment_status !== 'paid') {
    return new Response('Payment not completed', { status: 402 });
  }

  const form = JSON.parse(session.metadata?.form || '{}');

  const prompt = [
    `Generate a clear, plain-English Canadian residential tenancy agreement.`,
    `Province code: ${form.province || 'GEN'}.`,
    `Parties: Landlord ${form.landlord}; Tenant ${form.tenant}.`,
    `Property address: ${form.address}, ${form.postal}.`,
    `Terms: Start ${form.startDate}; Monthly rent $${form.rent} CAD;`,
    `Pets allowed: ${form.petsAllowed ? 'Yes' : 'No'}; Smoking allowed: ${form.smokingAllowed ? 'Yes' : 'No'};`,
    `Utilities included: ${(form.utilities || []).join(', ') || 'None'}.`,
    `Include signature lines and a short province-specific note (if provided).`,
    `Output as plain text (no HTML tags).`
  ].join('\n');

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.2
  });

  const text = completion.choices?.[0]?.message?.content?.trim() || 'Lease content unavailable.';

  const pdf = await PDFDocument.create();
  const page = pdf.addPage([612, 792]);
  const font = await pdf.embedFont(StandardFonts.TimesRoman);
  const fontBold = await pdf.embedFont(StandardFonts.TimesRomanBold);
  const margin = 54;
  const width = page.getWidth() - margin * 2;
  let y = page.getHeight() - margin;

  const drawTextBlock = (str: string, size = 11, bold = false, gap = 14) => {
    const words = str.split(/\s+/);
    let line = '';
    const lines: string[] = [];
    const maxChars = 95;
    words.forEach(w => {
      if ((line + ' ' + w).trim().length > maxChars) { lines.push(line.trim()); line = w; }
      else { line += ' ' + w; }
    });
    if (line.trim()) lines.push(line.trim());
    lines.forEach(l => {
      if (y < margin + 72) {
        y = page.getHeight() - margin;
      }
      page.drawText(l, { x: margin, y, size, font: bold ? fontBold : font });
      y -= gap;
    });
    y -= 6;
  };

  page.drawText('Residential Tenancy Agreement', { x: margin, y, size: 16, font: fontBold });
  y -= 24;

  drawTextBlock(text, 11, false, 14);

  if (y < margin + 100) y = margin + 100;
  page.drawText('Landlord Signature: ____________________________   Date: ___________', { x: margin, y, size: 11, font });
  y -= 20;
  page.drawText('Tenant Signature:   ____________________________   Date: ___________', { x: margin, y, size: 11, font });

  const bytes = await pdf.save();
  return new Response(bytes, {
    headers: {
      'content-type': 'application/pdf',
      'content-disposition': 'attachment; filename=canai-lease.pdf'
    }
  });
}


