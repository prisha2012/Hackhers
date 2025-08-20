const PDFDocument = require('pdfkit');

function generateCertificatePdf(name) {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });

  doc.fontSize(26).text('Certificate of Participation', { align: 'center' });
  doc.moveDown(2);
  doc.fontSize(16).text('This certifies that', { align: 'center' });
  doc.moveDown(0.5);
  doc.fontSize(22).text(name, { align: 'center' });
  doc.moveDown(0.5);
  doc.fontSize(16).text('has participated in SynapHack 3.0.', { align: 'center' });
  doc.moveDown(2);
  doc.fontSize(12).text(`Date: ${new Date().toLocaleDateString()}`, { align: 'center' });

  doc.end();
  return doc;
}

module.exports = { generateCertificatePdf };


