
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
        suc=data.result==="success";
    }).on("liqpay.ready", function (data) {
//	ready
    }).on("liqpay.close", function (data) {
//	close
        if(suc) {
            alert("Транзакція успішна!\n    Дякуємо за купівлю!:)");
            window.location.href = '/';
        }
    });
};

exports.create=create;