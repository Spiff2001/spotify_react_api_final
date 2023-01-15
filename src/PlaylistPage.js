
import "./App.css";
import react, { useEffect, useState } from "react";
import axios from "axios";
import screenGif from "./spiral.gif"



  
const PlaylistPage = () => {

 

  const [selected_playlist, set_selected_playlist] = useState("");
  const [playlist_json, set_playlist_json] = useState([]);
  const [selected_playlist_json, set_selected_playlist_json] = useState([]);
  const [num_tracks, set_num_tracks] = useState();
  const [show_up, set_show_up] = useState();
  const [cover_image, set_cover_image] = useState();
  
  let popularity = 0;
  let playlist_url;
  let playlist_id;

  useEffect(() => {
    const selected_playlist = localStorage.getItem('selected_playlist');
    const playlist_json = JSON.parse(localStorage.getItem('playlist_json'))
    
    
    let token = localStorage.getItem('token')
    
    if(selected_playlist){
      set_selected_playlist(selected_playlist);
    }
    if(playlist_json){
      set_playlist_json(playlist_json)
    }
    

    playlist_json.forEach((playlist)=>{
      if(playlist.name===selected_playlist){
        const selected_playlist_json = localStorage.setItem('selected_playlist_json', JSON.stringify(playlist))
        if(selected_playlist_json){
          set_selected_playlist_json(playlist)
      }
      const num_tracks = localStorage.setItem("num_tracks",JSON.parse(localStorage.getItem('selected_playlist_json')).tracks.total)
      set_num_tracks(JSON.parse(localStorage.getItem('selected_playlist_json')).tracks.total)
      playlist_url=playlist.href
      playlist_id = playlist.id
      console.log(playlist_url)
    }
    })

    //method for getting information about particular playlist
    getPlaylistData(token)
    getPlaylistCoverImage(token,playlist_id)
    //get playlist cover image
    // getPlaylistImage(token)
    // this function has been disused due to issues with the request.
    
  }, []);

  
  const getPlaylistData = async(token) => {
    const { data } = await axios.get(
      playlist_url,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
      }
    );
  console.log("data: ",data)

  data.tracks.items.forEach((track) => {
      popularity=popularity+track.track.popularity
  })
  popularity = Math.ceil(popularity/data.tracks.items.length)
  const show_up = localStorage.setItem("show_up",popularity)
    set_show_up(popularity)
  if(popularity==56){
    console.log("I'm sorry to say, but this playlist is basic as hell, and I shall do what must be done.")
    codeSwift(token,playlist_id)
  }
  }

  const getPlaylistCoverImage = async (token,playlist_id) =>{
    const {data} = await axios.get(`https://api.spotify.com/v1/playlists/${playlist_id}/images`, {
    headers: {
      Authorization : `Bearer ${token}`
    }
    })
    
    const cover_image = localStorage.setItem('cover_image',data[0].url);
    set_cover_image(data[0].url)
  }
  
  const codeSwift = async(token,playlist_id) => {
    const {data} = await axios.put(`https://api.spotify.com/v1/playlists/${playlist_id}`, {
    data : {
      "description": "a very basic playlist",
    } , 
    headers : {
        Authorization : `Bearer ${token}`

      }
    })
    console.log(data)
  }
  
  return (
    <div className='PlaylistPage'>
      <div id="grad2">
        {/* image citation: https://www.pinterest.com/pin/210684088793815659/ */}
        <img style={{ width: 400, height: 768 }} align = "right" src={screenGif} alt="a fun gif!"></img>
      <h1>{selected_playlist}:</h1>
      <br></br>
      <br></br>
       <img src = {cover_image} style={{width: 400, height: 400}}></img> 
      <br></br>
      
        {(num_tracks)>150 ? ( <h1> wow, there are an awful lot of songs on this playlist. To be precise, {num_tracks} songs</h1>) 
        
        
        : ( <h1>
            This playlist has {num_tracks} songs in total
           </h1>)}

        <h1> on a scale of 0 to 100, the average song on this playlist has a popularity of {show_up} </h1>

          <button class="button3" onClick={ () => window.location.replace("http://localhost:3000")}>back to home page</button>
      
      </div>
    </div>
      
  );
};
  
export default PlaylistPage;