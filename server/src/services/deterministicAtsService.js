import { extractSkills, cleanText, calculateCosineSimilarity } from '../utils/nlpHelpers.js';
import { calculateAtsScores } from '../utils/scoringFormulas.js';

export const analyzeResumeAts = ({ parsedData, rawResumeText, jobDescriptionText = '' }) => {
  const cleanedJdText = cleanText(jobDescriptionText);
  let jdSkills = [];

  if (cleanedJdText) {
    const jdSkillsData = extractSkills(cleanedJdText);
    jdSkills = jdSkillsData.all;
  }

  const cosineSim = cleanedJdText
    ? calculateCosineSimilarity(rawResumeText, cleanedJdText)
    : 0.75;

  const scoreResults = calculateAtsScores({
    resumeSkills: parsedData.skills || [],
    jdSkills,
    sections: parsedData.sections || {},
    contactInfo: parsedData.contactInfo || {},
    metrics: parsedData.metrics || { count: 0, samples: [] },
    cosineSim,
    rawResumeText,
  });

  return {
    ...scoreResults,
    jdSkillsDetected: jdSkills,
    hasJobDescription: Boolean(cleanedJdText),
  };
};
