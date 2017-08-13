"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MessageSubscription = (function () {
    function MessageSubscription() {
    }
    return MessageSubscription;
}());
exports.MessageSubscription = MessageSubscription;
var MessageBus = (function () {
    function MessageBus() {
        this.subscriptions = new Array();
    }
    MessageBus.prototype.subscribe = function (topic, callback) {
        //only one subscription per topic/callback pair
        for (var i = 0; i < this.subscriptions.length; i++) {
            if (this.subscriptions[i].topic === topic && this.subscriptions[i].callback === callback)
                return;
        }
        var ms = new MessageSubscription();
        ms.topic = topic;
        ms.callback = callback;
        this.subscriptions.push(ms);
    };
    MessageBus.prototype.unSubscribe = function (topic, callback) {
        for (var i = 0; i < this.subscriptions.length; i++) {
            if (this.subscriptions[i].topic === topic && this.subscriptions[i].callback === callback) {
                this.subscriptions.splice(i, 1);
            }
        }
    };
    MessageBus.prototype.publish = function (topic) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.subscriptions.forEach(function (subscr, i) {
            if (subscr.topic === topic) {
                setTimeout(function () {
                    subscr.callback(args);
                });
            }
        });
    };
    return MessageBus;
}());
exports.MessageBus = MessageBus;
