import mongoose from "mongoose";

const MentalStateSchema = mongoose.Schema({
    Sleep:{
        type: Number,
        required: true
    },
    Appetite:{
        type: Number,
        required: true
    },
    Interest:{
        type: Number,
        required: true
    },
    Fatigue:{
        type: Number,
        required: true
    },
    Worthlessness:{
        type: Number,
        required: true
    },
    Concentration:{
        type: Number,
        required: true
    },
    Agitation:{
        type: Number,
        required: true
    } ,
    SuicidalIdeation:{
        type: Number,
        required: true
    },
    SleepDisturbance:{
        type: Number,
        required: true
    },
    Aggression:{
        type: Number,
        required: true
    } ,
    PanicAttacks:{
        type: Number,
        required: true
    },
    Hopelessness:{
        type: Number,
        required: true
    },
    Restlessness:{
        type: Number,
        required: true
    },
    LowEnergy:{
        type:Number,
        required: true
    },
    DepressionState:{
        type:String,
        required: true
    },
    createdAt:{
        type:Date,
    }
})


const MentalState = mongoose.model('MentalState', MentalStateSchema);
export default MentalState

