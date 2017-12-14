$(function(){
    var $logo = $("#logo");

    var canvas = document.getElementById('plane');
    var context;
    var plane = document.getElementById('scheme');
    var sits = new Array(40);

    var GoogleMap=require('./googleMaps');

    var flights = null;
    var dates=null;
    var count=0;
    var API=require('./API');
    var Pay=require('./payment');
    API.getFlights(function (error, data){
        if(error)alert(error);
        else flights=data;
        changeFlight();
    });
    var $flight = $("#flight");
    var date = document.getElementById("date");
    var $price=$("#price");
    var currentPrice=0;
    var $nameInput=$(".nameInput"), $phoneInput=$(".phoneInput"), $mailInput=$(".mailInput"), $addressInput=$(".addressInput");
    var $complaint=$("#complaint");
    var $date=$("#date");
    var $service=$("#service"), $complain=$("#complain"), $phone=$("#phone"), $details=$("#details"), $contact=$("#contact");
    var $background=$("#background"), $widget=$(".widget");

    var $client=$("#client");
    var $clientPhone=$("#tel");
    var $clientMail=$("#mail");
    var $clientAddress=$("#address");

    var $client2=$("#client2");
    var $clientMail2=$("#mail2");
    var $clientPhone2=$("#tel2");

    var $client3=$("#client3");
    var $clientPhone3=$("#tel3");
    var $clientMail3=$("#mail3");
    var $clientAddress3=$("#address3");

    function fillDates(dest) {
        for (var i = 0; i < flights.length; i++) {
            if (flights[i].dest === dest) {
                dates=flights[i].dates;
                $date.empty();
                for(var j=0;j<dates.length;j++){
                    date.add(new Option(dates[j].date, dates[j].date, j === 0, j === 0));
                }
                break;
            }
        }
    }
    function getTaken(date) {
        for (var i = 0; i < dates.length; i++) {
            if (dates[i].date === date){
                currentPrice=dates[i].price;
                return dates[i].taken;
            }
        }
    }

    function check(j, taken) {
        if(taken) {
            for (var i = 0; i < taken.length; i++) {
                if (taken[i] === j) return true;
            }
        }
        return false;
    }

    $flight.change(function () {
        count=0;
        changeFlight();
    });

    $date.change(function(){
        count=0;
        changeDate();
    });

    $logo.mouseover(function () {
        $logo.prop("src", "images/Logo.gif");
    });
    $logo.mouseout(function () {
        $logo.prop("src", "images/Logo2.png");
    });
    $logo.click(function () {
        location.reload();
    });
    $("#mainPage").click(function () {
        location.reload();
    });

    $(".close").click(function () {
        $widget.removeClass("enabled");
        count=0;
        $nameInput.val("");
        $nameInput.css("box-shadow", "none");
        $phoneInput.val("");
        $phoneInput.css("box-shadow", "none");
        $mailInput.val("");
        $mailInput.css("box-shadow", "none");
        $addressInput.val("");
        $addressInput.css("box-shadow", "none");
        $price.css("box-shadow", "none");
        window.setTimeout(function(){
            $widget.hide();
            $background.hide();
        }, 300);
    });

    function changeFlight() {
        var bool, flight, date;
        for (var i = 210, n = 0; i <= 740; i += 50) {
            for (var j = 585; j <= 810; j += 70) {
                flight=$flight.find(":selected").val();
                fillDates(flight);
                date=$("#date").find(":selected").val();
                bool = check(n, getTaken(date));
                sits[n++] = {
                    x: j,
                    y: i,
                    w: 60,
                    h: 40,
                    br: 6,
                    taken: bool,
                    marked: false
                };
                if (j === 655) j += 15;
            }
            if (i === 530 || i === 360) i += 20;
        }
        redraw();
        updatePrice();
    }

    function changeDate(){
        var bool, date;
        for (var i = 210, n = 0; i <= 740; i += 50) {
            for (var j = 585; j <= 810; j += 70) {
                date=$("#date").find(":selected").val();
                bool = check(n, getTaken(date));
                sits[n++] = {
                    x: j,
                    y: i,
                    w: 60,
                    h: 40,
                    br: 6,
                    taken: bool,
                    marked: false
                };
                if (j === 655) j += 15;
            }
            if (i === 530 || i === 360) i += 20;
        }
        redraw();
        updatePrice();
    }

    $("#oBook").click(function () {
        $("#book").show();
        window.setTimeout(function(){
            $("#book").addClass('enabled');
        }, 1);
        $("#background").show();
        context = canvas.getContext('2d');
        changeFlight();
    });

    var mousePos;
    window.onmousemove = function (event) {
        mousePos = getMousePos(canvas, event);
    };

    window.setInterval(function () {
        if (context) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            redraw();
            for (var k = 0; k < sits.length; k++) {
                if (mousePos.x >= sits[k].x && mousePos.x <= sits[k].x + sits[k].w && mousePos.y >= sits[k].y && mousePos.y <= sits[k].y + sits[k].h && !sits[k].taken && !sits[k].marked) {
                    context.fillStyle = 'lightgray';
                    context.roundRect(sits[k].x, sits[k].y, sits[k].w, sits[k].h, sits[k].br).fill();
                    break;
                }
            }
        }
    }, 60);

    $(canvas).click(function () {
        context.clearRect(0, 0, canvas.width, canvas.height);
        redraw();
        for (var k = 0; k < sits.length; k++) {
            if (mousePos.x >= sits[k].x && mousePos.x <= sits[k].x + sits[k].w && mousePos.y >= sits[k].y && mousePos.y <= sits[k].y + sits[k].h && !sits[k].taken) {
                if (!sits[k].marked){
                    context.fillStyle = 'gray';
                    count++;
                }
                else {
                    context.fillStyle = 'lightgray';
                    count--;
                }
                sits[k].marked = !sits[k].marked;
                context.roundRect(sits[k].x, sits[k].y, sits[k].w, sits[k].h, sits[k].br).fill();
                break;
            }
        }
        updatePrice();
    });


    function updatePrice(){
        $price.text(count*currentPrice*25+" грн");
        if(count>0)$price.css("box-shadow", "none");
    }
    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect(), // abs. size of element
            scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for X
            scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y

        return {
            x: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
            y: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
        }
    }

    $("#oPhone").click(function () {
        $phone.show();
        window.setTimeout(function(){
            $phone.addClass('enabled');
        }, 1);
        $background.show();
    });

    $("#oComplain").click(function () {
        $complain.show();
        window.setTimeout(function(){
            $complain.addClass('enabled');
            }, 1);
        $background.show();
    });

    $("#infoPage").click(function () {
        $details.show();
        window.setTimeout(function(){
            $details.addClass('enabled');
        }, 1);
        $background.show();
    });
    $("#contactPage").click(function () {
        $contact.show();
        window.setTimeout(function(){
            $contact.addClass('enabled');
        }, 1);
        $background.show();
        GoogleMap.init();
    });
    $("#servicePage").click(function () {
        $service.show();
        window.setTimeout(function(){
            $service.addClass('enabled');
        }, 1);
        $background.show();
    });



    $("#order").click(function(){
        event.preventDefault();
        var suc=true;


        var name = $client.val();
        if(name===""){
            $client.css("box-shadow", "0 0 3px #CC0000");
            suc=false;
        }
        else $client.css("box-shadow", "0 0 3px #006600");

        var phone = $clientPhone.val();
        if(phone==="" || (phone.charAt(0)==='+' && phone.length<13) || (phone.charAt(0)==='0' && phone.length<10)){
            $clientPhone.css("box-shadow", "0 0 3px #CC0000");
            suc=false;
        }
        else $clientPhone.css("box-shadow", "0 0 3px #006600");

        var mail = $clientMail.val();
        if(mail===""){
            $clientMail.css("box-shadow", "0 0 3px #CC0000");
            suc=false;
        }
        else $clientMail.css("box-shadow", "0 0 3px #006600");

        var address = $clientAddress.val();
        if(address===""){
            $clientAddress.css("box-shadow", "0 0 3px #CC0000");
            suc=false;
        }
        else $clientAddress.css("box-shadow", "0 0 3px #006600");

        var cost=parseInt($price.text().split(" ")[0]);
        if(cost===0){
            $price.css("box-shadow", "0 0 3px #CC0000");
            suc=false;
        }
        else $price.css("box-shadow", "0 0 0 none");

        if(suc) {
            var tickets;
            if(count===1)tickets=" квиток";
            else if(count>1 && count<=4)tickets=" квитка";
            else tickets=" квитків";
            var flightDetails="Рейс – "+$flight.find(":selected").text()+";\nДата – "+$date.find(":selected").text()+";\n"+count+tickets+";\n";
            var ordered=[];
            for(var i=0;i<sits.length;i++){
                if(sits[i].marked)ordered.push(i);
            }
            var e=document.getElementById("flight");
            var dest = e.options[e.selectedIndex].value;
            var order_info = {
                name: name,
                phone: phone,
                address: address,
                email: mail,
                cost: cost,
                flight: flightDetails,
                dest: dest,
                date: $date.find(":selected").text(),
                taken: ordered
            };
            API.createOrder(order_info, function (error, data) {
                if (error) alert(error);
                else {
                    window.LiqPayCheckoutCallback=Pay.create(data.data, data.signature);
                }
            });

        }
    });

    $nameInput.bind("keypress", function(event){
        var regex= new RegExp("^[0-9A-Za-zА-Яа-яІіЇїЄєҐґ'/ -]+$");
        var key=String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if(!regex.test(key)){
            event.preventDefault();
            return false;
        }
    });

    $nameInput.bind("keydown", function(event){
        window.setTimeout(function() {
            var $name;
            if(!$client.is(':hidden'))$name=$client;
            else if(!$client2.is(':hidden'))$name=$client2;
            else $name=$client3;
            if($name.val()===""){
                $name.css("box-shadow", "0 0 3px #CC0000");
            }
            else $name.css("box-shadow", "0 0 3px #006600");
        }, 0);
    });

    $phoneInput.bind("keypress", function(event){
        var regex;
        var key;
        var text=$(this).val();
        switch(text.length){
            case 0:
                regex=new RegExp("[0+]");
                break;
            case 1:
                if(text.charAt(0)!=='0') {
                    regex = new RegExp("[3]");
                    break;
                }
            case 2:
                if(text.charAt(0)!=='0') {
                    regex = new RegExp("[8]");
                    break;
                }
            case 3:
                if(text.charAt(0)!=='0') {
                    regex = new RegExp("[0]");
                    break;
                }
            default:
                regex = new RegExp("[0-9]");
        }
        key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if(!regex.test(key) || (text.charAt(0)==='0' && text.length===10) || (text.charAt(0)==='+' && text.length===13)){
            event.preventDefault();
            return false;
        }
    });

    $phoneInput.bind("keydown", function(event){
        window.setTimeout(function() {
            var $phone;
            if(!$clientPhone.is(':hidden'))$phone=$clientPhone;
            else if(!$clientPhone2.is(':hidden'))$phone=$clientPhone2;
            else $phone=$clientPhone3;
            if ($phone.val() === "" || ($phone.val().charAt(0) === '+' && $phone.val().length < 13) || ($phone.val().charAt(0) === '0' && $phone.val().length < 10)) {
                $phone.css("box-shadow", "0 0 3px #CC0000");
            }
            else $phone.css("box-shadow", "0 0 3px #006600");
        });
    });

    $mailInput.bind("keypress", function(event){
        var regex;
        var key;
        regex = new RegExp("^[0-9A-Za-z@.]+$");
        key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if(!regex.test(key)){
            event.preventDefault();
            return false;
        }
    });

    $mailInput.bind("keydown", function(event){
        window.setTimeout(function() {
            var $mail;
            if(!$clientMail.is(':hidden'))$mail=$clientMail;
            else if(!$clientMail2.is(':hidden'))$mail=$clientMail2;
            else $mail=$clientMail3;
            if ($mail.val() === "" || $mail.val().length < 5 || $mail.val().indexOf('@')===-1 || $mail.val().indexOf('.')===-1) {
                $mail.css("box-shadow", "0 0 3px #CC0000");
            }
            else $mail.css("box-shadow", "0 0 3px #006600");
        });
    });

    $addressInput.bind("keypress", function(event){
        var regex;
        var key;
        regex= new RegExp("^[0-9A-Za-zА-Яа-яІіЇїЄєҐґ'.,/ -]+$");
        key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
        if(!regex.test(key)){
            event.preventDefault();
            return false;
        }
    });

    $addressInput.bind("keydown", function(event){
        window.setTimeout(function() {
            var $address;
            if(!$clientAddress.is(':hidden'))$address=$clientAddress;
            else $address=$clientAddress3;
            if ($address.val() === "" || $address.val().length < 1) {
                $address.css("box-shadow", "0 0 3px #CC0000");
            }
            else $address.css("box-shadow", "0 0 3px #006600");
        });
    });

    $("#sendComplaint").click(function(){
        event.preventDefault();
        var suc=true;


        var name = $client3.val();
        if(name===""){
            $client3.css("box-shadow", "0 0 3px #CC0000");
            suc=false;
        }
        else $client3.css("box-shadow", "0 0 3px #006600");

        var phone = $clientPhone3.val();
        if(phone==="" || (phone.charAt(0)==='+' && phone.length<13) || (phone.charAt(0)==='0' && phone.length<10)){
            $clientPhone3.css("box-shadow", "0 0 3px #CC0000");
            suc=false;
        }
        else $clientPhone3.css("box-shadow", "0 0 3px #006600");

        var mail = $clientMail3.val();
        if(mail===""){
            $clientMail3.css("box-shadow", "0 0 3px #CC0000");
            suc=false;
        }
        else $clientMail3.css("box-shadow", "0 0 3px #006600");

        var address = $clientAddress3.val();
        if(address===""){
            $clientAddress3.css("box-shadow", "0 0 3px #CC0000");
            suc=false;
        }
        else $clientAddress3.css("box-shadow", "0 0 3px #006600");

        var complaint=$complaint.val();
        if(complaint===""){
            $complaint.css("box-shadow", "0 0 3px #CC0000");
            suc=false;
        }
        else $complaint.css("box-shadow", "0 0 3px #006600");

        if(suc) {
            API.sendComplaint({
                name: name,
                mail: mail,
                phone: phone,
                address:address,
                text: complaint
            });
            API.sendMail({
                    to: mail,
                    subject: 'Скаргу отримано',
                    message: 'Шановний(а) ' + name + "!\nДякуємо вам! Ми отримали вашу скаргу й обов'язково розглянемо її!"
                }
            );
            location.reload();
        }
    });

    $("#orderCall").click(function(){
        event.preventDefault();
        var suc=true;


        var name = $client2.val();
        if(name===""){
            $client2.css("box-shadow", "0 0 3px #CC0000");
            suc=false;
        }
        else $client2.css("box-shadow", "0 0 3px #006600");

        var phone = $clientPhone2.val();
        if(phone==="" || (phone.charAt(0)==='+' && phone.length<13) || (phone.charAt(0)==='0' && phone.length<10)){
            $clientPhone2.css("box-shadow", "0 0 3px #CC0000");
            suc=false;
        }
        else $clientPhone2.css("box-shadow", "0 0 3px #006600");

        var mail = $clientMail2.val();
        if(mail===""){
            $clientMail2.css("box-shadow", "0 0 3px #CC0000");
            suc=false;
        }
        else $clientMail2.css("box-shadow", "0 0 3px #006600");

        if(suc) {
            API.sendCallOrder({
                name: name,
                mail: mail,
                phone: phone
            });
            API.sendMail({
                    to: mail,
                    subject: 'Заяву отримано',
                    message: 'Шановний(а) ' + name + "!\nДякуємо вам! Ми вам зателефонуємо найближчим часом!"
                }
            );
            location.reload();
        }
    });

    function redraw() {
        if(context) {
            context.drawImage(plane, -600, 0, 2650, 1200);
            for (var i = 0; i < sits.length; i++) {
                if (sits[i].marked) context.fillStyle = 'gray';
                if (sits[i].taken) context.fillStyle = 'black';
                context.roundRect(sits[i].x, sits[i].y, sits[i].w, sits[i].h, sits[i].br).stroke();
                if (sits[i].taken || sits[i].marked) context.roundRect(sits[i].x, sits[i].y, sits[i].w, sits[i].h, sits[i].br).fill();
            }
        }
    }

    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;
        this.beginPath();
        this.moveTo(x + r, y);
        this.arcTo(x + w, y, x + w, y + h, r);
        this.arcTo(x + w, y + h, x, y + h, r);
        this.arcTo(x, y + h, x, y, r);
        this.arcTo(x, y, x + w, y, r);
        this.closePath();
        return this;
    };
});