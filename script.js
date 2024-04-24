"use strict";

(function(){
	let now = new Date();
	let span = $("footer span");
	span.html(now.getFullYear());
})();


let recipesCollection = null;

let settings = {
	async: true,
	crossDomain: true,
	url: 'https://tasty.p.rapidapi.com/recipes/list?from=0&size=20',
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '5026eb2290mshfd82eeed860fa37p1b8426jsn7d71ceeee46d',
		'X-RapidAPI-Host': 'tasty.p.rapidapi.com'
	}
};

$.ajax(settings).done(function(data, textStatus){
    console.log(data);
    console.log(textStatus);

    displayRecipes(data);

    recipesCollection = data;
        
    $(".details").on("click", function(e){
        $(e.target).next("div").slideToggle();
        $(e.target).children(".arrow").toggleClass("opened");
    });
    
    //hide all of the movie details by default on page load, the user can expand the movie details for the movies they want to see. this way the page isn't ten miles long as soon as it loads
    $(".movie div").hide();
}).fail(function(textStatus){
console.error(textStatus);
});

$(document).ready(function() {
    $("#findButton").click(function() {
        let keyword = $("#filter").val();

        let settings = {
            async: true,
            crossDomain: true,
            url: `https://tasty.p.rapidapi.com/recipes/list?from=0&size=1000&q=${keyword}`,
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '5026eb2290mshfd82eeed860fa37p1b8426jsn7d71ceeee46d',
                'X-RapidAPI-Host': 'tasty.p.rapidapi.com'
            }
        };

        $.ajax(settings).done(function(data, textStatus){
            console.log(data);
            console.log(textStatus);

            if (keyword === "") {
                displayRecipes(recipesCollection);
            } else {
                displayRecipes(data);
            }
                
            $(".details").on("click", function(e){
                $(e.target).next("div").slideToggle();
                $(e.target).children(".arrow").toggleClass("opened");
            });
            
            //hide all of the movie details by default on page load, the user can expand the movie details for the movies they want to see. this way the page isn't ten miles long as soon as it loads
            $(".movie div").hide();
        }).fail(function(textStatus){
        console.error(textStatus);
        });
    });
});

function displayRecipes(data) {
    let html = "";

    for (let i = 0; i < 20; i++) {
        let recipe = data.results[i];
        if (!recipe) {
            console.error(`Recipe at index ${i} is undefined.`);
            continue;
        }

        let thumbnail = recipe.thumbnail_url;
        let name = recipe.name;
        let description = recipe.description;
        let numServings = recipe.num_servings;
        let calories = recipe.nutrition.calories;
        let totalTime = recipe.total_time_minutes;

        let instructionsHtml = '';
        if (recipe.instructions && Array.isArray(recipe.instructions)) {
            instructionsHtml = `<ol>`;
            for (let j = 0; j < recipe.instructions.length; j++) {
                instructionsHtml += `<li>${recipe.instructions[j].display_text}</li>`;
            }
            instructionsHtml += `</ol>`;
        }

        html += `<section class="recipes_display">
            <img src="${thumbnail}" alt="${name}">
            <button class="details">
                <span class="arrow"></span>
            </button>
            <div>
                <h3>${name}</h3>
                <p>${description}</p>
                <ul>
                    <li>Number of Servings: ${numServings}</li>
                    <li>Calories: ${calories}</li>
                    <li>Total Time: ${totalTime}</li>
                </ul>
                <h3>Instructions</h3>
                ${instructionsHtml}
            </div>
        </section>`;
    }

    document.getElementById("recipes").innerHTML = html;
}