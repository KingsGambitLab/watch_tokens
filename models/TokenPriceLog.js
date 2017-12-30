const mongoose = require('mongoose');

const tokenPriceLogSchema = new mongoose.Schema({
    token_id: {type: ObjectId, ref: 'Token'},
    eth: { type: Number, required: true },
    usd: { type: Number, required: true },
    block_number: { type: Number, required: false },
    timestamp: { type: Date, required: true },
    log_src: {type: String, default:"something", required: true}
}, , { timestamps: { createdAt: 'created_at', updatedAt: "updated_at" } });

const TokenPriceLog = mongoose.model('TokenTransferLog', tokenPriceLogSchema);
module.exports = TokenPriceLog;