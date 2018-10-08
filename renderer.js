// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const {shell} = require('electron')

function navigateLink(event){
  //debugger;
  event.preventDefault();
  var $target = $(event.currentTarget);
  var url = $target.attr('href');
  if(url){
    shell.openExternal(url);
  }
}

$(function(){
  $('a').on('click',navigateLink);
});
