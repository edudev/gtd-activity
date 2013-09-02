define(function (require) {

    var model = {};

    model.Model = function () {
        this.items = [];
    };

    model.Model.prototype.load = function (items) {
        this.items = items;
    };

    model.Model.prototype.create = function (title) {
        title = title || '';

        var newItem = {
            id: new Date().getTime(),
            title: title.trim(),
            completed: 0
        };

        this.items.push(newItem);
        this.save();
        return newItem;
    };

    model.Model.prototype.remove = function (id) {
        var needSave = false;

        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].id == id) {
                this.items.splice(i, 1);
                needSave = true;
                break;
            }
        }

        if (needSave) {
            this.save();
        }
    };

    model.Model.prototype.update = function (id, updateData) {
        var needSave = false;

        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].id == id) {
                for (var x in updateData) {
                    this.items[i][x] = updateData[x];
                }
                needSave = true;
            }
        }

        if (needSave) {
            this.save();
        }
    };

    model.Model.prototype.save = function () {
        localStorage["gtd-items"] = JSON.stringify(this.items);
    };

    return model;

});
