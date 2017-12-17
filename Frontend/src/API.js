var API_URL = "http://www.ua-abs.tk:80";

function backendGet(url, callback) {
    $.ajax({
        url: API_URL + url,
        type: 'GET',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", "Negotiate");
        },
        async: true,
        success: function(data){
            callback(null, data);
        },
        error: function() {
            callback(new Error("Ajax Failed"));
        }
    })
}

function backendPost(url, data, callback) {
    $.ajax({
        url: API_URL + url,
        type: 'POST',
        beforeSend: function (request) {
            request.setRequestHeader("Authorization", "Negotiate");
        },
        async: true,
        contentType : 'application/json',
        data: JSON.stringify(data),
        success: function(data){
            callback(null, data);
        },
        error: function() {
            callback(new Error("Ajax Failed"));
        }
    })
}

exports.getFlights = function(callback) {
    backendGet("/api/get-flights/", callback);
};

exports.createOrder = function(order_info, callback) {
    backendPost("/api/create-order/", order_info, callback);
};

exports.sendMail=function(data, callback){
    backendPost("/api/send-mail/", data, callback);
};

exports.sendTickets=function(data, callback){
    backendPost("/api/send-tickets/", data, callback);
};

exports.getClientData=function(callback){
    backendGet("/api/get-client-data/", callback);
};

exports.sendComplaint=function(data, callback){
    backendPost("/api/send-complaint/", data, callback);
};

exports.sendCallOrder=function(data, callback){
    backendPost("/api/send-call-order/", data, callback);
};