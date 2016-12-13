<!DOCTYPE html>
<html>
<head>
	<title>class_client</title>
</head>
<body>
<?php
$client_name_select=$_POST['client_name'];
$client_passeword_select=$_POST['client_passeword'];
class Client{//客户类建立（creer un class qui appel Client. Ce class fovorise a enreigister d'information de client）
	var $Name;// variation $name
	var $Password;// variation password
	function Client($Name,$Password)// qui est la function construition de class client.Dans un class, il est oblige de avoir une function de construction sauf que la class est abstraite。
	{
		$this->Name=$Name;
		$this->Password=$Password;
	}
	function afficher_identifiant(){// ce sont les methodes. selon notre besoin, choisir une ou plus de realiser.
		echo $this->Name;
		echo "<br />";
		echo $this->Password;
		echo "<br />";
	}
	function retour_valeur(){
		return $this->Name;
		return $this->Password;
	}
	function ajouter_name ($Name){
		return $Name;
	}
	function ajouter_passeword($Password){
		return $Password;
	}
}
$Client_01= new Client($client_name_select,$client_passeword_select);
//$Client_01= new Client('huang','1111');
$Client_01->afficher_identifiant();
include'projet_check_programme.php';
//header('Location:projet_check_programme.php');
?>
</body> 
</html>