<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL);

function get_data($url) {
  $ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 0);
  curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	$data = curl_exec($ch);
  if(curl_errno($ch)) {
    return curl_errno($ch);
  }
	curl_close($ch);
	return $data;
}

$errors = array();
$data = array();

$searchArtistURL = 'https://api.spotify.com/v1/search?type=artist&market=US&limit=50&q=';//add {name}


if (empty($_POST['name']))
  $errors['message'] = 'Name is required.';

if ( ! empty($errors)) {

  $data['success'] = false;
  $data['errors']  = $errors;
} else {
  $scrubbedName = str_replace(' ', '+', $_POST['name']);
  do {
    $artists = get_data($searchArtistURL.$scrubbedName);
  } while(!$artists);
  $data['artists'] = $artists;
  $data['success'] = true;
}
echo json_encode($data);
