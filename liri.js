require("dotenv").config();

// Specifying all my npm requirements.
var inquirer = require("inquirer");
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var key = require("./key.js");
var request = require('request');
var fs = require("fs");

// console.log(key);

// keys for both Spotify and Twitter, stored in other js file.
var spotify = new Spotify(key.spotify);
var client = new Twitter(key.twitter);

// variable for recurssion loop whether to re-prompt.
var promptGo = true;

// The main prompt for Liri to ask what you want to do.
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

                        twitterAPI();
                        
                        break;

                    case "Spotify This Song":

                        spotifyAPI();
                        
                        break;

                    case "Movie This":

                        omdbAPI();
                        
                        break;

                    case "Do What it Says":

                        liriDoThis();
                        
                        break;

                    default: console.log("That is not a valid option.")
                }


            })
    }
}



// Calling the prompt function the intitial time.
askPrompt();


// Twitter API Function
function twitterAPI() {
    var params = { screen_name: 'Antonath' };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            for(i = 0; i < 20; i++){
                console.log("Tweet!: " + tweets[i].text);
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
        }
    });
}

// Spotify API Function
function spotifyAPI(){
    inquirer.prompt([
        {
            type: "input",
            message: "What song do you want to search for?",
            name: "songName",
            default: "The Sign"
        }
    ])
        .then(function (inquirerResponse) {

            
            spotify.search({ type: 'track', query: inquirerResponse.songName }, function (err, data) {
                if (err) {
                    return console.log('Error occurred: ' + err);
                }

                console.log("Song Name: " + data.tracks.items[1].name);
                console.log("Artists Name: " + data.tracks.items[1].artists[0].name);
                console.log("Album Name: " + data.tracks.items[1].album.name);
                console.log("href: " + data.tracks.href);

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
            });
        });
}


// OMDB API Function
function omdbAPI(){
    inquirer.prompt([
        {
            type: "input",
            message: "What movie do you want to search for?",
            name: "movieName",
            default: "Mr. Nobody"
        }
    ]).then(function (inquirerResponse) {


        var queryUrl = "http://www.omdbapi.com/?t=" + inquirerResponse.movieName + "&y=&plot=short&apikey=trilogy";

        request(queryUrl, function (error, response, body) {

            var jsonData = JSON.parse(body);

            if (!jsonData.Title) {

                console.log("That is not a real movie.");

                askPrompt();
            }
            else {



                var movieData = [
                    "Title: " + jsonData.Title,
                    "Year Rleased: " + jsonData.Year,
                    "IMDB Rating: " + jsonData.Ratings[0].Value,
                    "Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value,
                    "Country movie was made: " + jsonData.Country,
                    "Language: " + jsonData.Language,
                    "Plot: " + jsonData.Plot,
                    "Actors: " + jsonData.Actors
                ]
                // console.log(jsonData);
                console.log(movieData);




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
            }
        });


    });
}



// Liri Do This Function
function liriDoThis(){
    fs.readFile("./random.txt", "utf8", function (error, data) {
        var doThis = data.split(",");
        console.log(doThis[1]);
        var thisIsWhatToDo = doThis[0];
        var doThisToo = doThis[1];

        switch(thisIsWhatToDo) {
            case "my-tweets":

            twitterAPI();

            break;

            case "spotify-this-song":

            spotify.search({ type: 'track', query: doThisToo }, function (err, data) {
                if (err) {
                    return console.log('Error occurred: ' + err);
                }
    
                console.log("Song Name: " + data.tracks.items[1].name);
                console.log("Artists Name: " + data.tracks.items[1].artists[0].name);
                console.log("Album Name: " + data.tracks.items[1].album.name);
                console.log("href: " + data.tracks.href);
    
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
            });

            break;

            case "movie-this":

            var queryUrl = "http://www.omdbapi.com/?t=" + doThisToo + "&y=&plot=short&apikey=trilogy";

        request(queryUrl, function (error, response, body) {

            var jsonData = JSON.parse(body);

            if (!jsonData.Title) {

                console.log("That is not a real movie.");

                askPrompt();
            }
            else {



                var movieData = [
                    "Title: " + jsonData.Title,
                    "Year Rleased: " + jsonData.Year,
                    "IMDB Rating: " + jsonData.Ratings[0].Value,
                    "Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value,
                    "Country movie was made: " + jsonData.Country,
                    "Language: " + jsonData.Language,
                    "Plot: " + jsonData.Plot,
                    "Actors: " + jsonData.Actors
                ]
                // console.log(jsonData);
                console.log(movieData);




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
            }
        });
        }


        

    });
}