import $ from 'jquery';
import Swal from 'sweetalert2';
import modaal from 'modaal';

$(document).ready(function(){
	$('#glass__now').on('click',function(){
		if($('#glass__buttons').css('display') == 'block'){
            $('#glass__buttons').fadeOut();
		}else{
            $('#glass__buttons').fadeIn();
		}
    });

    /*
    $('#glass__now').on('click',function(){
        Swal.fire({
            html: '<ul class="glass__buttons"><li><a href="#" data-no="0" id="button__normal"><img src="/images/colorglass_transparent.png" alt="" width="80px" height="" border="0" /></a></li><li><a href="#" data-no="1" id="button__red"><img src="/images/colorglass_red.png" alt="" width="80px" height="" border="0" /></a></li><li><a href="#" data-no="2" id="button__green"><img src="/images/colorglass_green.png" alt="" width="80px" height="" border="0" /></a></li><li><a href="#" data-no="3" id="button__blue"><img src="/images/colorglass_blue.png" alt="" width="80px" height="" border="0" /></a></li></ul>'
        })
    });
    */

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