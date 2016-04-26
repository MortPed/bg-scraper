#!/usr/bin/env node

var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var http = require('http');

var images = [];
var sources = [
  "https://www.reddit.com/r/earthporn",
  "https://www.reddit.com/r/mapporn",
  "https://www.reddit.com/r/HybridAnimals"
]
var subreddit = sources[Math.floor(Math.random()*sources.length)];
console.log(subreddit);

request(subreddit, function(error, response, body) {
  if(error) {
    console.log("Error: " + error);
  }
  console.log("Status code: " + response.statusCode);

  var $ = cheerio.load(body);

  $('a.thumbnail').each(function( index ) {
    var link = $(this)[0].attribs.href;

    if(link.search('imgur') > 0){

      if(link.search('.jpg') > 0) {
        images.push(link);
      }else{
        var id = link.substring(link.lastIndexOf('/') + 1);
        var cLink = 'http://i.imgur.com/' + id + '.jpg';
        images.push(cLink);
      }
    }
  });


console.log(images);

var fetchImage = http.get(images[Math.floor(Math.random()*images.length)], function(res){
     var imagedata = ''
     res.setEncoding('binary')

     res.on('data', function(chunk){
         imagedata += chunk
     });

     res.on('end', function(){

         fs.writeFile('/home/mop/Pictures/background/background.jpg', imagedata, 'binary', function(err){
             if (err) throw err
             console.log('File saved.')
         });
     });

 });
});
