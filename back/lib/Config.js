const fs  = require ('fs')
const Dia = require ('./Ext/Dia/Dia.js')

module.exports = class {

    constructor () {

        const conf = JSON.parse (fs.readFileSync ('../conf/elud.json', 'utf8'))

        for (let k in conf) this [k] = conf [k]

        this.pools = {
        
        	db: Dia.DB.Pool (this.db, new (require ('./Model.js')) ({path: './Model'})),
        	
        	http_static_server: new (require ('node-static')).Server ('../../front/root', {serverInfo: '.'}),
            
            sessions: new (require ('./Ext/Dia/Cache/MapTimer.js')) ({
				name: 'session',
				ttl: this.auth.sessions.timeout * 60 * 1000,
			}),
			
        }
        
		try {
		
			let db = this.pools.db;
			
			(async () => {
				await db.load_schema ()
				await db.update_model ()
			})()

		}
		catch (x) {
			return darn (['DB MIGRATION FAILED', x])
		}        

    }
        
}