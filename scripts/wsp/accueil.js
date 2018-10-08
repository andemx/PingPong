//console.log("loading wsp: accueil");
APP.wsp.accueil= {
 ajoutAnnee: function(année){
		var $tmpl = $($("#tmplannee").clone().html());
		var $wspBody = $(".wsp-accueil");

		$tmpl.find("[app-nav]").attr('app-data',année).find("span").html("année "+année);

		$wspBody.append($tmpl);
	},
	clean: function(){
		var $wspBody = $(".wsp-accueil");
		$wspBody.html("");
	},
  load: function(){
    this.clean();
    //APP.wsp.accueil.clean();
    APP.loadFolder();
  }
}
