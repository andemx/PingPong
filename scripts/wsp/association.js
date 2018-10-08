//console.log("loading wsp: association.js");
//private

//data
var saveAsso = function($line){
  var exist = false;
  var id = sanitizeJSON($line.attr("asso-id"));
  var nom = sanitizeJSON($line.find(".nom input")[0].value||"");
  var contact = sanitizeJSON($line.find(".contact input")[0].value||"");
  var tel = sanitizeJSON($line.find(".tel input")[0].value||"");
  var email = sanitizeJSON($line.find(".email input")[0].value||"");

  var dataObj = JSON.parse('{"id":"'+id+'","nom":"'+nom+'","contact":"'+contact+'","tel":"'+tel+'","email":"'+email+'"}');


  APP.data.association.forEach(function(dataLine) {
    if(id == dataLine.id){
      exist=true;
      dataLine.nom = nom;
      dataLine.contact = contact;
      dataLine.tel = tel;
      dataLine.email = email;
    }
  });

  if(!exist){
    APP.data.association.push(dataObj);
  }
  APP.saveData();
  console.log(">asso saved!go init");
  initTable();
  console.log(">asso init!isoquai stop");
}

var deleteAsso = function($line){
  var id = sanitizeJSON($line.attr("asso-id"));
  APP.data.association.forEach(function(dataLine,index) {
    //console.log("dataLine:",dataLine);
    if(id == dataLine.id){
      //console.log("already-exist=modification:{>>>}",index);
      APP.data.trash.push(dataLine);
      APP.data.association.splice(index,1);
    }
  });
}

//layout
var feedDisplay = function(line,data){
  line.attr("asso-id",data.id);
  line.find("[app-display='nom']").html(data.nom);
  line.find("[app-display='contact']").html(data.contact);
  line.find("[app-display='tel']").html(data.tel);
  line.find("[app-display='email']").html(data.email);
}

var feedEdit = function(line,data){
  line.find("[app-edit='nom']").attr('value',data.nom);
  line.find("[app-edit='contact']").attr('value',data.contact);
  line.find("[app-edit='tel']").attr('value',data.tel);
  line.find("[app-edit='email']").attr('value',data.email);
}

//action
var cancelLine = function($element,$parent,$line){
  $parent.find("[asso-line='save']").attr('hidden','');
  $parent.find("[asso-line='confirm']").attr('hidden','');
  $parent.find("[asso-line='edit']").removeAttr('hidden');

  $parent.find("[asso-line='cancel']").attr('hidden','');
  $parent.find("[asso-line='delete']").removeAttr('hidden');

  $line.find("[app-display]").removeAttr('hidden');
  $line.find("[app-edit]").attr('hidden','');
}

var saveLine = function($element,$parent,$line){
  $parent.find("[asso-line='save']").attr('hidden','');
  $parent.find("[asso-line='edit']").removeAttr('hidden');

  $parent.find("[asso-line='cancel']").attr('hidden','');
  $parent.find("[asso-line='delete']").removeAttr('hidden');

  $line.find("[app-display]").removeAttr('hidden');
  $line.find("[app-edit]").attr('hidden','');
  //SAVEDATA
}

var deleteLine = function($element,$parent,$line){
  $parent.find("[asso-line='delete']").attr('hidden','');
  $parent.find("[asso-line='edit']").attr('hidden','');
  $parent.find("[asso-line='confirm']").removeAttr('hidden');
  $parent.find("[asso-line='cancel']").removeAttr('hidden');

  $line.find("[app-display]").removeAttr('hidden');
  $line.find("[app-edit]").attr('hidden','');
}

var confirmDeleteLine = function($element,$parent,$line){
  $parent.find("[asso-line='confirm']").attr('hidden','');
  $parent.find("[asso-line='cancel']").attr('hidden','');
  $parent.find("[asso-line='delete']").removeAttr('hidden');
  $parent.find("[asso-line='edit']").removeAttr('hidden');

  $line.find("[app-display]").removeAttr('hidden');
  $line.find("[app-edit]").attr('hidden','');
  $line.remove();
}

var editLine = function($element,$parent,$line){
  $parent.find("[asso-line='edit']").attr('hidden','');
  $parent.find("[asso-line='save']").removeAttr('hidden');

  $parent.find("[asso-line='delete']").attr('hidden','');
  $parent.find("[asso-line='cancel']").removeAttr('hidden');

  $line.find("[app-edit]").removeAttr('hidden');
  $line.find("[app-display]").attr('hidden','');
}


var initTable= function(){
  //console.log("initTable asso");
  var $table= APP.$wsp.find("table .table-content");
  $table.empty();
  APP.data.association.sort(dynamicSort("nom"));
  //console.log("init:",APP.data.association)
  var ligneTmpl = APP.$wsp.find("#ligneasso").html();
  if(APP.data.association.length>0){
    APP.data.association.forEach(function(dataLine) {
      var $line = $(ligneTmpl);
      feedDisplay($line,dataLine);
      feedEdit($line,dataLine);
      $table.append($line);
    });
  }
}

// --- public --- //
APP.wsp.association= {
  load: function(){
    initTable();
  },
};

// --- event --- //
APP.$wsp.on('click','[asso-line]',function(event){
  var $element = $(event.currentTarget);
  var $parent = $element.parent();
  var $line = $parent.closest('tr');
  var action = $element.attr('asso-line');
  var $addLine = $("[asso-table='add']");
  var $allActions = $('.wsp-association button');
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
    saveAsso($line);
    break;
    case "confirm":
    $addLine.removeAttr('disabled');
    $allActions.not($lineActions).removeAttr('disabled');
    confirmDeleteLine($element,$parent,$line);
    deleteAsso($line);
    APP.saveData();
    break;
    default:console.log("asso-line-action > default break");
  }
});

APP.$wsp.on('click','[asso-table]',function(event){
  $("[asso-table='add']").attr('disabled','');
  var $table = APP.$wsp.find("table .table-content");
  var ligneTmpl = APP.$wsp.find("#ligneasso").html();
  $table.prepend(ligneTmpl);
  $table.find(".ligneasso").first().attr('asso-id', generateUUID());
  $table.find("[asso-line='edit']").first().click();
  $table.find('.nom input').first().focus();
});
