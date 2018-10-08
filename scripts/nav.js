//console.log("nav.js")

APP.nav = function(event){
  //console.log("nav",event);
  var $target = $(event.currentTarget);
  var destination = $target.attr("app-data");
  var nav = $target.attr("app-nav");
  APP.$subtitle = $("body>.header .subtitle");
  APP.$subtitle.html(destination);
	if(nav == "annee"){
		APP.year=destination;
		APP.loadFile();
    APP.$wsp.html($("#wspannee").html());
    APP.$nav.find("[disabled]").removeAttr("disabled");
    var $newNavElem = $($("#nav").html());//-----
    $newNavElem.attr("app-data","annee").html(destination);
		APP.year = destination;
    APP.$nav.append($newNavElem);
	}
  else if(nav=="prev"){
		if(destination=="accueil"){
			APP.year = "0000";
		}
    //console.log(">>>prev");
    APP.$wsp.html($("#wsp"+destination).html());
    $target.attr("disabled","");
    $target.nextAll().remove();
		APP.$events.trigger("ui-refreshed");
  }else if(nav=="next"){
    //console.log(">>>next");
    APP.$wsp.html($("#wsp"+destination).html());
    APP.$nav.find("[disabled]").removeAttr("disabled");
    var $newNavElem = $($("#nav").html());//-----
    $newNavElem.attr("app-data",destination).html(destination);
    APP.$nav.append($newNavElem);
  }else{
    console.log(">>>bug nav!",nav);
  }
  APP.$events.trigger('nav-done',[destination]);
};
