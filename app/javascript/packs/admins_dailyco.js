import DailyIframe from "@daily-co/daily-js"

let callFrame = DailyIframe.createFrame({
	showLeaveButton: true,
});
let room;

$("#kick").hide();

$("#enter_room").on("click", () => {
	$("#kick").hide();
	room = $("input[name='rooms']:checked").val();
	let participants = callFrame.join({url: "https://iiiex.daily.co/" + room});
	setInterval( () => {
		updateUsers();
		$("#kick").show();
	}, 5000)
});

$("#remove_user").on("click", () => {
	let id = $("input[name='users']:checked").val();
	let kick = callFrame.updateParticipant(id, {eject: true});
//	console.log(kick);
	updateUsers();
})

const updateUsers = () => {
	$("#room").empty();
	$("#users_list").empty();
	let parts = callFrame.participants();
	$("#room").text("ルーム：https://iiiex.daily.co/" + room);
//	console.log(parts)
	$("#users_list").html(Object.keys(parts).map(key => `<label>&nbsp;<input type="radio" name="users" value="${key}">${key}</label><br>`));
}
