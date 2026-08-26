import { model } from '../config/gemini.js';

/**
 * AI Service for Resume Optimization, Bullet Rewrites, Cover Letters & Interview Prep
 */

/**
 * 1. Deep AI Resume Audit & ATS Suggestions
 */
export const generateAiResumeReview = async ({ resumeText, jdText, scores, missingKeywords }) => {
  if (model) {
    try {
      const prompt = `
You are a Principal Software Architect and Executive Recruiter at top tech companies.
Analyze this candidate's resume against the Job Description (if provided) and ATS evaluation metrics.

Resume Text:
"""
${resumeText.slice(0, 4000)}
"""

Job Description:
"""
${jdText ? jdText.slice(0, 2000) : 'General Software Engineering / Tech Position'}
"""

Calculated ATS Metrics:
- Overall Score: ${scores.overallScore}/100
- Missing Keywords: ${missingKeywords.join(', ') || 'None critical'}

Return ONLY valid JSON matching this exact structure (no markdown formatting, no backticks):
{
  "executiveSummary": "Concise 2-sentence evaluation of candidate candidacy.",
  "topStrengths": ["Strength 1", "Strength 2", "Strength 3"],
  "criticalImprovements": ["Improvement 1", "Improvement 2", "Improvement 3"],
  "missingKeywordsStrategy": ["How to integrate missing keyword 1 naturally", "How to integrate missing keyword 2 naturally"],
  "bulletPointAudit": [
    {
      "original": "Sample weak line from resume",
      "critique": "Why this line underperforms",
      "improved": "Optimized version using Google XYZ formula (Accomplished [X] as measured by [Y] by doing [Z])"
    }
  ],
  "atsFormattingAdvice": ["Formatting tip 1", "Formatting tip 2"]
}
`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text().trim();
      const cleanedJson = responseText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
      return JSON.parse(cleanedJson);
    } catch (err) {
      console.warn('⚠️ Gemini AI call failed or timed out. Falling back to Smart Engine:', err.message);
    }
  }

  // Smart Heuristic Fallback
  return {
    executiveSummary: `Candidate demonstrates solid technical foundation with an ATS compatibility score of ${scores.overallScore}%. Highlighting quantifiable metrics and bridging key keyword gaps will substantially boost recruiter visibility.`,
    topStrengths: [
      `Strong technical skill variety across ${scores.matchedKeywords?.length || 'core'} key engineering competencies.`,
      scores.impactScore > 60 ? 'Good usage of quantifiable results and metrics.' : 'Clear chronological structure and clean section layout.',
      'Strong alignment with modern software development best practices.'
    ],
    criticalImprovements: [
      missingKeywords.length > 0
        ? `Incorporate critical missing domain terms: ${missingKeywords.slice(0, 5).join(', ')}.`
        : 'Deepen the architectural explanation of project outcomes.',
      'Transform passive task descriptions into Google XYZ formula bullet points (Accomplished X, measured by Y, by doing Z).',
      'Ensure each experience entry has 3-4 high-impact bullets with explicit metric measurements (e.g. latency, throughput, scale).'
    ],
    missingKeywordsStrategy: missingKeywords.slice(0, 4).map(kw => `Add ${kw} into your Skills list and reference it in a recent project or role impact bullet.`),
    bulletPointAudit: [
      {
        original: 'Worked on building backend REST APIs for the web application.',
        critique: 'Lacks scale, technical complexity, and measurable business impact.',
        improved: 'Architected and deployed 15+ RESTful microservices using Node.js and PostgreSQL, reducing API response latency by 35% across 500k monthly active users.'
      },
      {
        original: 'Responsible for database queries and bug fixing.',
        critique: 'Passive tone and does not demonstrate engineering ownership.',
        improved: 'Optimized complex SQL queries and implemented Redis caching, boosting database throughput by 42% and resolving 30+ critical production issues.'
      }
    ],
    atsFormattingAdvice: [
      'Maintain standard single-column layout for highest ATS parser accuracy.',
      'Ensure all contact links (LinkedIn, GitHub) use clean standard URLs.'
    ]
  };
};

/**
 * 2. AI Bullet Point Rewriter (Google XYZ Formula)
 */
export const rewriteBulletPointWithAi = async ({ originalBullet, targetRole = 'Software Engineer', skillsToHighlight = [] }) => {
  if (model && originalBullet) {
    try {
      const prompt = `
Act as a Principal Staff Engineer and Resume Coach.
Rewrite this resume bullet point for a ${targetRole} role.
Highlight skills: ${skillsToHighlight.join(', ') || 'High scalability, performance optimization, best practices'}

Original Bullet:
"${originalBullet}"

Return ONLY valid JSON (no markdown ticks):
{
  "googleXyz": "Accomplished [X], as measured by [Y], by doing [Z]",
  "metricHeavy": "High-impact version with strong percentage/dollar/speed figures",
  "concise": "Crisp, active-verb focused version for tight space",
  "keyChangesMade": ["Explanation of change 1", "Explanation of change 2"]
}
`;
      const result = await model.generateContent(prompt);
      const responseText = result.response.text().trim();
      const cleanedJson = responseText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
      return JSON.parse(cleanedJson);
    } catch (err) {
      console.warn('⚠️ Gemini bullet rewrite failed, using heuristic rewriter:', err.message);
    }
  }

  // Smart Heuristic Bullet Rewriter
  const cleaned = originalBullet ? originalBullet.replace(/^[-*•\s]+/, '') : 'Built application features';
  return {
    googleXyz: `Engineered and deployed scalable core modules for ${cleaned.toLowerCase()}, improving system reliability by 40% through automated CI/CD and optimized algorithms.`,
    metricHeavy: `Spearheaded end-to-end development of ${cleaned.toLowerCase()}, driving a 30% reduction in query latency and supporting 100k+ daily transactions.`,
    concise: `Architected and optimized ${cleaned.toLowerCase()}, boosting performance and code quality across production services.`,
    keyChangesMade: [
      'Replaced weak passive verbs with authoritative action verbs (Engineered, Spearheaded, Architected).',
      'Injected measurable business & performance metrics (% improvements, latency, reliability).'
    ]
  };
};

/**
 * 3. AI Tailored Cover Letter Generator
 */
export const generateCoverLetterWithAi = async ({ resumeText, jdText, companyName = 'Hiring Company', roleTitle = 'Software Engineer', tone = 'professional' }) => {
  if (model) {
    try {
      const prompt = `
You are a career strategist. Write a compelling, highly personalized cover letter for the role of ${roleTitle} at ${companyName}.
Tone: ${tone} (Options: professional, confident, conversational).

Candidate Resume Background:
"""
${resumeText.slice(0, 3000)}
"""

Job Description / Requirements:
"""
${jdText ? jdText.slice(0, 2000) : `Target Role: ${roleTitle}`}
"""

Write a high-converting 3-4 paragraph cover letter.
Do NOT use generic clichés. Connect candidate's specific background to the company's needs.
Return raw text only.
`;
      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    } catch (err) {
      console.warn('⚠️ Gemini Cover Letter generation failed, using structured template:', err.message);
    }
  }

  // Smart Fallback Cover Letter
  return `Dear Hiring Team at ${companyName},

I am writing to express my enthusiastic interest in the ${roleTitle} position. With my comprehensive background in full-stack software engineering, scalable backend architecture, and high-performance application development, I am eager to contribute immediately to ${companyName}'s engineering goals.

Throughout my software engineering career, I have specialized in designing robust distributed services, architecting RESTful APIs, and implementing responsive frontend experiences. I take pride in applying clean architecture, DRY principles, and rigorous performance optimization to solve complex technical challenges and deliver measurable business value.

What particularly excites me about ${companyName} is your dedication to engineering excellence and user-centric innovation. I am confident that my technical skills, combined with my collaborative problem-solving approach, make me a strong fit for your team.

Thank you for your time and consideration. I welcome the opportunity to discuss how my experience and passion for building high-quality software can support ${companyName}'s ongoing success.

Sincerely,
Candidate`;
};

/**
 * 4. AI Interview Prep Generator (STAR Method)
 */
export const generateInterviewPrepWithAi = async ({ resumeText, jdText, roleTitle = 'Software Engineer' }) => {
  if (model) {
    try {
      const prompt = `
Act as a Senior Director of Engineering at Google/Meta.
Generate 5 tailored interview questions for a candidate applying for ${roleTitle}, based on their resume and job requirements.
Include 2 Deep Technical questions, 2 System Architecture questions, and 1 Behavioral / Leadership question.

Resume:
"""
${resumeText.slice(0, 3000)}
"""

JD:
"""
${jdText ? jdText.slice(0, 1500) : roleTitle}
"""

Return ONLY a valid JSON array of objects (no markdown ticks):
[
  {
    "category": "Technical" | "Architecture" | "Behavioral",
    "question": "The interview question",
    "whyInterviewerAsks": "What the interviewer is testing for",
    "starTip": "Advice on structuring Situation, Task, Action, Result",
    "sampleAnswer": "High-scoring sample response"
  }
]
`;
      const result = await model.generateContent(prompt);
      const responseText = result.response.text().trim();
      const cleanedJson = responseText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
      return JSON.parse(cleanedJson);
    } catch (err) {
      console.warn('⚠️ Gemini interview prep failed, using fallback prep kit:', err.message);
    }
  }

  // Fallback Structured Questions
  return [
    {
      category: 'Technical',
      question: `How do you ensure data consistency and low latency in a high-throughput REST API using Node.js and PostgreSQL?`,
      whyInterviewerAsks: 'Assesses backend optimization, indexing, and connection pool management knowledge.',
      starTip: 'Explain a situation where API response times were bottlenecked by unindexed database queries and how you resolved it.',
      sampleAnswer: 'In my previous project, we observed 800ms P99 latencies. I performed an EXPLAIN ANALYZE on query plans, added composite B-tree indices on foreign keys, and introduced Redis caching for read-heavy endpoints, reducing latency to under 90ms.'
    },
    {
      category: 'Architecture',
      question: 'Walk me through your decision-making process when choosing between a monolithic MVC architecture vs. microservices.',
      whyInterviewerAsks: 'Tests architectural trade-off evaluation, avoiding premature complexity.',
      starTip: 'Discuss domain boundaries, team size, deployment velocity, and infrastructure operational overhead.',
      sampleAnswer: 'I advocate starting with a modular monolith with clean domain boundaries. Microservices introduce distributed transaction complexity and network latency, which are only justified when independent scaling of distinct domains or team ownership demands it.'
    },
    {
      category: 'Behavioral',
      question: 'Describe a situation where you had a disagreement with a team member or product manager about a technical trade-off.',
      whyInterviewerAsks: 'Evaluates emotional intelligence, data-driven persuasion, and collaborative mindset.',
      starTip: 'Use STAR: Situation, Task, Action (grounded in benchmarks/data, not ego), and Result.',
      sampleAnswer: 'When evaluating ORM adoption vs raw SQL, a teammate was hesitant about query overhead. I wrote benchmark tests simulating 10,000 concurrent requests demonstrating that Prisma caching had negligible difference while boosting developer velocity by 3x. We aligned on the decision and shipped on schedule.'
    }
  ];
};
