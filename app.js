require("dotenv").config();

const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/artist-search", (req, res) => {
  const artist = req.query.artist;

  spotifyApi
    .searchArtists(artist)
    .then((artistFromApi) => {
      //console.log("The received data from the API: ", artistFromApi.body.artists.items);
      res.render("artist-search-results", {
        artist: artistFromApi.body.artists.items,
      });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:id", (req, res) => {
  const id = req.params.id;

  spotifyApi
    .getArtistAlbums(id)
    .then((albumFromId) => {
      console.log("The received data: ", albumFromId.body.items);
      res.render("albums", { album: albumFromId.body.items });
    })
    .catch((err) => {
      console.log("The error while searching albums ocurred: ", err);
    });
});

app.get("/tracks/:id", (req, res) => {
  const idTrack = req.params.id;

  spotifyApi
    .getAlbumTracks(idTrack)
    .then((trackFromApi) => {
      //console.log(trackFromApi.body.items);
      res.render("tracks", {track: trackFromApi.body.items})
    })
    .catch((err) => {
      console.log("Something went wrong!", err);
    });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
