import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { site } from "@/lib/site";

type VoucherData = {
  amount: number;
  recipientName: string | null;
  occasion: string | null;
  message: string | null;
  voucherCode: string;
};

const GOLD = rgb(196 / 255, 145 / 255, 68 / 255);
const GOLD_LIGHT = rgb(222 / 255, 181 / 255, 115 / 255);
const CREAM = rgb(251 / 255, 243 / 255, 228 / 255);
const INK = rgb(24 / 255, 34 / 255, 32 / 255);

function drawToothLogo(
  page: import("pdf-lib").PDFPage,
  x: number,
  y: number,
  size: number
) {
  // Eenvoudig, gestileerd tand-icoon: rond lichaam + twee "wortels" onderaan.
  page.drawEllipse({
    x: x + size / 2,
    y: y + size * 0.62,
    xScale: size * 0.42,
    yScale: size * 0.38,
    color: GOLD,
  });
  page.drawRectangle({
    x: x + size * 0.22,
    y: y + size * 0.05,
    width: size * 0.16,
    height: size * 0.35,
    color: GOLD,
  });
  page.drawRectangle({
    x: x + size * 0.62,
    y: y + size * 0.1,
    width: size * 0.16,
    height: size * 0.3,
    color: GOLD,
  });
  page.drawEllipse({
    x: x + size * 0.38,
    y: y + size * 0.72,
    xScale: size * 0.08,
    yScale: size * 0.08,
    color: GOLD_LIGHT,
  });
}

export async function generateGiftVoucherPdf(
  data: VoucherData
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 330]); // A5-achtig, liggend

  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const timesItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);

  const { width, height } = page.getSize();

  // Achtergrond
  page.drawRectangle({ x: 0, y: 0, width, height, color: CREAM });

  // Gouden balk bovenaan
  page.drawRectangle({ x: 0, y: height - 14, width, height: 14, color: GOLD });

  // Logo
  drawToothLogo(page, 40, height - 95, 40);

  // Titel
  page.drawText(site.name, {
    x: 90,
    y: height - 60,
    size: 20,
    font: helveticaBold,
    color: GOLD,
  });

  const occasionLabel = data.occasion
    ? `Cadeaubon — ${data.occasion}`
    : "Cadeaubon";
  page.drawText(occasionLabel, {
    x: 90,
    y: height - 85,
    size: 14,
    font: helvetica,
    color: INK,
  });

  // Bedrag, groot en centraal
  const amountText = `€ ${data.amount},-`;
  page.drawText(amountText, {
    x: 40,
    y: height / 2 - 10,
    size: 48,
    font: helveticaBold,
    color: INK,
  });

  if (data.recipientName) {
    page.drawText(`Voor: ${data.recipientName}`, {
      x: 40,
      y: height / 2 - 45,
      size: 14,
      font: helvetica,
      color: INK,
    });
  }

  if (data.message) {
    const maxWidth = 500;
    const words = data.message.split(" ");
    let line = "";
    let y = height / 2 - 75;
    for (const word of words) {
      const testLine = line ? `${line} ${word}` : word;
      const testWidth = timesItalic.widthOfTextAtSize(testLine, 13);
      if (testWidth > maxWidth) {
        page.drawText(line, {
          x: 40,
          y,
          size: 13,
          font: timesItalic,
          color: INK,
        });
        line = word;
        y -= 18;
      } else {
        line = testLine;
      }
    }
    if (line) {
      page.drawText(line, {
        x: 40,
        y,
        size: 13,
        font: timesItalic,
        color: INK,
      });
    }
  }

  // Voettekst
  page.drawText(`Code: ${data.voucherCode}`, {
    x: 40,
    y: 45,
    size: 11,
    font: helveticaBold,
    color: GOLD,
  });
  page.drawText(
    `${site.address.streetAddress}, ${site.address.postalCode} ${site.address.addressLocality} — ${site.phoneDisplay}`,
    { x: 40, y: 28, size: 9, font: helvetica, color: INK }
  );

  return pdfDoc.save();
}
