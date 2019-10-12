$_DRAW.equipment_configs = async function (data) {

    $('title').text ("Передача конфигурации оборудования")

    $('main').w2regrid ({ 
    
        name: 'equipment_configs_grid',             
        
        show: {
            toolbar: true,
            footer: true,
//            toolbarAdd: true,
        },            
        
        columns: [                
            {field: 'ts_created', caption: 'Дата/время', size: 28, min: 155, render: _ts},
            {field: 'uuid', caption: 'UUID', size: 50, min: 250, style: 'font-family:courier'},
            {field: 'sap_id', caption: 'ID_SAP', size: 100},
        ],
                    
        src: data.src,

        onDblClick: (e) => open_tab   ('/equipment_config/' + e.recid),

    }).refresh ();

}