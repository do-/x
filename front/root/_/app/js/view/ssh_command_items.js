$_DRAW.ssh_command_items = async function (data) {

    $(w2_waiting_panel ()).w2regrid ({
    
        name: 'ssh_command_items_grid',             
        
        show: {
            toolbarInput: true,
            toolbar: true,
            footer: true,
        },            

        columns: [                
            {field: 'host',           caption: 'Host',    size: 50, sortable: true, searchable: true},
            {field: 'ts_from',        caption: 'Начало',    size: 50, render: _ts, sortable: true},
            {field: 'ts_conn',        caption: 'Соединение',    size: 50, render: _ts, sortable: true},
            {field: 'ts_to',          caption: 'Окончание',    size: 50, render: _ts, sortable: true},
            {field: 'ms_conn',        caption: 'Ожидание, мс',    size: 15, render: 'int'},
            {field: 'ms_exec',        caption: 'Исполнение, мс',    size: 15, render: 'int'},
            {field: 'ms_total',        caption: 'Всего, мс',    size: 15, render: 'int'},
            {field: 'code',           caption: 'Код',    size: 10},
            {field: 'signal',         caption: 'Сигнал',    size: 20},
            {field: 'error',          caption: 'Ошибка',    size: 20},
            {field: 'out',            caption: 'stdout',    size: 20, render: 'int'},
            {field: 'err',            caption: 'stderr',    size: 20, render: 'int'},
        ],
                    
        src: data.src,

        onDblClick: null,

        onClick: function (e) {
        
        	let col = this.columns [e.column]

        	let r = this.get (e.recid)

        	switch (col.field) {
        		case 'out': return $_DO.open_log_ssh_command_items (r.path_out)
        		case 'err': return $_DO.open_log_ssh_command_items (r.path_err)
        	}

        },

    }).refresh ();
    
}