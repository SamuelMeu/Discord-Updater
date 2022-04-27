const client = require('../index').client
module.exports = {
    version: 1,
    by: 'samuelMeu',
    get(name, guild) {
        if(guild == undefined) {
            var user
            if(name.startsWith('id:')) return client.users.cache.get(name.slice(3))
            user = client.users.cache.find(u => u.tag.toLowerCase().includes(name.toLowerCase()))
            if(user == undefined) user = client.users.cache.find(u => u.username.toLowerCase().includes(name.toLowerCase()))
            return user
        } else {
            var user
            if(name.startsWith('id:')) return guild.members.cache.get(name.slice(3))
            user = guild.members.cache.find(u => u.user.tag.toLowerCase().includes(name.toLowerCase()))
            if(user == undefined) user = guild.members.cache.find(u => u.nickname.toLowerCase().includes(name.toLowerCase()))
            return user
        }
    }
}