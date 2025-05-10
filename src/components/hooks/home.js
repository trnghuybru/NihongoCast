import $ from "jquery";
window.onload = () => {
    $("#join").click(function(){
        let meetingID = $("#meetingID").val();
        if(meetingID !== ""){
            window.location = "/meeting/"+meetingID;
        } else {
            alert("Enter a valid meeting ID")
        }
    })
    $("#genNewMeetingID").click(function() {
        let meetingID = create_UUID();
        $("#newMeetingID").val(meetingID);
    });
    $("#copyMeetingID").click(function(){
        var copyText = document.getElementById("newMeetingID");

        /* Select the text field */
        copyText.select();
        copyText.setSelectionRange(0, 99999); /* For mobile devices */
      
         /* Copy the text inside the text field */
        navigator.clipboard.writeText(copyText.value);      
    });
    $("#joinNewMeeting").click(function() {
        let meetingID = $("#newMeetingID").val();
        if(meetingID !== ""){
            window.location = "/meeting/"+meetingID;
        } else {
            alert("Please create a meeting.")
        }
    })
}
const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function create_UUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c === 'x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
}

export function getCurrentTimeAndDate() {
    const x = new Date();
    const ampm = x.getHours() >= 12 ? ' PM' : ' AM';
    let hours = x.getHours() % 12;
    hours = hours || 12; // Handle 0 as 12 AM/PM
    const minutes = x.getMinutes().toString().padStart(2, '0');
    const timeStr = `${hours}:${minutes}${ampm}`;

    const day = weekday[x.getDay()];
    const monthName = month[x.getMonth()];
    const dateStr = `${day} ${monthName} ${x.getDate()}, ${x.getFullYear()}`;

    return { time: timeStr, date: dateStr };
}