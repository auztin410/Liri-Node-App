require("dotenv").config();

var inquirer = require("inquirer");



var promptGo = true;

var askPrompt = function() {
    if(promptGo === true){
        inquirer.prompt([
            {
                type: "list",
                message: "Please select and option.",
                choices: ["My Tweets", "Spotify This Song", "Movie This", "Do What is Says"],
                name: "options"
            }
        ])
        .then(function(inquirerResponse) {
            console.log(inquirerResponse.options);

            inquirer.prompt([
                {
                type: "confirm",
                message: "Do you want to continue?",
                name: "continue",
                default: true
            }
            ])
            .then(function(inquirerResponse) {
                if(inquirerResponse.continue === false) {
                    promptGo = false;
                    console.log("Thanks for using Liri! And have a nice day!")
                    return;
                }
                else{
                    askPrompt();
                }
            })
        })
    }
}



// Calling the prompt function the intitial time.
askPrompt();