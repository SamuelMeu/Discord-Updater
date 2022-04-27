//requirements
const client = require('../index').client
const config = require("../config.json")
module.exports = {
    name: "dms", 
    author: "The Person Living in Your Walls",
    description: "send private messages",
    version: "1.1",
    enabled: true,
    onMessage: function(message, args) {
        if(message.channel.type == "DM") {
            if(message.content.startsWith('!')) {
                if(args[0].slice(1).toLowerCase() == "dm" & config.admin.includes(message.author.id)) {
                    try {
                        const user = client.users.cache.get(args[1])
                        user.send(message.content.slice((args[0].length + args[1].length + 2)))
                        message.reply('sent to ' + user.username)
                        config.admin.forEach(e => {
                            if(message.author.id !== e) {
                                const user = client.users.cache.get(e)
                                if(user !== undefined)user.send("bot to " + user.username + ": "+ message.content.slice((args[0].length + args[1].length + 2)))
                            }
                        })
                    }
                    catch {
                        message.channel.send('rip')
                    }
                }
            }
            else {
                if(config.admin.includes(message.author.id)) client.channels.cache.get(config.channel_id).send(message.content)
                config.admin.forEach(e => {
                    if(message.author.id !== e) {
                        const user = client.users.cache.get(e)
                        if(user !== undefined) user.send(message.author.username + ": " + message.content)
                    }
                })
            }
        }
    }
}