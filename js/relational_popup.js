(function($) {

    var RelationalPopup = {

        init: function() {
            // Key value pair of data name -> info like url/callback
            this.data = {};

            // Relational name attribute
            this.relationalNameAttribute = 'relational-name';
        },

        registerDataType: function(name, url, callback) {
            this.data[name] = {
                url: url,
                callback: callback
            }
        },

        openPopup: function(name) {
            if (!this.data[name]) {
                return false;
            }

            var win = window.open(this.data[name].url, name, 'height=500,width=800,resizable=yes,scrollbars=yes');
            win.focus();

            return true;
        },

        passDataToWindow: function(win, id, value) {
            if (win) {
                win.relationalPopupCallback(
                    window,
                    (win == window.opener),
                    window.name,
                    id,
                    value
                )
            }
        },

        passDataToParents: function(id, value) {
            var op = window.opener;
            while (op) {
                this.passDataToWindow(op, id, value);
                op = op.opener;
            }
        },

        getElementsByDataName: function(name) {
            return $('[data-' + this.relationalNameAttribute + '=' + name + ']');
        },

        applyDataToElements: function(name, id, value, is_immediate_parent) {
            // Get all the elements
            var elements = $.fn.relationalPopup().getElementsByDataName(name);

            elements.each(function(index, elem) {
                var o = new Option(value, id);

                elem.options[elem.options.length] = o;

                if (is_immediate_parent) {
                    o.selected = true;
                }
            });
        }

    };

    $.fn.relationalPopup = function() {

        return RelationalPopup;

    };

})(jQuery);

$.fn.relationalPopup().init();

function openRelationalPopup(name) {
    $.fn.relationalPopup().openPopup(name);
}

function addRelationalType(name, url, callback) {
    $.fn.relationalPopup().registerDataType(name, url, callback);
}

function passRelationalDataToParents(id, value) {
    $.fn.relationalPopup().passDataToParents(id, value);
}

function relationalPopupCallback(win, is_immediate_parent, name, id, value) {

    $.fn.relationalPopup().applyDataToElements(name, id, value, is_immediate_parent);

    if (is_immediate_parent) {
        win.close();
    }
}
