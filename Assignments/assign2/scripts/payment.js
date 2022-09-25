"use strict";
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function getCreditCardType() {
    var creditCards = document.getElementById("credit-card-container").getElementsByTagName('input');
    for (var i = 0; i < creditCards.length; i++) {
        if (creditCards[i].checked) {
            return creditCards[i].value;
        }
    } 
}
//Validate the checkout form:

function validate() {
    var errMsg = "";
    var result = true;
    //cardholder name
    var name = document.getElementById("name").value;
    var namePattern = /^[a-zA-Z ]*$/;;
    if (name.length == 0) {
        errMsg += "Your cardholder name cannot be empty\n";
        result = false;
    } 
    else if (!name.match(namePattern)) {
        errMsg += "Your cardholder name must contain only alpha letters and spaces\n";
        result = false;
    }
    //credit card type
    var chosenType = getCreditCardType();
    
    if (!chosenType) {
        errMsg += "Your credit card type must be chosen\n";
        result = false;
    }
    //card number
    var cardNumber = document.getElementById("number").value;

    if (cardNumber.length == 0) {
        errMsg += "Your credit card number cannot be empty\n";
        result = false;
    }
    else if (!Number(cardNumber)) {
        errMsg += "Your credit card number must contain only digits\n";
        result = false;
    } 
    else {
        switch(chosenType) {
            case "visa":
                if (cardNumber.length != 16) {
                    errMsg += "Your VISA number must contain 16 digits\n";
                    result = false;
                }
                else if (cardNumber[0] != 4) {
                    errMsg += "Your VISA number must start with digit 4\n";
                    result = false;
                } 
                break;
            case "mastercard":
                var mastercardPattern = /^5[1-5][0-9]{14}$/;
                if (cardNumber.length != 16) {
                    errMsg += "Your MasterCard number must contain 16 digits\n";
                    result = false;
                }
                else if (!cardNumber.match(mastercardPattern)) {
                    errMsg += "Your MasterCard number must start with digit 51 through to 55\n";
                    result = false;
                } 
                break;
            case "american-express":
                var americanExpressPattern = /^3[4-7][0-9]{13}$/;
                if (cardNumber.length != 15) {
                    errMsg += "Your American Express number must contain 15 digits\n";
                    result = false;
                }
                else if (!cardNumber.match(americanExpressPattern)) {
                    errMsg += "Your American Express number must start with digit 34 through to 37\n";
                    result = false;
                } 
                break;                
        }
    }
    //card expiry
    var cardExpiry = document.getElementById("expiry").value;
    var expiryPattern = /^(0[1-9]|1[0-2])-(2[2-9]|[3-9][0-9])$/;
    
    if (cardExpiry.length == 0) {
        errMsg += "Your credit card expiry date cannot be empty\n";
        result = false;
    }
    else if (!cardExpiry.match(expiryPattern)) {
        errMsg += "Your credit card expiry date must have pattern of mm-yy\n";
        result = false;
    } 

    if (errMsg != "") {
        alert(errMsg);
    }

    return result;
}

//Display sessionstorage in payment.html:
function calculateTotal() {
    return "$ "+sessionStorage.singleItemPrice * sessionStorage.quantity;
}
//display all sessionStorage data from enquire.html in the payment.html
function getPayment() {
    var total = "";

    //product photo:
    document.getElementById("product-photo").setAttribute("src", sessionStorage.image);

    //product model:
    document.getElementById("product-model").textContent = sessionStorage.displayName;

    // feature:
    var output = "<h3>Feature</h3>";
    var storedFeature = JSON.parse(sessionStorage.getItem("featureNames"));
    var unprocessedStoredChoice = JSON.parse(sessionStorage.getItem("choice"));
    for (var i = 0; i < storedFeature.length; i++) {
        let stopIndex = unprocessedStoredChoice[i].search("price");
        var processedStoreChoice = unprocessedStoredChoice[i].slice(0,stopIndex);

        output += '<div class="feature">'+
                '<h4 class="name">'+capitalizeFirstLetter(storedFeature[i])+'</h4>'+
                '<h4 class="chosen-option">'+processedStoreChoice+'</h4>'+
                '</div>';
    }
    var featureContainer = document.getElementById("feature-container");
    featureContainer.innerHTML = output;


    //quantity:
    var quantity = document.getElementsByClassName("quantity-value");
    for (var i = 0; i < quantity.length; i++) {
        quantity[i].textContent = sessionStorage.quantity;
    }

    //single item price:
    document.getElementById("single-price").textContent = "$ " + sessionStorage.singleItemPrice;


    //total price:
    total = calculateTotal();
    document.getElementById("total-price").textContent = total;


    //Write value to the hidden inputs to display in server side script
    //this helps to check information to be accurate or not.
    document.getElementById("firstName").value = sessionStorage.firstname;
    document.getElementById("lastName").value = sessionStorage.lastname;
    document.getElementById("email").value = sessionStorage.email;
    document.getElementById("phone").value = sessionStorage.phone;
    document.getElementById("streetAddress").value = sessionStorage.street;
    document.getElementById("suburb").value = sessionStorage.suburb;
    document.getElementById("state").value = sessionStorage.state;
    document.getElementById("postcode").value = sessionStorage.postcode;
    document.getElementById("chosenProduct").value = sessionStorage.productModel;
    document.getElementById("quantity").value = sessionStorage.quantity;
    document.getElementById("hidden-total-price").value = total;


    var featureOutput = ""; 
    for (var i = 0; i < storedFeature.length; i++) {
        let stopIndex = unprocessedStoredChoice[i].search("price");
        var processedStoreChoice = unprocessedStoredChoice[i].slice(0,stopIndex);
        featureOutput += '<input type="hidden" id = "'+storedFeature[i]+'" name="'+storedFeature[i]+'" value="'+processedStoreChoice+'">';
    }
    document.getElementById("hiddenFeatureInputs").innerHTML = featureOutput;

    if (myTimeout) {
        clearTimeout(myTimeout);
    }
}

//cancel order: redirect the webpage back to enquire.html and clear all session storage data
function cancelOrder() {
    window.location.href = "enquire.html";
    sessionStorage.clear();

    if (myTimeout) {
        clearTimeout(myTimeout);
    }
}

//Timeout to cancel order:
const myTimeout = setTimeout(cancelOrder,300000);

function init() {
    var checkOutForm = document.getElementById("checkout-form");
    checkOutForm.onsubmit = validate;

    var cancelButton = document.getElementById("cancelOrder");
    cancelButton.onclick = cancelOrder;


    getPayment();
}

window.onload = init;





