const client = require('../index').client
module.exports = {
    name: "example",
    version: "1.0",
    author: "SamuelMeu",
    source: "url",
    enabled: true,
    onReady: function() {
        console.log(client.user.username)
    }
}