"use strict";


let settings = {
	async: true,
	crossDomain: true,
	url: 'https://tasty.p.rapidapi.com/recipes/list?from=0&size=5&sort=approved_at%3Adesc',
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '5026eb2290mshfd82eeed860fa37p1b8426jsn7d71ceeee46d',
		'X-RapidAPI-Host': 'tasty.p.rapidapi.com'
	}
};
$.ajax(settings).done(function(data, textStatus){
    console.log(data);
    console.log(textStatus);

    carousel(data);

}).fail(function(textStatus){
console.error(textStatus);
});

$(document).ready(function(){
    let interval = window.setInterval(rotateSlide1, 3000);
    
    function rotateSlide1(){
        let $firstSlide = $('.slides:eq(0)');
        let width = $firstSlide.width();

        $firstSlide.animate({marginLeft: -width}, 1000, function(){
            let $secondSlide = $('.slides:eq(4)');
            $secondSlide.after($firstSlide);
            $firstSlide.css({marginLeft: -width*.125/8
            });
        });
    }
});

let recipesCollection = null;

settings = {
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

    // carousel(data);
    displayRecipes(data);

    recipesCollection = data;
        
    $(".details").on("click", function(e){
        $(e.target).next("div").slideToggle();
        $(e.target).children(".expose").toggleClass("opened");
    });
    
    //hide all of the movie details by default on page load, the user can expand the movie details for the movies they want to see. this way the page isn't ten miles long as soon as it loads
    $(".recipes_display div").hide();
}).fail(function(textStatus){
console.error(textStatus);
});

$(document).ready(function() {
    $("#findButton").click(function() {
        let keyword = $("#filter").val();

        settings = {
            async: true,
            crossDomain: true,
            url: `https://tasty.p.rapidapi.com/recipes/list?from=0&size=10000&q=${keyword}`,
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
                $(e.target).children(".expose").toggleClass("opened");
            });
            
            //hide all of the movie details by default on page load, the user can expand the movie details for the movies they want to see. this way the page isn't ten miles long as soon as it loads
            $(".recipes_display div").hide();
        }).fail(function(textStatus){
        console.error(textStatus);
        });
    });
});

function carousel(data){
    let html = "";

    for (let i = 0; i < 5; i++) {
        let recipe = data.results[i];
        let name = recipe.name;
        let thumbnail = recipe.thumbnail_url;
        
        html += `<div class="slides"><img src="${thumbnail}" alt="${name}">
            </div>`;
    }

    document.querySelector(".top-picks").innerHTML = html;
}

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
                <span class="expose"></span>
            </button>
            <div class="card">
                <h4>${name}</h4>
                <p>${description}</p>
                <ul>
                    <li><span class="bold">Number of Servings:</span> ${numServings}</li>
                    <li><span class="bold">Calories:</span> ${calories}</li>
                    <li><span class="bold">Total Time:</span> ${totalTime} minutes</li>
                </ul>
                <h5>Instructions</h5>
                ${instructionsHtml}
            </div>
        </section>`;
    }

    document.getElementById("recipes").innerHTML = html;
}

$.noConflict();
$(function() {
    $("#dialog-confirm").dialog({
        autoOpen: false,
        resizable: false,
        height: "auto",
        width: 400,
        modal: true,
        buttons: {
            "Change my credentials": function() {
                localStorage.removeItem("newUser");
                $(this).dialog("close");
                displayUser();
                clearFormInputs();
            },
            Cancel: function() {
                $(this).dialog("close");
            }
        }
    });

    $("#submitBtn").on("click", function(e) {
        e.preventDefault();
        let userString = formIsValid();
        if (userString) {
            if (localStorage.getItem("newUser")) {
                $("#dialog-confirm").dialog("open");
            } else {
                localStorage.setItem("newUser", userString);
                displayUser();
                clearFormInputs();
            }
        }
    });


    function formIsValid() {
        let fName = $("#firstName").val().trim();
        let lName = $("#lastName").val().trim();
        let email = $("#myEmail").val().trim();
        let phone = $("#myPhone").val().trim();

        if (fName === "" || lName === "" || email === "" || phone === "") {
            $(".message").text("All fields are required.").addClass("error");
            return false;
        }

        let person = {
            firstName: fName,
            lastName: lName,
            email: email,
            phone: phone
        };

        return JSON.stringify(person);
    }

    function displayUser() {
        let userString = localStorage.getItem("newUser");
        if (userString) {
            let person = JSON.parse(userString);
            let output = `Name: ${person.firstName} ${person.lastName}<br>Email: ${person.email}<br>Phone: ${person.phone}`;
            $("#personInfo").html(output);
            $(".message").text("").removeClass("error");
        } else {
            $("#personInfo").text("");
        }
    }

    // Clear form inputs
    function clearFormInputs() {
        $("#registerForm")[0].reset();
        $(".message").text("").removeClass("error");
    }

    displayUser();
});