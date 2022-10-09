<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Creating Web Applications Lab 10"/>
    <meta name="keywords" content="PHP, MySql"/>
    <link rel="stylesheet" href="addcar.css" type="text/css" />
    <title>Adding records to HTML</title>
</head>
<body>
    <h1>Creating Web Applications - Lab10</h1>
    <?php

    function sanitise_input($data) {
        $data = trim ($data);
        $data = stripslashes ($data);
        $data = htmlspecialchars ($data);
        return $data;
    }

    if ($_SERVER['REQUEST_METHOD'] == "POST") {
        $make = sanitise_input($_POST["carmake"]);
        $model = sanitise_input($_POST["carmodel"]);
        $price = sanitise_input($_POST["price"]);
        $yom = sanitise_input($_POST["yom"]);
        
        require_once("settings.php");
        
        if (!$conn) {
            echo "<p>Database connection failure</p>";
        } 
        else {
            $sql_table = "cars";
            $query = "INSERT INTO $sql_table (make, model, price, yom) VALUES ('$make','$model','$price','$yom')";

            $result = mysqli_query($conn, $query);
            
            if (!$result) {
                echo "<p class = \"wrong\">Something is wrong with", $query, "</p>";
            } else {
                echo "<p class = \"ok\">Successfully added New Car record</p>";
            }
            
            
            mysqli_close($conn);
        }
    }
    ?>
</body>
</html>