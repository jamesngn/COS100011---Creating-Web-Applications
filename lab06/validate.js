"use strict";
function storeBooking(firstname, lastname, age, species, beardLength, is1day, is4day, is10day, food, partySize) {
    
    sessionStorage.firstname = firstname;
    
    sessionStorage.lastname = lastname;

    sessionStorage.age = age;
    
    sessionStorage.species = species;

    sessionStorage.beardLength = beardLength;

    //store trip info:
    var trip = "";
    if (is1day) trip = "1day";
    if (is4day) trip += " 4day";
    if (is10day) trip += " 10day";
    sessionStorage.trip = trip;

    sessionStorage.food = food;

    sessionStorage.partySize = partySize;

}
function getSpecies() {
    var speciesName = "unknown";
    var speciesArray = document.getElementById("species").getElementsByTagName("input");
    for (var i = 0; i < speciesArray.length; i++) {
        if (speciesArray[i].checked) {
            speciesName = speciesArray[i].value;
        }
    }
    return speciesName;
}
function validateSpeciesAge(age,beard) {
    var errMsg = "";
    var speciesName = getSpecies();
    switch(speciesName) {
        case "Human":
            if (age > 120) {
                errMsg += "You cannot be a Human and over 120.\n";
            }
            break;
        case "Dwarf":
            if (age > 150) {
                errMsg += "You cannot be a Dwarf and over 150.\n";
            }
            if (age > 30 && beard <= 12) {
                errMsg += "Your beard is only " +beard+ " inches long. You cannot be a Dwarf that is over 30 years old and have a beard shorter than 12 inches.\n";
            }
            break;
        case "Hobbit":
            if (age > 150) {
                errMsg += "You cannot be a Hobbit and over 150.\n";
            }
            if (beard > 0) {
                errMsg += "You cannot be an Hobbit and have beards.\n";
            }
            break;
        case "Elf": 
            if (beard > 0) {
                errMsg += "You cannot be an Elf and have beards.\n";
            }
            break;
        default:
            break;
    } 
    return errMsg;
}
function validate() {
    var errMsg = "";
    var result = true;

    //first name validation
    var firstNamePattern = /^[a-zA-z]+$/; 
    var firstname = document.getElementById("firstname").value;
    if (!firstname.match(firstNamePattern)) {
        errMsg = errMsg + "Your first name must only contain alpha characters\n";
        result = false;
    }

    //last name validation
    var lastNamePattern = /^[a-zA-Z-]+$/;
    var lastname = document.getElementById("lastname").value;
    if (!lastname.match(lastNamePattern)) {
        errMsg = errMsg + "Your last name must only contain alpha characters\n";
        result = false;
    }

    //Species radio button:
    var isHuman = document.getElementById("human").checked;
    var isDwarf = document.getElementById("dwarf").checked;
    var isElf = document.getElementById("elf").checked;
    var isHobbit = document.getElementById("hobbit").checked;
    if (!(isHuman||isDwarf||isElf||isHobbit)) {
        errMsg += "Please selected one of the animal species.\n";
        result = false;
    } 

    //age and beard length validation
    var age = document.getElementById("age").value;
    var beardLength = document.getElementById("beard").value;
    console.log(beardLength);
    if (isNaN(age) || !age) {
        errMsg = errMsg + "Your age must be a number.\n";
        result = false;
    }
    else if (age < 0) {
        errMsg += "Your age must be at least zero.\n";
        result = false;
    }
    else {
        var tempMsg = validateSpeciesAge(age,beardLength);
        console.log(tempMsg);
        if (tempMsg != "") {
            errMsg += tempMsg;
            result = false;
        }
    }

    //booking day tour:
    var is1Day = document.getElementById("1day").checked;
    var is4Day = document.getElementById("4day").checked;
    var is10Day = document.getElementById("10day").checked;
    if (!is1Day&&!is4Day&&!is10Day) 
    {
        errMsg += "Please selected at least one trip.\n";
        result = false;
    }

    //food preference:
    var foodOption = document.getElementById("food").value;
    if (foodOption == "none") {
        errMsg += "You must select a food preference.\n";
        result = false;
    }

    //part size validation
    var partySize = document.getElementById("partySize").value;
    if (isNaN(partySize)) {
        errMsg = errMsg + "Your party size must be a number.\n";
        result = false;
    }
    else if (partySize < 1 || partySize > 100) {
        errMsg = errMsg + "Your party size must be between 1 and 100.\n";
        result = false;
    }

    //final check for having errors or not:
    if (errMsg != "") {
        alert(errMsg);
    }

    if (result) {
        storeBooking(firstname,lastname,age,getSpecies(),beardLength,is1Day,is4Day,is10Day,foodOption,partySize);
    }
    return result;
}

function prefill_form() {
    if (sessionStorage.firstname != undefined) {
        // firstname
        document.getElementById("firstname").value = sessionStorage.firstname;

        //lastname
        document.getElementById("lastname").value = sessionStorage.lastname;

        //species
        switch (sessionStorage.species) {
            case "Human":
                document.getElementById("human").checked = true;
                break;
            case "Dwarf":
                document.getElementById("dwarf").checked = true;
                break;
            case "Elf":
                document.getElementById("elf").checked = true;
                break;
            case "Hobbit":
                document.getElementById("hobbit").checked = true;
                break;
        }

        //age
        document.getElementById("age").value = sessionStorage.age;

        //beard length
        document.getElementById("beard").value = sessionStorage.beardLength;

        //trip
        if (sessionStorage.trip.search("1day")) 
        {
            document.getElementById("1day").checked = true;
        }
        if (sessionStorage.trip.search("4day")) 
        {
            document.getElementById("4day").checked = true;
        }
        if (sessionStorage.trip.search("10day")) 
        {
            document.getElementById("10day").checked = true;
        }

        //food
        document.getElementById("food").value = sessionStorage.food;

        //partySize
        document.getElementById("partySize").value = sessionStorage.partySize;

    }
}

function init() {
    prefill_form();

    var form = document.getElementById("regform");
    form.onsubmit = validate;
}
window.onload = init;