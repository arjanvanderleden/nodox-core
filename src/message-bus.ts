
import { IMessageBus } from "../interfaces/core-interfaces";

export class MessageSubscription {
    topic: string;
    callback: Function;
}

export class MessageBus implements IMessageBus {
    constructor() {
    }

    private subscriptions = new Array<MessageSubscription>();

    subscribe(topic: string, callback: Function) {
        //only one subscription per topic/callback pair
        for (var i = 0; i < this.subscriptions.length; i++) {
            if (this.subscriptions[i].topic === topic && this.subscriptions[i].callback === callback) return;
        }
        var ms = new MessageSubscription();
        ms.topic = topic;
        ms.callback = callback;
        this.subscriptions.push(ms);
    }

    unSubscribe(topic: string, callback: Function) {
        for (var i = 0; i < this.subscriptions.length; i++) {
            if (this.subscriptions[i].topic === topic && this.subscriptions[i].callback === callback) {
                this.subscriptions.splice(i, 1);
            }
        }
    }

    publish(topic: string, ...args: Array<any>) {
        this.subscriptions.forEach((subscr: MessageSubscription, i: number) => {
            if (subscr.topic === topic) {
                setTimeout(function () {
                    subscr.callback(args);
                });
            }
        });
    }
}

