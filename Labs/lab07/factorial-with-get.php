<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Factorial Calculator</title>
</head>
<body>
    <h1>Creating Web Applications - Lab 8</h1>
    <?php
        include 'mathfunctions.php';
        if (isset($_GET["number"])) {
            $num = $_GET["number"];
            if (isPositiveInteger($num)) {
                echo '<p>',$num,'! is ',factorial($num),'</p>';
            } else {
                echo '<p>Please enter a positive integer.</p>';
            }
            echo '<p><a href="factorial.html">Return to the Entry Page</a></p>';
        }
    ?>
</body>
</html>