// promaster-backend/server.js
import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { Sequelize, DataTypes } from 'sequelize';
import Joi from 'joi';
import sanitizeHtml from 'sanitize-html';


const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST || 'localhost';
const PORT = process.env.PORT || 4100;


const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'mysql',
  logging: false,
  define: { timestamps: true }
});


const Lead = sequelize.define('Lead', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  firstName: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(100), allowNull: false },
  phone: { type: DataTypes.STRING(30), allowNull: false },
  service: { type: DataTypes.STRING(100), allowNull: false },
  notes: { type: DataTypes.TEXT, allowNull: true },
  branch: { type: DataTypes.ENUM('ALMANAR','ALREAD','ALREMAL','JADEH'), allowNull: false }
}, { tableName: 'Leads' });


const leadSchema = Joi.object({
  firstName: Joi.string().max(100).required(),
  email: Joi.string().email().max(100).required(),
  phone: Joi.string().pattern(/^[0-9+()-\s]{5,30}$/).required(),
  branch: Joi.string().valid('ALMANAR','ALREAD','ALREMAL','JADEH').required(),
  service: Joi.string().max(100).required(),
  notes: Joi.string().max(1000).allow('', null)
});


const app = express();


app.use(helmet());


app.use(bodyParser.json({ limit: '10kb' }));


app.use(cors({
  origin: ['https://promaster.sa'],
  methods: ['POST', 'GET', 'OPTIONS']
}));


const limiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 10,
  message: { message: 'Too many requests, please try again later.' }
});
app.use('/contact', limiter);


app.post('/contact', async (req, res) => {
  try {
    const { error, value } = leadSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

   
    const sanitizedNotes = sanitizeHtml(value.notes || '', {
      allowedTags: [],
      allowedAttributes: {}
    });

    const newLead = await Lead.create({
      firstName: value.firstName.trim(),
      email: value.email.trim(),
      phone: value.phone.trim(),
      branch: value.branch,
      service: value.service.trim(),
      notes: sanitizedNotes
    });

    console.log(`New lead added: ${newLead.firstName} from branch ${newLead.branch} (id ${newLead.id})`);

    res.status(201).json({
      message: 'Your request has been submitted successfully! We will contact you soon.',
      leadId: newLead.id
    });

  } catch (err) {
    console.error('Error saving data:', err);
    res.status(500).json({ message: 'Failed to store data, please try again later.' });
  }
});

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to MySQL database.');
    await sequelize.sync({ alter: true });
    console.log('✅ Sequelize models synchronized.');

    app.listen(PORT, () => {
      console.log(`Promaster Backend running on: http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error('❌ Server failed to start:', err.message);
    process.exit(1);
  }
};

startServer();
