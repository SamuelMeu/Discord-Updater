const checker = require('../dependencies/config')
const users = require('../dependencies/user')
const muted = new Map
const kicking = new Map
const prefix = require('../config.json').bot.prefix
const need = checker.check(true, 'need-admin', 'kick-mute')
const anwser = checker.check(true, 'answer', 'kick-mute')
module.exports = {
    name: "kick-mute",
    version: "1.0",
    author: "SamuelMeu",
    description: "used to spam kick or spam mute someone",
    enabled: true,
    onMessage: function(message, args) {
        if(args[0] == prefix + "kick") {
            if(need == true & !checker.check([], 'admins', 'bot').includes(message.author.id)) return
            const user = users.get(args[1], message.guild)
            if(user == undefined) message.reply('couldn\'t find this user')
            else {
                const num = parseInt(args[2])
                if(isNaN(num)) return message.reply('please specify the number of times you want to kick this user')
                kicking.set(user.id, num - 1)
                user.voice.disconnect()
                if(anwser) message.reply('ok!')
            }
        }
        else if(args[0] == prefix + "mute") {
            if(need == true & !checker.check([], 'admins', 'bot').includes(message.author.id)) return
            const user = users.get(args[1], message.guild)
            if(user == undefined) message.reply('couldn\'t find this user')
            else {
                const num = parseInt(args[2])
                if(isNaN(num)) return message.reply('please specify the number of times you want to mute this user')
                muted.set(user.id, num - 1)
                user.voice.setMute(true)
                if(anwser) message.reply('ok!')
            }
        }
    },
    onVoiceStateUpdate: function(oldstate, newstate) {
        if(oldstate.channel == undefined & newstate.channel !== undefined) {
            if(kicking.has(oldstate.member.id)) {
                if(kicking.get(oldstate.member.id) < 1) return kicking.delete(oldstate.member.id)
                oldstate.member.voice.disconnect()
                kicking.set(oldstate.member.id, kicking.get(oldstate.member.id) - 1)
            }
        }
        if(oldstate.serverMute == true & newstate.serverMute == false) {
            if(muted.has(oldstate.member.id)) {
                if(muted.get(oldstate.member.id) < 1) return muted.delete(oldstate.member.id)
                oldstate.member.voice.setMute(true)
                muted.set(oldstate.member.id, muted.get(oldstate.member.id) - 1)
            }
        }
    }
}