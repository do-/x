$_DRAW.user = async function (data) {

    $('title').text (data.label)

    var layout = $('main').w2relayout ({

        name: 'main',

        panels: [
            {type: 'top', size: 230},
            {type: 'main', size: 400,
				tabs: [
                	{id: 'user_options', caption: 'Опции'},
				],
            },
        ],
                
    })

    $(layout.el ('top')).html (await to_fill ('user', data)).w2reform ({

        name: 'form',
        
        record: data,
        
    })

}