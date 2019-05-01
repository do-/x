$_DRAW.user = async function (data) {

    var __read_only = 1

    $('title').text (data.label)

    var layout = $('main').w2layout ({

        name: 'main',

        panels: [
            { type: 'top', size: 230},
            { type: 'main', size: 400,

                tabs: {

                    tabs: [
                        { id: 'user_options', caption: 'Опции'},
                    ],

                    onClick: $_DO.choose_tab_user

                }                

            },
        ],
        
        onRender: function (e) {
            this.get ('main').tabs.click (data.active_tab)
        }
        
        
    });

    $(layout.el ('top')).html (fill (await use.jq ('user'), data)).w2reform ({

        name: 'form',
        
        record: data,
        
        fields: [                
            {name: 'label', type: 'text'},
            {name: 'login', type: 'text'},
            {name: 'mail',  type: 'text'},
        ],            
        
        actions: {
        
            pass:   $_DO.pass_user,                
            delete: $_DO.delete_user,
            update: $_DO.update_user,

            edit:   function () {__read_only = 0; this.refresh ()},
            
            cancel: function () {
                if (!confirm ('Отменить несохранённые правки?')) return
                __read_only = 1; 
                this.record = clone (data)
                this.refresh ()
            },
            
        },
        
        onRefresh: function (e) {
        
            $('main input').prop ({disabled: __read_only})
            
            $('.w2ui-buttons button').each (function () {
                let $this = $(this)
                let is_ro = $this.is ('[data-edit]') ? 0 : 1
                $this.css ({display: is_ro == __read_only ? 'inline-block' : 'none'})
            })

        }

    })

}