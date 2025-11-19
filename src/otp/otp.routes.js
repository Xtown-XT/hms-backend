import express from "express";
import { v4 as uuidv4 } from "uuid";
import { otpSessions } from "./otp.store.js";

const router = express.Router();

// Request OTP (guest enters name+phone)
router.post("/request-otp", (req, res) => {
  const { name, phone } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ error: "Name and phone are required" });
  }

  const otp = String(Math.floor(100000 + Math.random() * 900000)); 
  const sessionId = uuidv4();
  const expiresAt = Date.now() + 5 * 60 * 1000; 

  otpSessions.set(sessionId, { name, phone, otp, expiresAt });

  // Send sessionId to guest and OTP to admin
  res.json({
    sessionId,
    otpForAdmin: otp, 
  });
});

// Verify OTP (guest enters otp)
router.get("/verify-otp", (req, res) => {
  const { sessionId, otp } = req.body;

  const session = otpSessions.get(sessionId);
  if (!session) {
    return res.status(400).json({ error: "Session not found or expired" });
  }

  if (Date.now() > session.expiresAt) {
    otpSessions.delete(sessionId);
    return res.status(400).json({ error: "OTP expired" });
  }

  if (session.otp !== otp) {       
    return res.status(400).json({ error: "Invalid OTP" });
  }

  otpSessions.delete(sessionId); 
  return res.json({ success: true, redirectUrl: "/menu" });
});

export default router;
