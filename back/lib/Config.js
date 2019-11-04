const fs  = require ('fs')
const Dia = require ('./Ext/Dia/Dia.js')

module.exports = class {

    constructor () {

        const conf = JSON.parse (fs.readFileSync ('../conf/elud.json', 'utf8'))

        for (let k in conf) this [k] = conf [k]

        this.pools = {
        
        	db: Dia.DB.Pool (this.db, new (require ('./Model.js')) ({path: './Model'})),

            sessions: new (require ('./Ext/Dia/Cache/MapTimer.js')) ({
				name: 'session',
				ttl: this.auth.sessions.timeout * 60 * 1000,
			}),
			
			pwd_calc: new (require ('./Ext/Dia/Crypto/FileSaltHashCalculator.js')) ({
				salt_file: this.auth.salt_file,
			}),

        }

    }
    
    async init () {
    
		let db = this.pools.db
		
		await db.load_schema ()
		
		await db.update_model ()
		
    }
        
}