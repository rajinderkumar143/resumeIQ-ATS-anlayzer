import prisma from '../config/prisma.js';
import {
  rewriteBulletPointWithAi,
  generateCoverLetterWithAi,
  generateInterviewPrepWithAi
} from '../services/geminiService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const rewriteBullet = async (req, res, next) => {
  try {
    const { bulletText, targetRole, skillsToHighlight } = req.body;

    if (!bulletText || bulletText.trim().length < 5) {
      return errorResponse(res, 'Please provide a valid bullet point to rewrite.', 400);
    }

    const rewritten = await rewriteBulletPointWithAi({
      originalBullet: bulletText,
      targetRole,
      skillsToHighlight: skillsToHighlight || [],
    });

    return successResponse(res, rewritten, 'Bullet point rewritten successfully.');
  } catch (error) {
    next(error);
  }
};

export const generateCoverLetter = async (req, res, next) => {
  try {
    const {
      resumeText,
      resumeId,
      jobDescriptionText,
      companyName = 'Hiring Team',
      roleTitle = 'Software Engineer',
      tone = 'professional',
    } = req.body;

    let targetResumeText = resumeText;
    if (resumeId) {
      const dbResume = await prisma.resume.findUnique({ where: { id: resumeId } });
      if (dbResume) targetResumeText = dbResume.rawText;
    }

    if (!targetResumeText) {
      return errorResponse(res, 'Please provide resume content to generate a cover letter.', 400);
    }

    const letterContent = await generateCoverLetterWithAi({
      resumeText: targetResumeText,
      jdText: jobDescriptionText,
      companyName,
      roleTitle,
      tone,
    });

    let savedLetter = null;
    if (req.user) {
      savedLetter = await prisma.coverLetter.create({
        data: {
          userId: req.user.id,
          resumeId: resumeId || null,
          title: `Cover Letter - ${roleTitle} at ${companyName}`,
          content: letterContent,
          tone,
        },
      });
    }

    return successResponse(
      res,
      {
        id: savedLetter?.id,
        content: letterContent,
        tone,
        roleTitle,
        companyName,
      },
      'Cover letter generated successfully.'
    );
  } catch (error) {
    next(error);
  }
};

export const generateInterviewPrep = async (req, res, next) => {
  try {
    const {
      resumeText,
      resumeId,
      jobDescriptionText,
      roleTitle = 'Software Engineer',
    } = req.body;

    let targetResumeText = resumeText;
    if (resumeId) {
      const dbResume = await prisma.resume.findUnique({ where: { id: resumeId } });
      if (dbResume) targetResumeText = dbResume.rawText;
    }

    if (!targetResumeText) {
      return errorResponse(res, 'Please provide resume content for interview prep generation.', 400);
    }

    const questions = await generateInterviewPrepWithAi({
      resumeText: targetResumeText,
      jdText: jobDescriptionText,
      roleTitle,
    });

    let savedPrep = null;
    if (req.user) {
      savedPrep = await prisma.interviewPrep.create({
        data: {
          userId: req.user.id,
          resumeId: resumeId || null,
          roleTitle,
          questions: JSON.stringify(questions),
        },
      });
    }

    return successResponse(
      res,
      {
        id: savedPrep?.id,
        roleTitle,
        questions,
      },
      'Interview prep generated successfully.'
    );
  } catch (error) {
    next(error);
  }
};
