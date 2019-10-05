const HTTPJsonRpc = require ('../../Ext/Dia/Content/Handler/HTTP/JsonRpc.js')

module.exports = class extends HTTPJsonRpc.Handler {

    constructor (o) {
    	super (o)
    	this.import ((require ('./Base')), ['get_log_banner', 'get_method_name', 'fork'])
    }

    is_transactional () { return false }

}