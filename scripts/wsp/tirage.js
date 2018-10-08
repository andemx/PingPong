//console.log("loading wsp: tirage.js");
APP.wsp.tirage= {
  /*hum: function(event){
  //console.log("hum",event);
  var $target = $(event.currentTarget);
  //var data = $target.attr("app-data");
  var action = $targ'et.attr("app-tirage");
},*/
numStart:10000,
numEnd:21980,
dernierNumero: 0,
rempli: false,
valid: false,
numeroTire:[],
load : function(){
  //loadNumeroTire();
  initTable();
  //console.log("tirage-load",APP.data.tirage.state);
  var state = APP.data.tirage.state;
  if(state >= 0 && state <= 3){
    //console.log(state,$app.find("[app-state='"+state+"']").length);
    APP.$body.find("[app-state]:not([hidden])").attr('hidden',"");
    APP.$body.find("[app-state='"+state+"']").removeAttr('hidden');
  }
  //console.log(state);
  if(state == 1){
    APP.wsp.tirage.resume();
    $("select").focus();
  }
},
validationInput : function($input){
  var typeLot = $input.attr('lot-type');
  var idLot = $input.attr('lot-id');
  var ordreLot = $input.closest("tr").attr("lot-ordre");
  var ordreTirage = $input.attr('tirage');

  var value = $input[0].value;

  if(value.length.toString()==$input.maxlength){
    //$input.valid=true; //define condition of validation
    if(value){
      switch(typeLot){
        case "jackpot":
        //console.log("validation du jackpot");
        if(between(value,APP.wsp.tirage.numStart,APP.wsp.tirage.numEnd,true)){
          $input.valid = true;
          displayGagnantDuJackpot();
        }
        //si le tirage est entre le premier ticket et le dernier ticket et qu'il n'est pas un ticket non valide.
        break;
        case "groslot":
        //console.log("validation d'un groslot",between(value,APP.wsp.tirage.numStart,APP.wsp.tirage.numEnd,true),APP.wsp.tirage.notAlreadyUsed(value,APP.wsp.tirage.numeroTire),APP.wsp.ticket.isValid(value));
        if(between(value,APP.wsp.tirage.numStart,APP.wsp.tirage.numEnd,true)
        && APP.wsp.tirage.notAlreadyUsed(value,APP.wsp.tirage.numeroTire)
        && APP.wsp.ticket.isValid(value)){
          $input.valid = true;
        }
        //si le tirage est entre le premier ticket et le dernier ticket et qu'il n'est pas un ticket non valide.
        //et qu'il n'est pas déjà un numéro tiré pour les gros lot ou le jackpot. ??? not sure ???
        break;
        case "petitlot":
        //console.log("validation d'un petitLot");
        //si le tirage est entre le premier ticket et le dernier ticket,  et qu'il ne soit pas correspondant a un ticket non valide.
        //et qu'il n'est pas un des numero tiré dans les petit lot.
        break;
        default:break;
      }

      if($input.valid){
        //console.log(typeLot,ordreLot,ordreTirage,"SAVE", $input[0].value,", a la place de:",APP.data.lot[typeLot][ordreLot].tirage[ordreTirage]);
        $input.addClass('valid');
      }
    }
  }else{
    if(typeLot == "jackpot"){
      $(".lignetiragejackpot [app-display='association']").html("");
    }
    //console.log("skip validation");
    $input.addClass('warning');
  }



  APP.data.lot[typeLot][ordreLot].tirage[ordreTirage] = value;
  APP.saveData();
  lengthValidation($input);
},
validationTirage : function() {
  //console.log("validataion tirage")
},


notAlreadyUsed : function(numero,array) {
  if (array.indexOf(numero) === -1) {
    return false;
  }
  return true
},

resume : function() {
  //console.log("resume");
  var $resumeContainer = $("[app-state='1'] select");
  feedSelect($resumeContainer,APP.data.association,-1);
  //$resumeContainer.append(lotsWin);
},
getLotsAsso : function(numeroAsso) {
  var tickets = getObjFromPropInArray(numeroAsso,"asso",APP.data.ticket);
  var lotWin = {
    jackpot:[],
    groslot:[],
    petitlot:[]
  }

  for(var plage in tickets){
    var min = parseInt(tickets[plage].de);
    var max = parseInt(tickets[plage].a);

    if(between(parseInt(APP.data.lot.jackpot[1].tirage[1]),min,max,true)){
      var lot = APP.data.lot.jackpot[1];
      lotWin.jackpot.push({"id":lot.id,"nom":lot.nom,"numero":parseInt(APP.data.lot.jackpot[1].tirage[1])});
    }

    //console.log("plage:",plage)
    //console.log("getLotAsso:",min,max);
    var grosLot = APP.data.lot.groslot;
    for(var i in grosLot){
      var lot = grosLot[i];
      for (var j in lot.tirage){
        var tirage = lot.tirage[j];
        if(between(parseInt(tirage),min,max,true)){
          lotWin.groslot.push({"id":lot.id,"nom":lot.nom,"numero":parseInt(lot.tirage[j])});
        }
      }
    }

    var petitLot = APP.data.lot.petitlot;
    for(var i in petitLot){
      var lot = petitLot[i];
      for (var j in lot.tirage){
        //debugger;
        var tirage1 = (parseInt(min/1000)*1000)+parseInt(lot.tirage[j]);
        if(between(parseInt(tirage1),min,max,true)){
          lotWin.petitlot.push({"id":lot.id,"nom":lot.nom,"numero":(parseInt(min/1000)*1000)+parseInt(lot.tirage[j])});
        }
        if(parseInt(min/1000) != parseInt(max/1000)){
          var tirage2 = (parseInt(max/1000)*1000)+parseInt(lot.tirage[j]);
          if(between(parseInt(tirage2),min,max,true)){
            lotWin.petitlot.push({"id":lot.id,"nom":lot.nom,"numero":(parseInt(max/1000)*1000)+parseInt(lot.tirage[j])});
          }
        }

      }
    }
  }

  //console.log("gagne ["+lotWin.length+"] lot(s):",lotWin);
  //console.log("xxx>>",lotWin.petitlot);
  return lotWin;
}



};

//instancie les numeros Tiré
var loadNumeroTire = function(){
  var numeroTire = [];

  if(APP.data.lot.jackpot[1].tirage[1]){
    numeroTire.push(APP.data.lot.jackpot[1].tirage[1]);
  }

  for(var dataA in APP.data.lot.groslot){
    //console.log(">dataA:",APP.data.lot.groslot[dataA]);
    for(var dataB in APP.data.lot.groslot[dataA].tirage){
      //console.log("-dataB:",APP.data.lot.groslot[dataA].tirage[dataB]);
      if(APP.data.lot.groslot[dataA].tirage[dataB]){
        numeroTire.push(APP.data.lot.groslot[dataA].tirage[dataB]);
      }
    }
  }

  //console.log(numeroTire);
  APP.wsp.tirage.numeroTire = numeroTire;
};

/*&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&*/
/*&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&*/
/*&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&*/
/*&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&*/
/*&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&*/

//console.log("loading wsp: jackpot.js");
//private
/*
//data
var savejackpot = function($line){
var exist = false;
var id = sanitizeJSON($line.attr("jackpot-id"));
var nom = sanitizeJSON($line.find(".nom input")[0].value||"");
var nombre = sanitizeJSON($line.find(".nombre input")[0].value||"");
var ordre = sanitizeJSON($line.find(".ordre input")[0].value||"");

var dataObj = JSON.parse('{"id":"'+id+'","nom":"'+nom+'","nombre":"'+nombre+'","ordre":"'+ordre+'"}');


APP.data.lot.jackpot.forEach(function(dataLine) {
if(id == dataLine.id){
exist=true;
dataLine.nom = nom;
dataLine.nombre = nombre;
dataLine.ordre = ordre;
}
});

if(!exist){
APP.data.lot.jackpot.push(dataObj);
}
APP.saveData();
initTable();
}

var deletejackpot = function($line){
var id = sanitizeJSON($line.attr("jackpot-id"));
APP.data.lot.jackpot.forEach(function(dataLine,index) {
console.log("dataLine:",dataLine);
if(id == dataLine.id){
console.log("already-exist=modification:{>>>}",index);
APP.data.trash.push(dataLine);
APP.data.lot.jackpot.splice(index,1);
}
});
}
*/
//layout
var feedDisplay = function(line,data){
  line.attr("lot-id",data.id);
  line.find("[app-display='nom']").html(data.nom);
  line.find("[app-display='nombre']").html(data.nombre);
  line.find("[app-display='ordre']").html(data.ordre);
  //console.log(data);
  var numero;

  if(data.nombre != 1){  //si ce n'est pas le jackpot calcul et affiche les numero de lot
  //console.log(APP.wsp.tirage.dernierNumero)
  var actueldernierNumero = APP.wsp.tirage.dernierNumero;
  var prochainDernierNumero = actueldernierNumero + Number(data.nombre) - 1;
  //console.log(" [ ",prochainDernierNumero , " = " , actueldernierNumero , " + " , data.nombre , " - " ,  1 , "] ");
  numero =  (actueldernierNumero + 1) + " à " + prochainDernierNumero;
  //console.log(">>>",numero,"||||",actueldernierNumero,data.nombre,prochainDernierNumero);
  APP.wsp.tirage.dernierNumero=prochainDernierNumero;
}else{
  numero = data.ordre;
  APP.wsp.tirage.dernierNumero=1;
}

line.find("[app-display='numero']").html(numero);

}

var feedInput = function(line,data){
  //console.log("FEED) Input",line);
  //console.log($(line));
  var $line = $(line);
  var ordreLot = $line.attr("lot-ordre");
  $line.find("input").each(function(index,element){
    var $element = $(element);
    var ordreTirage = $element.attr('tirage');
    $element.attr('lot-id',data.id);
    //console.log("value:", APP.data.lot[$element.attr("lot-type")][ordreLot].tirage[ordreTirage],"|",ordreTirage);
    $element[0].value = APP.data.lot[$element.attr("lot-type")][ordreLot].tirage[ordreTirage];
    //$(element)[0].value = getObjPropValueInArray($(element).attr("tirage"),'ordre','numero',data.tirage);
  });
  /*
  $actualLine = $line.find("[app-edit='tirage1']");
  $line.attr('valid',true);//maybe check if really valid but a bit a non-sense, because already saved so theorically valid
  $line.attr('lot-id',data.id);
  $line.value = data.tirage[0].numero;*/
  /*line.find("[app-edit='nombre']").attr('value',data.nombre);
  line.find("[app-edit='ordre']").attr('value',data.ordre);*/
}

var lengthValidation = function($input) {
  var $inputs = $(".wsp-tirage input[type=number]");
  if($input){
    var $element = $input;
    var valueLength = $element[0].value.length;
    var valueLimit = $element.attr('maxlength');
    if(valueLength == valueLimit){
      $element.addClass("valid");
    }else{
      $element.removeClass("valid");
    }
  }else{
    $inputs.each(function(index,element){
      var $element = $(element);
      var valueLength = $element[0].value.length;
      var valueLimit = $element.attr('maxlength');
      if(valueLength == valueLimit){
        $element.addClass("valid");
      }else{
        $element.removeClass("valid");
      }
    });
  }
  var $inputsValid = $inputs.filter(".valid");
  $(".totalNumero").html($inputs.length);
  $(".totalValid").html($inputsValid.length);
  //console.log($inputs.length,"--",$inputsValid.length );
  if($inputs.length == $inputsValid.length && $inputs.length != 0 ){
    $("[app-action='stateNext']").removeAttr('disabled');
  }else{
    $("[app-action='stateNext']").attr('disabled','');
  }
}

var rangeValidation = function() {
  var $inputs = $(".wsp-tirage .table-groslot input[type=number].valid");

  $inputs.each(function(index,element){
    var $element = $(element);
    var value = $element[0].value;

    if(!between(value,APP.wsp.tirage.numStart,APP.wsp.tirage.numEnd,true)){
      $element.removeClass("valid");
    }
  });
}

var initTable= function(){
  //console.log("initTable tirage");
  var $tablejackpot= APP.$wsp.find(".table-jackpot .table-content");
  var $tablegroslot= APP.$wsp.find(".table-groslot .table-content");
  var $tablepetitlot= APP.$wsp.find(".table-petitlot .table-content");

  var lignetiragejackpot = APP.$wsp.find("#lignetiragejackpot").html();
  var lignetiragegroslot = APP.$wsp.find("#lignetiragegroslot").html();
  var lignetiragepetitlot = APP.$wsp.find("#lignetiragepetitlot").html();

  $tablejackpot.empty();
  $tablegroslot.empty();
  $tablepetitlot.empty();

  //APP.data.lot.jackpot.sort(dynamicSort("ordre"));

  //console.log("init:",APP.data.lot.jackpot)
  //console.log("objlength",Object.keys(APP.data.lot.jackpot).length);
  //ajout ligne jackpot
  if(Object.keys(APP.data.lot.jackpot).length>0){
    Object.keys(APP.data.lot.jackpot).forEach(function(dataLine) {
      var $line = $(lignetiragejackpot);
      $line.attr("lot-ordre",dataLine);
      feedDisplay($line,APP.data.lot.jackpot[dataLine]);
      feedInput($line,APP.data.lot.jackpot[dataLine]);
      $tablejackpot.append($line);
    });
  }
  //ajout ligne groslot
  //console.log("objlength",Object.keys(APP.data.lot.groslot).length);
  if(Object.keys(APP.data.lot.groslot).length>0){
    Object.keys(APP.data.lot.groslot).forEach(function(dataLine) {
      var $line = $(lignetiragegroslot);
      $line.attr("lot-ordre",dataLine);
      feedDisplay($line,APP.data.lot.groslot[dataLine]);
      feedInput($line,APP.data.lot.groslot[dataLine]);
      $tablegroslot.append($line);
    });
  }
  //ajout ligne petitlots
  if(Object.keys(APP.data.lot.petitlot).length>0){
    Object.keys(APP.data.lot.petitlot).forEach(function(dataLine) {
      var $line = $(lignetiragepetitlot);
      $line.attr("lot-ordre",dataLine);
      feedDisplay($line,APP.data.lot.petitlot[dataLine]);
      feedInput($line,APP.data.lot.petitlot[dataLine]);
      $tablepetitlot.append($line);
    });
  }

  lengthValidation();
  rangeValidation();
  displayGagnantDuJackpot();
  //calcul et affichage des numeros de lot
}
var displayGagnantDuJackpot = function(){
  var $inputJackpot = $("input[lot-type='jackpot']");
  if($inputJackpot.length==1){
    var numero = $inputJackpot[0].value;
    var gagnantDuJackpot = "";

    for(var plage in APP.data.ticket){
      if(between(numero,APP.data.ticket[plage].de,APP.data.ticket[plage].a,true)){
        gagnantDuJackpot = getObjPropInArray(APP.data.ticket[plage].asso,"nom",APP.data.association);
      }
    }
    //getObjPropInArray(,nom,);//ici
    $(".lignetiragejackpot [app-display='association']").html(gagnantDuJackpot);
  }
}
