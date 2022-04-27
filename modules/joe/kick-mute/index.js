//requirements
const config = require('../config.json')
const spammute = new Object
const spamkick = new Object
module.exports = {
    name: "Moderation at an other level", 
    author: "Candice",
    description: "spam kick and mute",
    version: "1.0",
    enabled: true,
    onMessage: function(message, args) {
        if(args[0] == "kick" & config.admin.includes(message.author.id) ) {
            try {
                const user = message.guild.members.cache.find(u => u.user.username.toLowerCase().includes(args[1].toLowerCase()))
                if(user !== undefined) {
                    user.voice.disconnect()
                    Object.defineProperty(spamkick, user.id, {
                        value: parseInt(args[2]) - 1,
                        configurable: true,
                        writable: true,
                        enumerable: true
                    })
                }
                message.reply('ok!')
            } catch {
                message.reply('error')
            }
        }
        if(args[0] == "mute" & config.admin.includes(message.author.id)) {
            var user
            if(args[1].startsWith('id:')) user = message.guild.members.cache.get(args[1].slice(3))
            else user = message.guild.members.cache.find(u => u.user.username.toLowerCase().includes(args[1].toLowerCase()))
            user.voice.setMute(true)
            Object.defineProperty(spammute, user.id, {
                value: parseInt(args[2]) - 1, 
                configurable: true,
                writable: true
            })
        }
    },
    onVoiceStateUpdate: function(oldstate, newstate) {
        if(oldstate.channel == null & newstate.channel !== null) {
            if(spamkick[newstate.member.id] !== undefined) {
                if(spamkick[newstate.member.id] < 1) return (delete spamkick[newstate.member.id])
                newstate.member.voice.disconnect()
                spamkick[newstate.member.id] = spamkick[newstate.member.id] - 1
                console.log(spamkick[newstate.member.id])
            }
        }
        if(oldstate.serverMute == true, newstate.serverMute == false) {
            const user = newstate.member
            if(spammute[user.id] !== undefined) {
                if(spammute[user.id] < 1) return (delete spammute[user.id])
                user.voice.setMute(true)
                spammute[user.id] = spammute[user.id] - 1
                console.log(spammute[user.id])
            }
        }
    }
}