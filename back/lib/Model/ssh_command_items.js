module.exports = {

    label: 'SSH-команды по hostaм',

    columns: {    
        id_command : "(ssh_commands) // команда",
        host       : 'string         // Host',
        port       : 'int=22         // Порт',
        username   : 'string         // Пользователь',
		ts_from    : 'timestamp,     // Дата/время запуска',
		ts_conn    : 'timestamp,     // Дата/время установления соединения',
		ts_to      : 'timestamp,     // Дата/время окончания',
		code       : 'int,           // Код завершения',
		signal     : 'string,        // Сигнал',
		error      : 'string,        // Ошибка',
    },

    keys: {
        id_command: 'id_command,host',
    },
    
    triggers: {

    	before_update: `
    	
    		IF 1=1
    			AND NEW.ts_to IS NOT NULL
    			AND NEW.ts_conn IS NULL
    			AND NEW.error IS NULL
    		THEN 
    			NEW.error := 'connection failed for unknown reason';
    		END IF;

			RETURN NEW;

    	`,

    }

}