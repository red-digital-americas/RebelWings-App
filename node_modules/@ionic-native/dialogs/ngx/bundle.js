'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var core$1 = require('@angular/core');
var core = require('@ionic-native/core');

var Dialogs = /** @class */ (function (_super) {
    tslib.__extends(Dialogs, _super);
    function Dialogs() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Dialogs.prototype.alert = function (message, title, buttonName) { return core.cordova(this, "alert", { "successIndex": 1, "errorIndex": 4 }, arguments); };
    Dialogs.prototype.confirm = function (message, title, buttonLabels) { return core.cordova(this, "confirm", { "successIndex": 1, "errorIndex": 4 }, arguments); };
    Dialogs.prototype.prompt = function (message, title, buttonLabels, defaultText) { return core.cordova(this, "prompt", { "successIndex": 1, "errorIndex": 5 }, arguments); };
    Dialogs.prototype.beep = function (times) { return core.cordova(this, "beep", { "sync": true }, arguments); };
    Dialogs.pluginName = "Dialogs";
    Dialogs.plugin = "cordova-plugin-dialogs";
    Dialogs.pluginRef = "navigator.notification";
    Dialogs.repo = "https://github.com/apache/cordova-plugin-dialogs";
    Dialogs.platforms = ["Amazon Fire OS", "Android", "Browser", "iOS", "Windows"];
    Dialogs.decorators = [
        { type: core$1.Injectable }
    ];
    return Dialogs;
}(core.IonicNativePlugin));

exports.Dialogs = Dialogs;
