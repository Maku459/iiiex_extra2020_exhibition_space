import 'modaal';

$(document).ready(function(){
    $('#stick__cursor').on('touchstart',function(){
        var clickpos = [];
        clickpos = event.touches[0];
        $('#stick__cursor').on('touchmove',function(){
            var deltaX, deltaY;
            deltaX = event.touches[0].clientX - clickpos.clientX;
            deltaY = event.touches[0].clientY - clickpos.clientY;
            var scale = Math.sqrt(deltaX ** 2 + deltaY ** 2) * 2 / parseFloat($('#stickpad__container').css('width'));
            deltaX /= Math.max(1, scale);
            deltaY /= Math.max(1, scale);
            var obj = $('.stick-cursor').offset();
            obj.left += deltaX;
            obj.top += deltaY;
            $('#stick__cursor').offset(obj);
        })
    })
    
    $('#stick__cursor').on('touchend',function(){
        $('#stick__cursor').offset($('.stick-cursor').offset());
    })

    $('.button_speak').modaal({
		content_source: '#button_speak'
	});

	$('.speak_active > a > img').on('click',function(e){
		console.log("close")
		$('.button_speak').modaal('close');
    });
    
    var now_hour = new Date().getHours();
    if ( 11 <= now_hour && now_hour <= 19 ){
        $('.button_speak').css('background', '#ffaf1b');
        $('.button_speak').css('border-color', '#ffaf1b');
		$('.speak_inactive').css('display','none');
		$('.speak_active').css('display','block');
    } else {
        $('.button_speak').css('background', '#80807F');
        $('.button_speak').css('border-color', '#80807F');
		$('.speak_active').css('display','none');
		$('.speak_inactive').css('display','block');
    }


    $('.map__modal').modaal({
        content_source: '#map__modal',
//        width: 700
    });   
})

