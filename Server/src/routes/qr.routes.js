const express = require('express');
const router = express.Router();
const qrController = require('../controllers/qr.controller');
const { auth, checkRole } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const qrValidators = require('../middleware/validators/qr.validator');

/**
 * @swagger
 * /qr/visitor/{visitorId}:
 *   post:
 *     summary: Generate QR code for a visitor
 *     tags: [QR Codes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: visitorId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the visitor
 *     responses:
 *       200:
 *         description: QR code generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: QR code generated and sent to visitor's email
 *                 data:
 *                   type: object
 *                   properties:
 *                     qrCode:
 *                       type: string
 *                       description: Base64 encoded QR code image
 *                     validUntil:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: Visitor not found
 *       403:
 *         description: Unauthorized - Insufficient permissions
 */
router.post(
  '/visitor/:visitorId',
  checkRole('receptionist', 'admin'),
  qrValidators.visitorId,
  validate,
  qrController.generateVisitorQR
);

/**
 * @swagger
 * /qr/visitor/{visitorId}/checkout:
 *   post:
 *     summary: Generate check-out QR code for a visitor
 *     tags: [QR Codes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: visitorId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the visitor
 *     responses:
 *       200:
 *         description: Check-out QR code generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Check-out QR code generated and sent to visitor's email
 *                 data:
 *                   type: object
 *                   properties:
 *                     qrCode:
 *                       type: string
 *                       description: Base64 encoded QR code image
 *                     validUntil:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: Visitor not found
 *       400:
 *         description: Visitor is not checked in
 *       403:
 *         description: Unauthorized - Insufficient permissions
 */
router.post(
  '/visitor/:visitorId/checkout',
  checkRole('security', 'admin'),
  qrValidators.visitorId,
  validate,
  qrController.generateCheckOutQR
);

/**
 * @swagger
 * /qr/validate:
 *   post:
 *     summary: Validate a QR code
 *     tags: [QR Codes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - qrData
 *             properties:
 *               qrData:
 *                 type: string
 *                 description: Encrypted QR code data
 *     responses:
 *       200:
 *         description: QR code validated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       enum: [visitor, temporary]
 *                     qrType:
 *                       type: string
 *                       enum: [check-in, check-out]
 *                     visitor:
 *                       type: object
 *                       description: Visitor details (if type is visitor)
 *                     validUntil:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Invalid QR code
 *       403:
 *         description: Unauthorized - Insufficient permissions
 */
router.post(
  '/validate',
  checkRole('security', 'admin'),
  qrValidators.validateQR,
  validate,
  qrController.validateQR
);

/**
 * @swagger
 * /qr/temporary:
 *   post:
 *     summary: Generate temporary QR code
 *     tags: [QR Codes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - location
 *               - duration
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [visitor, contractor, delivery, event]
 *               location:
 *                 type: object
 *                 required:
 *                   - building
 *                 properties:
 *                   building:
 *                     type: string
 *                   floor:
 *                     type: string
 *                   room:
 *                     type: string
 *               duration:
 *                 type: integer
 *                 minimum: 15
 *                 maximum: 1440
 *                 description: Duration in minutes
 *     responses:
 *       200:
 *         description: Temporary QR code generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     qrCode:
 *                       type: string
 *                       description: Base64 encoded QR code image
 *                     validUntil:
 *                       type: string
 *                       format: date-time
 *       403:
 *         description: Unauthorized - Insufficient permissions
 */
router.post(
  '/temporary',
  checkRole('admin'),
  qrValidators.generateTemporaryQR,
  validate,
  qrController.generateTemporaryQR
);

/**
 * @swagger
 * /qr/visitor/{visitorId}/refresh:
 *   post:
 *     summary: Refresh visitor's QR code
 *     tags: [QR Codes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: visitorId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the visitor
 *     responses:
 *       200:
 *         description: QR code refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: QR code refreshed and sent to visitor's email
 *                 data:
 *                   type: object
 *                   properties:
 *                     qrCode:
 *                       type: string
 *                       description: Base64 encoded QR code image
 *                     validUntil:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: Visitor not found
 *       400:
 *         description: Visitor is not checked in
 *       403:
 *         description: Unauthorized - Insufficient permissions
 */
router.post(
  '/visitor/:visitorId/refresh',
  checkRole('security', 'admin'),
  qrValidators.visitorId,
  validate,
  qrController.refreshVisitorQR
);

module.exports = router; 