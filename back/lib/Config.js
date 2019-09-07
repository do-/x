const fs  = require ('fs')
const Dia = require ('./Ext/Dia/Dia.js')

module.exports = class {

    constructor () {

        const conf = JSON.parse (fs.readFileSync ('../conf/elud.json', 'utf8'))
        
        conf.ssh.privateKey = fs.readFileSync (conf.ssh.private_key)

        for (let k in conf) this [k] = conf [k]

        this.pools = {db: this.setup_db ()}

    }

    setup_db () {
    
        let model = new (require ('./Model.js')) ({path: './Model'})

        return Dia.DB.Pool (this.db, model)

    }

}