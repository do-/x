const fs  = require ('fs')
const Dia = require ('./Ext/Dia/Dia.js')

module.exports = class {

    constructor () {

        const conf = JSON.parse (fs.readFileSync ('../conf/elud.json', 'utf8'))
        
        for (let k in conf) this [k] = conf [k]

        this.pools = {
        	db: this.setup_db (),
        	http_static_server: this.setup_http_static_server (),
        }
        
        const pk = JSON.parse (fs.readFileSync ('../../front/package.json', 'utf8'))
        
        this.static = {prefix: '__' + pk.version.replace (/\./g, '_')}

    }

    setup_db () {
    
        let model = new (require ('./Model.js')) ({path: './Model'})

        return Dia.DB.Pool (this.db, model)

    }
    
    setup_http_static_server () {
    
    	let s = require ('node-static')

    	return new s.Server ('../../front/root', {serverInfo: '.'})

    }

}