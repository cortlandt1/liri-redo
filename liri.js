require("dotenv").config();
var fs = require("fs");
var request = require("request")
var keys = require("./keys.js")
var Spotify = require('node-spotify-api');
var moment = require('moment');
var spotify = new Spotify(keys.spotify);
var what = process.argv[2];
var query = process.argv.slice(3).join(" ");



switch (what) {
  case "movie":
    movie(query);
    break;
  case "spotify":
    spots(query);
    break;
  case "concert":
    bands(query);
    break;
  case "dowhatnow":
    doWhatISayCauseISaidIt(query);
    break;
}



function runQuery(query){
  console.log(query)
}

function movie(query) {
  if (query === ""){
    query = "Mr. Nobody"; 
  }

  request(`http://www.omdbapi.com/?t=${query}&y=&plot=short&apikey=e04193ea`, function (error, response, body) {

    if (!error && response.statusCode === 200) {
        var jsonData = JSON.parse(body);

        console.log(query)
        console.log("Title: " + jsonData.Title);
        console.log("Year: " + jsonData.Year);
        console.log("Country: " + jsonData.Country);
        console.log("Plot: " + jsonData.Plot);
        console.log("Actors: " + jsonData.Actors);
        // console.log("Rotten Tomatoes Score: " + jsonData.Ratings[1].Value);
        console.log("IMDB Rating: " + jsonData.imdbRating);
    }
});

}

function spots(query) {
  if (query === "") {
    query = "The Sign";
  }

  spotify.search({ type: 'track', query: query }, function (err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
      
    }
  
    console.log("Song: " + data.tracks.items[0].name);
    console.log("Artist: " + data.tracks.items[0].artists[0].name);
    console.log("Album: " + data.tracks.items[0].album.name);
    console.log("Link: " + data.tracks.items[0].album.external_urls.spotify);
  });
}

function bands(query) {
  if (query === "") {
    query = "Behemoth";
  }

  request(`https://rest.bandsintown.com/artists/${query}/events?app_id=codingbootcamp`, function (error, response, body) {

    if (!error && response.statusCode === 200) {
      var jsonData = JSON.parse(body);

      console.log("Venue: " + jsonData[0].venue.name);
      console.log("Location: " + jsonData[0].venue.city + ", " + jsonData[0].venue.country);
      console.log("Date: " + moment(jsonData[0].datetime.split("T", 1), "YYYY-MM-DD").format("MM-DD-YYYY"));
    }
  });

}

function doWhatISayCauseISaidIt() {
fs.readFile("random.txt", "utf8", function (err, data) {
  if (err) {
    console.log(err)
  }

  var whats = data.split(",", 1).join()
  var thingy = data.split('"', 2)
  

  switch (whats) {
    case "movie":
      movie(thingy[1]);
      break;
    case "spotify":
      spots(thingy[1]);
      break;
    case "concert":
      bands(thingy[1]);
      break;
  }


} )
}