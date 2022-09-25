// Author: Quang Nguyen (103493836)
// Target: clickme.html is linked to this js file
// Purpose: show the click me button to prompt the name and alert
// Created: 29/08/2022
// Last Updated:
// Credits:

"use strict"; //prevents creation of global variable

function promptName() {
    var sName = prompt("Enter your name.\nThis prompt should show up when the \n Click Me button is clicked.","Your name");
    alert("Hi there " + sName + ". Alert boxes are a quick way to check the state\n of your variables when you are developing code.");
    rewriteParagraph(sName);
}
function rewriteParagraph(userName) {
    var message = document.getElementById("message");
    message.innerHTML = "Hi " + userName +". If you can see this you have successfully overwritten the cotents of this paragraph. Congratulations!!";
}
function writeNewMessage() {
    var newMessage = document.getElementById("newMessage");
    newMessage.textContent = "You have now finished Task 1";
}
//this function is called when the browser window loads
//it will register functions that will respond to browser
function init() {
    var clickme = document.getElementById("clickme");
    clickme.onclick = promptName;

    var click2 = document.getElementsByTagName("h1");
    click2[0].onclick = writeNewMessage;
}
window.onload = init;