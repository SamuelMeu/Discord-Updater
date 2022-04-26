const client = require('../index').client
const example_dep = require('../dependencies/example')
module.exports = {
    name: "example",
    version: "1.0",
    author: "SamuelMeu",
    source: "url",
    enabled: true,
    onReady: function() {
        example_dep.log(client.user.username)
    }
}