$_DRAW.equipment_config_items = async function (data) {

    $(w2_waiting_panel ()).w2regrid ({
    
        name: 'equipment_config_items_grid',             
        
        show: {
            toolbarInput: true,
            toolbar: true,
            footer: true,
        },
        
	    toolbar: {
      		items: [
//      		  {type: 'button', id: 'printButton', caption: 'MS Excel', onClick: function (e) {this.owner.saveAsXLS ()}},
      		]
      	},

        columns: [                
            {field: 'ext_id',         caption: 'uniq_ID',    size: 20, sortable: true, searchable: true},
            {field: 'ts_created',     caption: 'Запись в БД',    size: 1, min: 155, render: _ts, sortable: true},
            {field: 'equipment_cfg_items_queue.uuid',     caption: 'Очередь',    size: 1, min: 175, render: (r, x, y, v) => !v ? '' : data.next_time_label},
            {field: 'ts_start',       caption: 'Отправка',       size: 1, min: 155, render: _ts, sortable: true},
            {field: 'ts_finish',      caption: 'Ответ',          size: 1, min: 155, render: _ts, sortable: true},
            {field: 'ts_error',       caption: 'Ошибка',         size: 1, min: 155, render: _ts, sortable: true},
            {field: 'error',          caption: 'Суть проблемы',    size: 20},

            {field: 'ts_start2',       caption: 'Отправка 2',       size: 1, min: 155, render: _ts, sortable: true},
            {field: 'ts_finish2',      caption: 'Ответ 2',          size: 1, min: 155, render: _ts, sortable: true},
            {field: 'ts_error2',       caption: 'Ошибка 2',         size: 1, min: 155, render: _ts, sortable: true},
            {field: 'error2',          caption: 'Суть проблемы 2',    size: 20},

        ],
                    
        src: data.src,

        onDblClick: function (e) {show_block ('equipment_config_item_popup', this.get (e.recid))}

    }).refresh ();
    
}