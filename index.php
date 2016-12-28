<?php
  require_once('function.php');
  $controllerAllow = array('test','inscription','index',);
  $methodAllow = array('show', 'index');
  if (!isset($_GET["m"]) or !in_array($_GET["m"], $controllerAllow)){
   $m = "index";
  }else{
   $m = $_GET["m"];
  }
  if (!isset($_GET["c"]) or !in_array($_GET["c"], $methodAllow)){
   $c = "show";
  }else{
   $c = $_GET["c"];
  }
  /*$controller = in_array($_GET['m'], $controllerAllow) ? daddslashes($_GET['m']) : 'index';
  $method = in_array($_GET['c'], $methodAllow) ? daddslashes($_GET['c']) : 'index';*/
  $core = new core();
  $core->C($m, $c);
?>