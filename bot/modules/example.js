const client = require('../index').client
module.exports = {
    name: "example",
    version: "1.0",
    author: "SamuelMeu",
    source: "url",
    onReady: function() {
        console.log(client.user.username)
    }
}