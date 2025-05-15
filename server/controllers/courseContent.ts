import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs-extra';
import { db } from '../../db';
import { courseContents } from '../../shared/schema';
import { eq } from 'drizzle-orm';

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), 'uploads');
fs.ensureDirSync(uploadDir);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const courseId = req.params.courseId;
    const coursePath = path.join(uploadDir, `course-${courseId}`);
    fs.ensureDirSync(coursePath);
    cb(null, coursePath);
  },
  filename: function (req, file, cb) {
    // Create a unique filename using timestamp and original name
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

export const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB max file size
  }
});

export const uploadCourseContent = async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const { title, description, contentType } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    // Get file details
    const fileSize = file.size;
    const fileName = path.basename(file.originalname);
    const fileUrl = `/api/content/files/course-${courseId}/${file.filename}`;

    // Store content information in database
    const [newContent] = await db.insert(courseContents).values({
      courseId: Number(courseId),
      title,
      description: description || '',
      contentType,
      fileUrl,
      fileName,
      fileSize,
      sortOrder: 0
    }).returning();

    return res.status(201).json({
      message: 'Content uploaded successfully',
      content: newContent
    });
  } catch (error) {
    console.error('Error uploading content:', error);
    return res.status(500).json({ message: 'Failed to upload content' });
  }
};

export const getCourseContents = async (req: Request, res: Response) => {
  const { courseId } = req.params;

  try {
    const contents = await db.query.courseContents.findMany({
      where: (courseContents, { eq }) => eq(courseContents.courseId, parseInt(courseId, 10))
    });

    return res.status(200).json(contents);
  } catch (error) {
    console.error('Error fetching course contents:', error);
    return res.status(500).json({ message: 'Failed to fetch course contents' });
  }
};

export const serveContentFile = async (req: Request, res: Response) => {
  const { courseId, filename } = req.params;
  const filePath = path.join(uploadDir, `course-${courseId}`, filename);

  try {
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Determine content type
    const ext = path.extname(filePath).toLowerCase();
    let contentType = 'application/octet-stream';
    
    switch (ext) {
      case '.pdf':
        contentType = 'application/pdf';
        break;
      case '.ppt':
      case '.pptx':
        contentType = 'application/vnd.ms-powerpoint';
        break;
      case '.doc':
      case '.docx':
        contentType = 'application/msword';
        break;
      case '.mp4':
        contentType = 'video/mp4';
        break;
      case '.webm':
        contentType = 'video/webm';
        break;
    }

    res.setHeader('Content-Type', contentType);
    fs.createReadStream(filePath).pipe(res);
  } catch (error) {
    console.error('Error serving file:', error);
    return res.status(500).json({ message: 'Failed to serve file' });
  }
};

export const deleteContent = async (req: Request, res: Response) => {
  const { contentId } = req.params;

  try {
    // Get the content information
    const [content] = await db.select().from(courseContents).where(eq(courseContents.id, parseInt(contentId, 10)));
    
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    // Delete file from filesystem
    const courseId = content.courseId;
    const filename = path.basename(content.fileUrl);
    const filePath = path.join(uploadDir, `course-${courseId}`, filename);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete record from database
    await db.delete(courseContents).where(eq(courseContents.id, parseInt(contentId, 10)));

    return res.status(200).json({ message: 'Content deleted successfully' });
  } catch (error) {
    console.error('Error deleting content:', error);
    return res.status(500).json({ message: 'Failed to delete content' });
  }
};