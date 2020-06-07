import $ from 'jquery';

$(document).ready(function(){
	$('#glass__now').on('click',function(){
		if($('#glass__buttons').css('display') == 'block'){
			$('#glass__buttons').fadeOut();
		}else{
			$('#glass__buttons').fadeIn();
		}
	});
})