module.exports = {

    label : 'SSH-команды',

    columns : {
        is_deleted      : 'int=0           // 1, если удалена', 
        cmd             : 'string          // Команда',
        ttl             : 'int             // Время на исполнение, с',
        par             : 'int             // Максимальное число одновременных соединений',
        timeout         : 'int             // Максимальное время исполнения запроса в целом, с',
		ts_created      : 'timestamp=now() // Дата/время создания',
		addr            : 'text            // JSON-массив записей {host, cmd, src}',
		path            : 'string          // Относительный путь для файлов',
		request         : 'string          // Номер запроса из CMDB',

		ts_notif_start  : 'timestamp       // Дата/время начала отправки извещения',
		ts_notif_finish : 'timestamp       // Дата/время подтверждения доставки извещения',
		ts_notif_error  : 'timestamp       // Дата/время ошибки доставки извещения',
		notif_error     : 'string          // Ошибка доставки извещения',

		ts_notif_start2  : 'timestamp       // Дата/время начала отправки извещения',
		ts_notif_finish2 : 'timestamp       // Дата/время подтверждения доставки извещения',
		ts_notif_error2  : 'timestamp       // Дата/время ошибки доставки извещения',
		notif_error2     : 'string          // Ошибка доставки извещения',

    },

    keys : {
        ts_created: '(ts_created)',
    },

    triggers: {

    	before_insert: `

			SELECT ttl, par, timeout INTO NEW.ttl, NEW.par, NEW.timeout FROM ssh_settings WHERE id = 1;

			RETURN NEW;

    	`,

    	after_insert: `
    	    		
			INSERT INTO ssh_command_items (id_command, host, cmd, src) 
				SELECT 
					NEW.uuid id_command, 
					addr.* 
				FROM 
					json_to_recordset (NEW.addr::json) AS addr (host TEXT, cmd TEXT, src TEXT);

			RETURN NEW;
			
    	`,

    }

}