//console.log("loading wsp: ticket.js");

//data
var saveTicket = function($line){
  var exist = false;
  var id = sanitizeJSON($line.attr("ticket-id"));
  var asso = sanitizeJSON($line.find(".asso select")[0].value);
  var nombre = sanitizeJSON($line.find(".nombre input")[0].value);
  var de = sanitizeJSON($line.find(".de input")[0].value);
  var a = sanitizeJSON($line.find(".a input")[0].value);

  var dataObj = JSON.parse('{"id":"'+id+'","asso":"'+asso+'","nombre":"'+nombre+'","de":"'+de+'","a":"'+a+'"}');

  APP.data.ticket.forEach(function(dataLine) {
    if(id == dataLine.id){
      exist=true;
      dataLine.asso = asso;
      dataLine.nombre = nombre;
      dataLine.de = de;
      dataLine.a = a;
    }
  });

  if(!exist){
    APP.data.ticket.push(dataObj);
  }
  APP.saveData();
  initTable();
}

var deleteTicket = function($line){
  var id = sanitizeJSON($line.attr("ticket-id"));
  APP.data.ticket.forEach(function(dataLine,index) {
    //console.log("dataLine:",dataLine);
    if(id == dataLine.id){
      //console.log("already-exist=modification:{>>>}",index);
      APP.data.trash.push(dataLine);
      APP.data.ticket.splice(index,1);
    }
  });
}

//layout
var feedDisplay = function(line,data){
  line.attr("ticket-id",data.id);
  line.find("[app-display='asso']").html(getObjPropInArray(data.asso,"nom",APP.data.association));
  line.find("[app-display='nombre']").html(data.nombre);
  line.find("[app-display='de']").html(data.de);
  line.find("[app-display='a']").html(data.a);
}

var feedEdit = function(line,data){
  //line.find("[app-edit='asso']").attr('value',data.asso);
  feedSelect(line.find("[app-edit='asso']"),APP.data.association,data.asso);
  line.find("[app-edit='nombre']").attr('value',data.nombre);
  line.find("[app-edit='de']").attr('value',data.de);
  line.find("[app-edit='a']").attr('value',data.a);
}

//action
var cancelLine = function($element,$parent,$line){
  $parent.find("[ticket-line='save']").attr('hidden','');
  $parent.find("[ticket-line='confirm']").attr('hidden','');
  $parent.find("[ticket-line='edit']").removeAttr('hidden');

  $parent.find("[ticket-line='cancel']").attr('hidden','');
  $parent.find("[ticket-line='delete']").removeAttr('hidden');

  $line.find("[app-display]").removeAttr('hidden');
  $line.find("[app-edit]").attr('hidden','');
}

var saveLine = function($element,$parent,$line){
  $parent.find("[ticket-line='save']").attr('hidden','');
  $parent.find("[ticket-line='edit']").removeAttr('hidden');

  $parent.find("[ticket-line='cancel']").attr('hidden','');
  $parent.find("[ticket-line='delete']").removeAttr('hidden');

  $line.find("[app-display]").removeAttr('hidden');
  $line.find("[app-edit]").attr('hidden','');
  //SAVEDATA
}

var deleteLine = function($element,$parent,$line){
  $parent.find("[ticket-line='delete']").attr('hidden','');
  $parent.find("[ticket-line='edit']").attr('hidden','');
  $parent.find("[ticket-line='confirm']").removeAttr('hidden');
  $parent.find("[ticket-line='cancel']").removeAttr('hidden');

  $line.find("[app-display]").removeAttr('hidden');
  $line.find("[app-edit]").attr('hidden','');
}

var confirmDeleteLine = function($element,$parent,$line){
  $parent.find("[ticket-line='confirm']").attr('hidden','');
  $parent.find("[ticket-line='cancel']").attr('hidden','');
  $parent.find("[ticket-line='delete']").removeAttr('hidden');
  $parent.find("[ticket-line='edit']").removeAttr('hidden');

  $line.find("[app-display]").removeAttr('hidden');
  $line.find("[app-edit]").attr('hidden','');
  $line.remove();
}

var editLine = function($element,$parent,$line){
  $parent.find("[ticket-line='edit']").attr('hidden','');
  $parent.find("[ticket-line='save']").removeAttr('hidden');

  $parent.find("[ticket-line='delete']").attr('hidden','');
  $parent.find("[ticket-line='cancel']").removeAttr('hidden');

  $line.find("[app-edit]").removeAttr('hidden');
  $line.find("[app-display]").attr('hidden','');
}


var initTable= function(){
  //console.log("initTable ticket");
  var $table= APP.$wsp.find("table .table-content");
  $table.empty();
  APP.data.ticket.sort(dynamicSort("de"));
  //console.log("init:",APP.data.ticket)
  var ligneTmpl = APP.$wsp.find("#ligneticket").html();
  if(APP.data.ticket.length>0){
    APP.data.ticket.forEach(function(dataLine) {
      var $line = $(ligneTmpl);
      feedDisplay($line,dataLine);
      feedEdit($line,dataLine);
      $table.append($line);
    });
  }
}

// --- public --- //
APP.wsp.ticket= {
  load: function(){
    initTable();
  },
  isValid : function(numTicket){

    return true;

  }
};

// --- event --- //
APP.$wsp.on('click','[ticket-line]',function(event){
  //console.log("click on an line action");
  var $element = $(event.currentTarget);
  var $parent = $element.parent();
  var $line = $parent.closest('tr');
  var action = $element.attr('ticket-line');
  var $allActions = $('.wsp-ticket button');
  var $lineActions = $line.find('button');
  var $addLine = $("[ticket-table='add']");
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
    saveTicket($line);
    break;
    case "confirm":
    $addLine.removeAttr('disabled');
    $allActions.not($lineActions).removeAttr('disabled');
    confirmDeleteLine($element,$parent,$line);
    deleteTicket($line);
    APP.saveData();
    break;
    default:console.log("ticket-line-action > default break");
  }
});

APP.$wsp.on('click','[ticket-table]',function(event){
  $("[ticket-table='add']").attr('disabled','');
  var $table = APP.$wsp.find("table .table-content");
  var ligneTmpl = APP.$wsp.find("#ligneticket").html();
  $table.prepend(ligneTmpl);
  $table.find(".ligneticket").first().attr('ticket-id', generateUUID());

  feedSelect($table.find(".ligneticket").find("[app-edit='asso']"),APP.data.association,null);
  $table.find("[ticket-line='edit']").first().click();
  //$table.find('.asso input').first().focus();
});
/*
APP.$wsp.on('click','[app-edit="asso"]',function(event){
console.log("select",event);
$(event.currentTarget).attr('selected','selected');//.parent().find("option[selected]").not(event.currentTarget).removeAttr('selected');

});*/
