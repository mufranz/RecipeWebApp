const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs'); // Required for file operations

const app = express();
const port = 3000;

app.use(bodyParser.json()); // for parsing application/json
app.use(express.static(path.join(__dirname, 'public')));

app.post('/', (req, res) => {
    const choiceData = req.body;
    console.log('Received data:', choiceData);

    // Append the data to a file, with a newline for separation
    fs.appendFile('choiceData.json', JSON.stringify(choiceData, null, 2) + '\n', (err) => {
        if (err) {
            console.error('There was an error writing the file:', err);
            return res.status(500).send('Error saving data');
        }
        console.log('Data appended successfully');
        res.send('Data appended successfully');
    });
});

app.post('/survey', (req, res) => {
    const surveyData = req.body;
    console.log('Received survey data:', surveyData);

    // Here you can choose to append to a new file or the same file
    // For this example, I'm using a new file 'surveyData.json'
    fs.appendFile('surveyData.json', JSON.stringify(surveyData, null, 2) + '\n', (err) => {
        if (err) {
            console.error('There was an error writing the file:', err);
            return res.status(500).send('Error saving survey data');
        }
        console.log('Survey data appended successfully');
        res.send('Survey data appended successfully');
    });
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
