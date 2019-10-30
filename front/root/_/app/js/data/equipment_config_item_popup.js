////////////////////////////////////////////////////////////////////////////////

$_GET.equipment_config_item_popup = async function (o) {

    return {json: JSON.stringify (JSON.parse (o.json), null, 2)}
    
}