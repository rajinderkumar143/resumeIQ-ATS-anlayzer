/**
 * Deterministic ATS Scoring Mathematics & Formulas
 */

const ACTION_VERBS = new Set([
  'architected', 'engineered', 'built', 'developed', 'designed', 'optimized',
  'spearheaded', 'implemented', 'orchestrated', 'scaled', 'refactored', 'deployed',
  'automated', 'reduced', 'improved', 'accelerated', 'led', 'managed', 'created',
  'delivered', 'integrated', 'migrated', 'streamlined', 'eliminated', 'boosted'
]);

export const calculateAtsScores = ({
  resumeSkills,
  jdSkills,
  sections,
  contactInfo,
  metrics,
  cosineSim,
  rawResumeText,
}) => {
  // 1. Skill Match Calculation (40% Weight)
  const resumeSkillsSet = new Set(resumeSkills.map(s => s.toLowerCase()));
  const jdSkillsSet = new Set(jdSkills.map(s => s.toLowerCase()));

  const matchedKeywords = [];
  const missingKeywords = [];

  if (jdSkillsSet.size > 0) {
    for (const skill of jdSkillsSet) {
      if (resumeSkillsSet.has(skill)) {
        matchedKeywords.push(skill);
      } else {
        missingKeywords.push(skill);
      }
    }
  } else {
    // If no JD provided, baseline against general resume richness
    matchedKeywords.push(...resumeSkills);
  }

  const skillMatchRatio = jdSkillsSet.size > 0
    ? matchedKeywords.length / jdSkillsSet.size
    : Math.min(1, resumeSkills.length / 15);
  const skillScore = Math.round(skillMatchRatio * 100);

  // 2. Experience & Action Verbs Calculation (25% Weight)
  const words = rawResumeText.toLowerCase().split(/\s+/);
  let actionVerbCount = 0;
  words.forEach(w => {
    if (ACTION_VERBS.has(w)) actionVerbCount++;
  });
  const hasExperienceSection = sections.experience && sections.experience.length > 50;
  let experienceScore = (hasExperienceSection ? 50 : 20) + Math.min(50, actionVerbCount * 5);
  experienceScore = Math.min(100, Math.max(0, experienceScore));

  // 3. Quantifiable Impact Calculation (15% Weight)
  // Evaluates metrics like percentages, revenue, latency, scale
  let impactScore = Math.min(100, metrics.count * 15);
  if (metrics.count === 0) impactScore = 20;

  // 4. Formatting & Structure Calculation (10% Weight)
  let formattingScore = 0;
  if (contactInfo.email) formattingScore += 20;
  if (contactInfo.phone) formattingScore += 15;
  if (contactInfo.linkedin || contactInfo.github) formattingScore += 15;
  if (sections.skills && sections.skills.length > 20) formattingScore += 15;
  if (sections.education && sections.education.length > 20) formattingScore += 15;
  if (sections.projects || sections.experience) formattingScore += 20;

  // Word count health check (ideal: 400 - 1000 words)
  const wordCount = words.length;
  if (wordCount >= 350 && wordCount <= 1200) {
    formattingScore = Math.min(100, formattingScore);
  } else {
    formattingScore = Math.max(30, formattingScore - 15);
  }

  // 5. Semantic / Context Similarity (10% Weight)
  const semanticScore = Math.round(cosineSim * 100);

  // Weighted Overall ATS Score
  const overallScore = Math.round(
    skillScore * 0.40 +
    experienceScore * 0.25 +
    impactScore * 0.15 +
    formattingScore * 0.10 +
    (jdSkillsSet.size > 0 ? semanticScore * 0.10 : formattingScore * 0.10)
  );

  return {
    overallScore: Math.min(100, Math.max(0, overallScore)),
    skillScore,
    experienceScore,
    impactScore,
    formattingScore,
    semanticScore,
    matchedKeywords,
    missingKeywords,
    sectionScores: {
      contact: contactInfo.email && contactInfo.phone ? 95 : 60,
      skills: Math.min(100, resumeSkills.length * 7),
      experience: experienceScore,
      education: sections.education ? 90 : 40,
      projects: sections.projects ? 85 : 50,
    },
    metricsDetected: metrics.count,
    actionVerbsDetected: actionVerbCount,
    wordCount,
  };
};
