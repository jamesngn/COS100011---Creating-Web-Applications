<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Creating Web Applications Lab 10"/>
    <meta name="keywords" content="PHP, MySql"/>
    <title>Retrieving searched records to HTML</title>
</head>
<body>
    <h1>Search results</h1>
    <?php
        function sanitise_input($data) {
            $data = trim ($data);
            $data = stripslashes ($data);
            $data = htmlspecialchars ($data);
            return $data;
        }

        require_once ("settings.php");

        if ($_SERVER['REQUEST_METHOD'] == "POST") {
            if (!$conn) {
                echo "<p>Database connection failure</p>";
            } else {
                $search = sanitise_input($_POST['searchinput']);
                $sql_table = "cars";
                $query = 
                    "SELECT *
                    FROM cars 
                    WHERE make LIKE '$search%'";
                $result = mysqli_query($conn,$query);
    
                if (!$result) {
                    echo "<p>Something is wrong with",$query,"</p>";
                } else {    

                    if (mysqli_num_rows($result) > 0) {
                        echo "<table border=\"1\">\n";
                        echo "<tr>\n"
                            ."<th scope=\"col\">Make</th>"
                            ."<th scope=\"col\">Model</th>"
                            ."<th scope=\"col\">Price</th>"
                            ."<th scope=\"col\">Year of Manufacture</th>"
                            ."</tr>\n";
        
                        while ($row = mysqli_fetch_assoc($result)) {
                            echo "<tr>\n";
                            echo "<td>",$row["make"],"</td>\n";
                            echo "<td>",$row["model"],"</td>\n";
                            echo "<td>",$row["price"],"</td>\n";
                            echo "<td>",$row["yom"],"</td>\n";
                            echo "</tr>\n";
                        }
                        echo "</table>\n";
                    }
                    else {
                        echo "<p>0 result found</p>";
                    }
                    mysqli_free_result($result);
                }
                mysqli_close($conn);
            }
        }

    ?>
</body>
</html>