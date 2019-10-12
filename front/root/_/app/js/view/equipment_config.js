$_DRAW.equipment_config = async function (data) {
    
    $('main').html (await to_fill ('equipment_config', data))

    $('title').text ($('header').text ())
        
    var layout = $('#container').w2relayout ({

        name: 'main',

        panels: [
            {type: 'main', size: 400, tabs: [
            	{id: 'equipment_config_items', caption: 'По hostaм'}
            ]},
        ],
                
    })    

}