import DailyIframe from "@daily-co/daily-js";

function showEvent(e) {
    console.log("video call event -->", e);
}

$('.button_speak_launch').click(() => {
    console.log('run');
    run();
});

async function run() {
    console.log('run');
    // create a short-lived demo room. if you just want to
    // hard-code a meeting link for testing you could do something like
    // this:
    //
    //   room = { url: 'https://your-domain.daily.co/hello' }
    //
    // room = await createMtgRoom();

    let room = { url: 'https://iiiex.daily.co/813_exhibition_space' }

    // create a video call iframe and add it to document.body
    // defaults to floating window in the lower right-hand corner
    //
    let date = new Date();
    let callFrame = DailyIframe.createFrame({
        userName: `visitor${date.toLocaleTimeString()}`,
    });

    // callFrame = window.DailyIframe.createFrame({
    //   iframeStyle: {
    //     position: 'fixed',
    //     border: 0,
    //     top: 0, left: 0,
    //     width: '100%',
    //     height: '100%'
    //   }
    // });
    // callFrame.join({ url: 'https://your-team.daily.co/hello' });

    // install event handlers that just print out event information
    // to the console
    //
    callFrame
        .on("loading", showEvent)
        .on("loaded", showEvent)
        .on("started-camera", showEvent)
        .on("camera-error", showEvent)
        .on("joining-meeting", showEvent)
        .on("joined-meeting", showEvent)
        .on("participant-joined", showEvent)
        .on("participant-updated", showEvent)
        .on("participant-left", showEvent)
        .on("recording-started", showEvent)
        .on("recording-stopped", showEvent)
        .on("recording-stats", showEvent)
        .on("recording-error", showEvent)
        .on("recording-upload-completed", showEvent)
        .on("app-message", showEvent)
        .on("input-event", showEvent)
        .on("error", showEvent)
        // add a leave handler to clean things up
        .on("left-meeting", leave);

    // join the room
    //
    await callFrame.join({
        url: room.url,
        showLeaveButton: true
    });

    function leave(e) {
        showEvent(e);
        callFrame.destroy();
    }

    console.log(
        " You are connected to",
        callFrame.properties.url,
        "\n",
        "Use the window.callFrame object to experiment with",
        "\n",
        "controlling this call. For example, in the console",
        "\n",
        "try",
        "\n",
        "    callFrame.participants()",
        "\n",
        "    callFrame.setLocalVideo(false)",
        "\n",
        "    callFrame.startScreenShare()"
    );
}