require("dotenv").config();


var inquirer = require("inquirer");
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var key = require("./key.js");
var request = require('request');
var fs = require("fs");

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

                        var params = { screen_name: 'Antonath' };
                        client.get('statuses/user_timeline', params, function (error, tweets, response) {
                            if (!error) {
                                console.log("Tweet #1: " + tweets[0].text);
                                console.log("Tweet #2: " + tweets[1].text);
                                console.log("Tweet #3: " + tweets[2].text);
                                console.log("Tweet #4: " + tweets[3].text);
                                console.log("Tweet #5: " + tweets[4].text);
                                console.log("Tweet #6: " + tweets[5].text);
                                console.log("Tweet #7: " + tweets[6].text);
                                console.log("Tweet #8: " + tweets[7].text);
                                console.log("Tweet #9: " + tweets[8].text);
                                console.log("Tweet #10: " + tweets[9].text);
                                console.log("Tweet #11: " + tweets[10].text);
                                console.log("Tweet #12: " + tweets[11].text);
                                console.log("Tweet #13: " + tweets[12].text);
                                console.log("Tweet #14: " + tweets[13].text);
                                console.log("Tweet #15: " + tweets[14].text);
                                console.log("Tweet #16: " + tweets[15].text);
                                console.log("Tweet #17: " + tweets[16].text);
                                console.log("Tweet #18: " + tweets[17].text);
                                console.log("Tweet #19: " + tweets[18].text);
                                console.log("Tweet #20: " + tweets[19].text);

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
                        break;

                    case "Spotify This Song":

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
                            })
                        break;

                    case "Movie This":

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


                        

                        break;

                    case "Do What it Says":
                         
                        fs.readFile("./random.txt", "utf8", function(error, data){
                          var doThis =  data.split(",");
                            console.log(doThis[1]);
                           var  doThisToo = doThis[1];
                        
                            
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

                    });

                        break;

                    default: console.log("That is not a valid option.")
                }


            })
    }
}



// Calling the prompt function the intitial time.
askPrompt();