const read = require('readline')
const fs = require('fs')
const https = require('https')
const http = require('http')
const config = require('./configs/config.json')
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
    } else if(args[0] == "install") {
        var repo = 0
        check
        function check() {
            https.get(config.repos[repo] + args[1], res => {
                var data = ""
                res.on('data', dat => {
                    data += dat.toString()
                })
                res.on('end', () => {
                    const link = JSON.parse(data)[args[1]]
                    if(link !== undefined) {
                        https.get(link,(res) => {
                            const path = `./modules/${args[1].replace('/', '-')}.js`; 
                            const filePath = fs.createWriteStream(path);
                            res.pipe(filePath);
                            filePath.on('finish',() => {
                                filePath.close();
                                console.log(colors.FgGreen + 'Download Completed' + colors.Reset); 
                            })
                        })
                    } else {
                        console.log(colors.FgRed + "couldn't find the module " + args[1] + colors.Reset)
                    }
                })
                res.on('error')
            })
        }
    } else if(args[0] == "delete") {
        if(fs.existsSync(`./modules/${args[1]}.js`)) {
            fs.unlink(`./modules/${args[1]}.js`, (err) => {
                if(err) console.log(err)
                else console.log(colors.FgGreen + 'Deleted' + colors.Reset); 
            })
        } else console.log(colors.FgRed + args[1] + " is not installed" + colors.Reset)
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