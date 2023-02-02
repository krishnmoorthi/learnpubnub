let pubnub;
var userid = null;

function showMessage(message) {
    let priceValue = '.price-value-' + message.style;
    $(priceValue).html('&#x20B9;' + message.bidPrice);
}

function setupPubNub() {

    // Update this block with your publish/subscribe keys
    pubnub = new PubNub({
        publishKey: "pub-c-e5093c86-4bbb-4733-80fe-74e032ad5792",
        subscribeKey: "sub-c-81328605-c3a6-447d-b0c7-fe64b05c5937",
        userId: userid
    });

    // add listener
    const listener = {
        status: (statusEvent) => {
            if (statusEvent.category === "PNConnectedCategory") {
                console.log("I am Connected with user ID - " + userid);
            }
        },
        message: (messageEvent) => {
            showMessage(messageEvent.message);
        },
        presence: (presenceEvent) => {
            // handle presence
        }
    };
    pubnub.addListener(listener);

    // subscribe to a channel
    pubnub.subscribe({
        channels: ["wineWorld"]
    });
};

const getUser = () => {
    $('#homeModal').modal('show');
}

// run after page is loaded
window.onload = getUser;

// publish message
const publishMessage = async (product) => {
    // With the right payload, you can publish a message, add a reaction to a message,
    // send a push notification, or send a small payload called a signal.
    const publishPayload = {
        channel: "wineWorld",
        message: product
    };
    await pubnub.publish(publishPayload);
}

function IsEmail(email) {
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    var res = filter.test(email);
    return res;
}

$(document).ready(function () {

    $('#signup').click(function (e) {
        e.preventDefault();
        var email = $('#email').val();
        if (IsEmail(email)) {
            userid = email;
            $('#user').html('<i class="material-icons">person</i>' + userid);
            $("#validation_msg").addClass("hide");
            $('#homeModal').modal('hide');
            setupPubNub();
        } else {
            $("#validation_msg").removeClass("hide");
            $('#email').val('');
        }
    });

    $('.js_bid').click(function (e) {
        e.preventDefault();
        var style = this.getAttribute("data-style");
        var productName = this.getAttribute("data-productName");
        var bidPrice = $("input[name=" + style + "_bidPrice]").val();
        var bidData = {
            email: userid,
            style: style,
            productName: productName,
            bidPrice: bidPrice
        };
        $.ajax({
            url: '/publish',
            type: 'POST',
            data: bidData
        }).done(function (response) {
            console.log(response);
        }).fail(function (error) {
            console.log(error);
        });
    });
});