<?php
$globals = [];
$globals['page'] = 'Calculateur';
$globals['title'] = 'Calculateur d\'adresses IPV4 IPV6';
$globals['meta-title'] = 'Calculateur d\'adresses IPV4 IPV6';
$globals['meta-description'] = 'Caculateur d\'adresse IPV4 IPV6 calculez l\'adresse de votre première et dernière machine, le masque inverse, la translation IPV4 en IPV6';
$globals['canonical'] = 'https://www.data-expertise.com/';
$globals['seo'] = true;

?>

<?php require '../partials/head.php' ?>

<body id="<?php echo $globals['page'] ?>_centrer">
<?php
require '../partials/header.php';
?>
 <div class="centrer">
    <div class="DCalc">Veuillez entrer vos paramètres dans les champs ci-dessous</div><br><br>
     <div>
        <label><legend>IP : </legend><input type="text" class="champ_title" name="IP" size="30" id='IP'></label>
        <label><legend>CIDR/masque :  </legend><input type="text" class="champ_title" id='CIDR' /></label>
        <label  class="hide" id ="label_SS_reseau"><legend>Sous-reseaux  </legend><select class="champ-title" id="SS_Reseau"><option value="">Entrez un CIDR</option></select></label>
    </div>
    <div>
        <input type="submit" class="button" value='CALCULER' id='submit' />
    </div>
    <div id="reponse"></div>

    <img src="./personnage.svg" alt="image illustrative d'un homme à son bureau" width="40%">

     <div class="text">
         <h2>Pourquoi IPV6?</h2>
         <p> Les adresses IPV6 sont une nouvelle forme d'adresse IP destinées à résoudre le problème de pénurie d'adresses IPV4.
             En effet IPV4 compte quatre milliards d’adresses. Elles seront bientôt épuisées puisqu'elles ont été distribuées d’une façon
             inappropriée. On a par exemple vu au début des attributions assigner seize millions d’adresses à des entreprises. Au contraire IPV6
             compte trois cent quarante sextillions d’adresses. Pour saturer les adresses IPV6 il faudrait placer six cent soixante sept millions
             de milliards d'appareils connectés sur chaque millimètre carré de la surface émergée de la Terre. </p>

         <h2>Fonctionalités du calculateur:</h2>
         <p> Le calculateur prend en charge les adresses simplifiées. Une adresse simplifiée est une adresse ou la répétition des zéros
             dans plus de deux champs est abrégée en deux fois deux points. Il convertit une adresse IPV4 en IPV6 et donne les caractéristiques
             d'un réseau en IPV4.</p>

         <p> Pour les adresses en IPV6 le calculateur demande le masque initial et y ajoute en fonction du nombre de réseaux désirés par l'utilisateur un masque
             de sous réseau. Comme le nombre de réseaux dépend de bits utilisés pour le masque de sous-réseau, les sous-réseaux peuvent être choisis en
             puissances de 2. Libre à vous de tous les utiliser ou non. Il faut savoir également que le masque en IPV6 a une taille maximale de soixante
             quatre bits. Le reste est réservé aux adresses machines.</p>

         <h2>Des adresses réservées:</h2>
         <p> Pour les adresses en IPV4 le calculateur donne le nombre de machines disposant d'une adresse avec le masque renseigné. Il donne également l'adresse
             de la première et de la dernière machine. En prenant en compte qu'une adresse avec tous les bits à 1 dans sa sous-partie hôte est une adresse
             spéciale réservée à la diffusion et une adresse avec tous les bits à 0 dans sa sous-partie hôte est une adresse de réseau et est également réservée.</p>

         <p>Pour les adresses en IPV6 il n'y a pas d'adresse réservée ni d'adresse de réseau.
            Une adresse IPV6 est constituée de 128 bits découpés en groupes de seize bits. Pour écrire l'adresse chacun des groupes est écrit sous forme de nombre hexadécimal.
            Une adresse IPV4 est constituée de 32 bits, séparés en blocs de 8 bits. Ce bloc s'écrit sous la forme d'un chiffre décimal compris entre 0 et 255. Le bit situé
             à gauche du groupe de 8 bits est appelé bit de poids fort et il vaut 2 puissance 7=128. A l'inverse le bit situé à droite est appelé bit de poids faible.</p>

         <h2>Le masque CIDR:</h2>
         <p>La notion de masque CIDR est importante en IPV6 et en IPV4: Un masque est une adresse binaire qui
             va servir à tamiser l’adresse fournie et donner une adresse résultat. La notation CIDR signifie que dans une adresse 32 ou 128 bits les n premiers bits
             du masque ont pour valeur 1. D’où une écriture abrégée qui donne /16.</p>

         <h2>Quelques liens vers des pages complémentaires:</h2>
         <a href="https://fr.wikipedia.org/wiki/IPv6"> Consultez ici la page de wikipédia sur IPV6. </a> <br>

         <a href="https://www.ionos.fr/digitalguide/serveur/know-how/quels-sont-les-avantages-de-ipv6/"> Ou la page de ionos cliquez ici.</a> <br>

         <a href="https://fr.wikipedia.org/wiki/IPv4">Pour la page sur IPV4 de wikipédia cliquez ici.</a> <br>

         <a href="https://sebastienguillon.com/test/javascript/convertisseur.html">Pour un convertisseur binaire/ hexadécimal/ décimal cliquez ici.</a> <br>




     </div>
    <script src='script.js'></script>



 </div>
<?php
  require '../partials/footer.php'
?>
</body>

</html>
