//Trellobot

const Discord = require('discord.js');
const client = new Discord.Client();
module.exports = {client};


const Trello = require('trello-events')
const events = new Trello({
    pollFrequency: 2000, // update time, milliseconds
    minId: 0, //Fix????
    start: false,
    trello: {
        boards: process.env.TRELLO_BOARDIDS, // array of Trello board IDs 
        key:    process.env.TRELLO_KEY, // your public Trello API key
        token:  process.env.TRELLO_TOKEN // your private Trello token for Trellobot
    } 
})

const MAX_ENTRYLENGTH   = 150;

client.on("ready", () => {
    
    var date = new Date();    
    date.setHours( date.getHours() - 8 ); //Pacific Time offset.
    var now = date.toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'});

    console.log("\n-  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -\n");
    console.log(`Trellobot is ALIVE!  Logged in as ${client.user.tag} at ${now} PT`);
    console.log("\n-  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -\n");
    
    events.start();
});


events.on('createCard', (event, board) => {
    
    if (!eventEnabled(`cardCreated`)) return
    
    //let embed = getEmbedBase(event)
    //    .setTitle(`New card created under __${event.data.list.name}__!`)
    //    .setDescription(`**CARD:** ${event.data.card.name} — **[CARD LINK](https://trello.com/c/${event.data.card.shortLink})**\n\n**EVENT:** Card created under __${event.data.list.name}__ by **[${conf.realNames ? event.memberCreator.fullName : event.memberCreator.username}](https://trello.com/${event.memberCreator.username})**`)
    //send(addDiscordUserData(embed, event.memberCreator))
    
    client.channels.get(process.env.ANNOUNCE_CHANNELID).send("test card added ${event.data.card.name}");
})


client.login(process.env.TOKEN);