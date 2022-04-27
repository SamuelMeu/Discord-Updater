const fs = require('fs')
const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'))
module.exports = {
    version: 1,
    by: "SamuelMeu",
    check: function(value, name, categ) {
        if(categ !== undefined) {
            if(config[categ] == undefined) {
                Object.defineProperty(config, categ, {
                    value: {
                        
                    },
                    enumerable: true,
                    configurable: true,
                    writable: true
                })
                Object.defineProperty(config[categ], name, {
                    value: value,
                    enumerable: true
                })
                console.log('a module required a new variable in config.json, please fill out the value of ' + name + ' in ' + categ)
                fs.writeFileSync('./config.json', JSON.stringify(config, null, 4), 'utf8')
                exit()
            } else if(config[categ] !== undefined) {
                if(config[categ][name] == undefined) {
                    Object.defineProperty(config[categ], name, {
                        value: value,
                        enumerable: true
                    })
                    console.log('a module required a new variable in config.json, please fill out the value of ' + name + ' in ' + categ)
                    fs.writeFileSync('./config.json', JSON.stringify(config, null, 4), 'utf8')
                    exit()
                }
                else return config[categ][name]
            }
        }
        else {
            if(config[name] !== undefined) {
                return config[name]
            } else {
                Object.defineProperty(config, name, {
                    value: value,
                    enumerable: true
                })
                fs.writeFileSync('./config.json', JSON.stringify(config, null, 4), 'utf8')
                console.log('a module required a new variable in config.json, please fill out the value of ' + name)
                exit()
            }
        }
    }
}
function exit() {
    setTimeout(process.exit(), 3000)
}