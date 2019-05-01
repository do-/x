$_DRAW.nav = async function (data) {
    
    function part (name, items) {
    
        function button (o) {
        
            let $b = $('<button>').attr ({
                name:  o.id, 
                title: o.label, 
                class: 'svg-' + o.icon
            })
            
            if (o.id == 'open_' + $_REQUEST.type) $b.addClass ('active');
                else clickOn ($b, $_DO [o.id + '_nav']);

            return $b            
            
        }
        
        let $result = $('<' + name + '>')        
        for (let o of items) $result.append (button (o))        
        return $result
    
    }

    var $nav = 
        $('<nav class=left-sidebar>')
            .append (part ('header', data.header))
            .append (part ('footer', data.footer))
        .insertBefore ($('main'))

    $('body > nav header button').after ('<hr>')
    $('body > nav footer button').before ('<hr>')
    
    return $nav

}