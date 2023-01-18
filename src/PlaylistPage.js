import "./App.css";
import react, { useEffect, useState } from "react";
import axios from "axios";
import screenGif from "./spiral.gif";

const PlaylistPage = () => {
  const [selected_playlist, set_selected_playlist] = useState("");
  const [playlist_json, set_playlist_json] = useState([]);
  const [selected_playlist_json, set_selected_playlist_json] = useState([]);
  const [num_tracks, set_num_tracks] = useState();
  const [show_up, set_show_up] = useState();
  const [cover_image, set_cover_image] = useState();
  const [most_popular_array, set_most_popular_array] = useState([]);
  const [playlist_valence, set_playlist_valence] = useState();

  let popularity = 0;
  let playlist_url;
  let playlist_id;
  let most_popular = 0;
  let most_popular_track;
  let most_popular_track_id;
  let playlist_ids_array = [];

  useEffect(() => {
    const selected_playlist = localStorage.getItem("selected_playlist");
    const playlist_json = JSON.parse(localStorage.getItem("playlist_json"));

    let token = localStorage.getItem("token");

    if (selected_playlist) {
      set_selected_playlist(selected_playlist);
    }
    if (playlist_json) {
      set_playlist_json(playlist_json);
    }

    playlist_json.forEach((playlist) => {
      if (playlist.name === selected_playlist) {
        const selected_playlist_json = localStorage.setItem(
          "selected_playlist_json",
          JSON.stringify(playlist)
        );
        if (selected_playlist_json) {
          set_selected_playlist_json(playlist);
        }
        const num_tracks = localStorage.setItem(
          "num_tracks",
          JSON.parse(localStorage.getItem("selected_playlist_json")).tracks
            .total
        );
        set_num_tracks(
          JSON.parse(localStorage.getItem("selected_playlist_json")).tracks
            .total
        );
        playlist_url = playlist.href;
        playlist_id = playlist.id;
        console.log(playlist_url);
      }
    });

    //method for getting information about particular playlist
    getPlaylistData(token);
    //method for getting cover photo of playlist
    getPlaylistCoverImage(token, playlist_id);
    //method for getting audio info about specific songs
  }, []);

  const getPlaylistData = async (token) => {
    const { data } = await axios.get(playlist_url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("data: ", data);

    data.tracks.items.forEach((track) => {
      popularity = popularity + track.track.popularity;
      playlist_ids_array.push(track.track.id)
      if (track.track.popularity > most_popular) {
        most_popular_track = track.track.name;
        most_popular = track.track.popularity;
        most_popular_track_id = track.track.id;
      }
    });
    
    popularity = Math.ceil(popularity / data.tracks.items.length);
    const show_up = localStorage.setItem("show_up", popularity);
    set_show_up(popularity);
    getAudioAnalysis(
      token,
      most_popular_track_id,
      most_popular,
      most_popular_track
    );
    if(data.tracks.items.length<100){
      get_playlist_vibes(token,playlist_ids_array)
    }
  };

  const getPlaylistCoverImage = async (token, playlist_id) => {
    const { data } = await axios.get(
      `https://api.spotify.com/v1/playlists/${playlist_id}/images`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const cover_image = localStorage.setItem("cover_image", data[0].url);
    set_cover_image(data[0].url);
  };

  const getAudioAnalysis = async (
    token,
    most_popular_track_id,
    most_popular,
    most_popular_track
  ) => {
    const { data } = await axios.get(
      `https://api.spotify.com/v1/audio-analysis/${most_popular_track_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(data);
    console.log(data.track.key);
    console.log(data.track.key_confidence);
    let key = data.track.key;
    let keyValue;
    if (key == -1) {
      keyValue = "nothing, apparently";
    } else if (key == 0) {
      keyValue = "C";
    } else if (key == 1) {
      keyValue = "C#/Db";
    } else if (key == 2) {
      keyValue = "D";
    } else if (key == 3) {
      keyValue = "D#/Eb";
    } else if (key == 4) {
      keyValue = "E";
    } else if (key == 5) {
      keyValue = "F";
    } else if (key == 6) {
      keyValue = "F#/Gb";
    } else if (key == 7) {
      keyValue = "G";
    } else if (key == 8) {
      keyValue = "G#/Ab";
    } else if (key == 9) {
      keyValue = "A";
    } else if (key == 10) {
      keyValue = "A#/Bb";
    } else {
      keyValue = "B";
    }
    const most_popular_array = localStorage.setItem("most_popular_array", [
      most_popular_track,
      most_popular,
      keyValue,
      data.track.key_confidence,
    ]);
    set_most_popular_array([
      most_popular_track,
      most_popular,
      keyValue,
      data.track.key_confidence,
    ]);
  };

const get_playlist_vibes = async(token,playlist_ids_array)=>{
  let valence = 0;
  let playlist_ids_string = playlist_ids_array.join(',');
  console.log(playlist_ids_string)
  const { data } = await axios.get(
    "https://api.spotify.com/v1/audio-features",
    {
      headers: {
        Authorization: `Bearer ${token}` ,
      },
      params: {
        ids: playlist_ids_string
      }
    }
  );
  console.log("data," , data)
  data.audio_features.forEach((track)=>{
    valence= valence+track.valence;
  })
  valence=valence/data.audio_features.length
  console.log("valence: ",valence)
  const playlist_valence = localStorage.setItem("playlist_valence", valence);
  set_playlist_valence(valence);
}

  return (
    <div className="PlaylistPage">
      <div id="grad2">
        {/* image citation: https://www.pinterest.com/pin/210684088793815659/ */}
        <img
          style={{ width: 400, height: 768 }}
          align="right"
          src={screenGif}
          alt="a fun gif!"
        ></img>
        <h1>{selected_playlist}:</h1>
        <br></br>
        <br></br>
        <img src={cover_image} style={{ width: 200, height: 200 }}></img>
        <br></br>

        {num_tracks > 150 ? (
          <h1>
            
            Wow, there are an awful lot of songs on this playlist. {num_tracks},
            to be precise, and on a scale of 0 to 100, the average song on this playlist has a
          popularity of {show_up}.
          </h1>
        ) : (
          <h1>This playlist has {num_tracks} songs in total, and on a scale of 0 to 100, the average song on this playlist has a
          popularity of {show_up}.</h1>
        )}
        {most_popular_array[3] > 0.5 ? (
          <h1> The most popular song on this playlist, {most_popular_array[0]} with a
          popularity of {most_popular_array[1]}, is likely in the key of {most_popular_array[2]}.</h1>
        ) : (
          <h1>
            The most popular song on this playlist, {most_popular_array[0]} with a
          popularity of {most_popular_array[1]}, may be in the key of {most_popular_array[2]}, but we're not quite
            sure.
          </h1>
        )}
        {(playlist_valence>.8) ? (<h1>this playlist is exceptionally peppy.</h1>) : (<h1></h1>)}
        {(playlist_valence<.2) ? (<h1>this playlist is kind of sad and angry... you ok?</h1>) : (<h1></h1>)}
        
        <button
          class="button3"
          onClick={() => window.location.replace("http://localhost:3000")}
        >
          back to home page
        </button>
      </div>
    </div>
  );
};

export default PlaylistPage;
