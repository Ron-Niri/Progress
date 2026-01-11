import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Verify connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SMTP Connection Error:', error);
  } else {
    console.log('✅ SMTP Server is ready to take our messages');
  }
});

console.log('📧 SMTP Config initialized:', {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE,
  user: process.env.SMTP_USER,
  from: process.env.SMTP_FROM_EMAIL
});

const emailTemplates = {
  verification: (code, username) => ({
    subject: 'Verify Your Progress Account',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.6; color: #1E293B; background-color: #FBFBFA; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
          .header { background: linear-gradient(135deg, #1E293B 0%, #334155 100%); padding: 40px 30px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 600; }
          .content { padding: 40px 30px; }
          .code-box { background: #F1F1EF; border: 2px dashed #94A3B8; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0; }
          .code { font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1E293B; font-family: 'Courier New', monospace; }
          .button { display: inline-block; background: #3B82F6; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .footer { background: #F1F1EF; padding: 20px 30px; text-align: center; font-size: 12px; color: #6B7280; }
          .warning { background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 12px 16px; margin: 20px 0; border-radius: 4px; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚀 Progress</h1>
          </div>
          <div class="content">
            <h2>Welcome, ${username}!</h2>
            <p>Thank you for joining Progress. To complete your registration, please verify your email address using the code below:</p>
            
            <div class="code-box">
              <div class="code">${code}</div>
            </div>
            
            <p>This code will expire in <strong>10 minutes</strong>.</p>
            
            <div class="warning">
              ⚠️ If you didn't create an account with Progress, please ignore this email.
            </div>
            
            <p>Ready to start your journey to peak potential?</p>
            <p style="margin-top: 30px; color: #6B7280; font-size: 14px;">
              Best regards,<br>
              The Progress Team
            </p>
          </div>
          <div class="footer">
            <p>This is an automated message, please do not reply.</p>
            <p>© 2026 Progress App. Built for human potential.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  passwordReset: (code, username) => ({
    subject: 'Reset Your Progress Password',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.6; color: #1E293B; background-color: #FBFBFA; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
          .header { background: linear-gradient(135deg, #1E293B 0%, #334155 100%); padding: 40px 30px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 600; }
          .content { padding: 40px 30px; }
          .code-box { background: #F1F1EF; border: 2px dashed #94A3B8; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0; }
          .code { font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1E293B; font-family: 'Courier New', monospace; }
          .warning { background: #FEE2E2; border-left: 4px solid #EF4444; padding: 12px 16px; margin: 20px 0; border-radius: 4px; font-size: 14px; }
          .footer { background: #F1F1EF; padding: 20px 30px; text-align: center; font-size: 12px; color: #6B7280; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚀 Progress</h1>
          </div>
          <div class="content">
            <h2>Password Reset Request</h2>
            <p>Hi ${username},</p>
            <p>We received a request to reset your password. Use the code below to proceed:</p>
            
            <div class="code-box">
              <div class="code">${code}</div>
            </div>
            
            <p>This code will expire in <strong>10 minutes</strong>.</p>
            
            <div class="warning">
              🔒 If you didn't request a password reset, please ignore this email and ensure your account is secure.
            </div>
            
            <p style="margin-top: 30px; color: #6B7280; font-size: 14px;">
              Best regards,<br>
              The Progress Team
            </p>
          </div>
          <div class="footer">
            <p>This is an automated message, please do not reply.</p>
            <p>© 2026 Progress App. Built for human potential.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  welcome: (username) => ({
    subject: 'Welcome to Progress - Let\'s Get Started!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; line-height: 1.6; color: #1E293B; background-color: #FBFBFA; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
          .header { background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 40px 30px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 600; }
          .content { padding: 40px 30px; }
          .feature { margin: 20px 0; padding: 15px; background: #F1F1EF; border-radius: 8px; }
          .feature h3 { margin: 0 0 8px 0; color: #1E293B; }
          .footer { background: #F1F1EF; padding: 20px 30px; text-align: center; font-size: 12px; color: #6B7280; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to Progress!</h1>
          </div>
          <div class="content">
            <h2>You're all set, ${username}!</h2>
            <p>Your account has been verified and you're ready to start your journey to peak potential.</p>
            
            <h3 style="margin-top: 30px;">Here's what you can do:</h3>
            
            <div class="feature">
              <h3>📅 Track Daily Habits</h3>
              <p>Build consistency with our streak system and visual tracking.</p>
            </div>
            
            <div class="feature">
              <h3>🎯 Set Goals</h3>
              <p>Transform ambitions into actionable milestones with progress tracking.</p>
            </div>
            
            <div class="feature">
              <h3>📓 Reflect & Journal</h3>
              <p>Document your thoughts and track your mood throughout your journey.</p>
            </div>
            
            <div class="feature">
              <h3>📊 Analyze Progress</h3>
              <p>Visualize your growth with charts and insights.</p>
            </div>
            
            <p style="margin-top: 30px;">Ready to begin? Log in and create your first habit!</p>
            
            <p style="margin-top: 30px; color: #6B7280; font-size: 14px;">
              Best regards,<br>
              The Progress Team
            </p>
          </div>
          <div class="footer">
            <p>© 2026 Progress App. Built for human potential.</p>
          </div>
        </div>
      </body>
      </html>
    `
  })
};

export const sendEmail = async (...args) => {
  let to, subject, html, templateName;

  // Handle both: sendEmail({ to, subject, html }) AND sendEmail(to, templateName, data)
  if (args.length === 1 && typeof args[0] === 'object') {
    ({ to, subject, html } = args[0]);
    templateName = 'custom';
  } else {
    const [recipient, type, data] = args;
    to = recipient;
    templateName = type;
    
    if (emailTemplates[type]) {
      const template = emailTemplates[type](data?.code || '', data?.username || '');
      subject = template.subject;
      html = template.html;
    } else {
      throw new Error(`Invalid email template: ${type}`);
    }
  }

  console.log(`📡 Attempting to send ${templateName} email to: ${to}`);
  
  try {
    const mailOptions = {
      from: `"${process.env.SMTP_FROM_NAME || 'Progress App'}" <${process.env.SMTP_FROM_EMAIL}>`,
      to,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

export default { sendEmail };
