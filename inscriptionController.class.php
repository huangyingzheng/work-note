<?php
require_once (dirname(_FILE_)."/libs/Model/inscriptionModel.class.php");
require_once(dirname(_FILE_).'/libs/View/inscriptionView.class.php');
class inscriptionController
{
	var $name;
	var $password;

	function show()
	{
		

		if (empty($name) or empty($password)) {
			require_once(dirname(_FILE_).'/libs/View/inscriptionView.class.php');
			$i= new inscriptionModel();
			$name=$_POST['client_name'];
			$password=$_POST['client_password'];
			$i->insert($name, $password);
		}
		/*if (!isset($_POST['submit'])) 
		{
			require_once(dirname(_FILE_).'/libs/View/inscriptionView.class.php');
		}
		if (isset($_POST['submit']))
		{
			require_once(dirname(_FILE_).'/libs/View/ceshi.php');
			$i= new inscriptionModel();
			$name=$_POST['client_name'];
			$password=$_POST['client_password'];
			$i->insert($name, $password);
		# code...	
		}*/
		
	}
}
$n = new inscriptionController();
$n ->show();
?>