module.exports = {

////////////////////////////////////////////////////////////////////////////////

do_create_sessions: 

    async function () {
    
        let user = await this.db.get ([{users: {
            login: this.rq.data.login,
        }}, 'roles(name)'])
        
        if (user.is_deleted) throw '#foo#: Вас пускать не велено'
                
        if (user.uuid) {
			let hash = await this.encrypt_password (this.rq.password, user.salt)
			if (user.password != hash) return {}
        }
        else if (this.conf.auth.allow_test_admin && this.rq.data.login == 'test' && this.rq.password == 'test') {
            user = await this.db.get ([{users: {uuid: '00000000-0000-0000-0000-000000000000'}}, 'roles(name)'])
        }
        else {
            return {}
        }

        this.session.user = user

        await this.session.start ()
        
        return {
        
			user: {
				id    : user.uuid,
				label : user.label,
				role  : user ['roles.name'],
			},
			
			timeout: this.session.o.timeout,
			
        }

    },
    
////////////////////////////////////////////////////////////////////////////////

do_delete_sessions: 

    function () {
    
        return this.session.finish ()
    
    },
    
////////////////////////////////////////////////////////////////////////////////

}