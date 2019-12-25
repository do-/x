////////////////////////////////////////////////////////////////////////////////

$_GET.equipment_config_item_popup = async function (o) {
    
    let data = clone (o); for (let k of ['json', 'error', 'error2']) data [k] = (s => {	
    
    	try {

    		return JSON.stringify (JSON.parse (s), null, 2)

    	}
    	catch (x) {

    		return s

    	}
    
    }) (o [k])

    if (data.ts_error) {
    	data.ts_finish = data.ts_error
    }
    else {
    	data.error = data.ts_start ? '200 OK' : ''
    }

    if (data.ts_error2) {
    	data.ts_finish2 = data.ts_error2
    }
    else {
    	data.error2 = data.ts_start2 ? '200 OK' : ''
    }

    return data
    
}