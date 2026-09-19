import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { readFile } from "fs/promises";
import path from "path";
import { site } from "@/lib/site";

type VoucherData = {
  amount: number;
  recipientName: string | null;
  occasion: string | null;
  message: string | null;
  voucherCode: string;
};

const GOLD = rgb(196 / 255, 145 / 255, 68 / 255);
const CREAM = rgb(251 / 255, 243 / 255, 228 / 255);
const INK = rgb(24 / 255, 34 / 255, 32 / 255);

export async function generateGiftVoucherPdf(
  data: VoucherData
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 330]);

  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const timesItalic = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);

  const { width, height } = page.getSize();

  page.drawRectangle({ x: 0, y: 0, width, height, color: CREAM });
  page.drawRectangle({ x: 0, y: height - 14, width, height: 14, color: GOLD });

  // Logo-afbeelding inladen en tonen
  const logoPath = path.join(
    process.cwd(),
    "public",
    "images",
    "mooi-gebit-glimlach-icoon.png"
  );
  const logoBytes = await readFile(logoPath);
  const logoImage = await pdfDoc.embedPng(logoBytes);
  const logoDims = logoImage.scale(60 / logoImage.width);
  page.drawImage(logoImage, {
    x: 40,
    y: height - 40 - logoDims.height,
    width: logoDims.width,
    height: logoDims.height,
  });

  const textX = 40 + logoDims.width + 15;

  page.drawText(site.name, {
    x: textX,
    y: height - 55,
    size: 18,
    font: helveticaBold,
    color: GOLD,
  });

  const occasionLabel = data.occasion
    ? `Cadeaubon — ${data.occasion}`
    : "Cadeaubon";
  page.drawText(occasionLabel, {
    x: textX,
    y: height - 80,
    size: 14,
    font: helvetica,
    color: INK,
  });

  const amountText = `€ ${data.amount},-`;
  page.drawText(amountText, {
    x: 40,
    y: height / 2 - 20,
    size: 48,
    font: helveticaBold,
    color: INK,
  });

  if (data.recipientName) {
    page.drawText(`Voor: ${data.recipientName}`, {
      x: 40,
      y: height / 2 - 55,
      size: 14,
      font: helvetica,
      color: INK,
    });
  }

  if (data.message) {
    const maxWidth = 500;
    const words = data.message.split(" ");
    let line = "";
    let y = height / 2 - 85;
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
