import { ALL_SKILLS_SET, TECH_SKILLS, SECTION_PATTERNS } from './keywordDictionary.js';

/**
 * Clean and normalize raw text
 */
export const cleanText = (text) => {
  if (!text) return '';
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/[^\x20-\x7E\n]/g, ' ') // remove non-ascii artifacts
    .replace(/[ \t]+/g, ' ')
    .trim();
};

/**
 * Extract Contact Information via RegEx
 */
export const extractContactInfo = (text) => {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g;
  const linkedinRegex = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[A-Za-z0-9_-]+/gi;
  const githubRegex = /(?:https?:\/\/)?(?:www\.)?github\.com\/[A-Za-z0-9_-]+/gi;

  const emails = text.match(emailRegex) || [];
  const phones = text.match(phoneRegex) || [];
  const linkedins = text.match(linkedinRegex) || [];
  const githubs = text.match(githubRegex) || [];

  // Extract candidate name heuristic (first clean non-empty line with 2-4 words)
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  let name = 'Candidate';
  for (const line of lines.slice(0, 5)) {
    if (
      !line.includes('@') &&
      !line.match(/\d/) &&
      !line.toLowerCase().includes('resume') &&
      !line.toLowerCase().includes('curriculum') &&
      line.split(/\s+/).length >= 2 &&
      line.split(/\s+/).length <= 4 &&
      line.length < 35
    ) {
      name = line;
      break;
    }
  }

  return {
    name,
    email: emails[0] || '',
    phone: phones[0] || '',
    linkedin: linkedins[0] || '',
    github: githubs[0] || '',
  };
};

/**
 * Extract Categorized Skills from Text
 */
export const extractSkills = (text) => {
  const normalizedText = ` ${text.toLowerCase().replace(/[^a-z0-9+/#.-]/g, ' ')} `;
  const foundSkills = new Set();
  const categorized = {
    frontend: [],
    backend: [],
    database: [],
    devops_cloud: [],
    testing_quality: [],
    ai_data: [],
    soft_skills: [],
    other: [],
  };

  // Check each category
  for (const [category, skillsList] of Object.entries(TECH_SKILLS)) {
    for (const skill of skillsList) {
      // Escape special characters in skill (like c++, .net, c#)
      const escapedSkill = skill.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
      const pattern = new RegExp(`(?:^|\\s|[.,;()|/])${escapedSkill}(?:$|\\s|[.,;()|/])`, 'i');

      if (pattern.test(normalizedText)) {
        foundSkills.add(skill);
        categorized[category].push(skill);
      }
    }
  }

  return {
    all: Array.from(foundSkills),
    categorized,
    totalCount: foundSkills.size,
  };
};

/**
 * Parse Structured Resume Sections
 */
export const extractSections = (text) => {
  const lines = text.split('\n');
  const sections = {
    summary: '',
    experience: '',
    education: '',
    skills: '',
    projects: '',
    certifications: '',
  };

  let currentSection = 'summary';

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Check if line is a section header (usually short line, < 40 chars)
    if (trimmed.length < 45) {
      let matchedHeader = false;
      for (const [secKey, pattern] of Object.entries(SECTION_PATTERNS)) {
        if (pattern.test(trimmed)) {
          currentSection = secKey;
          matchedHeader = true;
          break;
        }
      }
      if (matchedHeader) continue;
    }

    if (sections[currentSection] !== undefined) {
      sections[currentSection] += (sections[currentSection] ? '\n' : '') + trimmed;
    }
  }

  return sections;
};

/**
 * Identify Quantifiable Metrics (% improvements, latency reductions, numbers, dollar values)
 */
export const extractQuantifiableMetrics = (text) => {
  const metricRegex = /\b(?:\d+(?:\.\d+)?%|\$\d+(?:,\d{3})*(?:\.\d+)?(?:k|m|b)?|\d+x|\d+(?:\+)?\s*(?:users|clients|engineers|microservices|requests|req\/s|ms|fps|tb|gb|mb|k))\b/gi;
  const matches = text.match(metricRegex) || [];
  return {
    count: matches.length,
    samples: matches.slice(0, 10),
  };
};

/**
 * Vector TF-IDF Cosine Similarity approximation between two documents
 */
export const calculateCosineSimilarity = (textA, textB) => {
  const tokenize = (t) => t.toLowerCase().replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(w => w.length > 2);
  const wordsA = tokenize(textA);
  const wordsB = tokenize(textB);

  const freqMapA = {};
  const freqMapB = {};
  const allVocab = new Set([...wordsA, ...wordsB]);

  wordsA.forEach(w => freqMapA[w] = (freqMapA[w] || 0) + 1);
  wordsB.forEach(w => freqMapB[w] = (freqMapB[w] || 0) + 1);

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (const word of allVocab) {
    const valA = freqMapA[word] || 0;
    const valB = freqMapB[word] || 0;
    dotProduct += valA * valB;
    magnitudeA += valA * valA;
    magnitudeB += valB * valB;
  }

  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);

  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  return Math.min(1, Math.max(0, dotProduct / (magnitudeA * magnitudeB)));
};
