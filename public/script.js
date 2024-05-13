var recipes = []; 
var taskCount = 0; 
localStorage.clear();


document.addEventListener('DOMContentLoaded', function() {
    var isSecondAttempt = localStorage.getItem("secondAttempt") === "true";
    var startScreen = document.getElementById("start-screen");
    var mainContent = document.getElementById("main-content");

    if (isSecondAttempt) {
        // Hide start screen and show main content directly
        if (startScreen) startScreen.classList.remove("active");
        mainContent.classList.add("active");
    } else {
        // Show start screen
        if (startScreen) startScreen.classList.add("active");
    }

    fetch('recipes.json')
        .then(response => response.json())
        .then(data => {
            recipes = shuffleArray(data.recipes); // Shuffle the recipes
            displayImages(); // Call to display images and recipes
        })
        .catch(error => {
            console.error('Error:', error);
        });


    var startButton = document.getElementById("start-button");
    startButton.addEventListener("click", function() {
        var completions = localStorage.getItem("surveyCompletions") || 0;
        // Check if the survey has been completed twice already
        if (completions >= 2) {
            alert("You have already completed the survey twice.");
            return; // Prevent the survey from starting
        }
        
        taskCount = 0;


         // Generate a unique identifier
        var uniqueId = 'id_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem("surveyUserId", uniqueId);

        // Hide start screen and show the main content
        document.getElementById("start-screen").classList.remove("active");
        document.getElementById("main-content").classList.add("active");

        // Call any function to start the survey (if necessary)
        window.scrollTo(0, 0); // Scroll to top when starting the survey.
        startSurvey();
    });
});



function startSurvey() {
    displayImages();
}

// Shuffle array utility function
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Function to handle saving the chosen image and reloading
function saveChoiceAndReload() {
    var imageContainer = document.getElementById("image-container");
    var selectedRecipe = imageContainer.querySelector(".recipe-container.selected");

    if (selectedRecipe) {
        var selectedImage = selectedRecipe.querySelector("img");
        var uniqueId = localStorage.getItem("surveyUserId"); // Retrieve the identifier

        var choiceData = {
            userId: uniqueId, // Use the unique identifier
            chosenImage: selectedImage.src, // src of the selected image
            availableImages: Array.from(imageContainer.querySelectorAll("img")).map(img => img.src) // src of all images
        };
        console.log(choiceData);

        // Send the choiceData to the server
        fetch('/task', {  // Updated to use relative URL and the new endpoint
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(choiceData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            return response.text();
        })
        .then(data => {
            console.log('Success:', data);
            reloadImages(); // This function should handle the logic to move to the next set of images or end the session
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('An error occurred while submitting your choice. Please try again.');
        });


        // Increment the task counter
        taskCount++;
        if (taskCount >= 3) {
                // Increment and save the completion count
            var completions = (localStorage.getItem("surveyCompletions") || 0) + 1;
            localStorage.setItem("surveyCompletions", completions);

            if (completions < 2) {
                // Set flag for second attempt
                localStorage.setItem("secondAttempt", "true");
            } else {
                // Clear the flag as the user has completed the survey twice
                localStorage.removeItem("secondAttempt");
            }

            window.location.href = 'end.html';
            return; // Exit the function
        }
    } else {
        alert("Bitte wählen Sie ein Rezept aus");
    }
    window.scrollTo(0, 0); // Scroll to top after reloading recipes.
}

// Function to reload images and shuffle recipes
function reloadImages() {
    var imageContainer = document.getElementById("image-container");
    imageContainer.innerHTML = "";
    recipes = shuffleArray(recipes); // Shuffle the recipes again
    displayImages();
}

// Function to display a limited number of images and their recipes
function displayImages() {
    var imageContainer = document.getElementById("image-container");

    // Clear previous content
    imageContainer.innerHTML = '';

    // Display only the first three recipes
    for (let i = 0; i < 3 && i < recipes.length; i++) {
        let recipe = recipes[i];

          // Create a container for each recipe
        var recipeContainer = document.createElement("div");
        recipeContainer.classList.add("recipe-container");

        // Title
        var titleElement = document.createElement("h3");
        titleElement.textContent = recipe.title;
        recipeContainer.appendChild(titleElement);

        // Image
        var img = document.createElement("img");
        img.src = recipe.image;
        img.alt = recipe.title;
        recipeContainer.appendChild(img);

        // Ingredients
        var ingredientsHeadline = document.createElement("h4");
        ingredientsHeadline.textContent = "Zutaten";
        recipeContainer.appendChild(ingredientsHeadline);

        let ingredientsTable = document.createElement("table");

        recipe.ingredients.forEach(ing => {
            let row = ingredientsTable.insertRow();
            
            let cell1 = row.insertCell(0);
            let cell2 = row.insertCell(1);
            cell1.textContent = ing.name;
            cell2.textContent = ing.amount;
        });
        recipeContainer.appendChild(ingredientsTable);

        // Display directions
        let directionsTitle = document.createElement("h4");
        directionsTitle.textContent = "Zubereitung";
        recipeContainer.appendChild(directionsTitle);

        let ol = document.createElement("ol");
        recipe.directions.forEach(step => {
            let li = document.createElement("li");
            li.textContent = step;
            ol.appendChild(li);
        });
        recipeContainer.appendChild(ol);

        // Add onclick event to the recipe container
        recipeContainer.onclick = function() {
            // Remove 'selected' class from all recipe containers
            var allRecipes = imageContainer.querySelectorAll(".recipe-container");
            allRecipes.forEach(function(rc) {
                rc.classList.remove("selected");
            });

            // Add 'selected' class to this recipe container
            this.classList.add("selected");
        };

        // Append the entire recipe container
        imageContainer.appendChild(recipeContainer);
    }
}

var images = selectAndShuffleImages();

// Initial call to display images and recipes
displayImages();
