import prisma from '../config/prisma.js';
import { successResponse } from '../utils/apiResponse.js';

export const getDashboardAnalytics = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [resumes, analyses] = await Promise.all([
      prisma.resume.findMany({
        where: { userId },
        select: { id: true, fileName: true, createdAt: true, parsedData: true },
      }),
      prisma.atsAnalysis.findMany({
        where: { userId },
        orderBy: { createdAt: 'asc' },
        select: {
          id: true,
          overallScore: true,
          skillScore: true,
          impactScore: true,
          formattingScore: true,
          experienceScore: true,
          matchedKeywords: true,
          missingKeywords: true,
          createdAt: true,
        },
      }),
    ]);

    const totalAnalyses = analyses.length;
    const totalResumes = resumes.length;

    let avgScore = 0;
    let maxScore = 0;
    let scoreProgression = [];
    const missingSkillCounts = {};
    const skillCategoryCounts = {
      Frontend: 0,
      Backend: 0,
      Database: 0,
      'DevOps & Cloud': 0,
      'AI & Data': 0,
      Testing: 0,
    };

    if (totalAnalyses > 0) {
      const sum = analyses.reduce((acc, a) => acc + a.overallScore, 0);
      avgScore = Math.round(sum / totalAnalyses);
      maxScore = Math.round(Math.max(...analyses.map((a) => a.overallScore)));

      scoreProgression = analyses.map((a, idx) => ({
        scanNumber: `Scan #${idx + 1}`,
        date: new Date(a.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        overallScore: Math.round(a.overallScore),
        skillScore: Math.round(a.skillScore),
        impactScore: Math.round(a.impactScore),
      }));

      // Calculate missing keywords frequency
      analyses.forEach((a) => {
        try {
          const missing = JSON.parse(a.missingKeywords || '[]');
          missing.forEach((kw) => {
            missingSkillCounts[kw] = (missingSkillCounts[kw] || 0) + 1;
          });
        } catch {
          // ignore parsing error
        }
      });
    }

    // Parse resume skills to compute category distributions
    resumes.forEach((r) => {
      try {
        const parsed = JSON.parse(r.parsedData || '{}');
        const cats = parsed.categorizedSkills || {};
        if (cats.frontend?.length) skillCategoryCounts.Frontend += cats.frontend.length;
        if (cats.backend?.length) skillCategoryCounts.Backend += cats.backend.length;
        if (cats.database?.length) skillCategoryCounts.Database += cats.database.length;
        if (cats.devops_cloud?.length) skillCategoryCounts['DevOps & Cloud'] += cats.devops_cloud.length;
        if (cats.ai_data?.length) skillCategoryCounts['AI & Data'] += cats.ai_data.length;
        if (cats.testing_quality?.length) skillCategoryCounts.Testing += cats.testing_quality.length;
      } catch {
        // ignore
      }
    });

    const topMissingSkills = Object.entries(missingSkillCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([skill, count]) => ({ skill, count }));

    const categoryDistribution = Object.entries(skillCategoryCounts).map(([category, count]) => ({
      category,
      count,
      fullMark: 20,
    }));

    return successResponse(
      res,
      {
        summary: {
          totalResumes,
          totalAnalyses,
          avgScore: avgScore || 0,
          maxScore: maxScore || 0,
        },
        scoreProgression,
        categoryDistribution,
        topMissingSkills,
      },
      'Dashboard analytics fetched successfully.'
    );
  } catch (error) {
    next(error);
  }
};
