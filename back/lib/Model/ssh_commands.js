module.exports = {

    label : 'SSH-команды',

    columns : {
        is_deleted      : 'int=0           // 1, если удалена', 
        cmd             : 'string          // Команда',
        ttl             : 'int             // Время на исполнение, с',
		ts_created      : 'timestamp=now() // Дата/время создания',
		addr            : 'text            // JSON-массив записей {host, port, username}',
		ts_notif_start  : 'timestamp       // Дата/время начала отправки извещения',
		ts_notif_finish : 'timestamp       // Дата/время подтверждения доставки извещения',
		ts_notif_error  : 'timestamp       // Дата/время ошибки доставки извещения',
		notif_error     : 'string          // Ошибка доставки извещения',
		path            : 'string          // Относительный путь для файлов',
    },

    keys : {
        ts_created: '(ts_created)',
    },
    
    triggers: {

    	before_insert: `
    	    		
			SELECT ttl INTO NEW.ttl FROM ssh_settings WHERE id = 1;
			
			RETURN NEW;
			
    	`,
    	
    	after_insert: `
    	    		
			INSERT INTO ssh_command_items (id_command, host, port, username) 
				SELECT 
					NEW.uuid id_command, 
					addr.* 
				FROM 
					json_to_recordset (NEW.addr::json) AS addr (host TEXT, port INT, username TEXT);

			RETURN NEW;
			
    	`,

    }

}