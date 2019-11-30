module.exports = class {

	constructor (o) {
		this.o = o
	}
	
	from_to (from, to) {
		this.o.from = from
		this.o.to   = to
	}
	
	clear () {
		if (!this.t) return
		clearTimeout (this.t)
		delete this.t
		delete this.when
	}
	
	in (ms) {
	
		if (ms < 0) ms = 0

		let when = ms + new Date ().getTime ()

		if (this.o.from) {
		
			let dt         = new Date (when)

			let hhmmss     = dt.toJSON ().slice (11, 19)

			let ge_from    = this.o.from <= hhmmss
			let le_to      =                hhmmss <= this.o.to
			
			let is_one_day = this.o.from <= this.o.to
			
			let is_in      = is_one_day ? ge_from && le_to : ge_from || le_to
			
			if (!is_in) {
				darn (`Out of ${this.o.from}..${this.o.to}, adjusting`)
				if (is_one_day && !le_to) dt.setDate (1 + dt.getDate ())
				let [h, m, s] = this.o.from.split (':')
				dt.setHours   (h)
				dt.setMinutes (m)
				dt.setSeconds (s)				
				when = dt.getTime ()
			}
						
		}
				
		if (this.t) {
			if (this.when <= when) return darn ('Already was scheduled at ' + new Date (this.when))
			this.clear ()
		}

		this.when = when

		this.t = setTimeout (() => {
			this.clear  ()
			this.o.todo ()
		}, when - new Date ().getTime ())

		darn ('Scheduled at ' + new Date (when))
		
	}
	
	now () {

		this.in (0)

	}
	
	next () {
	
		this.in (this.o.period)

	}

	on () {
	
		if (!this.t) this.now ()

	}
	
	at (when) {

		if (when instanceof Date) when = when.getTime ()
		
		this.in (when - new Date ().getTime ())

	}	
	
	get () {
	
		return new Date (this.when)
	
	}

}