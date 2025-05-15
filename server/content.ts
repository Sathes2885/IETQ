import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';

// Store content in a local file
const CONTENT_FILE = path.join(process.cwd(), 'content-data.json');

// Initialize content if file doesn't exist
if (!fs.existsSync(CONTENT_FILE)) {
  const initialContent = {
    pages: [
      {
        id: 'home',
        title: 'Home Page',
        path: '/',
        elements: [
          {
            id: 'header-1',
            type: 'header',
            content: "India's Emerging Talent Quest",
            styles: { fontSize: '36px', fontWeight: 'bold', textAlign: 'center' }
          },
          {
            id: 'subtitle-1',
            type: 'text',
            content: "Discover, Develop, Dazzle - Get Ready for the Ultimate Student Challenge!",
            styles: { fontSize: '18px', textAlign: 'center', marginBottom: '24px' }
          },
          {
            id: 'image-1',
            type: 'image',
            content: "/competition-banner.jpg",
            styles: { width: '100%', borderRadius: '8px' }
          },
          {
            id: 'text-1',
            type: 'text',
            content: "Welcome to India's premier virtual talent platform for grades 1-10. Compete, learn, and grow with courses and competitions designed to unlock your potential!",
            styles: { margin: '24px 0' }
          },
          {
            id: 'button-1',
            type: 'button',
            content: "Register Now",
            styles: { backgroundColor: '#4f46e5', color: 'white', padding: '12px 24px', borderRadius: '4px' }
          }
        ]
      },
      {
        id: 'about',
        title: 'About Us',
        path: '/about',
        elements: [
          {
            id: 'header-1',
            type: 'header',
            content: "About IETQ",
            styles: { fontSize: '32px', fontWeight: 'bold' }
          },
          {
            id: 'text-1',
            type: 'text',
            content: "IETQ (India's Emerging Talent Quest) is a nationwide virtual platform for students in grades 1-10.",
            styles: { margin: '16px 0' }
          }
        ]
      }
    ],
    activePageId: 'home',
    lastUpdated: new Date().toISOString()
  };
  
  fs.writeFileSync(CONTENT_FILE, JSON.stringify(initialContent, null, 2));
}

// Get content
export const getContent = (req: Request, res: Response) => {
  try {
    if (!fs.existsSync(CONTENT_FILE)) {
      return res.status(404).json({ error: 'Content not found' });
    }
    
    const content = JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf-8'));
    return res.status(200).json(content);
  } catch (error) {
    console.error('Error getting content:', error);
    return res.status(500).json({ error: 'Failed to get content' });
  }
};

// Save content
export const saveContent = (req: Request, res: Response) => {
  try {
    const content = req.body;
    
    // Add timestamp
    content.lastUpdated = new Date().toISOString();
    
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2));
    
    return res.status(200).json({ 
      success: true, 
      message: 'Content saved successfully',
      timestamp: content.lastUpdated
    });
  } catch (error) {
    console.error('Error saving content:', error);
    return res.status(500).json({ error: 'Failed to save content' });
  }
};

// Get specific page content by ID
export const getPageContent = (req: Request, res: Response) => {
  try {
    const { pageId } = req.params;
    
    if (!fs.existsSync(CONTENT_FILE)) {
      return res.status(404).json({ error: 'Content not found' });
    }
    
    const content = JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf-8'));
    const page = content.pages.find((p: any) => p.id === pageId);
    
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }
    
    return res.status(200).json(page);
  } catch (error) {
    console.error('Error getting page content:', error);
    return res.status(500).json({ error: 'Failed to get page content' });
  }
};