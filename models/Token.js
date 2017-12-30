const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    address: { type: String, required: true, unique: true},
    abi: { type: String, required: true},
    token_type: { type: String, default: "erc20", required: true },
    deployed_on: Date,
    listed_on: Date
},
{ timestamps: { 
    createdAt: 'created_at', 
    updatedAt: "updated_at" } 
});


const Token = mongoose.model('Token', tokenSchema);
module.exports = Token;