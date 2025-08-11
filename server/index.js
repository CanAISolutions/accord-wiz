/* eslint-disable */
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import express from 'express';
import Stripe from 'stripe';
import OpenAI from 'openai';
import { PDFDocument, StandardFonts } from 'pdf-lib';

const app = express();
const port = process.env.PORT || 10000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Static assets built by Vite live in dist/
const distDir = join(__dirname, '..', 'dist');
app.use(express.static(distDir));

// Health check
app.get('/health', (req, res) => {
  res.status(200).send('ok');
});

// Serve MVP static page directly
app.get('/mvp', (req, res) => {
  const mvpIndex = join(distDir, 'mvp', 'index.html');
  if (fs.existsSync(mvpIndex)) return res.sendFile(mvpIndex);
  res.status(404).send('MVP page not found');
});

// --- API: /api/checkout ---
app.post('/api/checkout', async (req, res) => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET, { apiVersion: '2024-06-20' });
    const origin = `${req.protocol}://${req.get('host')}`;
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'cad',
          unit_amount: 999,
          product_data: { name: 'Canadian Rental Agreement (PDF)' }
        },
        quantity: 1
      }],
      success_url: `${origin}/api/download?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/`,
      metadata: { form: JSON.stringify(req.body) }
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).send('Checkout failed');
  }
});

// --- API: /api/download ---
app.get('/api/download', async (req, res) => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET, { apiVersion: '2024-06-20' });
    const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });
    const { session_id: sid } = req.query;
    if (!sid) return res.status(400).send('Missing session_id');

    const session = await stripe.checkout.sessions.retrieve(String(sid));
    if (session.payment_status !== 'paid') return res.status(402).send('Payment not completed');

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
    const text = (completion.choices?.[0]?.message?.content || 'Lease content unavailable.').trim();

    const pdf = await PDFDocument.create();
    const page = pdf.addPage([612, 792]);
    const font = await pdf.embedFont(StandardFonts.TimesRoman);
    const fontBold = await pdf.embedFont(StandardFonts.TimesRomanBold);
    const margin = 54;
    let y = page.getHeight() - margin;

    const drawTextBlock = (str, size = 11, bold = false, gap = 14) => {
      const words = String(str).split(/\s+/);
      let line = '';
      const lines = [];
      const maxChars = 95;
      for (const w of words) {
        if ((line + ' ' + w).trim().length > maxChars) { lines.push(line.trim()); line = w; }
        else { line += ' ' + w; }
      }
      if (line.trim()) lines.push(line.trim());
      for (const l of lines) {
        if (y < margin + 72) {
          y = page.getHeight() - margin;
        }
        page.drawText(l, { x: margin, y, size, font: bold ? fontBold : font });
        y -= gap;
      }
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
    res.setHeader('content-type', 'application/pdf');
    res.setHeader('content-disposition', 'attachment; filename=canai-lease.pdf');
    res.send(Buffer.from(bytes));
  } catch (err) {
    console.error(err);
    res.status(500).send('Download failed');
  }
});

// SPA fallback for client routes
app.get('*', (req, res) => {
  const indexPath = join(distDir, 'index.html');
  if (fs.existsSync(indexPath)) return res.sendFile(indexPath);
  res.status(404).send('Not found');
});

app.listen(port, () => {
  console.log(`Server listening on http://0.0.0.0:${port}`);
});


