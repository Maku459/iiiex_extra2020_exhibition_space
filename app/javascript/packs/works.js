import {} from 'jquery-ujs';
// 作品ページでjQueryが上書きされてしまいmodaalが使えなくなる問題対策
import 'modaal'

$(() => {
    let path = location.pathname;
    let works_name = path.match(/^\/works\/([^\/]+).*/)[1];
    $.ajax({
        type: "post",
        url: "/slack_notifications/entered_page.json",
        data: JSON.stringify({ 'work_name': works_name}),
        contentType: 'application/json',
        dataType: "json",

        success: function (data) {
            console.log("success");
            console.log(data);
            // $("#name").val("");
        },
        error: function (data) {
            console.log("error");
            console.log(data);
        }
    });
})


$('.speak_active > a > img').click(() => {
    let path = location.pathname;
    let works_name = path.match(/^\/works\/([^\/]+).*/)[1];
  $.ajax({
      type: "post",
      url: "/slack_notifications/daily_co_start.json",
      data: JSON.stringify({ 'work_name': works_name}),
      contentType: 'application/json',
      dataType: "json",

      success: function (data) {
          console.log("success");
          console.log(data);
          // $("#name").val("");
      },
      error: function (data) {
          console.log("error");
          console.log(data);
      }
  });
})