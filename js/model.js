define(function (require) {
    var dictstore = require("sugar-web/dictstore");
    var collaboration = require("sugar-web/collaboration");
    var activity = require("sugar-web/activity/activity");

    var model = {};
    var colors = { stroke: '#0000ff', fill: '#ff0000' };

    model.Model = function () {
        this.items = [];

        // these colors definately need some caching, atleast in activity.js
        function onResponseReceived(error, newColors) {
            if (error === null) {
                colors = newColors;
            }
        }
        activity.getXOColor(onResponseReceived);
    };

    model.Model.prototype.load = function (items) {
        this.items = items;
    };

    model.Model.prototype.create = function (title) {
        title = title || '';

        var newItem = {
            id: new Date().getTime(),
            title: title.trim(),
            completed: 0,
            local: true,
            colors: colors
        };

        this.items.push(newItem);
        this.save();
        collaboration.send({type: "created", item: newItem});
        return newItem;
    };

    model.Model.prototype.remove = function (id, remote) {
        var needSave = false;

        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].id == id) {
                needSave = true;
                this.items.splice(i, 1);
                break;
            }
        }

        if (needSave) {
            this.save();
            if (!remote) {
                collaboration.send({type: "removed", id: id});
            }
        }
    };

    model.Model.prototype.update = function (id, updateData, remote) {
        var needSave = false;

        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].id == id) {
                needSave = true;
                for (var x in updateData) {
                    this.items[i][x] = updateData[x];
                }
                // break???
            }
        }

        if (needSave) {
            this.save();
            if (!remote) {
                collaboration.send({type: "updated", id: id,
                                    updateData: updateData});
            }
        }
    };

    model.Model.prototype.save = function () {
        var localItems = [];
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].local === true) {
                localItems.push(this.items[i]);
            }
        }

        localStorage["gtd-items"] = JSON.stringify(localItems);
        dictstore.save();
    };

    return model;

});
