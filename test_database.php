<?php
$bdd = new mysqli('localhost','root','root','espace_membre');

if(isset($_POST['forminscription'])) {
   $pseudo = htmlspecialchars($_POST['pseudo']);
   $mail = htmlspecialchars($_POST['mail']);
   $mail2 = htmlspecialchars($_POST['mail2']);
   $mdp = sha1($_POST['mdp']);
   $mdp2 = sha1($_POST['mdp2']);
   if(!empty($_POST['pseudo']) AND !empty($_POST['mail']) AND !empty($_POST['mail2']) AND !empty($_POST['mdp']) AND !empty($_POST['mdp2'])) 
   {
      $pseudolength = strlen($pseudo);
      if($pseudolength <= 255)
       {
         if($mail == $mail2) 
         {
            if(filter_var($mail, FILTER_VALIDATE_EMAIL))
             {
               $reqmail = $bdd->prepare("SELECT * FROM espace_membres WHERE mail = '$mail' ");
               $reqmail->execute(array($mail));
               $mailexist = $reqmail->rowCount();
               if($mailexist == 0) 
               {
                  if($mdp == $mdp2) 
                  {
                     $insertmbr = $bdd->prepare("INSERT INTO espace_membres(pseudo,mail,motdepasse) VALUES('$pseudo', '$mail', '$mdp')");
                     $insertmbr->execute(array($pseudo, $mail, $mdp));
                     $erreur = "Votre compte a bien été créé ! <a href=\"connexion.php\">Me connecter</a>";
                  } 
                  else
                   {
                     $erreur = "Les mots de passes ne correspondent pas !";
                   }
               } 
               else 
               {
                  $erreur = "Adresse mail déjà utilisée !";
               }
            } 
            else 
            {
               $erreur = "Adresse mail non valide !";
            }
         } 
         else 
         {
            $erreur = "Les adresses mail ne correspondent pas !";
         }
      } 
      else 
      {
         $erreur = "Les pseudo ne doit pas dépasser 255 caractères !";
      }
   } else {
      $erreur = "Tous les champs doivent être complétés !";
   }
}
?>