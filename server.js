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
if (!uri) {
  console.error('MONGODB_URI not defined');
  process.exit(1);
}

console.log(`MongoDB URI: ${uri}`);

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  connectTimeoutMS: 10000 
});

let dbClient = null;

async function connectToMongoDB(retries = 5) {
  while (retries > 0) {
    try {
      console.log(`Attempting to connect to MongoDB. Retries left: ${retries}`);
      await client.connect();
      console.log('Connected to MongoDB');
      dbClient = client.db("RecipeCluster");
      break;
    } catch (err) {
      console.error('Failed to connect to MongoDB:', err.message);
      retries -= 1;
      if (retries === 0) {
        console.error('Exhausted all retries. Could not connect to MongoDB.');
        process.exit(1);
      }
      await new Promise(res => setTimeout(res, 5000)); 
    }
  }

  if (!dbClient) {
    console.error('Could not establish a connection to MongoDB after several retries. Exiting...');
    process.exit(1); 
  }
}

// Connect to DB
connectToMongoDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


app.use(async (req, res, next) => {
  if (!dbClient) {
    await connectToMongoDB();
  }
  next();
});

app.post('/api/survey', async (req, res) => {
  console.log('Received /api/survey request');
  if (!dbClient) {
    return res.status(500).send('No database connection');
  }
  try {
    const surveys = dbClient.collection('surveys');
    const surveyData = req.body;
    console.log('Survey data:', surveyData);
    await surveys.insertOne(surveyData);
    res.status(200).send('Survey data saved successfully');
  } catch (err) {
    console.error('Failed to save survey data:', err.message);
    res.status(500).send('Error saving survey data');
  }
});

app.post('/api/task', async (req, res) => {
  console.log('Received /api/task request');
  if (!dbClient) {
    return res.status(500).send('No database connection');
  }
  try {
    const tasks = dbClient.collection('tasks');
    const taskData = req.body;
    console.log('Task data:', taskData);
    await tasks.insertOne(taskData);
    res.status(200).send('Task data saved successfully');
  } catch (err) {
    console.error('Failed to save task data:', err.message);
    res.status(500).send('Error saving task data');
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
