
const CIDRMASK = document.querySelector('#CIDR');
const IP = document.querySelector('#IP');
const SS_Reseau = document.querySelector('#SS_Reseau');
const submit = document.querySelector('#submit');
const label_SS_Reseau = document.querySelector('#label_SS_reseau');


let IPV6=false;
let options = '';

let chaine_IPV6='';
let chaine_IPV4='';

const copyMeOnClipboard = (j) => {
    const showText = document.querySelector("bouton_inner");
    let nom_j= '#copyMe'+ j;
    const copyText = document.querySelector(nom_j);
    copyText.select();
    copyText.setSelectionRange(0, 99999); //for mobile phone
    document.execCommand("copy");
}

const generateList = (CIDR) => {
  for(let i = +CIDR; i <= 64; i++ ) {
    options += `<option value="${Math.pow(2, i - CIDR)}">${i} (${Math.pow(2, i - CIDR)} reseaux)</option>`;
  }
}

const init = () => {
  IP.addEventListener('change', (event) => {
    if (IP.value.split(':').length > 1) {
      label_SS_Reseau.classList.remove("hide");
    } else {
      label_SS_Reseau.classList.add("hide");
    }
  });

  CIDRMASK.addEventListener('change', (event) => {
    options = '';
    value = event.target.value;
    if (maskBadValue(value)){
      alert('Il semble que la valeur du masque est mauvaise')
    }
    generateList(event.target.value);
    SS_Reseau.innerHTML = options;    
  });
  
  submit.addEventListener('click', (event) => {
    // Verfier que tous les champs sont remplis
    // generate les ip a partir des champs
    //sortie ecran
    ipVersion();

    if (IPV6){
      document.getElementById("reponse").innerHTML=chaine_IPV6;
    }else{
      document.getElementById("reponse").innerHTML=chaine_IPV4;
    }
  })
}

/**
 * From IP input check if is IPv4 or IPv6
 */
const ipVersion = () => {
  if (IP.value.split(':').length > 1) {

    /////////////////////////// IP V6 DETECTÉ/////////////////////////
    IPV6 = true;
    IP6=complexAdress(IP);

    chaine_IPV6="<div class='tab_short'><TABLE> \n" +
        "  <TR> \n" +
        " <TH> id réseau </TH> \n" +
        " <TH> première adresse </TH> \n" +
        " <TH> dernière adresse </TH> \n" +
        " <TH> notation </TH> \n" +
        "  </TR>";

    //calcul du masque sous reseau
    binMaskSub=Number(SS_Reseau.value-1).toString(2);
    //calcul de l'adresse IPV6 en binaire
    let binIP6 = '';
    if(IP6.value != undefined) { IP6=IP6.value; }
    IP6.split(':').forEach(element => {
      binIP6 += addZeroForTwoOctet(parseInt(element,16).toString(2));
    });
    //boucle calculant les adresses et les mettant dans un tableau
    let reponse= [];
    for(let i=1;i<=SS_Reseau.value;i++){
      reponse[i]=[];

      //calcul de masque ss reseau
      binSSReseau='';
      binSSReseau+=Number(i-1).toString(2);
      for(let j =0; j < binMaskSub.length-(Number(i-1).toString(2)).length; j++){
        binSSReseau='0'+binSSReseau;
      }

      //calcul de la première adresse
      reponse[i][0]= (binIP6.substring(0,CIDRMASK.value))+binSSReseau;
      while ((reponse[i][0].length)<128){
        reponse[i][0]=reponse[i][0]+'0';
      }
      reponse[i][0]=simpleAdress(binToHex(reponse[i][0]));

      //calcul de la derniere adresse
      reponse[i][1]= (binIP6.substring(0,CIDRMASK.value))+binSSReseau;
      while ((reponse[i][1].length)<128){
        reponse[i][1]=reponse[i][1]+'1';
      }
      reponse[i][1]=simpleAdress(binToHex(reponse[i][1]));

      //calcul de la notation
      let masque=parseInt(CIDRMASK.value) + parseInt(binMaskSub.length);
      let Ipv6_notation=simpleAdress(reponse[i][0]);
      reponse[i][2]=Ipv6_notation.concat('/').concat(masque);

      //creation de la chaine d'affichage
      chaine_IPV6=chaine_IPV6 + " <TR> \n" +
          " <TD>" + i + "</TD> \n" +
          " <TD>" + "<input type='text' class= 'champ' size='22' id='copyMe" + i + "0" + "' value="+ reponse[i][0] + ">" + "<button class='button2' onClick='copyMeOnClipboard(" + i + "0" +")'>Copier</button>" +"</TD> \n" +
          " <TD>" + "<input type='text' class= 'champ' size='22' id='copyMe" + i + "1" + "' value="+ reponse[i][1] +">"+ "<button class='button2' onClick='copyMeOnClipboard(" + i + "1" +")'>Copier</button>" + "</TD> \n" +
          " <TD>" + "<input type='text' class= 'champ' size='22' id='copyMe" + i + "2" + "' value="+ reponse[i][2] +">"+ "<button class='button2' onClick='copyMeOnClipboard(" + i + "2" +")'>Copier</button>" + "</TD> \n" +
          "  </TR> \n";
    }
    chaine_IPV6=chaine_IPV6 +"</TABLE></div>";
  } else {

    /////////////////////////// IP V4 DECTECTÉ/////////////////////////
    IPV6 = false;
    let CIDR='';

    //Si le masque entré est un masque cidr ou un masque decimal
    let binMask="";
    let masque=false;
    if (CIDRMASK.value.split('.').length > 1) {
      CIDRMASK.value.split('.').forEach(element => {
        binMask +=  addZeroForByte((+element).toString(2));
      });
      CIDR=binMaskToCIDR(binMask);
      masque=true;
    }else{
      CIDR=CIDRMASK.value;
    }

    binMask = generateMask(CIDR);
    let binIP = '';
    IP.value.split('.').forEach(element => {
      binIP += addZeroForByte((+element).toString(2));
    });
    binAdrNetwork = (binIP).slice(0, +CIDR) + Array(32 - +CIDR).fill('0').join('');
    
    let binMaskInverse = generateMask(CIDR, true);

    //calculer le nombre de machines
    let nbMachines=1;
    let maskInverse= binIpToIPv4 (binMaskInverse);
    maskInverse.split('.').forEach(element => {
      nbMachines*=(++element);
    });
    nbMachines-=2;

    //calculer l'adresse de diffusion
    binAdrDiff = (binIP).slice(0, +CIDR) + Array(32 - +CIDR).fill('1').join('');
    adrDiff=binIpToIPv4(binAdrDiff);

    //convertir l'adresse binaire ip brodacast en adresse IPV4
    let networkIp= binIpToIPv4 (binAdrNetwork);

    //calculer l'adresse de la première machine
    tabNtwkIP=networkIp.split('.');
    tabNtwkIP[3]++;
    prAdresse=(tabNtwkIP.join('.'));

    //calculer l'adresse de la dernière machine
    tabDiffIP=adrDiff.split('.');
    tabDiffIP[3]--;
    derAdresse=(tabDiffIP.join('.'));

    //calculer l'adresse équivalente en IPV6
    binIp6toIp4=Array(16).fill('1').join('')+binIP;
    binIp6toIp4=Array(80).fill('0').join('')+binIp6toIp4;

    //fabrication de la chaîne a sortir écran
    chaine_IPV4="<TABLE> \n";

    //si le masque entré est en cidr ou decimal
    if(masque){
      chaine_IPV4+=" <TR class='cell2'> \n" +
        " <TD >" + "EQUIVALENT EN CIDR" + "</TD> \n" +
        " <TD>" + "<input type='text' class= 'champ' size='15' id='copyMe" + 0 + "' value="+ binMaskToCIDR(binMask) +">" + "<button class='button2' onClick='copyMeOnClipboard("+0+")'>Copier</button>" + "</TD> \n" +
        "  </TR> \n";
    }else{
      chaine_IPV4+=" <TR class='cell2'> \n" +
        " <TD >" + "CIDR EN MASQUE" + "</TD> \n" +
        " <TD>" + "<input type='text' class= 'champ' size='15' id='copyMe" + 0 + "' value="+ binIpToIPv4(binMask) +">" + "<button class='button2' onClick='copyMeOnClipboard("+0+")'>Copier</button>" + "</TD> \n" +
        "  </TR> \n";
    }
    chaine_IPV4+=" <TR class='cell2'> \n" +
        " <TD >" + "CONVERSION DE L'ADRESSE IPV4 EN IPV6:" + "</TD> \n" +
        " <TD>" + "<input type='text' class= 'champ' size='15' id='copyMe" + 0 + "' value="+simpleAdress(binToHex(binIp6toIp4))+">" + "<button class='button2' onClick='copyMeOnClipboard("+0+")'>Copier</button>" + "</TD> \n" +
        "  </TR> \n" +
        " <TR class='cell2'> \n" +
        " <TD >" + "ADRESSE IP RESEAU:" + "</TD> \n" +
        " <TD>" +"<input type='text' class= 'champ' size='15' id='copyMe" + 1 + "' value="+ networkIp +">"+ "<button class='button2' onClick='copyMeOnClipboard("+1+")'>Copier</button>" + "</TD> \n" +
        "  </TR> \n"+
        " <TR class='cell2'> \n" +
        " <TD >" + "ADRESSE DE DIFUSION:" + "</TD> \n" +
        " <TD>" + "<input type='text' class= 'champ' size='15' id='copyMe" + 2 + "' value="+adrDiff +">"+ "<button class='button2' onClick='copyMeOnClipboard("+2+")'>Copier</button>" + "</TD> \n" +
        "  </TR> \n"+
        " <TR class='cell2'> \n" +
        " <TD >" + "PREMIERE ADRESSE:" + "</TD> \n" +
        " <TD>" +"<input type='text' class= 'champ' size='15' id='copyMe" + 3 + "' value="+ prAdresse +">"+ "<button class='button2' onClick='copyMeOnClipboard("+3+")'>Copier</button>" + "</TD> \n" +
        "  </TR> \n"+
        " <TR class='cell2'> \n" +
        " <TD >" + "DERNIERE ADRESSE:" + "</TD> \n" +
        " <TD>" + "<input type='text' class= 'champ' size='15' id='copyMe" + 4 + "' value="+derAdresse +">"+ "<button class='button2' onClick='copyMeOnClipboard("+4+")'>Copier</button>" + "</TD> \n" +
        "  </TR> \n"+
        " <TR class='cell2'> \n" +
        " <TD>" + "NOMBRE DE MACHINES:" + "</TD> \n" +
        " <TD>" +"<input type='text' class= 'champ' size='15' id='copyMe" + 5 + "' value="+ nbMachines +">"+ "<button class='button2' onClick='copyMeOnClipboard("+5+")'>Copier</button>" + "</TD> \n" +
        "  </TR> \n"+
        " <TR class='cell2'> \n" +
        " <TD>" + "MASQUE INVERSE:" + "</TD> \n" +
        " <TD>" +"<input type='text' class= 'champ' size='15' id='copyMe" + 6 + "' value="+ binIpToIPv4(binMaskInverse)+">" + "<button class='button2' onClick='copyMeOnClipboard("+6+")'>Copier</button>" + "</TD> \n" +
        "  </TR> \n";
  }
}

/**
 * Generate mask from CIDR
 * @param {Number} value CIDR
 * @param {Boolean} inv GENERATE MASK INVERSE OR NOT
 * @returns MASK IN BINARY
 */
const generateMask = (value, inv = false) => ([].concat(Array(+value).fill(inv?'0':'1'), Array(32-value).fill(inv?'1':'0')).join('')).toString();

const IPToBinIP = () => {
}


///booleen de verification du masque si en cidr retourne false
const maskBadValue = (aVerif) => {
  let binMask='';
  if (aVerif.split('.').length > 1) {
    aVerif.split('.').forEach(element => {
      binMask +=  addZeroForByte((+element).toString(2));
    });
  
    let invalidMask=0;
    for(let i=0;i<32;i++){
      if((binMask.charAt(i)=='1'&& binMask.charAt(i+1)=='0')||(binMask.charAt(i)=='1'&& i+1==32)){
        invalidMask+=1;
      }
    }
    return invalidMask!=1;
  }else{
    return false;
  }
}

///conversion du masque en decimal a cidr ipv4 
const binMaskToCIDR = (bin) => {
  let CidrFromMask=0;
  let finMask=false;
  for(let i=0;i<32;i++){
    if(bin.charAt(i)=='1'&&!finMask){
      CidrFromMask+=1;
    }else{
      finMask=true;
    }
  }
  return CidrFromMask;
}

/// conversion de binaire en hexadecimal IPV6
const binToHex = (bin) => {
  ipV6 = [];
  binIPSplit = bin.match(/.{1,16}/g);
  binIPSplit.forEach((element) => {
    ipV6.push(parseInt(element,2).toString(16));
  })
  return(ipV6.join(':'));
}

/// ajouter des zeros a une chaine pour que sa taille fasse 16 bits
const addZeroForTwoOctet = (bin) => {
  addZero='';
  for(let i = bin.length; i < 16; i++){
    addZero+='0';
  }
  return `${addZero}${bin}`;
}

/// ajouter des zeros a une chaine pour que sa taille fasse un octet
const addZeroForByte = (bin) => {
  addZero='';
  for(let i = bin.length; i < 8; i++){
    addZero+='0';
  }
  return `${addZero}${bin}`;
}

/// application du masque binaire a l'adressse binaire
const applyMask = (binMask, binIp) => {
  binNetwork='';
  for(let i = 0; i < 32; i++) {
    binNetwork += binMask[i] & binIp[i];
  }
  return binNetwork;
}

/// conversion d'une adresse ip 4 en binaire vers une adresse en decimal
const binIpToIPv4 = (binIP) => {
  ipV4 = [];
  binIPSplit = binIP.match(/.{1,8}/g);
  binIPSplit.forEach((element) => {
    ipV4.push(parseInt(element, 2));
  })
  return(ipV4.join('.'));
}

/////////////// Compliquer une adresse simplifiée
const complexAdress = (SIP) => {
  let IP6 = '';
  let simplifie = false;
  for (let i = 0; i < SIP.value.length; i++) {
    if ((SIP.value.charAt(i) == ':') && (SIP.value.charAt(i + 1) == ":")) {
      simplifie = true;
    }
  }
  //si l'adresse est simplifiée on la complique
  if (simplifie) {
    if (SIP.value.charAt(SIP.value.length - 1) == ':') {
      //calcule le nombre de champ a ajouter a l'adresse simplifiée
      let nbDeChamp = 0;
      SIP.value.split(':').forEach(element => {
        nbDeChamp++;
      });
      nbDeChamp = 10 - nbDeChamp;

      //compose l'adresse IPV6
      for (let i = 0; i < IP.value.length; i++) {
        if ((SIP.value.charAt(i) == ':') && (SIP.value.charAt(i + 1) == ":")) {
          for (let j = 0; j < i; j++) {
            IP6 += SIP.value.charAt(j);
          }
          for (let k = 0; k < nbDeChamp; k++) {
            IP6 += ':0'
          }
        }
      }
    } else {
      //calcule le nombre de champ a ajouter a l'adresse simplifiée
      let nbDeChamp = 0;
      SIP.value.split(':').forEach(element => {
        nbDeChamp++;
      });
      nbDeChamp = 9 - nbDeChamp;

      //compose l'adresse IPV6
      for (let i = 0; i < IP.value.length; i++) {
        if ((SIP.value.charAt(i) == ':') && (SIP.value.charAt(i + 1) == ":")) {
          for (let j = 0; j < i; j++) {
            IP6 += SIP.value.charAt(j);
          }
          for (let k = 0; k < nbDeChamp; k++) {
            IP6 += ':0'
          }
          for (let j = i + 1; j < IP.value.length; j++) {
            IP6 += SIP.value.charAt(j);
          }
        }
      }
    }
  } else {
    IP6 = SIP;
  }
  return IP6;
}

///////////////////simplifier une adresse IPV6
const simpleAdress = (CIP) => {
  let chPlace='';
  let SIP='';
  if(CIP==undefined){CIP=CIP.value;}
  // creation d'une chaine intitulée place qui aidera a simplifier l'adresse attention aux cas particuliers de debut d'adresse et de fin
  for(let i=0;i<CIP.length;i++){
    if (CIP.charAt(i)=='0'&& CIP.charAt(i+1)==":"&& i==0){
      chPlace=chPlace+':'+i;
    }else if ((CIP.charAt(i-1)==':')&&(CIP.charAt(i)=='0')&&(CIP.charAt(i+1)==':')){
      chPlace=chPlace+':'+i;
    }else if ((CIP.charAt(i-1)==':')&&(CIP.charAt(i)=='0')&&((i+1)==CIP.length)){
      chPlace=chPlace+':'+i;
    }
  }

  //exploitation de la chaine place
  let last=0;
  let count=0;
  let countMax=0;
  let position=0;
  let positionMax=0;
  let positionMaxEnd=0;
  let tab=[];
  first=true;
  tab= chPlace.split(':');
  for (let i=0;i<tab.length;i++){
    if (tab[i] != '') {
      if (parseInt(last,10)+2 != tab[i] ){
        first=true;
        count = 0;
      }
      if ((parseInt(last,10)+2 == tab[i] ) || first) {
        count++;
        if(first) {
          position = tab[i];
        }
        last = tab[i] ;
        first = false;
        if ((count >= countMax)){
          positionMax = position;
          positionMaxEnd = tab[i];
          countMax = count;
        }
      } else {
        first = true;
        count = 0;
      }
    }
  }
  //boucle de choix si il n'y a qu'un seul zero a remplacer on garde l'ip fournie
  if (countMax>1){
    positionMax=parseInt(positionMax,10)-1;
    positionMaxEnd=parseInt(positionMaxEnd,10)+2;
    SIP=CIP.substring(0,positionMax)+"::"+CIP.substring(positionMaxEnd,CIP.length);
  }else{
    SIP=CIP;
  }
  return SIP;
}



const start = () => {
  init();
}

start();
