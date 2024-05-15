// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');

// Create Express application
const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Middleware for parsing JSON bodies

// MongoDB URI and client setup
const uri = process.env.MONGODB_URI;
console.log(`MongoDB URI: ${uri}`);

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  connectTimeoutMS: 10000 // 10 seconds timeout
});

let dbClient;

// Function to connect to MongoDB
async function connectToMongoDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    dbClient = client.db("RecipeCluster"); // Replace "RecipeCluster" with your actual database name if different
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
  }
}

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await connectToMongoDB(); // Attempt to connect to MongoDB after server starts
});

// Route to handle POST requests to /survey
app.post('/survey', async (req, res) => {
  try {
    if (!dbClient) {
      throw new Error('No database connection');
    }
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
    if (!dbClient) {
      throw new Error('No database connection');
    }
    const tasks = dbClient.collection('tasks');
    const taskData = req.body;
    await tasks.insertOne(taskData);
    res.status(200).send('Task data saved successfully');
  } catch (err) {
    console.error('Failed to save task data:', err);
    res.status(500).send('Error saving task data');
  }
});
