$_DRAW.nav = async function (data) {

    var $nav = $(fill (await use.jq ('nav'), data))
        .insertBefore ($('main'))
    
    $('button', $nav).each (function () {
                    
        if (location.href.indexOf (this.name.substr (5)) < 0) return
        
        $(this).addClass ('active')
    
    })
    
    $('body > nav header button').after ('<hr>')
    $('body > nav footer button').before ('<hr>')
    
    return $nav

}