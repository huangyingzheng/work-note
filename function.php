<?php
class core{
 public function C($m, $c) {
   require_once(dirname(_FILE).'/libs/Controller/'.$m.'Controller.class.php');
   $controller = $m.'Controller';  //实例化Controller
   $obj = new $controller();
   $obj-> $c();                //指向指定的方法
 }
}
?>