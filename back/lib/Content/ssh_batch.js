module.exports = {

////////////////////////////////////////////////////////////////////////////////

do_run_ssh_batch: 

    async function () {
    
    	this.rq.id = this.uuid

		return await this.fork ({type: 'ssh_commands', action: 'create'}, {data: {
			cmd  : this.rq.cmd,
			ttl  : 5,
			addr : this.rq.addr,
		}})

    },

}