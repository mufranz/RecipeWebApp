const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;  // This will use the PORT environment variable if available or default to 3000

// MongoDB URI from environment variables
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json()); // For parsing application/json
app.use(express.static(path.join(__dirname, 'public')));

// POST endpoint for saving choice data
app.post('/', async (req, res) => {
    try {
        await client.connect();
        const database = client.db("yourDatabaseName");
        const choices = database.collection("choices");
        const choiceData = req.body;

        const result = await choices.insertOne(choiceData);
        console.log(`Choice data inserted with ID: ${result.insertedId}`);
        res.send('Choice data saved to MongoDB');
    } catch (err) {
        console.error('Error connecting to MongoDB', err);
        res.status(500).send('Error saving data');
    } finally {
        await client.close();
    }
});

// POST endpoint for saving survey data
app.post('/survey', async (req, res) => {
    try {
        await client.connect();
        const database = client.db("yourDatabaseName");
        const surveys = database.collection("surveys");
        const surveyData = req.body;

        // Simple validation
        if (!surveyData.age || !surveyData.gender) {
            return res.status(400).send('Missing required fields');
        }

        const result = await surveys.insertOne(surveyData);
        console.log(`Survey data inserted with ID: ${result.insertedId}`);
        res.send('Survey data saved to MongoDB');
    } catch (err) {
        console.error('Error connecting to MongoDB', err);
        res.status(500).send('Error saving survey data');
    } finally {
        await client.close();
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
