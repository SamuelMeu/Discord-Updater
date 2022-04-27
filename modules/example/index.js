const client = require('../index').client
const example = require('../dependencies/example')
module.exports = {
    name: "example",
    version: "1.0",
    author: "SamuelMeu",
    enabled: true,
    onReady: function() {
        example.log(client.user.username)
    }
}