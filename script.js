const express = require('express');
const request = require('request');
const openurl = require("openurl");
const cheerio = require('cheerio');
const bodyParser = require("body-parser");
const https=require("https");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res){
    app.use(express.static("all"));
    res.sendFile(__dirname+"/index.html");
})
app.post("/",function(req,res){

    const song=req.body.songname;
    const artist=req.body.artist;
    const options = {
        method: 'GET',
        url: 'https://genius-song-lyrics1.p.rapidapi.com/search/',
        qs: {
            q: song+' '+artist,
            per_page: '10',
            page: '1'
        },
        headers: {
        'X-RapidAPI-Key': '705f5165e0msh5556e8f0470e3cdp165892jsna699bd4288e1',
        'X-RapidAPI-Host': 'genius-song-lyrics1.p.rapidapi.com'
        }
    };

    request(options, function (error, response, body) {
        console.log("your status code: ",response.statusCode);
        if (error) {
            console.log("oh i got this error: ",error);
        }

        else if (response.statusCode !== 200) {
            console.error('API request failed with status code:', response.statusCode);
            res.status(response.statusCode).send('API Error');
        }

        else{
            const data = JSON.parse(body);
            var link = data.hits[0];
            if(link=== undefined){
                res.sendFile(__dirname+"/failure.html");
            }else{
                link=link.result.url;
                openurl.open(link);
                res.redirect("/");
                  
            }
        }
        
    });
    
    
});

app.post("/failure",function(req,res){
    res.redirect("/")
})

app.listen(port, () => {
  console.log("Server is running on port "+port);
});