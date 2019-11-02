const conf         = new (require ('./Config.js'))
const http_router  = new (require ('./HttpRouter.js')) (conf)

;(async () => {

	try {
		await conf.init ()
		await http_router.init ()
	}
	catch (e) {
		return darn (['Failed to initialize', e])
	}

}) ()