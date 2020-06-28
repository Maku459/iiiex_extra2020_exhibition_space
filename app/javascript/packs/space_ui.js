import 'modaal';

$(document).ready(function(){
    $('.glass__buttons').modaal({
        content_source: '#glass__buttons'
    });

	$('#glass__buttons a').on('click',function(e){
        e.preventDefault();
        let src = $(this).children('img').attr('src');
        $('.glass__buttons').children('img').attr('src', src);
        $('.glass__buttons').modaal('close');
    });

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

    $('.map__modal').modaal({
        content_source: '#map__modal',
//        width: 700
    });   
})