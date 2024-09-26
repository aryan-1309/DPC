import axios from 'axios';
import MentalState from '../models/MentalStateModel.js';

export const predictMentalState = async (req, res) => {
  try {
    const {
      Sleep, Appetite, Interest, Fatigue, Worthlessness, Concentration,
      Agitation, SuicidalIdeation, SleepDisturbance, Aggression,
      PanicAttacks, Hopelessness, Restlessness, LowEnergy
    } = req.body;

    if (
      Sleep === undefined || Appetite === undefined || Interest === undefined ||
      Fatigue === undefined || Worthlessness === undefined || Concentration === undefined ||
      Agitation === undefined || SuicidalIdeation === undefined || SleepDisturbance === undefined ||
      Aggression === undefined || PanicAttacks === undefined || Hopelessness === undefined ||
      Restlessness === undefined || LowEnergy === undefined
    ) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const response = await axios.post('http://127.0.0.1:5000/predict', {
      Sleep, Appetite, Interest, Fatigue, Worthlessness, Concentration,
      Agitation, SuicidalIdeation, SleepDisturbance, Aggression,
      PanicAttacks, Hopelessness, Restlessness, LowEnergy
    });

    console.log('Response from Flask server:', response.data);

    const depressionState = response.data.prediction ? response.data.prediction[0] : null;

    if (!depressionState) {
      return res.status(500).json({ message: 'Prediction data not available' });
    }

    const patientData = new MentalState({
      Sleep, Appetite, Interest, Fatigue, Worthlessness, Concentration,
      Agitation, SuicidalIdeation, SleepDisturbance, Aggression,
      PanicAttacks, Hopelessness, Restlessness, LowEnergy, DepressionState: depressionState
    });

    console.log('Patient Data:', patientData);

    const patientstate = await patientData.save();

    res.status(200).json({ depressionState, patientstate });
  } catch (error) {
    console.error('Error predicting Mental state:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
