const stringSimilarity = require('string-similarity');

function isPlagiarized(newText, existingTexts, threshold = Number(process.env.PLAGIARISM_THRESHOLD || 0.85)) {
  if (!newText || existingTexts.length === 0) return { isPlagiarized: false, score: 0 };
  const scores = existingTexts.map((t) => stringSimilarity.compareTwoStrings((t || '').toLowerCase(), (newText || '').toLowerCase()));
  const maxScore = Math.max(...scores, 0);
  return { isPlagiarized: maxScore >= threshold, score: maxScore };
}

module.exports = { isPlagiarized };


