"use strict";

//AJAX for choosing product model
const productModelSelect = document.getElementById("product-model");
if (productModelSelect) {
    productModelSelect.onchange = loadJSON;
}

function loadJSON() {  

    var xhr = new XMLHttpRequest();
    xhr.open('GET','myproducts.json',true);

    xhr.onload = function() {
        if (this.status == 200) {
            const product = JSON.parse(this.responseText).product;

            var modelIndex = updateModel(product,productModelSelect.value);
            
            displayFeatures(product,modelIndex); 
            processInput(product,modelIndex);
        }
    }
    xhr.send();

}

function updateModel(productJSON, selectedModel) {
    for (var i = 0; i < productJSON.length; i++) {
        if (productJSON[i].model == selectedModel) {
            sessionStorage.displayName = productJSON[i].displayName;
            sessionStorage.image = productJSON[i].image;
            return i;
        }
    }
}
function displayFeatures(productJSON,modelIndex) {
    var output = ' ';

    if (modelIndex == 0) 
    {
        output = 'Please select a product model.';
    } 
    else 
    {
        for(var j = 0; j < productJSON[modelIndex].feature.length;j++) {
            output += '<div class = "feature">' + 
                '<p class = "feature-heading">'+ capitalizeFirstLetter(productJSON[modelIndex].feature[j].heading) +'</p>' +
                '<div class="option-container">';

            for(var i = 0; i < productJSON[modelIndex].feature[j].option.length;i++) {

                if (i == 0) {
                    output+='<div class="option">' +
                    '<input type="radio" id="'+productJSON[modelIndex].feature[j].option[i].name+'" name="'+productJSON[modelIndex].feature[j].heading+'" value="'+productJSON[modelIndex].feature[j].option[i].name+ " price " + productJSON[modelIndex].feature[j].option[i].extraPrice+'"checked>'+
                    '<label for="'+productJSON[modelIndex].feature[j].option[i].name+'">'+productJSON[modelIndex].feature[j].option[i].name+'</label>'+
                    '</div>';
                }
                else {
                    output+='<div class="option">' +
                    '<input type="radio" id="'+productJSON[modelIndex].feature[j].option[i].name+'" name="'+productJSON[modelIndex].feature[j].heading+'" value="'+productJSON[modelIndex].feature[j].option[i].name+ " price " + productJSON[modelIndex].feature[j].option[i].extraPrice+'">'+
                    '<label for="'+productJSON[modelIndex].feature[j].option[i].name+'">'+productJSON[modelIndex].feature[j].option[i].name+'</label>'+
                    '</div>';
                }

            }    
            output += '</div></div>';
        }
    }
    document.getElementById("feature-container").innerHTML = output;
}
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function processInput(productJSON,modelIndex) {
    
    UpdateFeatures(productJSON, modelIndex);

    var choice = updateChoice(productJSON,modelIndex);
    
    var price = 0;
    var noOptionPrice = parseInt(productJSON[modelIndex].price);
    updatePriceDisplay(noOptionPrice);
    

    for (var i = 0; i < productJSON[modelIndex].feature.length; i++) 
    {
        let featureName = productJSON[modelIndex].feature[i].heading;
        

        var inputs = document.getElementsByName(featureName);

        for(var j = 0; j < inputs.length; j++) {
            inputs[j].onclick = function() {
                choice = updateChoice(productJSON,modelIndex);
                price = noOptionPrice + updateExtraPrice(choice);
                updatePriceDisplay(price);
            }
        }
    }
}

function UpdateFeatures(productJSON, modelIndex) {
    var featureNames = [];
    for (var i = 0; i < productJSON[modelIndex].feature.length; i++) 
    {
        let feature = productJSON[modelIndex].feature[i].heading;
        featureNames.push(feature);
    }
    sessionStorage.setItem("featureNames", JSON.stringify(featureNames));
    return featureNames;
}

function updateChoice(productJSON,modelIndex) {
    var choice = [];
    for (var i = 0; i < productJSON[modelIndex].feature.length; i++) 
    {
        let featureName = productJSON[modelIndex].feature[i].heading;
        var inputs = document.getElementsByName(featureName);
        for(var j = 0; j < inputs.length; j++) {
            if (inputs[j].checked) {
                choice.push(inputs[j].value);
            }
        }
    }
    sessionStorage.setItem("choice", JSON.stringify(choice));
    return choice;
}

function updateExtraPrice(choice) {
    var extraPrice = 0;
    for (var i = 0; i < choice.length; i++) {
        let index = choice[i].search("price");
        extraPrice += parseInt(choice[i].slice(index+6,choice[i].length));
    }
    return extraPrice;
}
function updatePriceDisplay(price) {
    var priceContainer = document.getElementById("enquirePrice");
    priceContainer.innerHTML = '$ ' + price;
    sessionStorage.singleItemPrice = price;
}
//Quantity button increment/decrement:
const quantityInput = document.getElementById("quantity-input");
function stepper(btn) {
    let id = btn.getAttribute("id");
    let min = quantityInput.getAttribute("min");
    let max = quantityInput.getAttribute("max");
    let step = quantityInput.getAttribute("step");
    let val = quantityInput.getAttribute("value");
    let calcStep = (id=="increment") ? (step*1) : (step*-1);
    let newValue = parseInt(val) + calcStep;

    if (newValue >= min && newValue <= max) {
        quantityInput.setAttribute("value",newValue);
    }
}



//store all the form inputs into sessionStorage
function storePayment(firstname, lastname, email, phone, street, suburb, state, postcode, productModel, quantity) 
{
    sessionStorage.firstname = firstname;
    sessionStorage.lastname = lastname;
    sessionStorage.email = email;
    sessionStorage.phone = phone;
    sessionStorage.street = street;
    sessionStorage.suburb = suburb;
    sessionStorage.state = state;
    sessionStorage.postcode = postcode;
    sessionStorage.productModel = productModel;
    sessionStorage.quantity = quantity;
}

//Validation for enquire.html:
function validatePostcode(postcode) {
    var errMsg = "";
    var state = document.getElementById("state").value;
    switch (state) {
        case "VIC":
            if (postcode[0] != "3" && postcode[0] != "8") 
            {
                errMsg += "VIC Postcode must start with 3 or 8\n";
            }
            break;
        case "NSW":
            if (postcode[0] != "1" && postcode[0] != "2") 
            {
                errMsg += "NSW Postcode must start with 1 or 2\n";
            }
            break;
        case "QLD":
            if (postcode[0] != "4" && postcode[0] != "9") 
            {
                errMsg += "QLD Postcode must start with 4 or 9\n";
            }
            break;
        case "NT":
            if (postcode[0] != "0") 
            {
                errMsg += "NT Postcode must start with 0\n";
            }
            break;
        case "WA":
            if (postcode[0] != "6") 
            {
                errMsg += "WA Postcode must start with 6\n";
            }
            break;
        case "SA":
            if (postcode[0] != "5") 
            {
                errMsg += "SA Postcode must start with 5\n";
            }
            break;
        case "TAS":
            if (postcode[0] != "7") 
            {
                errMsg += "TAS Postcode must start with 7\n";
            }
            break;
        case "ACT":
            if (postcode[0] != "0") 
            {
                errMsg += "ACT Postcode must start with 0\n";
            }
            break;    
    }
    return errMsg;
}




function validate() {
    var errMsg = "";
    var result = true;

    //first name validation
    var firstNamePattern = /^[a-zA-z]+$/; 
    var firstname = document.getElementById("fName").value;
    if (firstname.length == 0) {
        errMsg = errMsg + "Your first name cannot be empty\n";
        result = false;
    }
    else if (!firstname.match(firstNamePattern)) {
        errMsg = errMsg + "Your first name must only contain alpha characters\n";
        result = false;
    }

    //last name validation
    var lastNamePattern = /^[a-zA-Z-]+$/;
    var lastname = document.getElementById("lName").value;
    if (lastname.length == 0) {
        errMsg = errMsg + "Your last name cannot be empty\n";
        result = false;
    }
    else if (!lastname.match(lastNamePattern)) {
        errMsg = errMsg + "Your last name must only contain alpha characters\n";
        result = false;
    }

    //email validation
    var emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    var email = document.getElementById("email").value;
    if (email.length == 0) {
        errMsg = errMsg + "Your email cannot be empty\n";
        result = false;
    }
    else if (!email.match(emailPattern)) {
        errMsg = errMsg + "Your email is not in the correct format\n";
        result = false;
    }

    //phone validation
    var phonePattern = /^(04)\d{8}$/;
    var phone = document.getElementById("phone-number").value;
    if (phone.length == 0) {
        errMsg = errMsg + "Your phone number cannot be empty\n";
        result = false;
    }
    else if (!Number(phone)) {
        errMsg = errMsg + "Your phone must be a number\n";
        result = false;
    }
    else if (!phone.match(phonePattern)) {
        errMsg = errMsg + "Your phone must start with (04)\n";
        result = false;
    }
    else if (phone.length != 10) {
        errMsg = errMsg + "Your phone number must contain 10 digits\n";
        result = false;
    }

    //street address
    var streetAddressPattern = /^\s*\S+(?:\s+\S+){2}/;
    var streetAddress = document.getElementById('street').value;
    
    if (streetAddress.length == 0) {
        errMsg = errMsg + "Your street address cannot be empty\n";
        result = false;
    }
    else if (!streetAddress.match(streetAddressPattern)) {
        errMsg = errMsg + "Your street address is not in the correct format\n";
        result = false;
    }

    //suburb - town validation
    var suburbPattern = /^[a-zA-Z-]+$/;
    var suburb = document.getElementById("suburb").value;
    if (suburb.length == 0) {
        errMsg = errMsg + "Your suburb/town cannot be empty\n";
        result = false;
    }
    else if (!suburb.match(suburbPattern)) {
        errMsg = errMsg + "Your suburb/town must only contain alpha characters\n";
        result = false;
    }

    //state validation
    var state = document.getElementById("state").value;

    if (state.length == 0) {
        errMsg = errMsg + "Your state cannot be empty\n";
        result = false;
    } else {
        //postcode by state validation
        var postcode = document.getElementById("postcode").value;
        if (postcode.length == 0) {
            errMsg = errMsg + "Your postcode cannot be empty\n";
            result = false;
        } else {
            var tempMsg = validatePostcode(postcode);
            if (tempMsg != "") {
                errMsg += tempMsg;
                result = false;
            }
        }
    }

    //product validation
    var chosenProduct = document.getElementById("product-model").value;
    if (chosenProduct == "") {
        errMsg += "The product model must be chosen before proceeding to payment\n";
        result = false;
    }

    //quantity validation
    var quantity = document.getElementById("quantity-input").value; 
    if (quantity == 0) {
        errMsg += "The product quantity must be greater than 0\n";
        result = false;
    }
    
     //final check for having errors or not:
    if (errMsg != "") {
        alert(errMsg);
    }

    if (result) {
        storePayment(firstname, lastname, email, phone, streetAddress, suburb, state, postcode, chosenProduct, quantity)
    }

    return result;
}




function init() {
    var form = document.getElementById("enquire-form");
    form.onsubmit = validate;
}

window.onload = init;








