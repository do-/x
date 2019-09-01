$_DRAW.ssh_command = async function (data) {

    $('title').text (data.cmd)
    
    $('main').html (await to_fill ('ssh_command', data))
    
    var layout = $('#container').w2relayout ({

        name: 'main',

        panels: [
            {type: 'main', size: 400, tabs: [
            	{id: 'ssh_command_items', caption: 'По hostaм'}
            ]},
        ],
                
    })    

/*
    var layout = $('main').w2relayout ({

        name: 'main',

        panels: [
            {type: 'main', size: 400},
        ],
                
    })

    $(layout.el ('main')).html (await to_fill ('user', data)).w2reform ({

        name: 'form',
        
        record: data,
        
    })
*/
}