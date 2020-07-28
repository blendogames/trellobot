//Trellobot

const Discord = require('discord.js');
const client = new Discord.Client();
module.exports = {client};

let latestActivityID = 0;
let started = 0;

const Trello = require('trello-events')
const events = new Trello({
    pollFrequency: 600, //60000 update time, milliseconds
    minId: latestActivityID,
    start: false,
    trello: {
        boards: [process.env.TRELLO_BOARDIDS], // array of Trello board IDs 
        key:    process.env.TRELLO_KEY, // your public Trello API key
        token:  process.env.TRELLO_TOKEN // your private Trello token for Trellobot
    } 
})

var trelloNode = require('trello-node-api')(process.env.TRELLO_KEY, process.env.TRELLO_TOKEN);


client.on("ready", () => {
    
    var date = new Date();    
    date.setHours( date.getHours() - 8 ); //Pacific Time offset.
    var now = date.toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'});

    console.log("\n-  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -\n");
    console.log(`Trellobot is ALIVE!  Logged in as ${client.user.tag} at ${now} PT`);
    console.log("\n-  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -\n");
    
    events.start();
});


//This gets called when a card is created
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


events.on('updateCard', async (event, board) => {
    
    if (started <= 0)
        return;
    
    if (event.data.old.hasOwnProperty("idList"))
    {
        //Trim the list name to its short version.
        var listName = event.data.listAfter.name;
        var colonIdx = event.data.listAfter.name.lastIndexOf(":");
        if (colonIdx >= 0)
        {
            listName = listName.substring(0, colonIdx );
        }        
        
        
        trelloNode.card.search(event.data.card.id).then(async response =>
        {
            if (response.idMembers.length <= 0)
            {
                //idMembers is empty.  Send the emergency backup.
                console.log(`idmem is empty.`);
                client.channels.get(process.env.ANNOUNCE_CHANNELID).send(`__${event.data.card.name}__ moved to **${listName}**\n*link: https://trello.com/c/${event.data.card.shortLink}*`);
            }
            else
            {
                //Someone is assigned to card. Get member name(s).
                var memberList = await GetMemberList(response);
                
                //for (let i = 0; i < response.idMembers.length; i++)
                //{
                //    //await client.channels.get(process.env.DEV_CHANNELID).send("this is a test message....").then(msg => {msg.delete(ERROR_TIMEOUT)}).catch();
                //    //trelloNode.member.search(response.idMembers[i]).then(idResponse =>
                //    //{
                //    //    await memberList = memberList + `${idResponse.username} `;
                //    //});
                //    
                //    var idResponse = await trelloNode.member.search(response.idMembers[i]);
                //    memberList = memberList + `${idResponse.username} `;
                //}
                
                if (memberList > 0)
                {
                    //Send the message with all the people assigned to the card.
                    console.log(`success.`);
                    client.channels.get(process.env.ANNOUNCE_CHANNELID).send(`__${event.data.card.name}__ moved to **${listName}**\n*assigned to: ${memberList} | link: https://trello.com/c/${event.data.card.shortLink}*`);
                }
                else
                {
                    //Emergency backup.
                    console.log(`memberlist array empty.`);
                    client.channels.get(process.env.ANNOUNCE_CHANNELID).send(`__${event.data.card.name}__ moved to **${listName}**\n*link: https://trello.com/c/${event.data.card.shortLink}*`);
                }
            }
        });
    }
})

async function GetMemberList(response)
{
    var memberList = '';
    
    for (let i = 0; i < response.idMembers.length; i++)
    {
        //var idResponse = await trelloNode.member.search(response.idMembers[i])
        //memberList = memberList + `${idResponse.username} `;
        await trelloNode.member.search(response.idMembers[i]).then(idResponse =>
        {
            console.log(`add ${idResponse.username}`);
            await memberList = memberList + `${idResponse.username} `;
        });
    }
    
    console.log(`returning memberlist`);
    return memberList;
}


events.on('maxId', (id) => {
    
    if (started > 0)
        return;
    
    started = 1;
    
    console.log(`Received maxId message (${id}).`);
    latestActivityID = id;
})

client.login(process.env.TOKEN);