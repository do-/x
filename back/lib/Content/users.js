const Dia = require ('../Ext/Dia/Dia.js')

module.exports = {

////////////////////////////////////////////////////////////////////////////////

get_vocs_of_users: 

    function () {

        return this.db.add_vocabularies ({_fields: this.db.model.tables.users.columns}, {
            roles: {},
        })

    },
    
////////////////////////////////////////////////////////////////////////////////

select_users: 
    
    function () {
   
        this.rq.sort = this.rq.sort || [{field: "label", direction: "asc"}]

        if (this.rq.searchLogic == 'OR') {

            let q = this.rq.search [0].value

            this.rq.search = [
                {field: 'label', operator: 'contains', value: q},
                {field: 'login', operator: 'contains', value: q},
                {field: 'mail',  operator: 'contains', value: q},
            ]

        }
    
        let filter = this.w2ui_filter ()
        
        filter ['uuid <>'] = '00000000-0000-0000-0000-000000000000'
        filter.is_deleted  = 0

        return this.db.add_all_cnt ({}, [{users: filter}, 'roles AS role'])

    },

////////////////////////////////////////////////////////////////////////////////
    
get_item_of_users: 

    async function () {
        
        let data = await this.db.get ([{users: 

            {uuid: this.rq.id},

        }, 'roles AS role'])
        
        data._fields = this.db.model.tables.users.columns
        
        return data

    },
        
////////////////////////////////////////////////////////////////////////////////

do_set_password_users: 

    async function () {

        if (this.rq.p1 == undefined) throw '#p1#: Получено пустое значение пароля'
        if (this.rq.p1 != this.rq.p2) throw '#p2#: Повторное значение пароля не сходится'

        let uuid = 
                   this.user.role == 'admin' ? this.rq.id : 
                   this.user.uuid

        let salt     = await this.encrypt_password (new Date ().toJSON (), Math.random ())
        let password = await this.encrypt_password (this.rq.p1, salt)

        return this.db.update ('users', {uuid, salt, password})

    },

////////////////////////////////////////////////////////////////////////////////

do_delete_users: 

    async function () {
    
        this.db.update ('users', {
            uuid        : this.rq.id, 
            is_deleted  : 1, 
        })

    },

////////////////////////////////////////////////////////////////////////////////

do_update_users: 

    async function () {
    
        let data = this.rq.data

        let uuid = this.rq.id

        let d = {uuid}

        for (let k of ['login', 'label', 'mail']) d [k] = data [k]
        
        try {
            await this.db.update ('users', d)
        }
        catch (x) {
            throw x.constraint == 'ix_users_login' ? '#login#: Этот login уже занят' : x
        }

    },

////////////////////////////////////////////////////////////////////////////////

do_create_users:

    async function () {
    
        let data = this.rq.data
            
        if (!data.id_role) throw '#id_role#: Не указана роль'

        let d = {uuid: this.rq.id}

        for (let k of ['login', 'label', 'id_role']) d [k] = data [k]        
        
        try {
            d.uuid = await this.db.insert ('users', d)
        }
        catch (x) {
            if (this.db.is_pk_violation (x)) return d
            throw x.constraint == 'ix_users_login' ? '#login#: Этот login уже занят' : x
        }
        
        return d

    },

}