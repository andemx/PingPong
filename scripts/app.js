//console.log("app.js")
APP={};
APP.wsp={};
APP.data={};

require('./tools.js');
require('./data.js');
require('./nav.js');

$(function(){
  //APP.loadData();
  require('./global.js');
  //wsp
  require('./wsp/accueil.js');
  require('./wsp/association.js');
  require('./wsp/gestion.js');
  require('./wsp/lot.js');
  require('./wsp/jackpot.js');
  require('./wsp/groslot.js');
  require('./wsp/petitlot.js');
  require('./wsp/ticket.js');
  require('./wsp/tirage.js');

  require('./template.js');
  require('./event.js');
});
