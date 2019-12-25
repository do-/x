$_DRAW.equipment_config_items_queue = async function (data) {

    $('title').text ("Очередь")

    $('main').w2regrid ({ 
    
        name: 'equipment_config_items_queue_grid',             
        
        show: {
            toolbarInput: true,
            toolbar: true,
            footer: true,
        },

        columns: [                
            {field: 'ext_id',         caption: 'uniq_ID',    size: 20, sortable: true, searchable: true},
            {field: 'ts_created',     caption: 'Запись в БД',    size: 10, render: _ts, sortable: true},
            {field: 'equipment_cfg_items_queue.uuid',     caption: 'Очередь',    size: 10, render: (r, x, y, v) => !v ? '' : data.next_time_label},
        ],
                    
        src: data.src,

        onDblClick: function (e) {show_block ('equipment_config_item_popup', this.get (e.recid))}

    }).refresh ();

}