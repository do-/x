$_DRAW.mfsm_settings = async function (data) {

    (await to_fill ('mfsm_settings', data)).w2uppop ({}, function () {

        $('#w2ui-popup .w2ui-form').w2reform ({

            name: 'mfsm_settings_form',

            record: data,
            
        })
                    
    })

}