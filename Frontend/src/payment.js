var sender=require("./API");

var create = function (data, signature) {
    var suc;
    LiqPayCheckout.init({
        data: data,
        signature: signature,
        embedTo: "#liqpay",
        mode: "popup"
    }).on("liqpay.callback", function (data) {
        console.log(data.status);
        console.log(data);
        if(data.status!=="failure") {
            sender.getClientData(function(error, response){
                if(error)alert(error);
                else {
                    console.log(response);
                    sender.sendMail({
                            to:response.email,
                        subject:'Бронювання квитків',
                        message:'Шановний(а) ' + response.name + '\nБілети було заброньовано.\nВи можете їх забрати у будь-якому відділенні нашої компанії.\nКод замовлення: ' + response.code
                    });
                    sender.sendTickets({
                        dest: response.dest,
                        date: response.date,
                        taken: response.taken
                    });
                }
            });
        }
        suc=data.result==="success";
    }).on("liqpay.ready", function (data) {
    }).on("liqpay.close", function (data) {
        if(suc) {
            window.location.href = '/';
        }
    });
};

exports.create=create;