import prisma from '../config/prisma.js';
import { analyzeResumeAts } from '../services/deterministicAtsService.js';
import { generateAiResumeReview } from '../services/geminiService.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/apiResponse.js';

const safeJsonParse = (str, fallback = []) => {
  if (!str) return fallback;
  if (typeof str === 'object') return str;
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
};

export const analyzeResume = async (req, res, next) => {
  try {
    const {
      resumeId,
      rawResumeText,
      parsedData,
      jobDescriptionText = '',
      jobTitle = 'Target Role',
      company = '',
      includeAiReview = true,
    } = req.body;

    let targetResumeText = rawResumeText;
    let targetParsedData = parsedData;
    let loadedResumeId = resumeId;

    if (resumeId) {
      const dbResume = await prisma.resume.findUnique({ where: { id: resumeId } });
      if (dbResume) {
        targetResumeText = dbResume.rawText;
        targetParsedData = safeJsonParse(dbResume.parsedData, {});
      }
    }

    if (!targetResumeText || !targetParsedData) {
      return errorResponse(res, 'Missing resume text or parsed content to analyze.', 400);
    }

    // 1. Run Deterministic ATS Algorithm
    const atsResult = analyzeResumeAts({
      parsedData: targetParsedData,
      rawResumeText: targetResumeText,
      jobDescriptionText,
    });

    // 2. Run AI Augmentation / Review
    let aiReview = null;
    if (includeAiReview) {
      aiReview = await generateAiResumeReview({
        resumeText: targetResumeText,
        jdText: jobDescriptionText,
        scores: atsResult,
        missingKeywords: atsResult.missingKeywords,
      });
    }

    let savedAnalysis = null;
    let savedJd = null;

    if (req.user) {
      // If Job Description text provided, persist JD
      if (jobDescriptionText && jobDescriptionText.trim().length > 10) {
        savedJd = await prisma.jobDescription.create({
          data: {
            userId: req.user.id,
            title: jobTitle,
            company: company || null,
            rawText: jobDescriptionText,
            extractedKeywords: JSON.stringify(atsResult.jdSkillsDetected || []),
          },
        });
      }

      if (loadedResumeId) {
        savedAnalysis = await prisma.atsAnalysis.create({
          data: {
            userId: req.user.id,
            resumeId: loadedResumeId,
            jobDescriptionId: savedJd ? savedJd.id : null,
            overallScore: atsResult.overallScore,
            skillScore: atsResult.skillScore,
            formattingScore: atsResult.formattingScore,
            impactScore: atsResult.impactScore,
            experienceScore: atsResult.experienceScore,
            matchedKeywords: JSON.stringify(atsResult.matchedKeywords),
            missingKeywords: JSON.stringify(atsResult.missingKeywords),
            sectionScores: JSON.stringify(atsResult.sectionScores),
            aiSuggestions: aiReview ? JSON.stringify(aiReview) : null,
          },
        });
      }
    }

    return successResponse(
      res,
      {
        analysisId: savedAnalysis ? savedAnalysis.id : null,
        scores: {
          overall: atsResult.overallScore,
          skills: atsResult.skillScore,
          experience: atsResult.experienceScore,
          impact: atsResult.impactScore,
          formatting: atsResult.formattingScore,
          semantic: atsResult.semanticScore,
        },
        sectionScores: atsResult.sectionScores,
        matchedKeywords: atsResult.matchedKeywords,
        missingKeywords: atsResult.missingKeywords,
        metricsDetected: atsResult.metricsDetected,
        actionVerbsDetected: atsResult.actionVerbsDetected,
        wordCount: atsResult.wordCount,
        aiReview,
      },
      'ATS Analysis completed successfully.'
    );
  } catch (error) {
    next(error);
  }
};

export const getAnalysisHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [analyses, total] = await Promise.all([
      prisma.atsAnalysis.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit),
        include: {
          resume: {
            select: { fileName: true, fileType: true },
          },
          jobDescription: {
            select: { title: true, company: true },
          },
        },
      }),
      prisma.atsAnalysis.count({ where: { userId } }),
    ]);

    const formatted = analyses.map((a) => ({
      id: a.id,
      overallScore: a.overallScore,
      skillScore: a.skillScore,
      impactScore: a.impactScore,
      formattingScore: a.formattingScore,
      matchedKeywords: safeJsonParse(a.matchedKeywords, []),
      missingKeywords: safeJsonParse(a.missingKeywords, []),
      fileName: a.resume?.fileName || 'Resume',
      jobTitle: a.jobDescription?.title || 'General Position',
      company: a.jobDescription?.company || 'Company',
      createdAt: a.createdAt,
    }));

    return paginatedResponse(res, formatted, total, page, limit, 'Analysis history fetched.');
  } catch (error) {
    next(error);
  }
};
