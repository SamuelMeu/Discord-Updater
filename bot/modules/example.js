const client = require('../index').client
const example = require('../dependencies/example')
module.exports = {
    name: "example",
    description: "an example module",
    version: "1.0",
    author: "SamuelMeu",
    source: "url",
    enabled: true,
    onReady: function() {
        example.log(client.user.username)
    }
}