module.exports = {

    label : 'Запросы на передачу конфигурации КЕ',

    columns : {
        is_deleted      : 'int=0           // 1, если удален', 
        sap_id          : 'string          // id в SAP',
		json            : 'string          // тело сообщения',
		ts_created      : 'timestamp=now() // Дата/время создания',
    },

    keys : {
        ts_created: '(ts_created)',
    },

}