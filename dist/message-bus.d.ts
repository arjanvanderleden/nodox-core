import { IMessageBus } from "./interfaces/core-interfaces";
export declare class MessageSubscription {
    topic: string;
    callback: Function;
}
export declare class MessageBus implements IMessageBus {
    constructor();
    private subscriptions;
    subscribe(topic: string, callback: Function): void;
    unSubscribe(topic: string, callback: Function): void;
    publish(topic: string, data?: any): void;
}
