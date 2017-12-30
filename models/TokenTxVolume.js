const mongoose = require('mongoose');
const tokenTxVolumeSchema = new mongoose.Schema({
    token_id: {type: ObjectId, ref: 'Token'},
    volume: { type: Number, required: true },
    block_number: { type: Number, required: false },
    timestamp: { type: Date, required: true },
}, 
{ timestamps: { 
    createdAt: 'created_at', 
    updatedAt: "updated_at" } 
});


const TokenTxVolume = mongoose.model('TokenTxVolume', tokenTxVolumeSchema);
module.exports = TokenTxVolume;