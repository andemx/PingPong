//console.log("loading wsp: groslot.js");
//private

//data
/*
var savegroslot = function($line){
var exist = false;
var id = sanitizeJSON($line.attr("groslot-id"));
var nom = sanitizeJSON($line.find(".nom input")[0].value||"");
var nombre = sanitizeJSON($line.find(".nombre input")[0].value||"");
var ordre = sanitizeJSON($line.find(".ordre input")[0].value||"");

var dataObj = JSON.parse('{"id":"'+id+'","nom":"'+nom+'","nombre":"'+nombre+'","ordre":"'+ordre+'"}');

console.log("revoir l'ordre");
Object.keys(APP.data.lot.groslot).forEach(function(index) {
var dataLine = APP.data.lot.groslot[index];
if(id == dataLine.id){
exist=true;
dataLine.nom = nom;
dataLine.nombre = nombre;
dataLine.ordre = index;
}
});

if(!exist){
console.log("pushJson");
//APP.data.lot.groslot.push(dataObj);
}
APP.saveData();
initTable();
}*/
/*
var deletegroslot = function($line){
var id = sanitizeJSON($line.attr("groslot-id"));
Object.keys(APP.data.lot.groslot).forEach(function(index) {
//console.log("dataLine:",dataLine);
var dataLine = APP.data.lot.groslot[index];
if(id == dataLine.id){
console.log("already-exist=modification:{>>>}",index);
APP.data.trash.push(dataLine);
console.log("remove in json");
//APP.data.lot.groslot.splice(index,1);
}
});
}
*/
//layout
var feedDisplay = function(line,data,index){
  line.attr("groslot-id",data.id);
  line.find("[app-display='nom']").html(data.nom);
  line.find("[app-display='nombre']").html(data.nombre);
  line.find("[app-display='ordre']").html(index);
}

var feedEdit = function(line,data,index){
  line.find("[app-edit='nom']").attr('value',data.nom);
  line.find("[app-edit='nombre']").attr('value',data.nombre);
  line.find("[app-edit='ordre']").attr('value',index);
}

//action
var cancelLine = function($element,$parent,$line){
  $parent.find("[groslot-line='save']").attr('hidden','');
  $parent.find("[groslot-line='confirm']").attr('hidden','');
  $parent.find("[groslot-line='edit']").removeAttr('hidden');

  $parent.find("[groslot-line='cancel']").attr('hidden','');
  $parent.find("[groslot-line='delete']").removeAttr('hidden');

  $line.find("[app-display]").removeAttr('hidden');
  $line.find("[app-edit]").attr('hidden','');
}

var saveLine = function($element,$parent,$line){
  $parent.find("[groslot-line='save']").attr('hidden','');
  $parent.find("[groslot-line='edit']").removeAttr('hidden');

  $parent.find("[groslot-line='cancel']").attr('hidden','');
  $parent.find("[groslot-line='delete']").removeAttr('hidden');

  $line.find("[app-display]").removeAttr('hidden');
  $line.find("[app-edit]").attr('hidden','');
  //SAVEDATA
}

var deleteLine = function($element,$parent,$line){
  $parent.find("[groslot-line='delete']").attr('hidden','');
  $parent.find("[groslot-line='edit']").attr('hidden','');
  $parent.find("[groslot-line='confirm']").removeAttr('hidden');
  $parent.find("[groslot-line='cancel']").removeAttr('hidden');

  $line.find("[app-display]").removeAttr('hidden');
  $line.find("[app-edit]").attr('hidden','');
}

var confirmDeleteLine = function($element,$parent,$line){
  $parent.find("[groslot-line='confirm']").attr('hidden','');
  $parent.find("[groslot-line='cancel']").attr('hidden','');
  $parent.find("[groslot-line='delete']").removeAttr('hidden');
  $parent.find("[groslot-line='edit']").removeAttr('hidden');

  $line.find("[app-display]").removeAttr('hidden');
  $line.find("[app-edit]").attr('hidden','');
  $line.remove();
}

var editLine = function($element,$parent,$line){
  $parent.find("[groslot-line='edit']").attr('hidden','');
  $parent.find("[groslot-line='save']").removeAttr('hidden');

  $parent.find("[groslot-line='delete']").attr('hidden','');
  $parent.find("[groslot-line='cancel']").removeAttr('hidden');

  $line.find("[app-edit]").removeAttr('hidden');
  $line.find("[app-display]").attr('hidden','');
}


var initTable= function(){
  //console.log("initTable groslot");
  var $table= APP.$wsp.find("table .table-content");
  $table.empty();
  //APP.data.lot.groslot.sort(dynamicSort("ordre"));
  //console.log("init:",APP.data.lot.groslot)
  var ligneTmpl = APP.$wsp.find("#lignegroslot").html();
  if(Object.keys(APP.data.lot.groslot).length>0){
    Object.keys(APP.data.lot.groslot).forEach(function(index) {
      var dataLine = APP.data.lot.groslot[index];
      var $line = $(ligneTmpl);
      feedDisplay($line,dataLine,index);
      feedEdit($line,dataLine,index);
      $table.append($line);
    });
  }
}

// --- public --- //
APP.wsp.groslot= {
  load: function(){
    initTable();
  },
};

// --- event --- //
APP.$wsp.on('click','[groslot-line]',function(event){
  var $element = $(event.currentTarget);
  var $parent = $element.parent();
  var $line = $parent.closest('tr');
  var action = $element.attr('groslot-line');
  var $addLine = $("[groslot-table='add']");
  var $allActions = $('.wsp-groslot button');
  var $lineActions = $line.find('button');
  switch(action){
    case "edit":
    $addLine.attr('disabled','');
    $allActions.not($lineActions).attr('disabled','');
    editLine($element,$parent,$line);
    break;
    case "delete":
    $addLine.attr('disabled','');
    $allActions.not($lineActions).attr('disabled','');
    deleteLine($element,$parent,$line);
    break;
    case "cancel":
    $addLine.removeAttr('disabled');
    $allActions.not($lineActions).removeAttr('disabled');
    cancelLine($element,$parent,$line);
    break;
    case "save":
    $addLine.removeAttr('disabled');
    $allActions.not($lineActions).removeAttr('disabled');
    saveLine($element,$parent,$line);
    saveLot($line,"groslot");
    break;
    case "confirm":
    $addLine.removeAttr('disabled');
    $allActions.not($lineActions).removeAttr('disabled');
    confirmDeleteLine($element,$parent,$line);
    deleteLot($line,"groslot");
    APP.saveData();
    break;
    default:
    //console.log("line-action > default break");
    break;
  }
});

APP.$wsp.on('click','[groslot-table]',function(event){
  $("[groslot-table='add']").attr('disabled','');
  var $table = APP.$wsp.find("table .table-content");
  var ligneTmpl = APP.$wsp.find("#lignegroslot").html();
  $table.prepend(ligneTmpl);
  $table.find(".lignegroslot").first().attr('groslot-id', generateUUID());
  $table.find("[groslot-line='edit']").first().click();
  $table.find('.ordre input').attr('hidden','');
  $table.find('.nom input').first().focus();
});
