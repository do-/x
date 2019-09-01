module.exports = {

    label : 'SSH-команды',

    columns : {
        is_deleted : 'int=0',             // 1, если удалена', 
        cmd        : 'string',            // Команда',
		ts_created : 'timestamp=now()',   // Дата/время создания 
    },

    keys : {
        ts_created: '(ts_created)',
    },

}