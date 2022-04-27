const fs = require("fs");
const path = "./saves";
fs.access(path, (error) => {
  if (error) {
    fs.mkdir(path, (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Save: files will be saved in dependencies/saves");
      }
    });
  }
});

module.exports = class {
    constructor(name, autosave) {
        if(autosave == true) this.auto = true
        else this.auto = false
        this.name = name
        this.path = name + ".json"
        if(fs.existsSync('./saves/' + this.path)) {
            this.content = JSON.parse(fs.readFileSync('./saves/' + this.path, 'utf-8'))
        } else {
            this.content = new Object
            fs.writeFile('./saves/' + this.path, '{\n}', 'utf-8', () => {
                console.log('file will be saved in dependencies/saves/' + this.path)
            })
        }
    }
    has(name) {
        if(this.content[name] !== undefined) {
            return true
        } else return false
    }
    get(name) {
        return this.content[name]
    }
    set(name, content) {
        Object.defineProperty(this.content, name, {
            value: content,
            enumerable: true,
            writable: true,
            configurable: true
        })
        if(this.auto) this.save()
    }
    add(name, add) {
        this.set(name, this.get(name) += add)
        if(this.auto) this.save()
    }
    save() {
        fs.writeFile('./saves/' + this.path, JSON.stringify(this.content), 'utf-8', (err) => {
            if(err) console.log(err) 
            else return true
        })
    }
}

//example code:
/*
const save = require('./dependencies/save.js')
const file = new save('test', true)
file.set('salut', 'test')
console.log(file.get('salut'))
*/