module.exports = {

////////////////////////////////////////////////////////////////////////////////

do_run_ssh_batch: 

    async function () {
    
    	this.rq.id = this.uuid
    	
        if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test (this.rq.id)) throw "-32602 Request id is not a UUID"
        
		return await this.fork ({type: 'ssh_commands', action: 'create'}, {data: {
			cmd  : this.rq.cmd,
			ttl  : 5,
			addr : this.rq.addr,
		}})

    },

}