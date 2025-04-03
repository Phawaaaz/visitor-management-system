const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendQRCodeEmail(visitor, qrCodeImage, type = 'check-in') {
    try {
      const subject = type === 'check-in' 
        ? 'Your Visitor QR Code for Check-in'
        : 'Your Visitor QR Code for Check-out';

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
            <h2 style="color: #2c3e50; margin-bottom: 15px;">Welcome ${visitor.firstName} ${visitor.lastName}!</h2>
            <p style="color: #34495e; line-height: 1.6;">Your ${type === 'check-in' ? 'check-in' : 'check-out'} QR code is attached below.</p>
            <p style="color: #34495e; line-height: 1.6;">Please present this QR code at the security desk when you ${type === 'check-in' ? 'enter' : 'exit'} the premises.</p>
            <p style="color: #34495e; line-height: 1.6;">This QR code will expire in 24 hours.</p>
          </div>
          
          <div style="text-align: center; margin: 20px 0; padding: 20px; background-color: white; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <img src="${qrCodeImage}" alt="Visitor QR Code" style="max-width: 300px; height: auto;">
          </div>

          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-top: 20px;">
            <p style="color: #34495e; line-height: 1.6;">Important Information:</p>
            <ul style="color: #34495e; line-height: 1.6;">
              <li>Keep this QR code secure and do not share it with others</li>
              <li>The QR code is valid for 24 hours from the time of generation</li>
              <li>If you need a new QR code, please contact the reception desk</li>
            </ul>
          </div>

          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #dee2e6;">
            <p style="color: #6c757d; font-size: 14px;">If you have any questions, please contact the reception desk.</p>
            <p style="color: #6c757d; font-size: 14px;">Best regards,<br>Security Team</p>
          </div>
        </div>
      `;

      const mailOptions = {
        from: `"Security Team" <${process.env.SMTP_FROM}>`,
        to: visitor.email,
        subject: subject,
        html: html
      };

      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      throw new Error('Failed to send QR code email');
    }
  }

  async sendQRCodeRefreshEmail(visitor, qrCodeImage) {
    try {
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
            <h2 style="color: #2c3e50; margin-bottom: 15px;">QR Code Refreshed</h2>
            <p style="color: #34495e; line-height: 1.6;">Dear ${visitor.firstName} ${visitor.lastName},</p>
            <p style="color: #34495e; line-height: 1.6;">Your QR code has been refreshed as requested. Please find the new QR code below.</p>
            <p style="color: #34495e; line-height: 1.6;">This QR code will expire in 24 hours.</p>
          </div>
          
          <div style="text-align: center; margin: 20px 0; padding: 20px; background-color: white; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <img src="${qrCodeImage}" alt="Refreshed QR Code" style="max-width: 300px; height: auto;">
          </div>

          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-top: 20px;">
            <p style="color: #34495e; line-height: 1.6;">Important Information:</p>
            <ul style="color: #34495e; line-height: 1.6;">
              <li>This is your new QR code - the previous one is no longer valid</li>
              <li>The QR code is valid for 24 hours from the time of refresh</li>
              <li>If you need another refresh, please contact the security desk</li>
            </ul>
          </div>

          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #dee2e6;">
            <p style="color: #6c757d; font-size: 14px;">If you have any questions, please contact the security desk.</p>
            <p style="color: #6c757d; font-size: 14px;">Best regards,<br>Security Team</p>
          </div>
        </div>
      `;

      const mailOptions = {
        from: `"Security Team" <${process.env.SMTP_FROM}>`,
        to: visitor.email,
        subject: 'Your QR Code Has Been Refreshed',
        html: html
      };

      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      throw new Error('Failed to send QR code refresh email');
    }
  }
}

module.exports = new EmailService(); 