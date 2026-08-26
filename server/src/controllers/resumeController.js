import prisma from '../config/prisma.js';
import { parseResumeBuffer } from '../services/parserService.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/apiResponse.js';

const safeJsonParse = (str, fallback = {}) => {
  if (!str) return fallback;
  if (typeof str === 'object') return str;
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
};

export const uploadAndParseResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return errorResponse(res, 'No resume file uploaded. Please upload a PDF or DOCX file.', 400);
    }

    const { originalname, buffer, mimetype, size } = req.file;

    // Parse text and extract entities
    const parsedResult = await parseResumeBuffer(buffer, originalname, mimetype);

    let savedResume = null;
    if (req.user) {
      savedResume = await prisma.resume.create({
        data: {
          userId: req.user.id,
          fileName: originalname,
          fileType: parsedResult.fileType,
          fileSize: size,
          rawText: parsedResult.rawText,
          parsedData: JSON.stringify(parsedResult.parsedData),
        },
      });
    }

    return successResponse(
      res,
      {
        resumeId: savedResume ? savedResume.id : null,
        fileName: originalname,
        fileSize: size,
        fileType: parsedResult.fileType,
        rawText: parsedResult.rawText,
        parsedData: parsedResult.parsedData,
      },
      'Resume uploaded and parsed successfully.',
      201
    );
  } catch (error) {
    next(error);
  }
};

export const getResumes = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [resumes, total] = await Promise.all([
      prisma.resume.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit),
        select: {
          id: true,
          fileName: true,
          fileType: true,
          fileSize: true,
          createdAt: true,
          analyses: {
            take: 1,
            orderBy: { createdAt: 'desc' },
            select: {
              overallScore: true,
              skillScore: true,
              createdAt: true,
            },
          },
        },
      }),
      prisma.resume.count({ where: { userId } }),
    ]);

    return paginatedResponse(res, resumes, total, page, limit, 'Resumes fetched successfully.');
  } catch (error) {
    next(error);
  }
};

export const getResumeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const resume = await prisma.resume.findFirst({
      where: { id, userId },
      include: {
        analyses: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!resume) {
      return errorResponse(res, 'Resume not found.', 404);
    }

    return successResponse(res, {
      ...resume,
      parsedData: safeJsonParse(resume.parsedData, {}),
    });
  } catch (error) {
    next(error);
  }
};

export const deleteResume = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const resume = await prisma.resume.findFirst({
      where: { id, userId },
    });

    if (!resume) {
      return errorResponse(res, 'Resume not found.', 404);
    }

    await prisma.resume.delete({ where: { id } });

    return successResponse(res, null, 'Resume deleted successfully.');
  } catch (error) {
    next(error);
  }
};
