 $(document).ready(function(){

    //Выбор даты телефон
 	$('input[data-input="date"]').datepicker({
        timepicker: true,
        dateFormat: 'd MM yyyy'
    });
    //END Выбор даты телефон


    //Выбор городов
    $('select.dropdown').dropdown({
    	onChange: function(value, text, $selectedItem) {
    	      raschet();
    	    }
    });
    //END Выбор городов


    //Маска телефон
    $('input[data-mask="phone"]').mask('+7 (999) 999-9999');
    //END Маска телефона
    


    
    //Отправка заявок
    function send() {
        var from = $('[data-send="from"]').val();
        var to = $('[data-send="to"]').val();
        var tarif = $('input[name="tarif"]:checked').val();
        var price = $('.main__step__price__num').text();
        var date = $('[data-send="date"]').val();
        var phone = $('[data-send="phone"]').val();

        $.ajax({
             url: 'https://khasenov.ru/taxi-krim/telegram.php',
             type: 'post',
             data: {from:from, to:to, tarif:tarif, price:price, date:date, phone:phone},
             dataType: 'json',
             success: function(){
                 $('[data-modal="order-send"]').show();
             }
        });
    }
    //END Отправка заявок




    //Валидация формы
    $.validator.addMethod("phone", function(value) {
        return value.replace(/\D+/g,"").length >= 11;
    }, 'Введите номер телефона полностью');

    $('form[data-validate]').validate({
        rules: {
            phone: "phone"
        },
        submitHandler: function() {
           //Здесь должна быть AJAX отправка формы
           send();
        }
    });
    //END Валидация формы





    //Закрыть модальное окно
    $('[data-click="order-send-hide"]').click(function(){
        $('[data-modal="order-send"]').hide();
    });
    //END Закрыть модальное окно




    //Расчет стоимости
    function raschet() {
        var from = $('[data-send="from"]').val();
        var to = $('[data-send="to"]').val();
        var tarif = $('input[name="tarif"]:checked').val();
        $.ajax({
             url: 'https://khasenov.ru/taxi-krim/route.php',
             type: 'post',
             data: {from: from, to:to, tarif: tarif},
             beforeSend: function(){
                  $('body').css('opacity','0.5');
             },
             success: function(otvet){
                 $('.main__step__price__num').text(otvet.replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, "$1" + ' '));
                 $('body').css('opacity','1');
             }
        });

        $.ajax({
             url: 'https://khasenov.ru/taxi-krim/route-2.php',
             type: 'post',
             data: {from: from, to:to, tarif: tarif},
             dataType: "JSON",
             beforeSend: function(){
                  $('body').css('opacity','0.5');
             },
             success: function(otvet2){

                if(otvet2 != '0') {

                    $('#map').html('');

                    ymaps.ready(init);
                    function init(){
                        var map = new ymaps.Map("map", {center: [55.76, 37.64], zoom: 7});
                        var pointsArray = polyline_decode(otvet2);
                        var polylineObject = new ymaps.Polyline(pointsArray, {}, { strokeColor: '#ff0000', strokeWidth: 5, opacity: 0.8 } );
                        map.geoObjects.add(polylineObject);
                        map.setBounds(map.geoObjects.getBounds());
                    }

                    polyline_decode = function(str, precision) {
                        var index = 0,
                            lat = 0,
                            lng = 0,
                            coordinates = [],
                            shift = 0,
                            result = 0,
                            byte_var = null,
                            latitude_change,
                            longitude_change,
                            factor = Math.pow(10, precision || 5);

                        // Coordinates have variable length when encoded, so just keep
                        // track of whether we've hit the end of the string. In each
                        // loop iteration, a single coordinate is decoded.
                        while (index < str.length) {

                            // Reset shift, result, and byte_var
                            byte_var = null;
                            shift = 0;
                            result = 0;

                            do {
                                byte_var = str.charCodeAt(index++) - 63;
                                result |= (byte_var & 0x1f) << shift;
                                shift += 5;
                            } while (byte_var >= 0x20);

                            latitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

                            shift = result = 0;

                            do {
                                byte_var = str.charCodeAt(index++) - 63;
                                result |= (byte_var & 0x1f) << shift;
                                shift += 5;
                            } while (byte_var >= 0x20);

                            longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

                            lat += latitude_change;
                            lng += longitude_change;

                            coordinates.push([lat / factor, lng / factor]);
                        }

                        return coordinates;
                    }
                }

                 

             }
        });


    }
    //END Расчет стоимости





    $('input[name="tarif"]').on('change', function(){
        raschet(); 
    });





    ymaps.ready(init);
    function init(){
        var map = new ymaps.Map("map", {center: [45.375088, 34.517746], zoom: 7});
    }





    $('.head__hamburger').click(function(){
        $('.mobile__nav__wrapper').toggleClass('show');
        $(this).toggleClass('active');
    });

 });