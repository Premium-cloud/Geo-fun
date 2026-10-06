/**
 * Génère des PDF A4 prêts à imprimer (fond perdu + traits de coupe).
 * Usage:
 *   node scripts/export-pdf.mjs              → deck complet + feuille test
 *   node scripts/export-pdf.mjs --test-only  → feuille test seule
 *   BASE_URL=http://127.0.0.1:43125 node scripts/export-pdf.mjs
 */
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const outDir = path.join(root, 'public')
const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:43125'
const testOnly = process.argv.includes('--test-only')

const pdfOpts = {
  format: 'A4',
  printBackground: true,
  preferCSSPageSize: true,
  margin: { top: '0', right: '0', bottom: '0', left: '0' },
}

async function exportPdf(page, filename, { testSheet = false } = {}) {
  await page.goto(baseUrl, { waitUntil: 'networkidle' })
  await page.emulateMedia({ media: 'print' })
  await page.waitForTimeout(400)

  if (testSheet) {
    await page.addStyleTag({
      content: `
        .print-deck > div:not(:first-child) { display: none !important; }
      `,
    })
  }

  const out = path.join(outDir, filename)
  await page.pdf({ ...pdfOpts, path: out })
  console.log('écrit', out)
}

await mkdir(outDir, { recursive: true })
const browser = await chromium.launch()
const page = await browser.newPage()

try {
  await exportPdf(page, 'feuille-test.pdf', { testSheet: true })
  if (!testOnly) {
    await exportPdf(page, 'drapeaux-du-monde.pdf', { testSheet: false })
  }
} finally {
  await browser.close()
}
