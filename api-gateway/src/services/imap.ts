import Imap from 'imap';
import { simpleParser } from 'mailparser';
import { createTransport } from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';

export interface EmailMessage {
  id: string;
  uid: number;
  messageId: string;
  subject: string;
  from: { name: string; address: string };
  to: Array<{ name: string; address: string }>;
  cc?: Array<{ name: string; address: string }>;
  bcc?: Array<{ name: string; address: string }>;
  date: Date;
  body: string;
  html?: string;
  attachments: Array<{
    filename: string;
    contentType: string;
    size: number;
    contentId?: string;
  }>;
  flags: string[];
  labels: string[];
  folder: string;
  size: number;
}

export interface IMAPConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export interface SMTPConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export class ImapService {
  private imap: Imap;
  private config: IMAPConfig;
  private isConnected: boolean = false;

  constructor(config: IMAPConfig) {
    this.config = config;
    this.imap = new Imap({
      ...config,
      connTimeout: 10000,
      authTimeout: 5000,
    });
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.imap.once('ready', () => {
        this.isConnected = true;
        resolve();
      });

      this.imap.once('error', (err) => {
        reject(err);
      });

      this.imap.connect();
    });
  }

  async disconnect(): Promise<void> {
    if (this.isConnected) {
      this.imap.end();
      this.isConnected = false;
    }
  }

  async listFolders(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.imap.getBoxes((err, boxes) => {
        if (err) {
          reject(err);
          return;
        }

        const folders: string[] = [];
        const traverse = (box: any, path: string = '') => {
          const currentPath = path ? `${path}${box.attribs.includes('\\Noselect') ? '' : '/'}` : '';
          if (!box.attribs.includes('\\Noselect')) {
            folders.push(currentPath + box.name);
          }
          if (box.children) {
            Object.keys(box.children).forEach(childName => {
              traverse(box.children[childName], currentPath + box.name);
            });
          }
        };

        traverse(boxes);
        resolve(folders);
      });
    });
  }

  async searchMessages(folder: string, criteria: any[]): Promise<number[]> {
    return new Promise((resolve, reject) => {
      this.imap.openBox(folder, false, (err, box) => {
        if (err) {
          reject(err);
          return;
        }

        this.imap.search(criteria, (err, uids) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(uids);
        });
      });
    });
  }

  async getMessage(folder: string, uid: number): Promise<EmailMessage> {
    return new Promise((resolve, reject) => {
      this.imap.openBox(folder, false, (err, box) => {
        if (err) {
          reject(err);
          return;
        }

        const fetch = this.imap.fetch(uid, {
          bodies: '',
          struct: true,
        });

        fetch.on('message', (msg, seqno) => {
          let buffer = '';
          let attributes: any;

          msg.on('body', (stream, info) => {
            stream.on('data', (chunk) => {
              buffer += chunk.toString('utf8');
            });
          });

          msg.once('attributes', (attrs) => {
            attributes = attrs;
          });

          msg.once('end', async () => {
            try {
              const parsed = await simpleParser(buffer);
              const email: EmailMessage = {
                id: uuidv4(),
                uid,
                messageId: parsed.messageId || '',
                subject: parsed.subject || '',
                from: {
                  name: parsed.from?.value[0]?.name || '',
                  address: parsed.from?.value[0]?.address || '',
                },
                to: (parsed.to?.value || []).map(addr => ({
                  name: addr.name || '',
                  address: addr.address || '',
                })),
                cc: (parsed.cc?.value || []).map(addr => ({
                  name: addr.name || '',
                  address: addr.address || '',
                })),
                bcc: (parsed.bcc?.value || []).map(addr => ({
                  name: addr.name || '',
                  address: addr.address || '',
                })),
                date: parsed.date || new Date(),
                body: parsed.text || '',
                html: parsed.html || '',
                attachments: (parsed.attachments || []).map(att => ({
                  filename: att.filename || '',
                  contentType: att.contentType || '',
                  size: att.size || 0,
                  contentId: att.contentId,
                })),
                flags: attributes.flags || [],
                labels: [],
                folder,
                size: buffer.length,
              };

              resolve(email);
            } catch (error) {
              reject(error);
            }
          });
        });

        fetch.once('error', reject);
        fetch.once('end', () => {
          // All messages processed
        });
      });
    });
  }

  async getMessages(folder: string, uids: number[]): Promise<EmailMessage[]> {
    const messages: EmailMessage[] = [];
    
    for (const uid of uids) {
      try {
        const message = await this.getMessage(folder, uid);
        messages.push(message);
      } catch (error) {
        console.error(`Failed to fetch message ${uid}:`, error);
      }
    }

    return messages;
  }

  async getRecentMessages(folder: string, limit: number = 20): Promise<EmailMessage[]> {
    try {
      const uids = await this.searchMessages(folder, ['ALL']);
      const recentUids = uids.slice(-limit);
      return await this.getMessages(folder, recentUids);
    } catch (error) {
      console.error('Failed to get recent messages:', error);
      return [];
    }
  }

  async getUnreadMessages(folder: string): Promise<EmailMessage[]> {
    try {
      const uids = await this.searchMessages(folder, ['UNSEEN']);
      return await this.getMessages(folder, uids);
    } catch (error) {
      console.error('Failed to get unread messages:', error);
      return [];
    }
  }

  async getStarredMessages(folder: string): Promise<EmailMessage[]> {
    try {
      const uids = await this.searchMessages(folder, ['FLAGGED']);
      return await this.getMessages(folder, uids);
    } catch (error) {
      console.error('Failed to get starred messages:', error);
      return [];
    }
  }

  async addFlags(folder: string, uid: number, flags: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      this.imap.openBox(folder, false, (err) => {
        if (err) {
          reject(err);
          return;
        }

        this.imap.addFlags(uid, flags, (err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        });
      });
    });
  }

  async removeFlags(folder: string, uid: number, flags: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      this.imap.openBox(folder, false, (err) => {
        if (err) {
          reject(err);
          return;
        }

        this.imap.delFlags(uid, flags, (err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        });
      });
    });
  }

  async moveMessage(folder: string, uid: number, destFolder: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.imap.openBox(folder, false, (err) => {
        if (err) {
          reject(err);
          return;
        }

        this.imap.move(uid, destFolder, (err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        });
      });
    });
  }

  async deleteMessage(folder: string, uid: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.imap.openBox(folder, false, (err) => {
        if (err) {
          reject(err);
          return;
        }

        this.imap.addFlags(uid, ['\\Deleted'], (err) => {
          if (err) {
            reject(err);
            return;
          }

          this.imap.expunge((err) => {
            if (err) {
              reject(err);
              return;
            }
            resolve();
          });
        });
      });
    });
  }
}

export class SmtpService {
  private transporter: any;

  constructor(config: SMTPConfig) {
    this.transporter = createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: config.auth,
    });
  }

  async sendEmail(options: {
    to: string | string[];
    cc?: string | string[];
    bcc?: string | string[];
    subject: string;
    text?: string;
    html?: string;
    attachments?: Array<{
      filename: string;
      content: Buffer | string;
      contentType?: string;
    }>;
  }): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const result = await this.transporter.sendMail({
        from: this.transporter.options.auth.user,
        to: options.to,
        cc: options.cc,
        bcc: options.bcc,
        subject: options.subject,
        text: options.text,
        html: options.html,
        attachments: options.attachments,
      });

      return {
        success: true,
        messageId: result.messageId,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

export class EmailService {
  private imapService: ImapService;
  private smtpService: SmtpService;

  constructor(imapConfig: IMAPConfig, smtpConfig: SMTPConfig) {
    this.imapService = new ImapService(imapConfig);
    this.smtpService = new SmtpService(smtpConfig);
  }

  async connect(): Promise<void> {
    await this.imapService.connect();
  }

  async disconnect(): Promise<void> {
    await this.imapService.disconnect();
  }

  async getFolders(): Promise<string[]> {
    return await this.imapService.listFolders();
  }

  async getInboxMessages(limit: number = 20): Promise<EmailMessage[]> {
    return await this.imapService.getRecentMessages('INBOX', limit);
  }

  async getUnreadMessages(): Promise<EmailMessage[]> {
    return await this.imapService.getUnreadMessages('INBOX');
  }

  async getStarredMessages(): Promise<EmailMessage[]> {
    return await this.imapService.getStarredMessages('INBOX');
  }

  async getFolderMessages(folder: string, limit: number = 20): Promise<EmailMessage[]> {
    return await this.imapService.getRecentMessages(folder, limit);
  }

  async getMessage(folder: string, uid: number): Promise<EmailMessage> {
    return await this.imapService.getMessage(folder, uid);
  }

  async markAsRead(folder: string, uid: number): Promise<void> {
    await this.imapService.addFlags(folder, uid, ['\\Seen']);
  }

  async markAsUnread(folder: string, uid: number): Promise<void> {
    await this.imapService.removeFlags(folder, uid, ['\\Seen']);
  }

  async starMessage(folder: string, uid: number): Promise<void> {
    await this.imapService.addFlags(folder, uid, ['\\Flagged']);
  }

  async unstarMessage(folder: string, uid: number): Promise<void> {
    await this.imapService.removeFlags(folder, uid, ['\\Flagged']);
  }

  async moveMessage(folder: string, uid: number, destFolder: string): Promise<void> {
    await this.imapService.moveMessage(folder, uid, destFolder);
  }

  async deleteMessage(folder: string, uid: number): Promise<void> {
    await this.imapService.deleteMessage(folder, uid);
  }

  async sendEmail(options: {
    to: string | string[];
    cc?: string | string[];
    bcc?: string | string[];
    subject: string;
    text?: string;
    html?: string;
    attachments?: Array<{
      filename: string;
      content: Buffer | string;
      contentType?: string;
    }>;
  }): Promise<{ success: boolean; messageId?: string; error?: string }> {
    return await this.smtpService.sendEmail(options);
  }

  async searchMessages(folder: string, query: string): Promise<EmailMessage[]> {
    try {
      // Simple search implementation - in production, you'd want more sophisticated search
      const uids = await this.imapService.searchMessages(folder, ['ALL']);
      const messages = await this.imapService.getMessages(folder, uids);
      
      return messages.filter(message => 
        message.subject.toLowerCase().includes(query.toLowerCase()) ||
        message.body.toLowerCase().includes(query.toLowerCase()) ||
        message.from.address.toLowerCase().includes(query.toLowerCase())
      );
    } catch (error) {
      console.error('Failed to search messages:', error);
      return [];
    }
  }
}