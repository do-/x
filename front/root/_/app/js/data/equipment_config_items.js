////////////////////////////////////////////////////////////////////////////////

$_GET.equipment_config_items = async function (o) {

    let data = clone ($('body').data ('data'))

    data.src = ['equipment_cfg_items', 
    	{data: {id_cfg: $_REQUEST.id}}
    ]

    return data

}