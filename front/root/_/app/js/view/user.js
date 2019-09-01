$_DRAW.user = async function (data) {

    $('title').text (data.label)

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

}