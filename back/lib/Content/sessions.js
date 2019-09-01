module.exports = {

////////////////////////////////////////////////////////////////////////////////

do_create_sessions: 

    async function () {
    
        let user = await this.db.get ([{users: {
            login: this.rq.data.login,
        }}, 'roles(name)'])
        
        if (user.is_deleted) throw '#foo#: Вас пускать не велено'
                
        if (user.uuid) {
            if (user.password != await this.session.password_hash (user.salt, this.rq.password)) return {}
        }
        else if (this.conf.auth.allow_test_admin && this.rq.data.login == 'test' && this.rq.password == 'test') {
            user = await this.db.get ([{users: {uuid: '00000000-0000-0000-0000-000000000000'}}, 'roles(name)'])
        }
        else {
            return {}
        }

        this.session.user = user
        await this.session.start ()
        
        user.role = user ['roles.name']
        user.id = user.uuid
        
        return {user, timeout: this.session.o.timeout}

    },
    
////////////////////////////////////////////////////////////////////////////////

do_delete_sessions: 

    function () {
    
        return this.session.finish ()
    
    },
    
////////////////////////////////////////////////////////////////////////////////

}