'use strict';

const PubNub = require('pubnub');

const pubnub = new PubNub({
    publishKey: "pub-c-e5093c86-4bbb-4733-80fe-74e032ad5792",
    subscribeKey: "sub-c-81328605-c3a6-447d-b0c7-fe64b05c5937",
    userId: "node-wineworld"
})

const listener = {
    status: (statusEvent) => {
        if (statusEvent.category === "PNConnectedCategory") {
            console.log("WineWorld PubNub Server Connected !");
        }
    },
    message: (messageEvent) => {
        console.log('Subscribed: ' + JSON.stringify(messageEvent.message));
    },
    presence: (presenceEvent) => {
        // handle presence
    }
};
pubnub.addListener(listener);

// publish message
const publishMessage = async (message) => {
    await pubnub.publish({
        channel: "wineWorld",
        message: message,
    });
}

// subscribe to a channel
pubnub.subscribe({
    channels: ["wineWorld"],
});



module.exports = {
    publishMessage: publishMessage
};