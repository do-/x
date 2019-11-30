module.exports = {

    label: 'Конфигурации отдельных КЕ',

    columns: {    

        id_cfg    : "(equipment_cfgs) // запрос",
		ext_id    : 'string           // ext_id (имя хоста)',
		json      : 'string           // тело сообщения',

		ts_start  : 'timestamp        // Дата/время начала отправки',
		ts_finish : 'timestamp        // Дата/время подтверждения доставки',
		ts_error  : 'timestamp        // Дата/время ошибки доставки',
		error     : 'string           // Ошибка доставки',
		
    },

    keys: {
        id_cfg: 'id_cfg,ext_id',
    },

    triggers: {    

    	after_insert: `

			INSERT INTO equipment_cfg_items_queue (uuid) VALUES (NEW.uuid);

			RETURN NEW;

    	`,

    	after_update: `

    		IF NEW.ts_finish IS NOT NULL OR NEW.ts_error IS NOT NULL THEN 
    			DELETE FROM equipment_cfg_items_queue WHERE uuid = NEW.uuid;
    		END IF;

			RETURN NEW;

    	`,

    },

}