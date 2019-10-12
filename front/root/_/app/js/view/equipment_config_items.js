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
      		  {type: 'button', id: 'printButton', caption: 'MS Excel', onClick: function (e) {this.owner.saveAsXLS ()}},
      		]
      	},

        columns: [                
            {field: 'ext_id',         caption: 'Host',    size: 50, sortable: true, searchable: true},
            {field: 'ts_start',       caption: 'Начало',    size: 1, min: 155, render: _ts, sortable: true},
            {field: 'ts_finish',      caption: 'Окончание',    size: 1, min: 155, render: _ts, sortable: true},
            {field: 'ts_error',       caption: 'Ошибка',    size: 1, min: 155, render: _ts, sortable: true},
            {field: 'error',          caption: 'Суть проблемы',    size: 20},
        ],
                    
        src: data.src,

        onDblClick: null,

    }).refresh ();
    
}