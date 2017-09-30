// BOT FRAMEWORK FOR A DISCORD SERVER - CODENAME RAZEBOT
// USING DISCORD.JS LIBRARIES AND THE OFFICIAL DISCORD API
// CREATED 24/09/2017
// MADE BY STEVEN WHEELER (robotprobot#8211)

// main.js is the main file for the bot
// included should be a commands folder, and a config.json.

// Bot is partially modifiable and can be changed via config.json.
// (Do not change the token in config.json. This will break the connection to Discord!)

// <<<--- Code starts past this line! --->>>

const Discord = require("discord.js"); // Require Discord.js for app to run
const client = new Discord.Client(); // Prepare a client for the bot
const config = require("./config.json"); // Require the config file for the bot
const fs = require("fs"); // Prepare file reading
const unrecognisedCommands = 0; // Keep track of how many unrecognised commands were used

client.login(config.token); // Connect to the Discord service and provide bots identity to server

client.on("ready", () => {
  console.log(""); // "Dont let them back in, im teaching them a lesson about spacing"
  console.log(config.botName + " online and ready!");
  console.log("V1.0.0");
  console.log("Developed by robotprobot (Steven Wheeler)");
  console.log("DISCORD: robotprobot#8211");
  console.log("TWITTER: @robot_probot");
  console.log(""); // Spacing
  console.log("Listening for commands with the " + config.prefix + " prefix!");
  console.log(""); // Spacing
});

client.on("guildCreate", guild => { // Notes in console when bot has joined a server
  console.log(`Joined server joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
});

client.on("guildDelete", guild => { // Notes in console when bot has left or been removed from a server
  console.log(`Disconnected/removed from: ${guild.name} (id: ${guild.id})`);
});

fs.readdir("./commands/", (err, files) => { // Read the commands folder and prepare commands for use
  if (err) return console.error(err); // If reading fails, write to console and abort
  files.forEach(file => { // Prepare each file
    let eventFunction = require(`./commands/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, (...args) => eventFunction.run(client, ...args));
  });
});

client.on("message", message => {
  if (!message.guild) return; // If message is not in server (like a dm), reject
  if (message.author.bot) return; // If the message the bot wants to respond to is from itself, reject to prevent loops
  if (!message.content.startsWith(config.prefix)) return; // If the message does not contain the prefix, reject

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g); // If message accepted, remove prefix
  const command = args.shift().toLowerCase(); // Change resulting message to lowercase

  try {
    let commandFile = require(`./commands/${command}.js`); // Search for a corrosponding command
    commandFile.run(client, message, args); // If command exists, run it
  } catch (err) { // Else tell user that command was not found
    console.error(err);
    console.log("Unrecognised command entered with a prefix.");
    console.log("Command was: " + command);
    unrecognisedCommands = unrecognisedCommands + 1;
    message.channel.send("Command not recognised");
    console.log("Informed user command is unrecognised.");
  }
});

client.on("guildMemberAdd", member => { // Preparing the STATSTRACK file for a joining member if new
  var unformatteduserid = `${member}`; // Take the original UserID
  var newuserid = unformatteduserid.replace(/\D/g,''); // Remove any characters that are not numbers
  var playerData = `./stats/${newuserid}.json`; // Tells system to use the formatted UserID as filename
  if (!fs.existsSync(playerData)) { // If the file does not already exist (i.e a brand new user), generate file
    console.log("New client detected. Generating stats file."); // Alert in console that this has happened
    var stream = fs.createWriteStream(playerData); // Create the file and prepare it
    stream.once('open', function(fd) { // Open the file to write to it
      stream.write('{\n'); // Write the basic template
      stream.write(' "userid": ' + newuserid + ',\n'); // Include the UserID in file for reading later
      stream.write(' "points": 0,\n');
      stream.write(' "wins": 0,\n');
      stream.write(' "losses": 0,\n');
      stream.write(' "level": 0\n');
      stream.write('}\n'); // Finish the basic template
      stream.end(); // Close the file and save
    });
  };
});
