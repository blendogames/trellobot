//Trellobot


const Discord = require('discord.js');
const client = new Discord.Client();

module.exports = {client};

const MAX_ENTRYLENGTH   = 150;

client.on("ready", () => {
    
    var date = new Date();    
    date.setHours( date.getHours() - 8 ); //Pacific Time offset.
    var now = date.toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'});

    console.log("\n-  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -\n");
    console.log(`Trellobot is ALIVE!  Logged in as ${client.user.tag} at ${now} PT`);
    console.log("\n-  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -\n");

});


client.login(process.env.TOKEN);