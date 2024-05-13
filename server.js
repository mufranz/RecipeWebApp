// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');

// Create Express application
const app = express();
app.use(bodyParser.json()); // Middleware for parsing JSON bodies

// MongoDB URI and client setup
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let dbClient;

// Connect to MongoDB and start the server
client.connect(err => {
  if (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1); // Exit process with error
  }
  dbClient = client.db("RecipeCluster"); // Replace "RecipeCluster" with your actual database name if different
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
  });
});

// Route to handle POST requests to /survey
app.post('/survey', async (req, res) => {
  try {
    const surveys = dbClient.collection('surveys');
    const surveyData = req.body;
    await surveys.insertOne(surveyData);
    res.status(200).send('Survey data saved successfully');
  } catch (err) {
    console.error('Failed to save survey data:', err);
    res.status(500).send('Error saving survey data');
  }
});

// Route to handle POST requests to /task
app.post('/task', async (req, res) => {
  try {
    const tasks = dbClient.collection('tasks');
    const taskData = req.body;
    await tasks.insertOne(taskData);
    res.status(200).send('Task data saved successfully');
  } catch (err) {
    console.error('Failed to save task data:', err);
    res.status(500).send('Error saving task data');
  }
});
