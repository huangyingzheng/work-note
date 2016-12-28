<?php
require_once(dirname(_FILE_).'/libs/Model/testModel.class.php');
 class testController{
   function show() {
     $testModel = new testModel(); //实例化testModel
     $data = $testModel->get(); //指向get方法获取值
     require_once(dirname(_FILE_).'/libs/View/testView.class.php');
     }
   }
?>