var recipes = []; 
var taskCount = 0; 

document.addEventListener('DOMContentLoaded', function() {
    var isSecondAttempt = localStorage.getItem("secondAttempt") === "true";
    var startScreen = document.getElementById("start-screen");
    var mainContent = document.getElementById("main-content");

    //check for second attempt and adjust start screen 
    if (isSecondAttempt) {
        if (startScreen) startScreen.classList.remove("active");
        mainContent.classList.add("active");
    } else {
        if (startScreen) startScreen.classList.add("active");
    }

    fetch('recipes.json')
        .then(response => response.json())
        .then(data => {
            recipes = shuffleArray(data.recipes); 
            displayImages(); 
        })
        .catch(error => {
            console.error('Error:', error);
        });

    var startButton = document.getElementById("start-button");
    startButton.addEventListener("click", function() {
        var completions = localStorage.getItem("surveyCompletions") || 0;
        if (completions >= 2) {
            alert("You have already completed the survey twice.");
            return;
        }
        
        taskCount = 0;

         // Generate a unique identifier for participant
        var uniqueId = 'id_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem("surveyUserId", uniqueId);

        // Display Odd-One-Out task
        document.getElementById("start-screen").classList.remove("active");
        document.getElementById("main-content").classList.add("active");

        window.scrollTo(0, 0);
        startSurvey();
    });
});

function startSurvey() {
    displayImages();
}

// Shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// handle saving the chosen recipe and reloading the displayed recipes
function saveChoiceAndReload() {
    var imageContainer = document.getElementById("image-container");
    var selectedRecipe = imageContainer.querySelector(".recipe-container.selected");

    if (selectedRecipe) {
        var selectedImage = selectedRecipe.querySelector("img");
        var uniqueId = localStorage.getItem("surveyUserId"); 

        var choiceData = {
            userId: uniqueId, 
            chosenImage: selectedImage.src, 
            availableImages: Array.from(imageContainer.querySelectorAll("img")).map(img => img.src) 
        };
        console.log(choiceData);

        // Send recipe selection data to server
        fetch('/api/task', { 
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
            reloadImages();
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('An error occurred while submitting your choice. Please try again.');
        });

        // Number of odd-one-out tasks to be completed in one round
        taskCount++;
        if (taskCount >= 10) {
            var completions = (localStorage.getItem("surveyCompletions") || 0) + 1;
            localStorage.setItem("surveyCompletions", completions);

            if (completions < 2) {
                localStorage.setItem("secondAttempt", "true");
            } else {
                localStorage.removeItem("secondAttempt");
            }

            window.location.href = 'end.html';
            return; 
        }
    } else {
        alert("Bitte wählen Sie ein Rezept aus");
    }
    window.scrollTo(0, 0);
}



// Function to reload and shuffle recipes
function reloadImages() {
    var imageContainer = document.getElementById("image-container");
    imageContainer.innerHTML = "";
    recipes = shuffleArray(recipes); // Shuffle the recipes again
    displayImages();
}

// Function to display recipes
function displayImages() {
    var imageContainer = document.getElementById("image-container");

    imageContainer.innerHTML = '';

    // Display three recipes
    for (let i = 0; i < 3 && i < recipes.length; i++) {
        let recipe = recipes[i];

        var recipeContainer = document.createElement("div");
        recipeContainer.classList.add("recipe-container");

        // Title
        var titleElement = document.createElement("h3");
        titleElement.textContent = recipe.title;
        recipeContainer.appendChild(titleElement);

        // Image
        var img = document.createElement("img");
        img.src = recipe.image.replace;
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

        // Directions
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

        // Add onclick event to recipe container
        recipeContainer.onclick = function() {
            var allRecipes = imageContainer.querySelectorAll(".recipe-container");
            allRecipes.forEach(function(rc) {
                rc.classList.remove("selected");
            });
            this.classList.add("selected");
        };
        imageContainer.appendChild(recipeContainer);
    }
}

displayImages();
