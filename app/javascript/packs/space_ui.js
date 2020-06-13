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
    
})