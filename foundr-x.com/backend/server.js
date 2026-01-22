/**
 * ✅ FOUNDR-X Secure Production Backend
 * Features:
 * - Input validation (express-validator)
 * - Helmet (security headers)
 * - Rate limit + slow-down (anti brute-force)
 * - CORS whitelist
 * - Request sanitization (safe sanitize-html)
 * - MySQL connection pool (mysql2/promise)
 * - Logging with winston + morgan
 * - Compression, small body limits
 * - Centralized error handling
 */

import express from "express";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";
import cors from "cors";
import morgan from "morgan";
import compression from "compression";
import { body, validationResult } from "express-validator";
import winston from "winston";
import fs from "fs";
import path from "path";
import sanitizeHtml from "sanitize-html";

dotenv.config();
const app = express();

/* -------------------- Logger Setup -------------------- */
const logDir = "logs";
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message, meta }) => {
      return `${timestamp} [${level}] ${message} ${meta ? JSON.stringify(meta) : ""}`;
    })
  ),
  transports: [
    new winston.transports.File({ filename: path.join(logDir, "error.log"), level: "error" }),
    new winston.transports.File({ filename: path.join(logDir, "combined.log") }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(new winston.transports.Console({ format: winston.format.simple() }));
}

/* -------------------- Middleware -------------------- */
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(compression());

// Helmet (security headers)
app.use(helmet({ contentSecurityPolicy: false }));

// ✅ CORS whitelist
const whitelist = (process.env.CORS_WHITELIST || "https://foundr-x.com,https://www.foundr-x.com")
  .split(",")
  .map(s => s.trim());

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow non-browser requests
    if (whitelist.includes(origin)) return callback(null, true);
    callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST"],
  credentials: true,
};
app.use(cors(corsOptions));

// Logging (morgan → winston)
app.use(morgan("combined", { stream: { write: msg => logger.info(msg.trim()) } }));

// ✅ Clean request body safely (instead of deprecated libs)
app.use((req, res, next) => {
  if (req.body && typeof req.body === "object") {
    for (const key in req.body) {
      if (typeof req.body[key] === "string") {
        req.body[key] = sanitizeHtml(req.body[key], {
          allowedTags: [],
          allowedAttributes: {},
        });
      }
    }
  }
  next();
});

// ✅ Rate limiting
const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 min
  max: parseInt(process.env.RATE_LIMIT_MAX || "60", 10),
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api/", apiLimiter);

// ✅ Slow-down protection
const speedLimiter = slowDown({
  windowMs: 1 * 60 * 1000,
  delayAfter: 30,
  delayMs: 500,
});
app.use("/api/", speedLimiter);

/* -------------------- Database -------------------- */
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONN_LIMIT || "10", 10),
  queueLimit: 0,
});

/* -------------------- Helpers -------------------- */
const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* -------------------- Routes -------------------- */

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Bookings route
app.post(
  "/api/bookings",
  [
    body("name").isString().trim().isLength({ min: 2, max: 200 }),
    body("email").isEmail().normalizeEmail(),
    body("phone").isString().trim().isLength({ min: 6, max: 30 }),
    body("service").optional().isString().trim().isLength({ max: 100 }),
    body("description").isString().trim().isLength({ min: 5, max: 1200 }),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn("Validation failed", { errors: errors.array() });
      return res.status(400).json({ message: "Validation failed", errors: errors.array() });
    }

    const { name, email, phone, service = "", description } = req.body;

    const sql = `
      INSERT INTO bookings (name, email, phone, service, description, created_at)
      VALUES (?, ?, ?, ?, ?, NOW())
    `;
    const [result] = await db.execute(sql, [name, email, phone, service, description]);

    logger.info("New booking created", { id: result.insertId, email });
    res.status(200).json({ message: "done", id: result.insertId });
  })
);

/* -------------------- Error Handler -------------------- */
app.use((err, req, res, next) => {
  logger.error(err.message || "Server error", {
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
    ip: req.ip,
  });

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ message: "CORS error: Not allowed." });
  }

  res.status(err.status || 500).json({
    message: process.env.NODE_ENV === "production"
      ? "Internal server error"
      : err.message,
  });
});

/* -------------------- Start Server -------------------- */
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";

app.listen(PORT, HOST, () => {
  logger.info(`✅ Server listening on ${HOST}:${PORT}`);
  console.log(`✅ Server listening on ${HOST}:${PORT}`);
});
