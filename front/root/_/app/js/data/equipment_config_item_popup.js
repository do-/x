////////////////////////////////////////////////////////////////////////////////

$_GET.equipment_config_item_popup = async function (o) {
    
    let data = clone (o); for (let k of ['json', 'error']) data [k] = (s => {	
    
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
    	data.error = '200 OK'
    }

    return data
    
}