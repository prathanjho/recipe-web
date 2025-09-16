const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const axios = require('axios'); //REQUEST To CHATGPT VIA HTTP
const path = require('path');

const User = require('./Models/User');
const signupRoute = require('./signup');
const loginRoute = require('./login');
const itemaddRoute = require('./itemadd');
const historyRoute = require('./history');
const itemdeleteRoute = require('./itemdelete');
const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));
require('dotenv').config();
const uri = process.env.MONGO_URI;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// MONGODB ATLAS CONNECTION


mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, dbName: 'mydatabase' })
    .then(() => console.log('MongoDB Atlas connected'))
    .catch(err => console.log('MongoDB connection error:', err));

// USER MODEL


app.use('/signup', signupRoute); // now POST /signup works
app.use('/login', loginRoute);   // now POST /login works
app.use('/itemadd', itemaddRoute);
app.use('/history', historyRoute);
app.use('/itemdelete', itemdeleteRoute);
// TEST ROUTE


app.post('/api/recipe', async (req, res) => {
    const { menu, food_allergy, description, age, gender, congenital_disease } = req.body;

    const prompt = `
Suggest a recipe based on the following details:
Menu name: ${menu || "Not specified"}
Food allergies: ${food_allergy || "None"}
Description: ${description || "None"}
Age: ${age || "Any"}
Gender: ${gender || "Any"}
Select what is best for healing disease: ${congenital_disease || "None"}

Return only valid JSON:
{
  "title": "Recipe name",
  "description": "Short description",
  "ingredients": ["ingredient list"],
  "instructions": ["step by step instructions"]
}
`;

    let recipe = null;
    let attempt = 0;
    const maxRetries = 5;

    while (!recipe && attempt < maxRetries) {
        attempt++;
        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        // Gemini API payload
                        contents: [{ parts: [{ text: prompt }] }]
                    })
                }
            );

            if (!response.ok) throw new Error(`Gemini API error: ${response.status}`);

            const data = await response.json();
            let text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
            text = text.replace(/```json|```/g, "").trim();
            recipe = JSON.parse(text);

        } catch (err) {
            console.warn(`Attempt ${attempt} failed: ${err.message}`);
            recipe = null;
            const waitTime = Math.min(5000 * attempt, 20000); // exponential backoff
            await new Promise(r => setTimeout(r, waitTime));
        }
    }

    if (!recipe) {
        recipe = {
            title: "Failed to fetch recipe",
            description: "The AI service is currently unavailable.",
            ingredients: [],
            instructions: []
        };
    }

    res.json(recipe);
});


app.get('/test-db', async (req, res) => {
    try {
        const count = await User.countDocuments();
        res.json({ message: 'MongoDB connected', users: count });
    } catch (err) {
        res.status(500).json({ error: 'MongoDB connection failed', details: err.message });
    }
});

// START SERVER
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://127.0.0.1:${PORT}`));
