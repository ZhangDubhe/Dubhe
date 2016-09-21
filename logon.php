
<?php

$db_user = "root";
$db_pass = "123456";
$db_host = "127.0.0.1";
$db_port = 3306;
$db_name = "ecnu";
$connect = mysqli_connect($db_host, $db_user, $db_pass, $db_name, $db_port);
if (!$connect) {
    die("Connection failed: " . mysqli_connect_error());
}
$sql = "SELECT buildingID,peopleNum FROM building";
$result= mysqli_query($connect, $sql);
if (mysqli_num_rows($result) > 0) {
    // output data of each row
    while($row = mysqli_fetch_assoc($result)) {
        // echo "id: " . $row["buildingID"]. " - PeopleNum: " . $row["peopleNum"];
        $res=$row["peopleNum"];
        echo json_encode($res);
    }


} else {
    echo "0 results";
}

mysqli_close($connect);


?>
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/9/10
 * Time: 22:26
 */