//requirements
const client = require('../index').client
module.exports = {
    name: "ban/kick", 
    author: "Random Discord Mod",
    description: "ban command (!kick [guild] [user]",
    version: "1.0",
    enabled: true,
    onMessage: function(message, args) {
        if(message.channel.type == "DM") {
            if(args[0] == "!kick") {
                try {
                    const guild = client.guilds.cache.find(g => g.name.toLowerCase().includes(args[1]))
                    if(guild == null) return message.channel.send('wrong server')
                    const user = guild.members.cache.find(u => u.user.username.toLowerCase().includes(args[2]))
                    if(!user.kickable) return message.channel.send("can't kick this user")
                    if(user !== undefined) user.kick('joe bot among us balls').then(() => message.channel.send(user.user.username + " has been kicked"))
                    else message.channel.send('wrong user')
                } catch {
                    message.channel.send('error')
                }
            }
            if(args[0] == "!ban") {
                try {
                    const guild = client.guilds.cache.find(g => g.name.toLowerCase().includes(args[1]))
                    if(guild == null) return message.channel.send('wrong server')
                    const user = guild.members.cache.find(u => u.user.username.toLowerCase().includes(args[2]))
                    if(!user.bannable) return message.channel.send("can't ban this user")
                    if(user !== undefined) user.ban('joe bot among us balls').then(() => message.channel.send(user.user.username + " has been banned"))
                    else message.channel.send('wrong user')
                } catch {
                    message.channel.send('error')
                }
            }
        }
    }
}