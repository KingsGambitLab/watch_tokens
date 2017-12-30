const mongoose = require('mongoose');

const blockScanLogsSchema = new mongoose.Schema({
    block_number: { type: Number, required: true },
    timestamp: { type: Date, required: true },
    eth_volume: { type: Number, required: true, default: 0 },
    all_tokens_volume: { type: Number, required: true, default: 0 }
    status: {type: String, enum : ['PROCESSING','COMPLETED', 'FAILED'], default: 'PROCESSING' }
},
{ timestamps: { 
    createdAt: 'created_at', 
    updatedAt: "updated_at" } 
});

const BlockScanLogs = mongoose.model('BlockScanLogs', blockScanLogsSchema);
module.exports = BlockScanLogs; 