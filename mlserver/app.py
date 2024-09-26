from flask import Flask, request, jsonify
import pickle
import numpy as np

app = Flask(__name__)

with open('model.pkl', 'rb') as f:
    model = pickle.load(f)

@app.route('/')
def home():
    return "Hello ML"

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        
        required_fields = [
            'Sleep', 'Appetite', 'Interest', 'Fatigue', 'Worthlessness',
            'Concentration', 'Agitation', 'SuicidalIdeation', 'SleepDisturbance',
            'Aggression', 'PanicAttacks', 'Hopelessness', 'Restlessness', 'LowEnergy'
        ]

        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing key: {field}"}), 400
        
        features = [
            data['Sleep'],
            data['Appetite'],
            data['Interest'],
            data['Fatigue'],
            data['Worthlessness'],
            data['Concentration'],
            data['Agitation'],
            data['SuicidalIdeation'],
            data['SleepDisturbance'],
            data['Aggression'],
            data['PanicAttacks'],
            data['Hopelessness'],
            data['Restlessness'],
            data['LowEnergy'] 
        ]

        features = np.array(features).reshape(1, -1)

        prediction = model.predict(features)
        
        depression_states = ['Mild', 'Moderate', 'No Depression', 'Severe']
        predicted_states = [depression_states[int(pred)] for pred in prediction]
        
        return jsonify({'prediction': predicted_states})
    
    except KeyError as e:
        return jsonify({"error": f"Missing key: {str(e)}"}), 400
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
