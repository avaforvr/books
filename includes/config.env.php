<?php
// database
$db_host = "127.0.0.1:3306";
$db_name = "books";
$db_user = "root";
$db_pass = "root";

/*themes:
  default        - seajs and lesscss
  seajs_standard - standard seajs without lesscss
  seajs_custom   - customseajs without lesscss
*/
$theme = 'default';

// For development or For production
$DEBUG_MODE = true;

// SITE_DOMAIN
defined('SITE_DOMAIN') || define('SITE_DOMAIN', 'books.com');

?>