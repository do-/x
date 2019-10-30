$_DRAW.equipment_config_item_popup = async function (data) {

    (await to_fill ('equipment_config_item_popup', data)).w2uppop ({}, function () {

        $('#w2ui-popup .w2ui-form').w2reform ({

            name: 'equipment_config_item_popup_form',

            record: data,

        })
    
    })

}
