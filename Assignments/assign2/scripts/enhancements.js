//Enhancement 1: AJAX JS for dynamic webpage

//AJAX for choosing product model
const productModelSelect = document.getElementById("product-model");
if (productModelSelect) {
    productModelSelect.onchange = loadJSON;
}

function loadJSON() {  

    // This line of code is to create an object XMLHttpRequest, which helps the web page change without reloading the whole page
    var xhr = new XMLHttpRequest();
    // This line of code is to send a request to a server by using the open() and send() methods of the XMLHttpRequest object.
    xhr.open('GET','myproducts.json',true);
    // With the XMLHttpRequest object a callback function is created to be executed when the request receives an answer.
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
//This function is to display the features of the chosen product. The content is all stored in JSON. Therefore, I used AJAX JS to retrieve the data from myproducts.json. Then, I create the html elementm such as radio inputs and labels. 
//As JSON is stored under the object format, I use the dot '.' to access the property of the object. This helps me to retrieve the desired data of each product model. 
//each radio inputs has a value of its content and extra price. For example, a feature 'Screen Size' has an option of '75 inches' and extra price for this option is $1000. Therefore, the radio input value is 'screen size price 1000'.
function displayFeatures(productJSON,modelIndex) {
    var output = ' ';

    if (modelIndex == 0) 
    {
        //check the case of the user not choosing any product model.
        output = 'Please select a product model.';
    } 
    else 
    {
        for(var j = 0; j < productJSON[modelIndex].feature.length;j++) {
            output += '<div class = "feature">' + 
                '<p class = "feature-heading">'+ capitalizeFirstLetter(productJSON[modelIndex].feature[j].heading) +'</p>' +
                '<div class="option-container">';

            for(var i = 0; i < productJSON[modelIndex].feature[j].option.length;i++) {

                //default checked for the first option (zero extra price)
                if (i == 0) {
                    output+='<div class="option">' +
                    '<input type="radio" id="'+productJSON[modelIndex].feature[j].option[i].name+'" name="'+productJSON[modelIndex].feature[j].heading+'" value="'+productJSON[modelIndex].feature[j].option[i].name+ " price " + productJSON[modelIndex].feature[j].option[i].extraPrice+'"checked>'+
                    '<label for="'+productJSON[modelIndex].feature[j].option[i].name+'">'+productJSON[modelIndex].feature[j].option[i].name+'</label>'+
                    '</div>';
                }
                //add elements to the output, such as radio inputs or label.
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
    //add ouput as the html element into the feature-container id.
    document.getElementById("feature-container").innerHTML = output;
}

//After determing which product model is chosen, the processInput function is executed.

//processInput(productJSON,modelIndex) function is to do various things:
//1. Store available features for each product model into sessionStorage under the array.

//2. Update the choices of features changed by the user when they click onto another choice.

//3. Update the price displayed in html page based on the choice and store the current price in sessionStorage.
function processInput(productJSON,modelIndex) {
    
    UpdateFeatures(productJSON, modelIndex);

    var choice = updateChoice(productJSON,modelIndex);
    
    var price = 0;
    var noOptionPrice = parseInt(productJSON[modelIndex].price);
    updatePriceDisplay(noOptionPrice);
    

    for (var i = 0; i < productJSON[modelIndex].feature.length; i++) 
    {
        var featureName = productJSON[modelIndex].feature[i].heading;

        var inputs = document.getElementsByName(featureName);

        for(var j = 0; j < inputs.length; j++) {
            //the below callback function is executed whenever the user changes their choice by clicking onto the radio inputs.
            //then, the choice array is resetted and the price is changed based on the most recent choices.
            inputs[j].onclick = function() {
                choice = updateChoice(productJSON,modelIndex);
                //extra price is calculated based on the choice
                //single price is calculated by adding the original price with the extra price
                price = noOptionPrice + updateExtraPrice(choice);
                //display price on html page.
                updatePriceDisplay(price);
            }
        }
    }
}
//All available features depending on the chosen product model are stored under the array for doing further process in JS as well as under the sessionStorage for displaying the result in server side script.
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
//All choices decided are stored under the array for doing further process in JS script as well as under the sessionStorage for displaying the result in server side script.
function updateChoice(productJSON,modelIndex) {
    var choice = [];
    for (var i = 0; i < productJSON[modelIndex].feature.length; i++) 
    {
        let featureName = productJSON[modelIndex].feature[i].heading;
        var inputs = document.getElementsByName(featureName);
        for(var j = 0; j < inputs.length; j++) {
            //store any checked inputs under the array.
            if (inputs[j].checked) {
                choice.push(inputs[j].value);
            }
        }
    }
    sessionStorage.setItem("choice", JSON.stringify(choice));
    return choice;
}
//process the price by choosing the number in the checked radio input.
//This is done by searching the keyword "price" to know its index.
//From the index to the last index of the value, it will be the number which represents for the extra price of that option.
function updateExtraPrice(choice) {
    var extraPrice = 0;
    for (var i = 0; i < choice.length; i++) {
        let index = choice[i].search("price");
        extraPrice += parseInt(choice[i].slice(index+6,choice[i].length));
    }
    return extraPrice;
}
//change the price dynamically on enquire.html
function updatePriceDisplay(price) {
    var priceContainer = document.getElementById("enquirePrice");
    priceContainer.innerHTML = '$ ' + price;
    sessionStorage.singleItemPrice = price;
}



//Enhancement 2: Timeout in payment.js
//Timeout to cancel order:
const myTimeout = setTimeout(cancelOrder,300000);
function cancelOrder() {
    window.location.href = "enquire.html";
    sessionStorage.clear();

    //After canceling the order, clearTimeout is used to remove the timer out of the server -> memory handling.
    if (myTimeout) {
        clearTimeout(myTimeout);
    }
}