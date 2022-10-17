import { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import SongCard from './SongCard.js'
import { GlobalStoreContext } from '../store'
import EditSongModal from './EditSongModal'
/*
    This React component lets us edit a loaded list, which only
    happens when we are on the proper route.
    
    @author McKilla Gorilla
*/
function PlaylistCards() {
    const { store } = useContext(GlobalStoreContext);
    store.history = useHistory();

    function moveSong(sourceId, targetId){
        if(store)
        {
            store.moveSong(sourceId, targetId);
        }
    }

    function editCurrentSong(index){
        if(store){
            store.loadCurrentSong(index);
        }
        showEditSongModal();
    }

    // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
    // TO SEE IF THEY REALLY WANT TO EDIT A SONG
    function showEditSongModal() {
        let modal = document.getElementById("edit-song-modal");
        modal.classList.add("is-visible");
    }
    // THIS FUNCTION IS FOR HIDING THE MODAL
    function hideEditSongModal() {
        let modal = document.getElementById("edit-song-modal");
        modal.classList.remove("is-visible");
    }

    return (
        <div className="root" id="playlist-cards">
        {
            store.currentList.songs.map((song, index) => (
                <SongCard
                    id={'playlist-song-' + index}
                    key={'playlist-song-' + index}
                    index={index}
                    song={song}
                    moveCallback={moveSong}
                    editCurrentSongCallback={editCurrentSong}
                />
            ))
        }
        <EditSongModal
            hideEditSongModalCallback={hideEditSongModal}
            song={store.currentSong}
            updateSongCallback={(sondData) => store.editSong(sondData)}
        />
        </div>
    )
}

export default PlaylistCards;