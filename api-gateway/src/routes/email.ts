import { Router } from 'express';
import { authenticateToken, validateRequest, emailValidation } from '../middleware/validation';
import { EmailService, IMAPConfig, SMTPConfig } from '../services/imap';

const router = Router();

// Mock user email configurations - in production, this would come from database
const userEmailConfigs: Map<string, { imap: IMAPConfig; smtp: SMTPConfig }> = new Map();

// Initialize with some default configs (these would be user-specific in production)
userEmailConfigs.set('user-id', {
  imap: {
    host: 'localhost',
    port: 993,
    secure: true,
    auth: {
      user: 'user@oxlas.com',
      pass: 'password',
    },
  },
  smtp: {
    host: 'localhost',
    port: 587,
    secure: false,
    auth: {
      user: 'user@oxlas.com',
      pass: 'password',
    },
  },
});

// Get email service for user
const getEmailService = (userId: string): EmailService | null => {
  const config = userEmailConfigs.get(userId);
  if (!config) return null;
  
  return new EmailService(config.imap, config.smtp);
};

// Get all emails for user
router.get('/', authenticateToken, async (req, res) => {
  const userId = (req as any).user.id;
  const emailService = getEmailService(userId);
  
  if (!emailService) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Email configuration not found'
    });
  }

  try {
    await emailService.connect();
    const messages = await emailService.getInboxMessages(50);
    await emailService.disconnect();
    
    res.json({
      success: true,
      emails: messages
    });
  } catch (error) {
    console.error('Email fetch error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch emails'
    });
  }
});

// Get single email
router.get('/:id', authenticateToken, async (req, res) => {
  const userId = (req as any).user.id;
  const emailId = req.params.id;
  
  const emailService = getEmailService(userId);
  if (!emailService) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Email configuration not found'
    });
  }

  try {
    await emailService.connect();
    
    // Parse emailId to get folder and uid (format: "folder:uid")
    const [folder, uidStr] = emailId.split(':');
    const uid = parseInt(uidStr);
    
    if (!folder || isNaN(uid)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid email ID format'
      });
    }
    
    const email = await emailService.getMessage(folder, uid);
    await emailService.disconnect();
    
    res.json({
      success: true,
      email
    });
  } catch (error) {
    console.error('Email fetch error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch email'
    });
  }
});

// Send email
router.post('/send', authenticateToken, emailValidation, validateRequest, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { to, subject, body, cc, bcc, attachments } = req.body;
    
    const emailService = getEmailService(userId);
    if (!emailService) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Email configuration not found'
      });
    }

    const result = await emailService.sendEmail({
      to,
      cc,
      bcc,
      subject,
      text: body,
      html: body.replace(/\n/g, '<br>'), // Simple text to HTML conversion
      attachments,
    });
    
    if (result.success) {
      res.status(201).json({
        success: true,
        message: 'Email sent successfully',
        messageId: result.messageId
      });
    } else {
      res.status(500).json({
        error: 'Internal Server Error',
        message: result.error || 'Failed to send email'
      });
    }
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to send email'
    });
  }
});

// Mark email as read
router.put('/:id/read', authenticateToken, async (req, res) => {
  const userId = (req as any).user.id;
  const emailId = req.params.id;
  
  const emailService = getEmailService(userId);
  if (!emailService) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Email configuration not found'
    });
  }

  try {
    await emailService.connect();
    
    const [folder, uidStr] = emailId.split(':');
    const uid = parseInt(uidStr);
    
    if (!folder || isNaN(uid)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid email ID format'
      });
    }
    
    await emailService.markAsRead(folder, uid);
    await emailService.disconnect();
    
    res.json({
      success: true,
      message: 'Email marked as read'
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to mark email as read'
    });
  }
});

// Star/unstar email
router.put('/:id/star', authenticateToken, async (req, res) => {
  const userId = (req as any).user.id;
  const emailId = req.params.id;
  const { star } = req.body; // true to star, false to unstar
  
  const emailService = getEmailService(userId);
  if (!emailService) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Email configuration not found'
    });
  }

  try {
    await emailService.connect();
    
    const [folder, uidStr] = emailId.split(':');
    const uid = parseInt(uidStr);
    
    if (!folder || isNaN(uid)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid email ID format'
      });
    }
    
    if (star) {
      await emailService.starMessage(folder, uid);
    } else {
      await emailService.unstarMessage(folder, uid);
    }
    
    await emailService.disconnect();
    
    res.json({
      success: true,
      message: star ? 'Email starred' : 'Email unstarred'
    });
  } catch (error) {
    console.error('Star/unstar error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to star/unstar email'
    });
  }
});

// Move email to folder
router.put('/:id/folder', authenticateToken, async (req, res) => {
  const userId = (req as any).user.id;
  const emailId = req.params.id;
  const { folder: destFolder } = req.body;
  
  const emailService = getEmailService(userId);
  if (!emailService) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Email configuration not found'
    });
  }

  try {
    await emailService.connect();
    
    const [folder, uidStr] = emailId.split(':');
    const uid = parseInt(uidStr);
    
    if (!folder || isNaN(uid)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid email ID format'
      });
    }
    
    await emailService.moveMessage(folder, uid, destFolder);
    await emailService.disconnect();
    
    res.json({
      success: true,
      message: `Email moved to ${destFolder}`
    });
  } catch (error) {
    console.error('Move email error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to move email'
    });
  }
});

// Delete email
router.delete('/:id', authenticateToken, async (req, res) => {
  const userId = (req as any).user.id;
  const emailId = req.params.id;
  
  const emailService = getEmailService(userId);
  if (!emailService) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Email configuration not found'
    });
  }

  try {
    await emailService.connect();
    
    const [folder, uidStr] = emailId.split(':');
    const uid = parseInt(uidStr);
    
    if (!folder || isNaN(uid)) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid email ID format'
      });
    }
    
    await emailService.deleteMessage(folder, uid);
    await emailService.disconnect();
    
    res.json({
      success: true,
      message: 'Email deleted successfully'
    });
  } catch (error) {
    console.error('Delete email error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete email'
    });
  }
});

// Get emails by folder
router.get('/folder/:folder', authenticateToken, async (req, res) => {
  const userId = (req as any).user.id;
  const folder = req.params.folder;
  
  const emailService = getEmailService(userId);
  if (!emailService) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Email configuration not found'
    });
  }

  try {
    await emailService.connect();
    const messages = await emailService.getFolderMessages(folder, 50);
    await emailService.disconnect();
    
    res.json({
      success: true,
      emails: messages
    });
  } catch (error) {
    console.error('Folder emails fetch error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch folder emails'
    });
  }
});

// Get unread emails
router.get('/unread', authenticateToken, async (req, res) => {
  const userId = (req as any).user.id;
  
  const emailService = getEmailService(userId);
  if (!emailService) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Email configuration not found'
    });
  }

  try {
    await emailService.connect();
    const messages = await emailService.getUnreadMessages();
    await emailService.disconnect();
    
    res.json({
      success: true,
      emails: messages
    });
  } catch (error) {
    console.error('Unread emails fetch error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch unread emails'
    });
  }
});

// Get starred emails
router.get('/starred', authenticateToken, async (req, res) => {
  const userId = (req as any).user.id;
  
  const emailService = getEmailService(userId);
  if (!emailService) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Email configuration not found'
    });
  }

  try {
    await emailService.connect();
    const messages = await emailService.getStarredMessages();
    await emailService.disconnect();
    
    res.json({
      success: true,
      emails: messages
    });
  } catch (error) {
    console.error('Starred emails fetch error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch starred emails'
    });
  }
});

// Search emails
router.get('/search/:query', authenticateToken, async (req, res) => {
  const userId = (req as any).user.id;
  const query = req.params.query;
  
  const emailService = getEmailService(userId);
  if (!emailService) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Email configuration not found'
    });
  }

  try {
    await emailService.connect();
    const messages = await emailService.searchMessages('INBOX', query);
    await emailService.disconnect();
    
    res.json({
      success: true,
      emails: messages
    });
  } catch (error) {
    console.error('Email search error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to search emails'
    });
  }
});

// Get email folders
router.get('/folders', authenticateToken, async (req, res) => {
  const userId = (req as any).user.id;
  
  const emailService = getEmailService(userId);
  if (!emailService) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Email configuration not found'
    });
  }

  try {
    await emailService.connect();
    const folders = await emailService.getFolders();
    await emailService.disconnect();
    
    res.json({
      success: true,
      folders
    });
  } catch (error) {
    console.error('Folders fetch error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch folders'
    });
  }
});

export default router;