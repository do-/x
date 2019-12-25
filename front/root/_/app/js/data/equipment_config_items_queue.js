////////////////////////////////////////////////////////////////////////////////

$_GET.equipment_config_items_queue = async function (o) {

    let data = await response ({type: 'equipment_cfg_items_queue', part: 'vocs'})

    let dt = data.next_time; if (dt) {
    	data.next_time_label = 'до ' + dt_dmy (dt) + ' ' + dt.substr (11, 12)
    }
        
    $('body').data ('data', data)
    
    data.src = 'equipment_cfg_items_queue'
            
    return data

}