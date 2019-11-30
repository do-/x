module.exports = class {

	constructor (o) {
		this.o = o
	}
	
	clear () {
		if (!this.t) return
		clearTimeout (this.t)
		delete this.t
		delete this.when
	}
	
	in (ms = 0) {
	
		if (ms < 0) ms = 0

		let when = ms + new Date ().getTime ()

		if (this.t) {
			if (this.when <= when) return
			this.clear ()
		}

		this.when = when
		
		darn ('Scheduled at ' + new Date (when))
		
		setTimeout (this.o.todo, ms)
		
	}
	
	at (when) {

		if (when instanceof Date) when = 0 + when
		
		this.in (when - new Date ())

	}	

}