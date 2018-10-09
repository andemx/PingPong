console.log("data.js");

const {shell} = require('electron') // deconstructing assignment
var fs = require('fs'); // Load the File System to execute our common tasks (CRUD)
var app = require('electron').remote;
//var dateFormat = require('dateformat');
var dialog = app.dialog;
//console.log(generateUUID());
//APP.fs =fs;

function getAppPath(){
	var appName = "UD44-souscription";
	var execPath = process.execPath;
	var indexA = execPath.indexOf(appName);
	var substringA = execPath.substring(indexA);
	var indexB = substringA.indexOf("\\");
	var substringB = execPath.substring(indexA,indexA+indexB);
	var appPath = execPath.split(appName)[0]+substringB;
	return appPath;
}

function getActualFile(){
	return dataPath+APP.year+".json";
	//return dataPath+"data.json";

}
//console.log(">>>",app,process.resourcesPath.split("UD44-souscription")[0]+"UD44-souscription\data");

//C:\data\UD44-souscription\node_modules\electron\dist\electron.exe
var appName = "UD44-souscription";
//var appPath = process.execPath.split(appName)[0]+appName;
var appPath = getAppPath();
console.log(">",process.execPath,"\n>",appPath);
//var originData = appPath+"\\data\\origin.json";
var dataPath = appPath+"\\data\\";
//var savePath = dataPath+"save\\";

APP.loadFile = function(){
	var file = getActualFile();
	console.log(">loadFile:",file);
	fs.readFile(file, 'utf-8', function(err, data) {
		if(err){
			console.log("problème de lecture du fichier de donnée:",file);
			alert("Désolé, ce fichier semble incorrecte. Nous allons retourner à l'accueil, merci de choisir un autre fichier");
			$(".breadcrumb button[app-data='accueil']").click();
		}else{
			var output;
			try {
				output = JSON.parse(data);
				APP.data=output;
			} catch(err) {
				console.log("Le fichier de donnée n'est pas valide: ",err); // error in the above string (in this case, yes)!
				alert("Désolé, ce fichier semble incorrecte. Nous allons retourner à l'accueil, merci de choisir un autre fichier");
				$(".breadcrumb button[app-data='accueil']").click();
			}
		}
	});
}

APP.openFolder = function(){
	shell.openItem(dataPath);
}

APP.loadFolder = function(){
	console.log(">loadFolder");
	//var file = getActualFile();
	/*if (!fs.existsSync(dataPath)){ // si le dossier n existe pas je le créer
	fs.mkdirSync(dataPath);
}else{*/
var files = fs.readdir(dataPath, (err,data) => {
	if (err){
		console.log("readdir fail!",err,data);
	}else{
		console.log("readdir WORK!",data);
		APP.wsp.accueil.clean();
		data.reverse();
		for(var i in data) {
			console.log("folder?:",dataPath+data[i]);
			var isFile = data[i].search(".json");
			//if(!fs.lstatSync(dataPath+data[i]).isDirectory()){
			if(isFile>=0){
				var fileName = data[i].slice(0,4);
				APP.wsp.accueil.ajoutAnnee(fileName);
			}
			//}else{
			//console.log("yes");
			//}
		}
	}
}); // je recuoere la liste des fichier et je les affiche
/*if(files && files.length){
APP.wsp.accueil.clean();
files.reverse();
for(var i in files) {
console.log("folder?:",dataPath+files[i]);
if(!fs.lstatSync(dataPath+files[i]).isDirectory()){
var fileName = files[i].slice(0,4);
APP.wsp.accueil.ajoutAnnee(fileName);
}else{
console.log("yes");
}
}
}else{
console.log("but no file");
}*/
//}
}


APP.saveData = function(){
	var file = getActualFile();
	console.log(">saveData:",file);
	//APP.quickSave();	//console.log(JSON.stringify(APP.data));
	//debugger;
	fs.writeFile(file, JSON.stringify(APP.data), function(err) {
		//console.log(">ISOQUAI");
		//debugger;
		if(err) {
			//console.log(">KO");
			console.log('/!\\ERROR ON SAVE /!\\',err);
			//debugger;
			//return alert(err);
		}else{
			console.log('success!');

		}
		//console.log(" --- save OCCURED --- ");
	});
}

APP.quickSave = function(){
	console.log(">quicksave");
	/*var saveFile = dateFormat(new Date(),"yyyy-mm-dd_hh-mm-ss")+"-year.json";
	fs.writeFile(savePath+saveFile, JSON.stringify(APP.data), function(err) {
	if(err) {
	//return alert(err);
}

//console.log("The file was saved!");
});*/
}

APP.createData = function(année){
	var basicData = '{"tirage":{"state":0},"lot":{"jackpot":{},"groslot":{},"petitlot":{}},"association":[],"ticket":[],"trash":[]}'
	var fileUrl = dataPath+année+".json"
	console.log("createData:",fileUrl);
	var fileExist = fs.existsSync(fileUrl);
	//check if file existe
	//check if creation succeed
	if(fileExist){
		alert("Le fichier existe déjà, merci de choisir une autre année");
	}else{
		fs.writeFile(fileUrl, basicData,(err)=>{
			if(err){
				alert("erreur lors de la créatioin du nouveau fichier:",err);
			}else{
				$(".accueil-card input").blur();
				$(".accueil-card").removeClass('active');
				$(".wsp-accueil+.wsp-action .create").addClass('raised');
				APP.loadFolder();
			}
		});
	}
}
/*APP.loadData = function(){
fs.readFile(actualData, 'utf-8', function(err, data) {
if(err){
//if no actual data
fs.readFile(originData, 'utf-8', function(err, data){
if(err){
//if no origin data
//console.log("pas de sauvegarde principale trouvé.\nMerci de selectionner la sauvegarde la plus récente.\nDans le dossier ~\\UD44-souscription\\data\\save\\xx-xx-xxxx.json ");
dialog.showOpenDialog(function(fileNames){
// fileNames is an array that contains all the selected
if(fileNames === undefined){
//console.log("No file selected");
return;
}
var filePath = fileNames[0];
fs.readFile(filePath, 'utf-8', function(err, data){
if(err){
alert("An error ocurred reading the file :" + err.message);
return;
}
var output = JSON.parse(data);
//console.log(output);
APP.data=output;
// Change how to handle the file content
//console.log("The file content is : ", output);
});
});
return;
}else{
var output = JSON.parse(data);
APP.data=output;
}
});
/*
console.log("pas de sauvegarde principale trouvé.\nMerci de selectionner la sauvegarde la plus récente.\nDans le dossier ~\\UD44-souscription\\data\\save\\xx-xx-xxxx.json ");
dialog.showOpenDialog(function(fileNames) {
// fileNames is an array that contains all the selected
if(fileNames === undefined){
//console.log("No file selected");
return;
}
var filePath = fileNames[0];
//console.log("OOO",filePath);

fs.readFile(filePath, 'utf-8', function(err, data) {
if(err){
alert("An error ocurred reading the file :" + err.message);
return;
}
var output = JSON.parse(data);
//console.log(output);
APP.data=output;
// Change how to handle the file content
console.log("The file content is : ", output);
});
});
return;
}else{
var output = JSON.parse(data);
APP.data=output;
// Change how to handle the file content
//console.log("The file content is : ", output);
}
});

}*/


/*
--- DATA MODEL ---
data.tirage.state: 0/1/2 (not started/started/ended)
data.tirage.jackpot: [{id:0,numero:[0]}]
data.tirage.groslot: [{id:0,numero:[0]},...]
data.tirage.petitlot: [{id:0,numero:[0]},...]
*/
/*
APP={};
APP.wsp={};
APP.data= {
tirage:{
state: 0,
jackpot:null,
groslot:null,
petitlot:null
},
lot:[{
type:"jackpot",
titre:"Voyage de 1000€",
numero:"0228001191"
}],
association:[{
nom:"nom de l association",
contact:"prenom NOM",
tel:"0228001191",
email:""
}],
ticket:[]
};*/

if(!fs.existsSync(dataPath)){
	fs.mkdir(dataPath, (error) => {
		if(error){
			console.log("can't create the data folder:",error)
		}
	});
}

//synch folder data
var chokidar = require('chokidar');
console.log('chokidar:',chokidar,':',dataPath);
chokidar.watch('data', {ignored: /(^|[\/\\])\../}).on('add', (event, path) => {
	APP.loadFolder();
}).on('unlink', (event, path) => {
	APP.loadFolder();
});
