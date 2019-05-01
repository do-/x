$_DRAW.user_password = async function (data) {

    (await use.jq ('user_password')).w2uppop ({}, function () {
        
        $('#w2ui-popup .w2ui-form').w2reform ({

            name: 'passwordForm',

            record: {},

            fields : [
                {name: 'p1', type: 'password'},
                {name: 'p2', type: 'password'},
            ],

        })

    })

}