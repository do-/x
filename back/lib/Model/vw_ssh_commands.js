module.exports = {

    label: 'SSH-команды по hostaм',

    columns: {
    
        is_deleted      : 'int=0           // 1, если удалена', 
        cmd             : 'string          // Команда',
        ttl             : 'int             // Время на исполнение, с',
		addr            : 'text            // JSON-массив записей {host, port, username}',
		ts_created      : 'timestamp=now() // Дата/время создания',
		ts_notif_start  : 'timestamp       // Дата/время начала отправки извещения',
		ts_notif_finish : 'timestamp       // Дата/время подтверждения доставки извещения',
		ts_notif_error  : 'timestamp       // Дата/время ошибки доставки извещения',
		notif_error     : 'string          // Ошибка доставки извещения',
		path            : 'string          // Относительный путь для файлов',

		ms_exec         : 'int,            // время исполнения, мс',
		ms_notif        : 'int,            // время извещения, мс',
	
    },

    sql: `
    	SELECT

    		uuid,      
    		is_deleted,      
			cmd,
			ttl,
			addr,
			ts_created,
			ts_notif_start,
			ts_notif_finish,
			ts_notif_error,
			notif_error, 
			path,    
			
			1000 * (extract (epoch from ts_notif_start) - extract (epoch from ts_created)) ms_exec,
			1000 * (extract (epoch from coalesce (ts_notif_finish, ts_notif_error)) - extract (epoch from ts_notif_start)) ms_notif

    	FROM
    		ssh_commands
    `,

}