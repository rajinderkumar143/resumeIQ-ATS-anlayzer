import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { cleanText, extractContactInfo, extractSkills, extractSections, extractQuantifiableMetrics } from '../utils/nlpHelpers.js';

export const parseResumeBuffer = async (fileBuffer, originalName, mimeType) => {
  let rawText = '';
  const fileExt = originalName.split('.').pop().toLowerCase();

  if (fileExt === 'pdf' || mimeType === 'application/pdf') {
    try {
      const pdfData = await pdfParse(fileBuffer);
      rawText = pdfData.text;
    } catch (err) {
      throw new Error(`Failed to parse PDF file: ${err.message}`);
    }
  } else if (fileExt === 'docx' || mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    try {
      const docxData = await mammoth.extractRawText({ buffer: fileBuffer });
      rawText = docxData.value;
    } catch (err) {
      throw new Error(`Failed to parse DOCX file: ${err.message}`);
    }
  } else if (fileExt === 'txt' || mimeType === 'text/plain') {
    rawText = fileBuffer.toString('utf-8');
  } else {
    throw new Error('Unsupported file format. Please upload a PDF or DOCX file.');
  }

  const cleanedText = cleanText(rawText);
  if (!cleanedText || cleanedText.length < 50) {
    throw new Error('Could not extract readable text. The document might be an image scan or empty.');
  }

  const contactInfo = extractContactInfo(cleanedText);
  const skillsData = extractSkills(cleanedText);
  const sections = extractSections(cleanedText);
  const metrics = extractQuantifiableMetrics(cleanedText);

  return {
    rawText: cleanedText,
    fileType: fileExt,
    parsedData: {
      contactInfo,
      skills: skillsData.all,
      categorizedSkills: skillsData.categorized,
      sections,
      metrics,
      charCount: cleanedText.length,
      wordCount: cleanedText.split(/\s+/).length,
    }
  };
};
