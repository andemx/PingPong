//console.log("template.js")

/* --- TEMPLATES --- */
$("#templates")
.append('<script id="wspaccueil" type="text/html"></script>')
.append('<script id="wspannee" type="text/html"></script>')
.append('<script id="wspassociation" type="text/html"></script>')
.append('<script id="wspgestion" type="text/html"></script>')
.append('<script id="wsplot" type="text/html"></script>')
.append('<script id="wspjackpot" type="text/html"></script>')
.append('<script id="wspgroslot" type="text/html"></script>')
.append('<script id="wsppetitlot" type="text/html"></script>')
.append('<script id="wspticket" type="text/html"></script>')
.append('<script id="wsptirage" type="text/html"></script>')
.append('<script id="tmplannee" type="text/html"></script>')
.append('<script id="nav" type="text/html"></script>');

$("#wspaccueil").load("./views/wsp/accueil.html");
$("#wspannee").load("./views/wsp/annee.html");
$("#wspassociation").load("./views/wsp/association.html");
$("#wspgestion").load("./views/wsp/gestion.html");
$("#wsplot").load("./views/wsp/lot.html");
$("#wspjackpot").load("./views/wsp/jackpot.html");
$("#wspgroslot").load("./views/wsp/groslot.html");
$("#wsppetitlot").load("./views/wsp/petitlot.html");
$("#wspticket").load("./views/wsp/ticket.html");
$("#wsptirage").load("./views/wsp/tirage.html");
$("#tmplannee").load("./views/tmpl/annee.html");
$("#nav").load("./views/wsp/nav.html",function(){
  APP.$events.trigger("templates-ready");
});
