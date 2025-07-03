<?php

require_once '../config/db.php';
require_once '../config/header.php';


$query = "
  SELECT a.kebele_code, COUNT(r.resident_id) AS total_residents
  FROM residents r
  JOIN addresses a ON r.resident_id = a.resident_id
  WHERE r.is_active = TRUE
  GROUP BY a.kebele_code
";

$result = $conn->query($query);
$population = [];

while ($row = $result->fetch_assoc()) {
  $population[] = $row;
}

echo json_encode([
  'success' => true,
  'population' => $population
]);
?>