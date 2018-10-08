//console.log("tools.js")

generateUUID= function() {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (d + Math.random()*16)%16 | 0;
    d = Math.floor(d/16);
    return (c=='x' ? r : (r&0x3|0x8)).toString(16);
  });
  return uuid;
};

dynamicSort = function(property) {
  var sortOrder = 1;
  if(property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a,b) {
    var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
    return result * sortOrder;
  }
}

sanitizeJSON = function(unsanitized){
  if(typeof unsanitized == "number"){
    unsanitized=unsanitized.toString();
  }
  return unsanitized.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t").replace(/\f/g, "\\f").replace(/"/g,"\\\"").replace(/\&/g, "");/*.replace(/'/g,"");*/
}

feedSelect = function($element,data,selected){
  //console.log("feedSelect:",data);
  var id, name;
  data.forEach(function(obj) {
    id=obj.id;
    name=obj.nom;
    if(obj.id==selected){
      $element.append('<option value="'+id+'" selected>'+name+'</option>');
    }else{
      $element.append('<option value="'+id+'">'+name+'</option>');
    }
  });
}

getObjPropInArray = function(id,prop,array) {
  var result="";
  array.forEach(function(obj) {
    if(obj.id && obj.id == id){
      //console.log("getObjInArray:FIND",obj[prop]);
      result = obj[prop];
    }
  });
  return result;
}

getObjFromPropInArray = function(id,prop,array){
  var result=[];
  array.forEach(function(obj) {
    if(obj[prop] && obj[prop] == id){
      //console.log("getObjInArray:FIND",obj[prop]);
      result.push(obj);
    }
  });
  return result;
}
/*
getObjPropValueInArray = function(id,prop,value,array)  {
  var result="";
  array.forEach(function(obj) {
    if(obj[prop] && obj[prop] == id){
      //console.log("getObjInArray:FIND",obj[prop]);
      result = obj[value];
    }
  });
  return result;
}
*/


/* ----- SAVE LOT ----- */
saveLot = function($line,type){
  //console.log(type);
  var i = 1;
  var nextIndex= 1;
  //  debugger;
  while(typeof APP.data.lot[type][i] == "object"){
    nextIndex = i+1;
    i++;
  }
  //nextIndex+=nextIndex;
  var id = sanitizeJSON($line.attr(type+"-id"));
  var nom = sanitizeJSON($line.find(".nom input")[0].value||"");
  var nombre = sanitizeJSON($line.find(".nombre input")[0].value||"");
  var ordre = sanitizeJSON($line.find(".ordre input")[0].value||nextIndex);
  var prevOrdre = $line.find(".ordre [app-display]").html();
  //console.log(prevOrdre);

if(type == "jackpot"){
  var dataObj = JSON.parse('{"id":"'+id+'","nom":"'+nom+'","nombre":"'+nombre+'","ordre":"'+ordre+'","tirage":{"1":""}}');
}else{
  var dataObj = JSON.parse('{"id":"'+id+'","nom":"'+nom+'","nombre":"'+nombre+'","ordre":"'+ordre+'","tirage":{"1":"","2":"","3":"","4":"","5":""}}');
}


  if(!APP.data.lot[type][ordre]){
    APP.data.lot[type][ordre] = dataObj;
    delete APP.data.lot[type][prevOrdre];
  }else if(ordre < nextIndex){ //si le nombre dans ordre existe deja
    //console.log("ordre deja existant donc a switch avec un autre.");
    if(dataObj.id == APP.data.lot[type][ordre].id){//si je modifie le même je garde le meme ordre
      //console.log("modification de la meme ligne");
      APP.data.lot[type][ordre] = dataObj;
    }else{//sinon je switch
      //console.log("switch");
      var target = APP.data.lot[type][ordre];
      //var temp
      APP.data.lot[type][ordre] = dataObj;
      APP.data.lot[type][prevOrdre] = target;

    }
  }else{
    if(!APP.data.lot[type][ordre]){
      delete APP.data.lot[type][prevOrdre];
    }
    APP.data.lot[type][nextIndex] = dataObj;
  }
  APP.saveData();
  APP.wsp[type].load();
}

deleteLot = function($line,type){
  var id = sanitizeJSON($line.attr(type+"-id"));
  Object.keys(APP.data.lot[type]).forEach(function(index) {
    var dataLine = APP.data.lot[type][index];
    //console.log("dataLine:",dataLine);
    //debugger;
    if(id == dataLine.id){
      //console.log("already-exist=modification:{>>>}",index);
      APP.data.trash.push(dataLine);
      //console.log("delete in json?");
      //console.log("delete:",APP.data.lot[type][index]);
      delete APP.data.lot[type][index];
    }
  });
}

between = function(value,min,max,ioe){
  //"ioe" meaning insideOrEqual
  if(ioe){
    return value >= min && value <= max;
  }else{
      return value > min && value < max;
  }
}
