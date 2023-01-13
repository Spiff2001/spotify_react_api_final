
import "./App.css";
import react, { useEffect, useState } from "react";
import axios from "axios";


const Home = () => {

  //variable declarations
  const client_ID = "16753e89202c44ea89597bbde1085955";
  const redirect_url = "http://localhost:3000";
  const auth_endpoint = "https://accounts.spotify.com/authorize";
  const response_type = "token";
  const [token, setToken] = useState("");
  const [user_ID, set_user_ID] = useState("");
  const [followers, set_followers] = useState("");
  const [playlist_json, set_playlist_json] = useState([]);
  const [button_json,set_button_json] = useState([])
  const [selected_playlist, set_selected_playlist] = useState("");
  let playlist_names_array = [];
  let playlists_json = [];
  let redirect_button_clicked;

  

  //useEffect function to call other functions
  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    // getToken
    if (!token && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];

      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }

    setToken(token);
    getID(token);
    getPlaylists(token);
    
    window.onbeforeunload = function() {
      if(!redirect_button_clicked){
        localStorage.clear();
      }
      else{
        redirect_button_clicked=false;
      }
   }
  }, []);
  
  //gets a user's playlist data
  const getPlaylists = async (token) => {
    const { data } = await axios.get(
      "https://api.spotify.com/v1/me/playlists",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    playlists_json = data.items;
    localStorage.setItem('playlist_json', JSON.stringify(data.items))

    if (playlist_names_array.length == 0) {
      playlists_json.forEach((playlist) => {
        playlist_names_array.push(playlist.name);
      });
      console.log(playlist_names_array)
      const playlist_buttons = playlist_names_array.map(name => (
        <button class = "button2" key = {name} onClick={e=>{
          console.log(selected_playlist)
          localStorage.setItem('selected_playlist', name);
          redirect_button_clicked = true;
          window.location.replace("http://localhost:3000/PlaylistPage")
        }}> 
          {name}
        </button>
        ));
      set_button_json(playlist_buttons)
    }
  };

  


  //gets a user's ID so that personal info on playlists can be retrieved.
  const getID = async (token) => {
    const { data } = await axios.get("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    set_followers(data.followers.total)
    set_user_ID(data.display_name);
    console.log(data)
  };

  



  // const getRecentlyPlayed = async (token) => {
  //   const { data } = await axios.get("https://api.spotify.com/v1/me/player/recently-played", { 
  //   headers: {
  //       Authorization: `Bearer ${token}`
  //     },
  //   params:{
  //     limit: "2"
  //   }
  //   });
    
  // };

  

  

  //logs a user out an wipes the sensitive data variables
  const logout = () => {
    console.log("logged out")
    setToken("");
    window.localStorage.removeItem("token");
    window.localStorage.clear();
    playlists_json = [];
    playlist_names_array = [];

  };



  
  return (
    <div className="Home">
      <div id="grad1">
        <h1>Will's Nifty Tunes Finder</h1>
        <br></br>
        <br></br>
        <br></br>

        {token ? (
          <h2>
            
            welcome, {user_ID}!

            <p>you have {button_json.length} playlists and {followers} followers!</p>
            {/* here, add data you can obtain from their general profile and account */}
            <p>click on one of your playlists to find out more about your musical taste!</p>
            <br></br>
            <br></br>
            
            <div>{button_json}</div>
            

          </h2>
        ) : (
          <h2>Please Login </h2>
          
        )}

        {!token ? (
          <a
            href={`${auth_endpoint}?client_id=${client_ID}&redirect_uri=${redirect_url}&response_type=${response_type}`}
            class="button2"
          >
            show me your nifty tunes!
          </a>
        ) : (
          <button class="button2" onClick={logout}>
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Home;
