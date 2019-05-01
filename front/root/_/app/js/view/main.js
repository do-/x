$_DRAW.main = async function (data) {

    let $main = $('body').html ('<main/>')
    
    if ($_REQUEST.id) {
        use.block (en_unplural ($_REQUEST.type))
    }
    else {
        show_block ($_REQUEST.type)
    }

    show_block ('nav')
    
    return $main

}