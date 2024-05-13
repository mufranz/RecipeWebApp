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

// Define port from environment variable or default
const port = process.env.PORT || 3000;

// Route to handle POST requests to /survey
app.post('/survey', async (req, res) => {
  try {
    await client.connect();
    const database = client.db("RecipeCluster"); // Replace with your actual database name
    const surveys = database.collection('surveys');

    const surveyData = req.body;
    await surveys.insertOne(surveyData);
    res.status(200).send('Survey data saved successfully');
  } catch (err) {
    console.error('Failed to save survey data:', err);
    res.status(500).send('Error saving survey data');
  } finally {
    await client.close();
  }
});

app.post('/task', async (req, res) => {
    try {
      await client.connect();
      const database = client.db("RecipeCluster"); // Ensure this matches your MongoDB database name
      const tasks = database.collection('tasks');
  
      const taskData = req.body;
      await tasks.insertOne(taskData);
      res.status(200).send('Task data saved successfully');
    } catch (err) {
      console.error('Failed to save task data:', err);
      res.status(500).send('Error saving task data');
    } finally {
      await client.close();
    }
  });

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
