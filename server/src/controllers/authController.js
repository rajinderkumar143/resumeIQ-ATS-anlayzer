import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';
import prisma from '../config/prisma.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const register = async (req, res, next) => {
  try {
    const { email, password, name, targetJobTitle, preferredIndustry } = req.body;

    if (!email || !password || !name) {
      return errorResponse(res, 'Name, email, and password are required.', 400);
    }

    if (password.length < 6) {
      return errorResponse(res, 'Password must be at least 6 characters long.', 400);
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return errorResponse(res, 'An account with this email already exists.', 409);
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        passwordHash,
        name: name.trim(),
        targetJobTitle: targetJobTitle || 'Software Engineer',
        preferredIndustry: preferredIndustry || 'Technology',
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        targetJobTitle: true,
        preferredIndustry: true,
        createdAt: true,
      },
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      ENV.JWT_SECRET,
      { expiresIn: ENV.JWT_EXPIRES_IN }
    );

    return successResponse(
      res,
      { user, token },
      'Account created successfully.',
      201
    );
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 'Email and password are required.', 400);
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return errorResponse(res, 'Invalid email or password.', 401);
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return errorResponse(res, 'Invalid email or password.', 401);
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      ENV.JWT_SECRET,
      { expiresIn: ENV.JWT_EXPIRES_IN }
    );

    const userProfile = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      targetJobTitle: user.targetJobTitle,
      preferredIndustry: user.preferredIndustry,
      createdAt: user.createdAt,
    };

    return successResponse(
      res,
      { user: userProfile, token },
      'Logged in successfully.'
    );
  } catch (error) {
    next(error);
  }
};

export const demoLogin = async (req, res, next) => {
  try {
    const demoEmail = 'demo@resumeiq.ai';
    let user = await prisma.user.findUnique({
      where: { email: demoEmail },
    });

    if (!user) {
      const passwordHash = await bcrypt.hash('DemoPassword123!', 12);
      user = await prisma.user.create({
        data: {
          email: demoEmail,
          passwordHash,
          name: 'Alex Chen (Staff Engineer)',
          targetJobTitle: 'Principal Software Engineer',
          preferredIndustry: 'Cloud Infrastructure',
        },
      });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      ENV.JWT_SECRET,
      { expiresIn: ENV.JWT_EXPIRES_IN }
    );

    const userProfile = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      targetJobTitle: user.targetJobTitle,
      preferredIndustry: user.preferredIndustry,
      createdAt: user.createdAt,
    };

    return successResponse(
      res,
      { user: userProfile, token },
      'Demo session authorized.'
    );
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [user, totalResumes, totalAnalyses] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          targetJobTitle: true,
          preferredIndustry: true,
          createdAt: true,
        },
      }),
      prisma.resume.count({ where: { userId } }),
      prisma.atsAnalysis.count({ where: { userId } }),
    ]);

    return successResponse(res, {
      ...user,
      stats: {
        totalResumes,
        totalAnalyses,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, targetJobTitle, preferredIndustry } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name: name.trim() }),
        ...(targetJobTitle && { targetJobTitle: targetJobTitle.trim() }),
        ...(preferredIndustry && { preferredIndustry: preferredIndustry.trim() }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        targetJobTitle: true,
        preferredIndustry: true,
        updatedAt: true,
      },
    });

    return successResponse(res, updatedUser, 'Profile updated successfully.');
  } catch (error) {
    next(error);
  }
};
