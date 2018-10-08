//console.log("event.js");
/* --- EVENTS --- */
APP.$events.one("app-launch",function(){
	console.log("€app-launch");
	APP.$wsp.html($("#wspaccueil").html());
	APP.$subtitle.html("accueil");
	APP.wsp.accueil.load();
	//APP.$events.trigger("ui-refreshed");
});

APP.$events.on("ui-refreshed",function(){
	console.log("€ui-refreshed");
	//APP.loadFolder();
});

APP.$events.one("templates-ready",function(){
	console.log("€templates-ready");
	APP.$events.trigger("app-launch");
});

APP.$events.on("nav-ready",function(){
	console.log("€nav-ready");
	//console.log("nav-ready");

});

APP.$body.on('nav-done',function(event,destination){
	console.log("€nav-done");
	//console.log("nav-done:",destination,"|",event);
	switch(destination){
		case "accueil":APP.wsp.accueil.load();break;
		case "tirage":APP.wsp.tirage.load();break;
		case "ticket":APP.wsp.ticket.load();break;
		case "association":APP.wsp.association.load();break;
		case "jackpot":APP.wsp.jackpot.load();break;
		case "groslot":APP.wsp.groslot.load();break;
		case "petitlot":APP.wsp.petitlot.load();break;
		case "gestion":break;
		default:
		//console.log("nav to empty wsp");
		break;
	}
	//tirageLoad
});



/* --- ACTION --- */
APP.$body.on('click','[app-nav]',function(event){
	APP.nav(event);
});

APP.$body.on('click','[app-tirage]',function(event){
	APP.tirage(event);
});

APP.$body.on('click','[app-action]',function(event){
	//console.log(event);
	var action = $(event.currentTarget).attr('app-action');
	switch(action){
		case "créer":
		//APP.loadFolder();
		//APP.wsp.tirage.load();
		break;
		case "rafraichir":
		console.log("ah");
		APP.loadFolder();
		//APP.wsp.tirage.load();
		break;
		case "ouvrir":
		APP.openFolder();
		//APP.wsp.tirage.load();
		break;
		case "creer":
		$(".wsp-accueil+.wsp-action, .create").removeClass('raised');
		$(".accueil-card").addClass('active');
		//setTimeout()
		$(".accueil-card input").focus();
		//APP.wsp.tirage.load();
		break;
		case "cancel":
		$(".accueil-card input").blur();
		$(".accueil-card").removeClass('active');
		$(".wsp-accueil+.wsp-action .create").addClass('raised');
		break;
		case "help":
		$(".help-info").toggleClass('active');
		break;
		case "save":
		var année = $(".accueil-card input").val();
		console.log("ah:",année);
		if(année && année.length == 4 && !isNaN(année)){
			APP.createData(année);
		}else{
			alert("Merci de saisir une année constitué de 4 numéro, ex: 2018");
				$(".accueil-card input").focus();
		}
		break;
		case "stateNext":
		APP.data.tirage.state++;
		APP.wsp.tirage.load();
		break;
		case "statePrev":
		APP.data.tirage.state--;
		APP.wsp.tirage.load();
		break;
		case "print":
		window.print();
		break;
	}
	//console.log('action:'+action);
});


/* --- INPUT --- */ // (focus/blur/keypress/validation)
APP.$body.on('focus','.wsp-tirage input',function(event){
	var $element = $(event.currentTarget);
	APP.$inputFocus = $element;
	APP.$inputFocus.maxlength = $element.attr('maxlength');
	APP.$inputFocus.value = APP.$inputFocus[0].value;
	APP.$inputFocus.typingPending;
	APP.$inputFocus.valid = $element.attr('valid');
	//console.log('focus input',APP.$inputFocus);
});

APP.$body.on('keyup','.wsp-tirage input',function(event){
	//console.log(event.originalEvent.keyCode);
	switch (event.originalEvent.keyCode){
		case 8:
		//console.log("[-BackSpace-]");
		APP.wsp.tirage.validationInput(APP.$inputFocus);
		break;
		case 9:console.log("[-Tab-]");break;
		case 13:console.log("[-Enter-]");break;
		case 16:console.log("[-Shift-]");break;
		case 17:console.log("[-Ctrl-]");break;
		case 18:console.log("[-Alt]");break;
		case 32:console.log("[-Space-]");break;
		default:break;
	}
});

APP.$body.on('keypress','.wsp-tirage input',function(event){
	APP.$inputFocus.value = APP.$inputFocus[0].value;
	//console.log(window.getSelection().toString().length,APP.$inputFocus.maxlength);
	if(APP.$inputFocus.maxlength > APP.$inputFocus.value.length || (window.getSelection().toString().length > 0 && window.getSelection().toString().length <= APP.$inputFocus.maxlength)){
		APP.$inputFocus.valid=false;
		clearTimeout(APP.$inputFocus.typingPending);
		APP.$inputFocus.typingPending = setTimeout(function(){
			//console.log(APP.$inputFocus);
			APP.wsp.tirage.validationInput(APP.$inputFocus);
		}, 100);
	}else{
		return false;
	}
});

APP.$body.on('blur','input',function(event){
	var $element = $(event.currentTarget);
	//console.log('blur input', APP.$inputFocus);

	//save
	//console.log(APP.data.tirage[$element.attr('lot')])
	//if(APP.data.tirage.)
	APP.$inputFocus = null;
});

APP.$body.on('change','select',function(event){
	var $element = $(event.currentTarget);
	//$element.toggleClass("active");
	var val = $element.val();
	//if(!$element.hasClass("active")){
	var $container = $("[app-state='1'] .lotWin");
	$container.html("");
	var lotWin = APP.wsp.tirage.getLotsAsso(val);
	if(lotWin.jackpot.length||lotWin.groslot.length||lotWin.petitlot.length){
		for(var lotType in lotWin){
			var lot = lotWin[lotType];
			for(var realLot in lot){
				//console.log(lot[realLot]);
				var actualLot = lot[realLot]
				var icone;
				switch(lotType){
					case "jackpot":
					icone = "airplanemode_active";
					break;
					case "groslot":
					icone = "speaker";
					break;
					case "petitlot":
					icone = "free_breakfast";
					break;
					default:
					icone = "warning";
					break;
				}
				$container.append("<p class='win-"+lotType+"'><i class='material-icons'>"+icone+"</i> 1 - "+actualLot.nom+" <i>("+actualLot.numero+")</i></p>");
			}
		}
	}else{
		$container.append("<h4>Pas de lot trouvé pour cette association.</h4>");
	}

	//}
});

APP.$body.on('blur','select',function(event){
	var $element = $(event.currentTarget);
	$element.removeClass("active");
});
