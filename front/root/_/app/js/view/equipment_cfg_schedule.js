$_DRAW.equipment_cfg_schedule = async function (data) {

    (await to_fill ('equipment_cfg_schedule', data)).w2uppop ({}, function () {

        $('#w2ui-popup .w2ui-form').w2reform ({

            name: 'equipment_cfg_schedule_form',

            record: data,
            
            field_options: {
            	hh_from: {options: {max: 23}},
            	hh_to: {options: {max: 23}},
            	mm_from: {options: {max: 59}},
            	mm_to: {options: {max: 59}},
            }
            
        })
                    
    })

}