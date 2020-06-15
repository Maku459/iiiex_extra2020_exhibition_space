import Swal from 'sweetalert2';
import 'modaal';
import 'modaal/dist/css/modaal.css'

$(document).ready(function(){
	$('#glass__now').on('click',function(){
		if($('#glass__buttons').css('display') == 'block'){
            $('#glass__buttons').fadeOut();
		}else{
            $('#glass__buttons').fadeIn();
		}
    });

	$('#glass__buttons a').on('click',function(e){
        e.preventDefault();
        let src = $(this).children('img').attr('src');
        $('#glass__now').children('img').attr('src', src);

    });

    $('#map__launcher').on('click',function(){
        Swal.fire({
            width: 800,
            imageUrl: '/images/map.png',
            imageWidth: 400,
            html: '<ul><li>①ぼやける境界</li><li>②気配のふるまい</li></ul>'
        })
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
    
})