define(function (require) {

    var view = {};

    view.View = function () {
        // TODO: how to use CSS to set entry colors to user colors
        // this is the simplest way to indicate entries by user
        // this is also an awful way, but I can't think of a better one
        this.template =
            '<li data-id="{{id}}" class="{{completed}}" ' +
            'style="background-color: {{bg_color}}; color: {{fg_color}};">' +
            '<div class="view">' +
            '<input class="toggle" type="checkbox" {{checked}}>' +
            '<label>{{title}}</label>' +
            '<button class="remove"></button>' +
            '</div>' +
            '</li>';
    };

    // Create a string of HTML <li> elements inside with the given
    // items.
    view.View.prototype.show = function (items) {
        var i, l;
        var view = '';
        for (i = 0, l = items.length; i < l; i++) {
            var template = this.template;
            var completed = '';
            var checked = '';
            if (items[i].completed === 1) {
                completed = 'completed';
                checked = 'checked';
            }
            template = template.replace('{{id}}', items[i].id);
            template = template.replace('{{bg_color}}', items[i].colors.stroke);
            template = template.replace('{{fg_color}}', items[i].colors.fill);
            template = template.replace('{{title}}', items[i].title);
            template = template.replace('{{completed}}', completed);
            template = template.replace('{{checked}}', checked);
            view = view + template;
        }
        return view;
    };

    return view;

});
