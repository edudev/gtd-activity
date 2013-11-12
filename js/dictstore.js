define(["sugar-web/activity/activity"], function (activity) {

    var dictstore = {};

    // This is a helper class that allows to persist key/value data
    // using the standard localStorage object.
    //
    // Usage:
    // ------
    //
    // // 1. Setup:
    //
    // onReadyCallback = function () {};
    // window.addEventListener('storeReady', onReadyCallback);
    //
    // dictstore.init(onReadyCallback);
    //
    // var value = myStore.read('key'); // read
    // myStore.write('key', newValue); // write
    //
    // // 2. Use localStorage directly, and then call save():
    //
    // var value = localStorage['key'];
    // localStorage['key'] = newValue;
    // dictstore.save();
    //
    function DictStore() {

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

    // Internally, it is stored as text in the JSON format in the
    // Sugar datastore.
    DictStore.prototype.save = function () {
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

    dictstore.DictStore = DictStore;

    return dictstore;

});
