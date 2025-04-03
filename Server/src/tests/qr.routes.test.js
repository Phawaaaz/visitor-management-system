const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/user.model');
const Visitor = require('../models/visitor.model');
const QRCode = require('../models/qrcode.model');
const jwt = require('jsonwebtoken');

describe('QR Code Routes', () => {
  let adminToken;
  let receptionistToken;
  let securityToken;
  let testVisitor;
  let testQRCode;

  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/visitor-management-test');

    // Create test users
    const admin = await User.create({
      email: 'admin@test.com',
      password: 'password123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin'
    });

    const receptionist = await User.create({
      email: 'receptionist@test.com',
      password: 'password123',
      firstName: 'Receptionist',
      lastName: 'User',
      role: 'receptionist'
    });

    const security = await User.create({
      email: 'security@test.com',
      password: 'password123',
      firstName: 'Security',
      lastName: 'User',
      role: 'security'
    });

    // Create test visitor
    testVisitor = await Visitor.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '1234567890',
      purpose: 'Meeting',
      host: admin._id
    });

    // Create test QR code
    testQRCode = await QRCode.create({
      visitor: testVisitor._id,
      type: 'visitor',
      data: 'test-qr-data',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
    });

    // Generate tokens
    adminToken = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET);
    receptionistToken = jwt.sign({ id: receptionist._id, role: receptionist.role }, process.env.JWT_SECRET);
    securityToken = jwt.sign({ id: security._id, role: security.role }, process.env.JWT_SECRET);
  });

  afterAll(async () => {
    // Clean up test data
    await User.deleteMany({});
    await Visitor.deleteMany({});
    await QRCode.deleteMany({});
    await mongoose.connection.close();
  });

  describe('POST /api/qr/visitor/:visitorId', () => {
    it('should generate QR code for visitor (admin)', async () => {
      const response = await request(app)
        .post(`/api/qr/visitor/${testVisitor._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('qrCode');
      expect(response.body).toHaveProperty('validUntil');
    });

    it('should generate QR code for visitor (receptionist)', async () => {
      const response = await request(app)
        .post(`/api/qr/visitor/${testVisitor._id}`)
        .set('Authorization', `Bearer ${receptionistToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('qrCode');
      expect(response.body).toHaveProperty('validUntil');
    });

    it('should not generate QR code for non-existent visitor', async () => {
      const response = await request(app)
        .post('/api/qr/visitor/507f1f77bcf86cd799439011')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
    });

    it('should not allow security to generate QR codes', async () => {
      const response = await request(app)
        .post(`/api/qr/visitor/${testVisitor._id}`)
        .set('Authorization', `Bearer ${securityToken}`);

      expect(response.status).toBe(403);
    });
  });

  describe('POST /api/qr/validate', () => {
    it('should validate QR code (security)', async () => {
      const response = await request(app)
        .post('/api/qr/validate')
        .set('Authorization', `Bearer ${securityToken}`)
        .send({ qrData: testQRCode.data });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('valid', true);
      expect(response.body).toHaveProperty('visitor');
    });

    it('should validate QR code (admin)', async () => {
      const response = await request(app)
        .post('/api/qr/validate')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ qrData: testQRCode.data });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('valid', true);
      expect(response.body).toHaveProperty('visitor');
    });

    it('should reject invalid QR code', async () => {
      const response = await request(app)
        .post('/api/qr/validate')
        .set('Authorization', `Bearer ${securityToken}`)
        .send({ qrData: 'invalid-qr-data' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('valid', false);
    });

    it('should reject expired QR code', async () => {
      // Create expired QR code
      const expiredQR = await QRCode.create({
        visitor: testVisitor._id,
        type: 'visitor',
        data: 'expired-qr-data',
        expiresAt: new Date(Date.now() - 1000) // Expired 1 second ago
      });

      const response = await request(app)
        .post('/api/qr/validate')
        .set('Authorization', `Bearer ${securityToken}`)
        .send({ qrData: expiredQR.data });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('valid', false);
      expect(response.body.message).toContain('expired');
    });
  });

  describe('POST /api/qr/temporary', () => {
    it('should generate temporary QR code (admin)', async () => {
      const response = await request(app)
        .post('/api/qr/temporary')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          type: 'contractor',
          location: {
            building: 'Main Building',
            floor: '1st Floor',
            room: '101'
          },
          duration: 60
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('qrCode');
      expect(response.body).toHaveProperty('validUntil');
    });

    it('should not allow non-admin to generate temporary QR codes', async () => {
      const response = await request(app)
        .post('/api/qr/temporary')
        .set('Authorization', `Bearer ${receptionistToken}`)
        .send({
          type: 'contractor',
          location: {
            building: 'Main Building',
            floor: '1st Floor',
            room: '101'
          },
          duration: 60
        });

      expect(response.status).toBe(403);
    });

    it('should validate temporary QR code', async () => {
      const tempQR = await QRCode.create({
        type: 'contractor',
        data: 'temp-qr-data',
        location: {
          building: 'Main Building',
          floor: '1st Floor',
          room: '101'
        },
        expiresAt: new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now
      });

      const response = await request(app)
        .post('/api/qr/validate')
        .set('Authorization', `Bearer ${securityToken}`)
        .send({ qrData: tempQR.data });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('valid', true);
      expect(response.body).toHaveProperty('type', 'contractor');
      expect(response.body).toHaveProperty('location');
    });
  });

  describe('POST /api/qr/visitor/:visitorId/refresh', () => {
    it('should refresh visitor QR code (security)', async () => {
      const response = await request(app)
        .post(`/api/qr/visitor/${testVisitor._id}/refresh`)
        .set('Authorization', `Bearer ${securityToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('qrCode');
      expect(response.body).toHaveProperty('validUntil');
    });

    it('should refresh visitor QR code (admin)', async () => {
      const response = await request(app)
        .post(`/api/qr/visitor/${testVisitor._id}/refresh`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('qrCode');
      expect(response.body).toHaveProperty('validUntil');
    });

    it('should not allow receptionist to refresh QR codes', async () => {
      const response = await request(app)
        .post(`/api/qr/visitor/${testVisitor._id}/refresh`)
        .set('Authorization', `Bearer ${receptionistToken}`);

      expect(response.status).toBe(403);
    });

    it('should not refresh QR code for non-existent visitor', async () => {
      const response = await request(app)
        .post('/api/qr/visitor/507f1f77bcf86cd799439011/refresh')
        .set('Authorization', `Bearer ${securityToken}`);

      expect(response.status).toBe(404);
    });
  });
}); 