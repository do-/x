$_DRAW.ssh_host_popup = async function (data) {

    (await to_fill ('ssh_host_popup', data)).w2uppop ({}, function () {

        $('#w2ui-popup .w2ui-form').w2reform ({

            name: 'ssh_host_popup_form',

            record: data,

        })
    
    })

}
