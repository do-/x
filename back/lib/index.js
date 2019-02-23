const Content = require ('./Content.js')

_ ()

async function _ () {

    let conf = new (require ('./Config.js'))
    
    try {
        await migrate (conf.pools.db)
    }
    catch (x) {
        return darn (['DB MIGRATION FAILED', x])
    }

    Content.create_http_server (conf)

}

async function migrate (db) {

    await db.load_schema ()
    await db.update_model ()

}