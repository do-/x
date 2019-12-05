module.exports = class {

	constructor (o) {
		this.o = o
	}
	
	from_to (from, to) {
		darn (`Timer: from_to (${from}, ${to}) called`)
		this.o.from = from
		this.o.to   = to
		darn ('Timer: o = ' + JSON.stringify (this.o))
	}
	
	clear () {
		darn ('Timer: clear () called')
		if (!this.t) return
		clearTimeout (this.t)
		delete this.t
		delete this.when
	}
	
	in (ms) {
	
		darn (`Timer: in (${ms}) called`)

		if (ms < 0) ms = 0

		let when = ms + new Date ().getTime ()

		if (this.o.from) {
		
			darn (`Timer: checking for ${this.o.from}..${this.o.to}`)

			let dt         = new Date (when)

			let hhmmss     = dt.toJSON ().slice (11, 19)

			let ge_from    = this.o.from <= hhmmss
			let le_to      =                hhmmss <= this.o.to
			
			let is_one_day = this.o.from <= this.o.to
			
			let is_in      = is_one_day ? ge_from && le_to : ge_from || le_to
			
			if (!is_in) {
			
				darn (`Timer: ${dt} is out of ${this.o.from}..${this.o.to}, adjusting`)
				
				if (is_one_day && !le_to) dt.setDate (1 + dt.getDate ())
				
				let [h, m, s] = this.o.from.split (':')
				
				dt.setHours   (h)
				dt.setMinutes (m)
				dt.setSeconds (s)				
				
				when = dt.getTime ()
			
			}
						
		}
				
		darn ('Timer: about to schedule at ' + new Date (when))

		if (this.t) {
			darn ('Timer: found to be scheduled at ' + new Date (this.when))
			if (this.when <= when) return darn ('Timer: will be called earlier, exiting')
			this.clear ()
		}

		this.t = setTimeout (async () => {
		
			darn ('Timer: about to clean up and call todo ()')
			
			this.is_busy = 1
			
				let ts = new Date ().getTime ()

					this.clear ()
					await this.o.todo ()

				let elapsed = new Date ().getTime () - ts

				darn ('Timer: todo () took ' + elapsed + ' ms')
			
			delete this.is_busy
			
			if (this.is_reset) {
			
				darn ('Timer: about to reset')

				delete this.is_reset
				
				this.in (this.o.period - elapsed)
			
			}
		
		}, when - new Date ().getTime ())

		darn ('Timer: now scheduled at ' + new Date (this.when = when))
		
	}
	
	now () {

		this.in (0)

	}
	
	next () {
	
		darn ('Timer: next () called')

		this.in (this.o.period)

	}

	on () {
	
		darn ('Timer: on () called')

		if (this.t) return darn ('Timer: already scheduled, exiting on ()')

		if (this.is_busy) {

			this.is_reset = 1

			return darn ('Timer: busy, resetting')

		}
	
		this.now ()

	}
	
	at (when) {

		if (when instanceof Date) when = when.getTime ()
		
		this.in (when - new Date ().getTime ())

	}	
	
	get () {
	
		return new Date (this.when)
	
	}

}