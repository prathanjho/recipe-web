const mongoose = require('mongoose');

const storeItemSchema = new mongoose.Schema({
  menuname: { type: String, required: true },        
  food_allergy: { type: String, default: '' },     
  description: { type: String, default: '' },  
  ingredient: { type: String, required: true },  
  instruction: { type: String, required: true },  
  createdAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },

  // Array of store items
  storeData: [storeItemSchema]  // embedded documents
});

module.exports = mongoose.model('User', userSchema);
