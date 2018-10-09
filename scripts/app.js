//console.log("app.js")
/*
APP={};
APP.wsp={};
APP.data={};

require('./tools.js');
require('./data.js');
require('./nav.js');*/



//---tracert---
/*
var traceroute = require('traceroute');
console.log(">>>",traceroute);

traceroute.trace('127.0.0.1', function (err,hops) {
if (!err) console.log(hops);
});
*/

$(function(){

	//---ping---
/*	console.log("---tcp-ping--------------------------------------------------------");
	var tcpp = require('tcp-ping');
	tcpp.ping({ address: '192.168.1.1' }, function(err, data) {
		console.log(data);
	});*/


	var Ping = require('ping-wrapper');

	// load configuration from file 'config-default-' + process.platform
	// Only linux is supported at the moment
	Ping.configure();

	var ping = new Ping('127.0.0.1');
	//console.log(ping)
	debugger;
	ping.on('ping', function(data){
	    console.log('Ping %s: time: %d ms', data.host, data.time);
	});

	ping.on('fail', function(data){
	    console.log('Fail', data);
	});

	ping.stop();


	/*
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
	require('./event.js');*/



});
