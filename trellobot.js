//Trellobot

const Discord = require('discord.js');
const client = new Discord.Client();
module.exports = {client};

let latestActivityID = 0;

let started = 0;

const Trello = require('trello-events')
const events = new Trello({
    pollFrequency: 2000, // update time, milliseconds
    minId: latestActivityID,
    start: false,
    trello: {
        boards: [process.env.TRELLO_BOARDIDS], // array of Trello board IDs 
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




//This gets called when a card is created but unfortunately it also gets called for every pre-existing card.
//events.on('createCard', (event, board) => {
//    
//        
//    //let embed = getEmbedBase(event)
//    //    .setTitle(`New card created under __${event.data.list.name}__!`)
//    //    .setDescription(`**CARD:** ${event.data.card.name} — **[CARD LINK](https://trello.com/c/${event.data.card.shortLink})**\n\n**EVENT:** Card created under __${event.data.list.name}__ by **[${conf.realNames ? event.memberCreator.fullName : event.memberCreator.username}](https://trello.com/${event.memberCreator.username})**`)
//    //send(addDiscordUserData(embed, event.memberCreator))
//    
//    //client.channels.get(process.env.ANNOUNCE_CHANNELID).send(`test card added ${event.data.card.name}`);
//    
//    console.log(`test card added ${event.data.card.name}`);
//})

events.on('updateCard', (event, board) => {
    
    if (started <= 0)
        return;
    
    console.log(`updatecard event.`);
    
    if (event.data.old.hasOwnProperty("idList"))
    {
        //Trim the list name to its short version.
        var listName = event.data.listAfter.name;
        var colonIdx = event.data.listAfter.name.lastIndexOf(":");
        if (colonIdx >= 0)
        {
            listName = listName.substring(0, colonIdx );
        }        
        
        console.log(`__**${event.data.card.name}**__ moved to **${listName}** - ${event.memberCreator.username}`);
        
        //(https://trello.com/c/${event.data.card.shortLink})
        
        
        //client.channels.get(process.env.ANNOUNCE_CHANNELID).send(`*${event.memberCreator.fullName}* moved card ${event.data.card.name} to **${listName}** https://trello.com/c/${event.data.card.shortLink}`);
    }
    
})

events.on('maxId', (id) => {
    
    if (started > 0)
        return;
    
    started = 1;
    
    console.log(`Received maxId message (${id}).`);
    latestActivityID = id;    
})

client.login(process.env.TOKEN);