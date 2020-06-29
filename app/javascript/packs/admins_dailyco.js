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
	$("#enter_room").prop("disabled", true);
	$("input[name='rooms']").prop("disabled", true);
});

$("#remove_user").on("click", () => {
	let id = $("input[name='users']:checked").val();
	let kick = callFrame.updateParticipant(id, {eject: true});
	console.log(kick);
})

callFrame.on("participant-updated", (evt) => {
	console.log("participant-updated");
	updateUsers();
});

callFrame.on("participant-joined", (evt) => {
	console.log("participant-joined");
	updateUsers();
});

callFrame.on("participant-left", (evt) => {
	console.log("participant-left");
	updateUsers();
});

const updateUsers = () => {
	$("#room").empty();
	$("#users_list").empty();
	let participants = callFrame.participants();
	$("#room").text("ルーム：https://iiiex.daily.co/" + room);
	console.log(participants)
	$("#users_list").html(Object.keys(participants).map(key => `<label>&nbsp;<input type="radio" name="users" value="${key}">${key}</label><br>`));
	$("#kick").show();
}
