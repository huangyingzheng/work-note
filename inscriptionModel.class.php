<?php
/**
* 
*/

class inscriptionModel
{
	var $name;
	var $password;
	
	function insert($name, $password)
	{
		$con = new mysqli('localhost','root','root','mybd');
		if ($con->connect_error) 
		{// la connexion verifier
    		die("Connection failed: " . $con->connect_error);
		}

		$sql="INSERT INTO personne(Name,Passeword)VALUES ('$name','$password')";
		if ($con->query($sql)!==TRUE){
			die("error:".$sql.'<br>'.$con->error);
			}
	}
}
?>