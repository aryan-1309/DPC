import express from 'express';
const router = express.Router();

import { predictMentalState } from '../controllers/patientCtrl.js';

router.post('/predictmentalstate', predictMentalState);

export default router;
