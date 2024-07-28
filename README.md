# Cross-Cultural Similarity of Recipes

This web application is part of the "Perceived recipe similarity: insights from the odd-one-out task" study. It is developed using HTML, CSS, and JavaScript, and hosted on a public Vercel server. The application allows participants to complete a survey that includes an odd-one-out task with 15 diefferent recipes and a questionnaire to collect demographic data.

## Features

The web application was developed using HTML, CSS, and JavaScript. The frontend structure includes pages for the survey start including a informed consent page, the main survey featuring the odd-one-out task, and a questionnaire.

JavaScript is used to fetch and display recipe data from a JSON file, handle user selections, generate a unique ID for each user, and manage the survey flow. The recipe selection and display process is also randomized using JavaScript. User choices are saved and sent to the server via the Fetch API.

The application is hosted on a public vercel server. The server-side logic is implemented using Node.js, with Express.js handling HTTP requests. The server receives user data via POST requests, which are saved to two JSON files for recipe selection and questionnaire data respectively.

## Installation

To install and run the application locally, follow these steps:

1. Clone the repository:

2. Install dependencies:
Make sure you have Node.js installed. Then run:
   ```bash
   npm install

3. Run the application:
   ```bash
   node server.js

4. Access the application:
Open your web browser and navigate to `http://localhost:3000`.

## Usage
To start the survey, open the application and follow the instructions on the start page. During the main survey, select the odd-one-out recipe from each triplet presented. After completing the recipe selections, fill in the questionnaire.

## Technologies Used

The application uses the following technologies:
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Hosting**: Vercel ('https://recipe-similarity.vercel.app/')

## Repository
The code for the application can be found at [https://github.com/mufranz/RecipeWebApp](https://github.com/mufranz/RecipeWebApp).
