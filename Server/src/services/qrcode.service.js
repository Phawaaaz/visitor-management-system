const QRCode = require('qrcode');
const crypto = require('crypto');

class QRCodeService {
  static async generateVisitorQR(visitorData, type = 'check-in') {
    try {
      // Create a unique identifier for the QR code
      const qrId = crypto.randomBytes(16).toString('hex');
      
      // Create QR code payload
      const payload = {
        id: qrId,
        visitorId: visitorData._id.toString(),
        name: `${visitorData.firstName} ${visitorData.lastName}`,
        validUntil: visitorData.qrCodeExpiry,
        type: 'visitor',
        qrType: type // 'check-in' or 'check-out'
      };

      // Encrypt the payload
      const encryptedPayload = this.encryptPayload(payload);

      // Generate QR code
      const qrCodeImage = await QRCode.toDataURL(encryptedPayload);

      return {
        qrId,
        qrCodeImage,
        encryptedPayload,
        qrType: type
      };
    } catch (error) {
      throw new Error(`QR Code generation failed: ${error.message}`);
    }
  }

  static async validateQRCode(encryptedData) {
    try {
      // Decrypt the payload
      const payload = this.decryptPayload(encryptedData);

      // Check if QR code has expired
      if (new Date(payload.validUntil) < new Date()) {
        throw new Error('QR code has expired');
      }

      return payload;
    } catch (error) {
      throw new Error(`QR Code validation failed: ${error.message}`);
    }
  }

  static encryptPayload(payload) {
    try {
      const algorithm = 'aes-256-cbc';
      const key = Buffer.from(process.env.QR_CODE_SECRET, 'hex');
      const iv = crypto.randomBytes(16);

      const cipher = crypto.createCipheriv(algorithm, key, iv);
      let encrypted = cipher.update(JSON.stringify(payload));
      encrypted = Buffer.concat([encrypted, cipher.final()]);

      return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
    } catch (error) {
      throw new Error(`Encryption failed: ${error.message}`);
    }
  }

  static decryptPayload(encryptedData) {
    try {
      const algorithm = 'aes-256-cbc';
      const key = Buffer.from(process.env.QR_CODE_SECRET, 'hex');
      
      const [ivHex, encryptedHex] = encryptedData.split(':');
      const iv = Buffer.from(ivHex, 'hex');
      const encrypted = Buffer.from(encryptedHex, 'hex');

      const decipher = crypto.createDecipheriv(algorithm, key, iv);
      let decrypted = decipher.update(encrypted);
      decrypted = Buffer.concat([decrypted, decipher.final()]);

      return JSON.parse(decrypted.toString());
    } catch (error) {
      throw new Error(`Decryption failed: ${error.message}`);
    }
  }

  static async generateTemporaryQR(accessData) {
    try {
      const qrId = crypto.randomBytes(16).toString('hex');
      
      // Create QR code payload for temporary access
      const payload = {
        id: qrId,
        accessType: accessData.type,
        location: accessData.location,
        validUntil: new Date(Date.now() + accessData.duration * 60 * 1000), // duration in minutes
        type: 'temporary'
      };

      // Encrypt the payload
      const encryptedPayload = this.encryptPayload(payload);

      // Generate QR code
      const qrCodeImage = await QRCode.toDataURL(encryptedPayload);

      return {
        qrId,
        qrCodeImage,
        encryptedPayload,
        validUntil: payload.validUntil
      };
    } catch (error) {
      throw new Error(`Temporary QR Code generation failed: ${error.message}`);
    }
  }

  static async generateCheckOutQR(visitorData) {
    return this.generateVisitorQR(visitorData, 'check-out');
  }

  // Generate multiple QR codes for a list of visitors
  static async generateBatchQRCodes(visitors, type = 'check-in') {
    try {
      const qrCodes = await Promise.all(
        visitors.map(visitor => this.generateVisitorQR(visitor, type))
      );
      return qrCodes;
    } catch (error) {
      throw new Error(`Batch QR Code generation failed: ${error.message}`);
    }
  }

  // Generate QR code with custom styling
  static async generateStyledQR(visitorData, options = {}) {
    try {
      const qrId = crypto.randomBytes(16).toString('hex');
      
      const payload = {
        id: qrId,
        visitorId: visitorData._id.toString(),
        name: `${visitorData.firstName} ${visitorData.lastName}`,
        validUntil: visitorData.qrCodeExpiry,
        type: 'visitor',
        qrType: options.type || 'check-in'
      };

      const encryptedPayload = this.encryptPayload(payload);

      const qrOptions = {
        errorCorrectionLevel: options.errorCorrectionLevel || 'H',
        margin: options.margin || 1,
        width: options.width || 300,
        color: {
          dark: options.darkColor || '#000000',
          light: options.lightColor || '#ffffff'
        }
      };

      const qrCodeImage = await QRCode.toDataURL(encryptedPayload, qrOptions);

      return {
        qrId,
        qrCodeImage,
        encryptedPayload,
        qrType: options.type || 'check-in'
      };
    } catch (error) {
      throw new Error(`Styled QR Code generation failed: ${error.message}`);
    }
  }

  // Generate QR code with logo
  static async generateQRWithLogo(visitorData, logoPath, options = {}) {
    try {
      const qrId = crypto.randomBytes(16).toString('hex');
      
      const payload = {
        id: qrId,
        visitorId: visitorData._id.toString(),
        name: `${visitorData.firstName} ${visitorData.lastName}`,
        validUntil: visitorData.qrCodeExpiry,
        type: 'visitor',
        qrType: options.type || 'check-in'
      };

      const encryptedPayload = this.encryptPayload(payload);

      const qrOptions = {
        errorCorrectionLevel: 'H',
        margin: 1,
        width: options.width || 300,
        color: {
          dark: options.darkColor || '#000000',
          light: options.lightColor || '#ffffff'
        }
      };

      const qrCodeImage = await QRCode.toDataURL(encryptedPayload, qrOptions);

      // Here you would typically use a library like sharp or jimp to overlay the logo
      // This is a placeholder for the actual implementation
      // const finalImage = await overlayLogo(qrCodeImage, logoPath);

      return {
        qrId,
        qrCodeImage,
        encryptedPayload,
        qrType: options.type || 'check-in'
      };
    } catch (error) {
      throw new Error(`QR Code with logo generation failed: ${error.message}`);
    }
  }

  // Generate QR code with additional security features
  static async generateSecureQR(visitorData, options = {}) {
    try {
      const qrId = crypto.randomBytes(16).toString('hex');
      
      const payload = {
        id: qrId,
        visitorId: visitorData._id.toString(),
        name: `${visitorData.firstName} ${visitorData.lastName}`,
        validUntil: visitorData.qrCodeExpiry,
        type: 'visitor',
        qrType: options.type || 'check-in',
        security: {
          timestamp: Date.now(),
          nonce: crypto.randomBytes(8).toString('hex'),
          signature: this.generateSignature(visitorData._id.toString(), qrId)
        }
      };

      const encryptedPayload = this.encryptPayload(payload);

      const qrCodeImage = await QRCode.toDataURL(encryptedPayload, {
        errorCorrectionLevel: 'H',
        margin: 1,
        width: options.width || 300
      });

      return {
        qrId,
        qrCodeImage,
        encryptedPayload,
        qrType: options.type || 'check-in',
        security: payload.security
      };
    } catch (error) {
      throw new Error(`Secure QR Code generation failed: ${error.message}`);
    }
  }

  // Generate signature for secure QR codes
  static generateSignature(visitorId, qrId) {
    const secret = process.env.QR_CODE_SECRET || 'your-secret-key';
    const data = `${visitorId}:${qrId}:${Date.now()}`;
    return crypto
      .createHmac('sha256', secret)
      .update(data)
      .digest('hex');
  }

  // Verify signature for secure QR codes
  static verifySignature(payload, signature) {
    const secret = process.env.QR_CODE_SECRET || 'your-secret-key';
    const data = `${payload.visitorId}:${payload.id}:${payload.security.timestamp}`;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(data)
      .digest('hex');
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  }
}

module.exports = QRCodeService; 