define(["sugar-web/activity/activity"], function (activity) {

    var jsonstore = {};

    // This is a helper class that allows to store JSON data using
    // standard localStorage.
    //
    // Usage:
    // ------
    //
    // myReadyCallback = function () {};
    // window.addEventListener('storeReady', myReadyCallback);
    //
    // myStore = jsonstore.JSONStore();
    //
    // var value = myStore.read('key'); // read
    // myStore.write('key', newValue); // write
    //
    // // Or use localStorage directly, and then call save():
    //
    // var value = localStorage['key'];
    // localStorage['key'] = newValue;
    // myStore.save();
    //
    function JSONStore() {

        this.readyEvent = new CustomEvent(
            "storeReady",
            {
                detail: {},
                bubbles: true,
                cancelable: true
            }
        );

        if (window.sugar.environment === undefined) {
            // In standalone mode, use localStorage as is.
            window.dispatchEvent(this.readyEvent);

        } else {
            // In Sugar, set localStorage from the datastore.
            localStorage.clear();
            var that = this;

            function onLoaded(error, metadata, jsonData) {
                var data = JSON.parse(jsonData)
                for (var i in data) {
                    localStorage[i] = data[i];
                }

                window.dispatchEvent(that.readyEvent);

            }
            activity.getDatastoreObject().loadAsText(onLoaded);
        }
    }

    JSONStore.prototype.read = function (key) {
        return localStorage[key];
    }

    JSONStore.prototype.write = function (key, value) {
        localStorage[key] = value;
        this.save();
    }

    JSONStore.prototype.save = function () {
        var datastoreObject = activity.getDatastoreObject();
        var jsonData = JSON.stringify(localStorage);
        datastoreObject.setDataAsText(jsonData);
        datastoreObject.save(function (error) {
            if (error === null) {
                console.log("write done.");
            }
            else {
                console.log(["write failed.", error]);
            }
        });
    }

    jsonstore.JSONStore = JSONStore;

    return jsonstore;

});
