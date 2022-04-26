//require
const fs = require('fs')
const discord = require('discord.js')
const config = require('./config.json')
//client
const intents = Object.values(discord.Intents.FLAGS)
const client = new discord.Client({intents: intents, partials: ['CHANNEL']})
module.exports.client = client
//modules
const modules = new Map()
fs.readdirSync('./modules').forEach(e => {
    const module = require('./modules/' + e)
    if(module.enabled == true) modules.set(module.name, module)
})
//client login
client.login(config.token)
//on ready
client.on('ready', () => {
    //load ready modules
    modules.forEach(mod => {
        if(mod.onReady !== undefined) mod.onReady()
    })
})
//on message
client.on('messageCreate', (message) => {
    if(message.author.id == client.user.id) return
    const args = message.content.split(' ')
    modules.forEach(mod => {
        if(mod.onMessage !== undefined) mod.onMessage(message, args)
    })
})
//on voice
client.on('voiceStateUpdate', (oldchannel, newchannel) => {
    modules.forEach(mod => {
        if(mod.onVoiceStateUpdate !== undefined) mod.onVoiceStateUpdate(oldchannel, newchannel)
    })
})
//on reaction add
client.on('messageReactionAdd', (reaction) => {
    modules.forEach(mod => {
        if(mod.onReactionAdd !== undefined) mod.onReactionAdd(reaction)
    })
}) 
//on reaction removed
client.on('messageReactionRemove', (reaction) => {
    modules.forEach(mod => {
        if(mod.onReactionRemoved !== undefined) mod.onReactionRemoved(reaction)
    })
}) 