const mongoose = require('mongoose');

const tokenTransferLogSchema = new mongoose.Schema({
    token_id: {type: ObjectId, ref: 'Token'},
    from_address: { type: String, required: true},
    to_address: { type: String, required: true},
    volume: { type: Number, required: true },
    block_number: { type: Number, required: true },
    tx_receipt: { type: String, required: true},
    tx_timestamp: { type: Date, required: true }
}, , { timestamps: { createdAt: 'created_at', updatedAt: "updated_at" } });

const TokenTransferLog = mongoose.model('TokenTransferLog', tokenTransferLogSchema);
module.exports = TokenTransferLog;