<!DOCTYPE html>
<html>
<head>
	<title>projet wamp</title>
</head>
<body background="Dc1.png">
<div id="Layer1" style="position:absolute; width:100%; height:100%; z-index:-1">    
<img src="Dc1.png" height="100%" width="100%"/>    
<form action="libs/Controller/inscriptionController.class.php" method="post">
</div><!--不需要使用监听器，直接使用超全局函数控制时间发生，form对应的是指向的文件，
metho对应的是方法-->
<p style="font-family:arial;color: blue;font-size: 40px;text-align: center;">bienvenu a la divercity</p>
<p style="font-family:arial;color: yellow;font-size: 20px;text-align: center;">Name(用户名):<br /><p/>
<div align="center">
<input type="text" name="client_name" value="" style="width:250px; height=20px;" required>
</div>
<p style="font-family:arial;color: yellow;font-size: 20px;text-align: center;">Passeword（密码）:<br /><p/>
<div align="center">
  <input type="password" name="client_password" value="" style="width:250px; height=20px;" required><!--name对应的是输入的值或者说是属性，
而valur对应的是显示的值，这个属性所对应的值-->
</div>
<br>
<br>
<div align="center">
<input type="submit" name="submit" value="注册(login)">
<!--<input type="button" onclick="window.location.href='http://localhost/page_de_inscription_rapide.php'" value="注册(registered)">-->
</div>
</table>
</body>
</html>