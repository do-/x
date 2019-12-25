module.exports = {

    label: 'SSH-команды по hostaм',

    columns: {
    
        is_deleted      : 'int=0           // 1, если удалена', 
        cmd             : 'string          // Команда',
        ttl             : 'int             // Время на исполнение, с',
        par             : 'int             // Максимальное число одновременных соединений',
        timeout         : 'int             // Максимальное время исполнения запроса в целом, с',
		addr            : 'text            // JSON-массив записей {host, port, username}',
		ts_created      : 'timestamp=now() // Дата/время создания',
		ts_notif_start  : 'timestamp       // Дата/время начала отправки извещения',
		ts_notif_finish : 'timestamp       // Дата/время подтверждения доставки извещения',
		ts_notif_error  : 'timestamp       // Дата/время ошибки доставки извещения',
		notif_error     : 'string          // Ошибка доставки извещения',
		ts_notif_start2  : 'timestamp       // Дата/время начала отправки извещения',
		ts_notif_finish2 : 'timestamp       // Дата/время подтверждения доставки извещения',
		ts_notif_error2  : 'timestamp       // Дата/время ошибки доставки извещения',
		notif_error2     : 'string          // Ошибка доставки извещения',
		path            : 'string          // Относительный путь для файлов',
		request         : 'string          // Номер запроса из CMDB',

		ms_exec         : 'int,            // время исполнения, мс',
		ms_notif        : 'int,            // время извещения, мс',
		ms_notif2        : 'int,            // время извещения, мс',
		
    },

    sql: `
    	SELECT

    		uuid,      
    		is_deleted,      
			cmd,
			ttl,
			par,
			timeout, 
			addr,
			ts_created,
			ts_notif_start,
			ts_notif_finish,
			ts_notif_error,
			notif_error, 
			ts_notif_start2,
			ts_notif_finish2,
			ts_notif_error2,
			notif_error2, 
			path,    
			request,

			1000 * (extract (epoch from ts_notif_start) - extract (epoch from ts_created)) ms_exec,
			1000 * (extract (epoch from coalesce (ts_notif_finish, ts_notif_error)) - extract (epoch from ts_notif_start)) ms_notif,
			1000 * (extract (epoch from coalesce (ts_notif_finish2, ts_notif_error2)) - extract (epoch from ts_notif_start2)) ms_notif2

    	FROM
    		ssh_commands
    `,

}