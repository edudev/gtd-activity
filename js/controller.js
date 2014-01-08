define(function (require) {

    var collaboration = require("sugar-web/collaboration");

    var controller = {};

    // Take a model and view and act as the controller between them.
    controller.Controller = function (model, view) {
        var that = this;
        this.model = model;
        this.view = view;

        this.ENTER_KEY = 13;
        this.ESCAPE_KEY = 27;

        // not really sure if this is where these should be called
        // probably a higher level of abstraction would be nice
        function helloInit(msg) {
            if (! msg.sameUrl)
                return;

            collaboration.send({type: "list", items: that.model.items});
        }
        function listItems(msg) {
            if (! msg.sameUrl)
                return;

            // maybe a method in model would be nice
            var ids = [];
            for (var i = 0; i < that.model.items.length; i++) {
                ids.push(that.model.items[i].id);
            }

            for (var i = 0; i < msg.items.length; i++) {
                if (ids.indexOf(msg.items[i].id) === -1) {
                    ids.push(msg.items[i].id);
                    msg.items[i].local = false;
                    that.model.items.push(msg.items[i]);
                }
            }
            that.loadItems(that.model.items);
        }
        function addItem(msg) {
            if (! msg.sameUrl)
                return;

            // maybe a method in model would be nice
            msg.item.local = false;
            that.model.items.push(msg.item);
            that.loadItems(that.model.items);
        }
        function removeItem(msg) {
            if (! msg.sameUrl)
                return;

            that.model.remove(msg.id, true);
            that.loadItems(that.model.items);
        }
        function updateItem(msg) {
            if (! msg.sameUrl)
                return;

            msg.updateData.local = false;
            that.model.update(msg.id, msg.updateData, true);
            that.loadItems(that.model.items);
        }
        collaboration.hub.on("togetherjs.hello", helloInit);
        collaboration.hub.on("list", listItems);
        collaboration.hub.on("created", addItem);
        collaboration.hub.on("removed", removeItem);
        collaboration.hub.on("updated", updateItem);
    };

    controller.Controller.prototype.loadItems = function (items) {
        this.model.load(items);
        var list = document.getElementById("todo-list");
        list.innerHTML = this.view.show(items);
    };

    controller.Controller.prototype.addItem = function (title) {
        if (title.trim() === '') {
            return false;
        }
        var item = this.model.create(title);
        var list = document.getElementById("todo-list");
        list.innerHTML += this.view.show([item]);
        return true;
    };

    controller.Controller.prototype.removeItem = function (id) {
        this.model.remove(id, false);
        this.loadItems(this.model.items);
    };

    controller.Controller.prototype.toggleComplete = function (id, checkbox) {
        var completed = checkbox.checked ? 1 : 0;
        this.model.update(id, {completed: completed}, false);
        this.loadItems(this.model.items);
    };

    return controller;

});
