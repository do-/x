module.exports = class {

	constructor (o) {
		this.o = o
	}
	
	clear () {
		if (!this.t) return
		clearTimeout (this.t)
		delete this.t
		darn ('Cancelled at ' + new Date (this.when))
		delete this.when
	}
	
	in (ms) {
	
		if (ms < 0) ms = 0

		let when = ms + new Date ().getTime ()
darn ([this.when, when])
		if (this.t) {
			if (this.when <= when) return darn ('Already was scheduled at ' + new Date (this.when))
			this.clear ()
		}

		this.when = when
		
		darn ('Scheduled at ' + new Date (when))
		
		this.t = setTimeout (() => {
			this.clear  ()
			this.o.todo ()
		}, ms)
		
	}
	
	now () {

		this.in (0)

	}
	
	next () {
	
		this.in (this.o.period)

	}
	
	at (when) {

		if (when instanceof Date) when = 0 + when
		
		this.in (when - new Date ())

	}	

}