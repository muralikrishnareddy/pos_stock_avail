    function pos_product_available(instance, module){

        var PosModelSuper = module.PosModel
        module.PosModel = module.PosModel.extend({
            load_server_data: function(){
                var self = this;
                var loaded = PosModelSuper.prototype.load_server_data.call(this);

                loaded = loaded.then(function(){
                    return self.fetch(
                        'product.product',
                        ['qty_available'], //new field
                        [['sale_ok','=',true],['available_in_pos','=',true]],
                        {}
                    );

                }).then(function(products){
                    $.each(products, function(){
                        $.extend(self.db.get_product_by_id(this.id) || {}, this)
                    });
                    return $.when()
                })
                return loaded;
            },
        })
    }

    (function(){
        var _super = window.openerp.point_of_sale;
        window.openerp.point_of_sale = function(instance){
            _super(instance);
            var module = instance.point_of_sale;

            pos_product_available(instance, module);

        }
    })()

