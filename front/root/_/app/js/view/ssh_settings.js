$_DRAW.ssh_settings = async function (data) {

    (await to_fill ('ssh_settings', data)).w2uppop ({}, function () {

        $('#w2ui-popup .w2ui-form').w2reform ({

            name: 'ssh_settings_form',

            record: data,
            
        })
                    
    })

}