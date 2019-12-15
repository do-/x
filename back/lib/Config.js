const fs  = require ('fs')
const Dia = require ('./Ext/Dia/Dia.js')
const Async = require ('./Content/Handler/Async.js')

module.exports = class {

    constructor () {

        const conf = JSON.parse (fs.readFileSync ('../conf/elud.json', 'utf8'))

        for (let k in conf) this [k] = conf [k]
        
        let model = new (require ('./Model.js')) ({path: './Model'})
        
        let create_db_pool = () => Dia.DB.Pool (this.db, model)
        
        this.ui_db_pool = create_db_pool ()

        this.pools = {
        
        	db: create_db_pool (),

            sessions: new (require ('./Ext/Dia/Cache/MapTimer.js')) ({
				name: 'session',
				ttl: this.auth.sessions.timeout * 60 * 1000,
			}),
			
			pwd_calc: new (require ('./Ext/Dia/Crypto/FileSaltHashCalculator.js')) ({
				salt_file: this.auth.salt_file,
			}),
			
			equip_timer: new (require ('./Timer.js')) ({
			
				period: 60000,
				
				todo: async () => {
				
					darn (await new Promise ((ok, fail) => {
					
						(new Async ({

							conf:  this, 
							pools: this.pools, 
							rq: {
								type: 'equipment_cfg_schedule', 
								action: 'check'
							}

						}, ok, fail)).run ()

					})) 

				}

			}),

        }

    }
    
    async call_load (type) {    
    	return new Promise ((ok, fail) => {		
			(new Async ({			
				conf: this, 
				pools: this.pools, 
				rq: {type, action: 'load'}				
			}, ok, fail)).run ()        		
		})
    }
    
    async init () {
    
		let db = this.pools.db
		
		await db.load_schema ()		
		await db.update_model ()
		
		await this.call_load ('ssh_settings')
		await this.call_load ('equipment_cfg_schedule')
				
    }
        
}