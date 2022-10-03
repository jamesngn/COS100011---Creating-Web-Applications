

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmation</title>
</head>
<body>
    <h1>Rohirrim Tour Booking Confirmation</h1>
    <?php
    function sanitise_input($data) {
        $data = trim ($data);
        $data = stripslashes ($data);
        $data = htmlspecialchars ($data);
        return $data;
    }

    $errMsg = "";

    if (isset($_POST["firstname"])) {
        $firstname = sanitise_input($_POST["firstname"]);
        if ($firstname == "") {
            $errMsg .= "<p>Youy must enter your firstname</p>";
        } else if (!preg_match("/^[a-zA-z]*$/",$firstname)) {
            $errMsg .= "<p>Only alpha letters allowed in your firstname.</p>";
        }
    } else {
        header("location: register.html");
    }
    

    if (isset($_POST["lastname"])) {
        $lastname = sanitise_input($_POST["lastname"]);
    } 
    if ($lastname == "") {
        $errMsg .= "<p>You must enter your lastname</p>";
    }else if (!preg_match("/^[a-zA-z-]*$/",$lastname)) {
        $errMsg .= "<p>Only alpha letters allowed in your lastname.</p>";
    }
    $name = $firstname." ".$lastname;
    
    if (isset($_POST["species"])) {
        $species = sanitise_input($_POST["species"]);
    } else {
        $species = "Unknow Species";
    }
    


    if (isset($_POST["age"])) {
        $age = sanitise_input($_POST["age"]);
    } 
    if ($age == "") {
        $errMsg .= "<p>You must enter your age</p>";
    }else if (!is_numeric($age)) {
        $errMsg .= "<p>Only numerical value allowed in your age.</p>";
    }else if (!($age >= 18 && $age <= 10000)) {
        $errMsg .= "<p>Only range [18-10000] allowed in your age.</p>";
    }

    $tour = "";
    if (isset($_POST["1day"])) $tour = $tour. "One-day ";
    if (isset($_POST["4day"])) $tour = $tour. "Four-day ";
    if (isset($_POST["10day"])) $tour = $tour. "Ten-day ";

    if (isset($_POST["food"])) {
        $food = sanitise_input($_POST["food"]);
    } else {
        $food = "Unknown Food";
    }

    if (isset($_POST["partySize"])) {
        $partySize = sanitise_input($_POST["partySize"]);
    } else {
        echo "<p>Error: Enter data in the <a href=\"register.html\">form</a></p>";
    }

    if ($errMsg != "") {
        echo "<p>$errMsg</p>";
    } else {
    ?>
    <p>Welcome <?php echo $name;?></p>
    <p>You are now book on the <?php echo $tour; ?> tour</p>
    <p>Species: <?php echo $species;?></p>
    <p>Age: <?php echo $age;?></p>
    <p>Meal Preference: <?php echo $food;?></p>
    <p>Number of travellers: <?php echo $partySize;?></p>
    <?php };?>
</body>
</html>