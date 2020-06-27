import DailyIframe from "@daily-co/daily-js"

let callFrame = DailyIframe.createFrame({
    showLeaveButton: true,
});

let participants = callFrame.join({ url: 'https://iiiex.daily.co/test-call' })

$("#remove_user").click( () => {
    let id = $("#user_to_be_removed").val()
    callFrame.updateParticipant(id, {
            eject: true
    })
})

setInterval( () => {
    let participants = callFrame.participants()
    $("#users_list").html(Object.keys(participants).map( key => `<li>${key}</li>`))
}, 5000)