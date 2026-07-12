const express = require('express');
const { z } = require('zod');

const authController = require('../services/authController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/signup', async (req, res, next) => {
  try {
    const bodySchema = z.object({ email: z.string().email(), password: z.string().min(8) });
    const body = bodySchema.parse(req.body);
    const out = await authController.signup(body.email, body.password);
    return res.status(201).json(out);
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const bodySchema = z.object({ email: z.string().email(), password: z.string().min(1) });
    const body = bodySchema.parse(req.body);
    const out = await authController.login(body.email, body.password);
    return res.status(200).json(out);
  } catch (err) {
    next(err);
  }
});

router.post('/forgot-password', async (req, res, next) => {
  try {
    const bodySchema = z.object({ email: z.string().email() });
    const body = bodySchema.parse(req.body);
    const out = await authController.forgotPassword(body.email);
    return res.status(200).json(out);
  } catch (err) {
    next(err);
  }
});

router.post('/reset-password', async (req, res, next) => {
  try {
    const bodySchema = z.object({
      token: z.string().min(10),
      newPassword: z.string().min(8)
    });
    const body = bodySchema.parse(req.body);
    const out = await authController.resetPassword(body.token, body.newPassword);
    return res.status(200).json(out);
  } catch (err) {
    next(err);
  }
});

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const out = await authController.me(req.auth.userId);
    return res.status(200).json(out);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

