const { generateCertificatePdf } = require('../utils/certificates');

async function getCertificate(req, res) {
  const name = req.user?.name || 'Participant';
  const doc = generateCertificatePdf(name);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="certificate-${name}.pdf"`);
  doc.pipe(res);
}

module.exports = { getCertificate };


