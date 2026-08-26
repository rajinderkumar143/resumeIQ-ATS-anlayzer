import React, { createContext, useContext, useState } from 'react';
import { resumeService } from '../services/resumeService.js';
import { atsService } from '../services/atsService.js';

const ResumeContext = createContext();

const SAMPLE_RESUME_TEXT = `Alex Chen
San Francisco, CA | alex.chen@email.com | (555) 342-8910 | linkedin.com/in/alexchen-dev | github.com/alexchen-cloud

SUMMARY
Results-driven Senior Full-Stack Engineer with 6+ years of experience architecting high-throughput distributed systems, modern React frontends, and cloud microservices. Proven track record reducing API latency by 45% and leading engineering teams to deliver mission-critical web applications supporting 1.2M+ active users.

TECHNICAL SKILLS
- Frontend: React, Next.js, TypeScript, JavaScript, Tailwind CSS, Redux Toolkit, Webpack, Vite, HTML5, CSS3
- Backend: Node.js, Express.js, NestJS, Python, FastAPI, REST APIs, GraphQL, Microservices, WebSockets
- Database & Cache: PostgreSQL, MongoDB, Redis, Prisma, SQL, Database Indexing
- DevOps & Cloud: Docker, Kubernetes, AWS (EC2, S3, Lambda, CloudWatch), CI/CD, GitHub Actions, Nginx, Linux
- Testing & Methodologies: Jest, Cypress, TDD, Agile/Scrum, System Design, Code Review

PROFESSIONAL EXPERIENCE
Senior Software Engineer | CloudScale Technologies | Jan 2022 - Present
- Architected and deployed 14+ scalable REST microservices using Node.js, Express, and PostgreSQL, handling over 25,000 requests per minute with 99.98% uptime.
- Spearheaded frontend migration to Next.js and Tailwind CSS, improving Lighthouse performance score from 62 to 98 and cutting initial page load times by 55%.
- Implemented multi-tier Redis caching layer, decreasing database read pressure by 40% and cutting P99 API response latency from 650ms to 85ms.
- Mentored a team of 6 junior and mid-level engineers, instituting automated CI/CD pipelines via GitHub Actions that reduced deployment failure rates by 30%.

Full-Stack Developer | InnovateX Labs | June 2019 - Dec 2021
- Built dynamic real-time data visualization dashboard in React and Recharts, utilized by 250k enterprise users.
- Designed robust authentication flow utilizing JWT, refresh tokens, and bcrypt, eliminating session hijacking vulnerabilities.
- Integrated payment processing gateway using Stripe API, facilitating $4.2M in annual recurring subscription revenue.
- Authored 120+ comprehensive unit and integration test suites using Jest and Supertest, achieving 92% code coverage.

EDUCATION
Bachelor of Science in Computer Science | University of California, Berkeley | 2015 - 2019
- Dean's Honor List, President of ACM Student Chapter

CERTIFICATIONS
- AWS Certified Solutions Architect - Associate (2023)
- Certified Kubernetes Application Developer (CKAD) (2022)
`;

const SAMPLE_JOB_DESCRIPTION = `Senior Full-Stack Engineer (Node.js & React)

About The Role:
We are seeking an experienced Senior Full-Stack Engineer to architect and scale our next-generation cloud analytics platform. You will be responsible for developing high-performance REST APIs, responsive React interfaces, and distributed backend services.

Key Requirements:
- 5+ years of experience with modern JavaScript / TypeScript ecosystems (React, Node.js, Express).
- Strong proficiency in relational databases (PostgreSQL) and caching strategies (Redis).
- Hands-on experience with Docker, Kubernetes, and AWS cloud infrastructure.
- Demonstrated experience designing scalable microservices and RESTful API architectures.
- Experience with CI/CD automation and automated testing (Jest, Cypress).
- Familiarity with Generative AI / LLM integration or Python is a strong plus.
`;

export const ResumeProvider = ({ children }) => {
  const [activeResume, setActiveResume] = useState(null);
  const [activeAnalysis, setActiveAnalysis] = useState(null);
  const [targetJd, setTargetJd] = useState(SAMPLE_JOB_DESCRIPTION);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  const uploadResume = async (file) => {
    setUploading(true);
    setError(null);
    try {
      const data = await resumeService.uploadResume(file);
      setActiveResume(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const loadSampleResume = () => {
    const sampleParsed = {
      resumeId: null,
      fileName: 'Alex_Chen_Senior_Engineer_Resume.pdf',
      fileSize: 145000,
      fileType: 'pdf',
      rawText: SAMPLE_RESUME_TEXT,
      parsedData: {
        contactInfo: {
          name: 'Alex Chen',
          email: 'alex.chen@email.com',
          phone: '(555) 342-8910',
          linkedin: 'linkedin.com/in/alexchen-dev',
          github: 'github.com/alexchen-cloud',
        },
        skills: [
          'react', 'next.js', 'typescript', 'javascript', 'tailwind', 'redux', 'node.js',
          'express', 'nestjs', 'python', 'fastapi', 'postgresql', 'mongodb', 'redis',
          'prisma', 'docker', 'kubernetes', 'aws', 'ci/cd', 'github actions', 'jest',
          'cypress', 'rest api', 'microservices', 'system design'
        ],
        sections: {
          summary: 'Results-driven Senior Full-Stack Engineer with 6+ years of experience...',
          skills: 'Frontend: React, Next.js... Backend: Node.js, Express...',
          experience: 'Senior Software Engineer | CloudScale Technologies...',
          education: 'Bachelor of Science in Computer Science...',
          certifications: 'AWS Certified Solutions Architect...',
        },
        metrics: { count: 8, samples: ['45%', '1.2M+', '25,000 req/min', '99.98%', '55%', '40%', '85ms', '$4.2M'] },
      }
    };
    setActiveResume(sampleParsed);
    setTargetJd(SAMPLE_JOB_DESCRIPTION);
    return sampleParsed;
  };

  const runAnalysis = async ({ jdText = targetJd, jobTitle = 'Senior Full-Stack Engineer', company = 'TechCorp' } = {}) => {
    if (!activeResume) {
      throw new Error('Please upload or load a resume first.');
    }
    setAnalyzing(true);
    setError(null);
    try {
      const payload = {
        resumeId: activeResume.resumeId,
        rawResumeText: activeResume.rawText,
        parsedData: activeResume.parsedData,
        jobDescriptionText: jdText,
        jobTitle,
        company,
        includeAiReview: true,
      };
      const result = await atsService.analyzeResume(payload);
      setActiveAnalysis(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setAnalyzing(false);
    }
  };

  const clearSession = () => {
    setActiveResume(null);
    setActiveAnalysis(null);
    setError(null);
  };

  return (
    <ResumeContext.Provider
      value={{
        activeResume,
        activeAnalysis,
        targetJd,
        setTargetJd,
        uploading,
        analyzing,
        error,
        uploadResume,
        loadSampleResume,
        runAnalysis,
        clearSession,
        SAMPLE_JOB_DESCRIPTION,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) throw new Error('useResume must be used within a ResumeProvider');
  return context;
};
