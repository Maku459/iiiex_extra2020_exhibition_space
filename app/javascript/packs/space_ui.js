import $ from 'jquery';

$(document).ready(function(){
	$('#glass__now').on('click',function(){
		if($('#glass__buttons').css('display') == 'block'){
			$('#glass__buttons').fadeOut();
		}else{
			$('#glass__buttons').fadeIn();
		}
	});
	//e.preventDefalt()でリンク無効にしました
	$('#glass__buttons a').on('click',function(e){
        e.preventDefault();
        let src = $(this).children('img').attr('src');
        $('#glass__now').children('img').attr('src', src);
	});
})