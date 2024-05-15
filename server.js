require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  connectTimeoutMS: 10000 // 10 seconds timeout
});

let dbClient = null;

async function connectToMongoDB(retries = 5) {
  while (retries > 0) {
    try {
      await client.connect();
      console.log('Connected to MongoDB');
      dbClient = client.db("RecipeCluster"); // Replace "RecipeCluster" with your actual database name if different
      break; // Exit the loop if connection is successful
    } catch (err) {
      console.error('Failed to connect to MongoDB', err);
      retries -= 1;
      console.log(`Retries left: ${retries}`);
      await new Promise(res => setTimeout(res, 5000)); // Wait for 5 seconds before retrying
    }
  }

  if (!dbClient) {
    console.error('Could not establish a connection to MongoDB. Exiting...');
    process.exit(1); // Exit the process if the connection could not be established
  }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await connectToMongoDB();
});

app.post('/api/survey', async (req, res) => {
  console.log('Received /api/survey request');
  try {
    if (!dbClient) {
      throw new Error('No database connection');
    }
    const surveys = dbClient.collection('surveys');
    const surveyData = req.body;
    console.log('Survey data:', surveyData); // Log the survey data
    await surveys.insertOne(surveyData);
    res.status(200).send('Survey data saved successfully');
  } catch (err) {
    console.error('Failed to save survey data:', err);
    res.status(500).send('Error saving survey data');
  }
});

app.post('/api/task', async (req, res) => {
  console.log('Received /api/task request');
  try {
    if (!dbClient) {
      throw new Error('No database connection');
    }
    const tasks = dbClient.collection('tasks');
    const taskData = req.body;
    console.log('Task data:', taskData); // Log the task data
    await tasks.insertOne(taskData);
    res.status(200).send('Task data saved successfully');
  } catch (err) {
    console.error('Failed to save task data:', err);
    res.status(500).send('Error saving task data');
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
