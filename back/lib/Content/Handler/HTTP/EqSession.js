const fs     = require ('fs')
const crypto = require ('crypto')

module.exports = class extends require ('../../../Ext/Dia/Content/Handler/HTTP/Session/BasicSession.js') {

	async get_user () {

		if (!this.user) throw 403
		
        let s = await this.h.db.select_hash ('SELECT shop_user, shop_salt, shop_pass FROM ssh_settings WHERE id = 1')

		if (this.user != s.shop_user) throw 403

		let hash = await this.h.fork ({type: 'users', action: 'encrypt_password'}, {salt: s.shop_salt, password: this.password})

		if (s.shop_pass != hash) throw 403
		
		return this.user

    }

}