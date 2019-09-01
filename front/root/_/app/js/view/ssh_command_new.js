$_DRAW.ssh_command_new = async function (data) {

    (await to_fill ('ssh_command_new', data)).w2uppop ({}, function () {

        $('#w2ui-popup .w2ui-form').w2reform ({

            name: 'users_new_form',

            record: data,

            field_options : {                
                id_role: {voc: data.roles},
            },

        })
        
		$('#container').w2regrid ({ 

			name: 'ssh_hosts_grid',             

			show: {
				toolbar: false,
				header: false,
				footer: false,
				selectColumn: true,
			},            

			columns: [                
				{field: 'host',   caption: 'host',    size: 100, sortable: true},
			],

			src: 'ssh_hosts',

		}).refresh ();
        
    
    })

}
