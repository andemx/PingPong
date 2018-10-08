//console.log("loading wsp: jackpot.js");
//private

//data
/*
var savejackpot = function($line){
saveLot($line,"jackpot");
}*/

/*
var deletejackpot = function($line){
var id = sanitizeJSON($line.attr("jackpot-id"));
Object.keys(APP.data.lot.jackpot).forEach(function(index) {
var dataLine = APP.data.lot.jackpot[index];
console.log("dataLine:",dataLine);
//debugger;
if(id == dataLine.id){
console.log("already-exist=modification:{>>>}",index);
APP.data.trash.push(dataLine);
//console.log("delete in json?");
console.log("delete:",APP.data.lot.jackpot[index]);
delete APP.data.lot.jackpot[index];
}
});
}
*/

//layout
var feedDisplay = function(line,data,index){
  line.attr("jackpot-id",data.id);
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
  $parent.find("[jackpot-line='save']").attr('hidden','');
  $parent.find("[jackpot-line='confirm']").attr('hidden','');
  $parent.find("[jackpot-line='edit']").removeAttr('hidden');

  $parent.find("[jackpot-line='cancel']").attr('hidden','');
  $parent.find("[jackpot-line='delete']").removeAttr('hidden');

  $line.find("[app-display]").removeAttr('hidden');
  $line.find("[app-edit]").attr('hidden','');
}

var saveLine = function($element,$parent,$line){
  $parent.find("[jackpot-line='save']").attr('hidden','');
  $parent.find("[jackpot-line='edit']").removeAttr('hidden');

  $parent.find("[jackpot-line='cancel']").attr('hidden','');
  $parent.find("[jackpot-line='delete']").removeAttr('hidden');

  $line.find("[app-display]").removeAttr('hidden');
  $line.find("[app-edit]").attr('hidden','');
  //SAVEDATA
}

var deleteLine = function($element,$parent,$line){
  $parent.find("[jackpot-line='delete']").attr('hidden','');
  $parent.find("[jackpot-line='edit']").attr('hidden','');
  $parent.find("[jackpot-line='confirm']").removeAttr('hidden');
  $parent.find("[jackpot-line='cancel']").removeAttr('hidden');

  $line.find("[app-display]").removeAttr('hidden');
  $line.find("[app-edit]").attr('hidden','');
}

var confirmDeleteLine = function($element,$parent,$line){
  $parent.find("[jackpot-line='confirm']").attr('hidden','');
  $parent.find("[jackpot-line='cancel']").attr('hidden','');
  $parent.find("[jackpot-line='delete']").removeAttr('hidden');
  $parent.find("[jackpot-line='edit']").removeAttr('hidden');

  $line.find("[app-display]").removeAttr('hidden');
  $line.find("[app-edit]").attr('hidden','');
  $line.remove();
}

var editLine = function($element,$parent,$line){
  $parent.find("[jackpot-line='edit']").attr('hidden','');
  $parent.find("[jackpot-line='save']").removeAttr('hidden');

  $parent.find("[jackpot-line='delete']").attr('hidden','');
  $parent.find("[jackpot-line='cancel']").removeAttr('hidden');

  $line.find("[app-edit]").removeAttr('hidden');
  $line.find("[app-display]").attr('hidden','');
}


var initTable= function(){
  //console.log("initTable jackpot");
  var $table= APP.$wsp.find("table .table-content");
  $table.empty();
  //APP.data.lot.jackpot.sort(dynamicSort("ordre"));
  //console.log("init:",APP.data.lot.jackpot)
  var ligneTmpl = APP.$wsp.find("#lignejackpot").html();
  if(Object.keys(APP.data.lot.jackpot).length>0){
    //console.log(APP.data.lot.jackpot);
    Object.keys(APP.data.lot.jackpot).forEach(function(index) {
      var dataLine = APP.data.lot.jackpot[index];
      //console.log("lot.jackpot:",APP.data.lot.jackpot[index]);
      var $line = $(ligneTmpl);
      feedDisplay($line,dataLine,index);
      feedEdit($line,dataLine,index);
      $table.append($line);
    });
  }else{
    //console.log(Object.keys(APP.data.lot.jackpot).length,"APP.data.lot.jackpot empty");
  }
}

// --- public --- //
APP.wsp.jackpot= {
  load: function(){
    initTable();
  },
};

// --- event --- //
APP.$wsp.on('click','[jackpot-line]',function(event){
  var $element = $(event.currentTarget);
  var $parent = $element.parent();
  var $line = $parent.closest('tr');
  var action = $element.attr('jackpot-line');
  var $addLine = $("[jackpot-table='add']");
  var $allActions = $('.wsp-jackpot button');
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
    //savejackpot($line);
    saveLot($line,"jackpot");
    break;
    case "confirm":
    $addLine.removeAttr('disabled');
    $allActions.not($lineActions).removeAttr('disabled');
    confirmDeleteLine($element,$parent,$line);
    deleteLot($line,"jackpot");
    APP.saveData();
    break;
    default:console.log("line-action > default break");
  }
});

APP.$wsp.on('click','[jackpot-table]',function(event){
  $("[jackpot-table='add']").attr('disabled','');
  var $table = APP.$wsp.find("table .table-content");
  var ligneTmpl = APP.$wsp.find("#lignejackpot").html();
  $table.prepend(ligneTmpl);
  $table.find(".lignejackpot").first().attr('jackpot-id', generateUUID());
  $table.find("[jackpot-line='edit']").first().click();
  $table.find('.ordre input').attr('hidden','');
  $table.find('.nom input').first().focus();
});
