import 'modaal';
import 'modaal/dist/css/modaal.css'

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

    $('.map__modal').modaal({
        content_source: '#map__modal',
        width: 700
    });   
})