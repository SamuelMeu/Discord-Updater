const read = require('readline')
const fs = require('fs')
const https = require('https')
const http = require('http')
const config = require('./config.json')
const version = "1.1"
//colors for terminal
const colors = require('./colors.json')
console.log(colors.FgCyan + "helper: " + colors.Reset)
//read stream
const rl = read.createInterface({
    input: process.stdin,
    output: process.stdout
})
//on command
rl.on('line', (line) => {
    const args = line.split(' ')
    if(line == "update") {
        try {
            console.log('updating 1/2')
            const url = config.index;
            https.get(url,(res) => {
                const path = `./index.js`; 
                const filePath = fs.createWriteStream(path);
                res.pipe(filePath);
                filePath.on('finish',() => {
                    filePath.close();
                    console.log('updating 2/2'); 
                    const url = config.helper;
                    https.get(url,(res) => {
                        const path = `./helper.js`; 
                        const filePath = fs.createWriteStream(path);
                        res.pipe(filePath);
                        filePath.on('finish',() => {
                            filePath.close();
                            console.log(colors.FgGreen + 'download completed' + colors.Reset); 
                        })
                    })
                })
            })
        } catch {
            console.log(colors.FgRed + 'error' + colors.Reset)
        }
    } else if(args[0] == "mod" | args[0] == "module" | args[0] == "m") {
        //install
        if(args[1] == "install" | args[1] == "i") {
            var repo = 0
            check(repo)
            function check(num) {
                https.get("https://raw.githubusercontent.com" + config.repos[num] + "/" + args[2] + "/" + "module.json", res => {
                    var data = ""
                    res.on('data', dat => {
                        data += dat.toString()
                    })
                    res.on('end', () => {
                        if(res.statusCode !== 200) {
                            repo++
                            if(repo < config.repos.length) check(repo)
                            else console.log(colors.FgRed + "couldn't find the module" + colors.Reset)
                            return
                        }                        
                        const json = JSON.parse(data)
                        const link = "https://raw.githubusercontent.com" + config.repos[num] + "/" + args[2] + "/index.js"
                        if(json.dependencies.length !== 0) {
                            json.dependencies.forEach(d => {
                                const a = d.split('@')
                                if(a[1] >= deps.version(a[0])) return
                                else deps.add(a[0])
                            })
                        }
                        https.get(link,(res) => {
                            const path = "./modules/" + args[2].replaceAll('/', '') + ".js"; 
                            const filePath = fs.createWriteStream(path);
                            res.pipe(filePath);
                            filePath.on('finish', () => {
                                filePath.close();
                                console.log(colors.FgGreen + 'Downloaded ' + args[2] + colors.Reset); 
                            })
                        })
                    })
                })
            }
        }
        //delete
        else if(args[1] == "delete") {
            if(fs.existsSync(`./modules/${args[2].replaceAll('/', '')}.js`)) {
                fs.unlink(`./modules/${args[2].replaceAll('/', '')}.js`, (err) => {
                    if(err) console.log(err)
                    else console.log(colors.FgGreen + 'Deleted' + colors.Reset); 
                })
            } else console.log(colors.FgRed + args[2] + " is not installed" + colors.Reset)
        } 
    } else if(line == "version" | line == "v") {
        console.log('module bot V' + version)
    } else if(line == "help") {
        console.log(`${colors.FgBlue}help${colors.FgCyan}\n-> list of commands\n${colors.FgBlue}version${colors.FgCyan}\n-> module bot version\n${colors.FgBlue}update${colors.FgCyan}\n-> update module bot (index.js)\n${colors.FgBlue}install [module]${colors.FgCyan}\n-> install a new module\n${colors.FgBlue}delete [module]${colors.FgCyan}\n-> uninstall a module\n${colors.FgRed}exit${colors.Reset}`)
    } else if(line == "modules") {
        const modules = new Map()
        fs.readdirSync('./modules').forEach(e => {
            const module = require('./modules/' + e)
            if(module.enabled == true) modules.set(module.name, module)
        })
        modules.forEach(mod => {
            console.log(`-> module by ${mod.author}: ${mod.name}`)
        })
    } else if(line == "exit") {
        process.exit()
    } else {
        console.log(colors.FgRed + "-> type help for a list of commands" + colors.Reset)
    }
})
const deps = {
    add: function(name) {
        var repo = 0
        check(repo)
        function check(num) {
            https.get("https://raw.githubusercontent.com" + config['dependencies-repos'][num] + "/" + name, res => {
                const path = "./dependencies/" + name; 
                const filePath = fs.createWriteStream(path);
                if(res.statusCode !== 200) {
                    repo++
                    if(repo < config['dependencies-repos'].length) check(repo)
                    else console.log(colors.FgRed + "couldn't find the module" + colors.Reset)
                    return
                }    
                res.pipe(filePath);
                filePath.on('finish', () => {
                    filePath.close();
                    console.log(colors.FgGreen + 'Downloaded dep ' + name + colors.Reset); 
                })
            })
        }
    },
    delete: function(name) {
        if(fs.existsSync('./dependencies/' + name)) {
            fs.unlink('./dependencies/' + name)
            console.log(colors.FgGreen + 'Deleted ' + name + colors.Reset); 
        }
        else console.log(colors.FgRed + "couldn't find the dependence" + colors.Reset)
    },
    has: function(name) {
        if(fs.existsSync('./dependencies/' + name)) {
            return true
        }
        else return false
    },
    version: function(name) {
        if(fs.existsSync('./dependencies/' + name)) {
            return require('./dependencies/' + name).version
        }
        else return undefined
    }
}