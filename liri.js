require("dotenv").config();

var inquirer = require("inquirer");
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var key = require("./key.js");

console.log(key);

var spotify = new Spotify(key.spotify);
var client = new Twitter(key.twitter);


var promptGo = true;

var askPrompt = function () {
    if (promptGo === true) {
        inquirer.prompt([
            {
                type: "list",
                message: "Please select and option.",
                choices: ["My Tweets", "Spotify This Song", "Movie This", "Do What it Says"],
                name: "options"
            }
        ])
            .then(function (inquirerResponse) {


                switch (inquirerResponse.options) {

                    case "My Tweets":
                        console.log("I'm twitting my tweeter!");
                        var params = { screen_name: 'Antonath' };
                        client.get('statuses/user_timeline', params, function (error, tweets, response) {
                            if (!error) {
                                console.log(tweets);
                            }
                        });
                        break;

                    case "Spotify This Song":
                        console.log("Find this song you dumb robot!");
                        inquirer.prompt([
                            {
                                type: "input",
                                message: "What song do you want to search for?",
                                name: "songName"
                            }
                        ])
                        break;

                    case "Movie This":
                        console.log("I love Movies!");
                        break;

                    case "Do What it Says":
                        console.log("I will do what you command!");
                        break;

                    default: console.log("That is not a valid option.")
                }

                inquirer.prompt([
                    {
                        type: "confirm",
                        message: "Do you want to continue?",
                        name: "continue",
                        default: true
                    }
                ])
                    .then(function (inquirerResponse) {
                        if (inquirerResponse.continue === false) {
                            promptGo = false;
                            console.log("Thanks for using Liri! And have a nice day!")
                            return;
                        }
                        else {
                            askPrompt();
                        }
                    })
            })
    }
}



// Calling the prompt function the intitial time.
askPrompt();