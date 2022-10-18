import { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import SongCard from './SongCard.js'
import { GlobalStoreContext } from '../store'
import EditSongModal from './EditSongModal'
import DeleteSongModal from './DeleteSongModal.js'
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
            store.addMoveSongTransaction(sourceId, targetId);
        }
    }

    function editCurrentSong(index){
        if(store){
            store.loadCurrentSong(index);
        }
        showEditSongModal();
    }

    function removeCurrentSong(index){
        if(store){
            store.loadCurrentSong(index);
        }
        showDeleteSongModal();
    }

    function addRemoveSong(){
        if(store){
            store.addRemoveSongTransaction();
        }
        hideDeleteSongModal();
    }

    function showDeleteSongModal() {
        let modal = document.getElementById("remove-song-modal");
        modal.classList.add("is-visible");
    }
   
    function hideDeleteSongModal() {
        let modal = document.getElementById("remove-song-modal");
        modal.classList.remove("is-visible");
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
                store.currentList && store.currentList.songs.map((song, index) => (
                    <SongCard
                        id={'playlist-song-' + index}
                        key={'playlist-song-' + index}
                        index={index}
                        song={song}
                        moveCallback={moveSong}
                        editCurrentSongCallback={editCurrentSong}
                        removeCurrentSongCallback={removeCurrentSong}
                    />
                ))
            }
            <EditSongModal
                hideEditSongModalCallback={hideEditSongModal}
                song={store.currentSong}
                updateSongCallback={(sondData) => store.addEditSongTransaction(sondData)}
            />
            <DeleteSongModal
                song={store.currentSong}
                deleteSongCallback={addRemoveSong}
                hideDeleteSongModalCallback={hideDeleteSongModal}
            />
        </div>
    )
}

export default PlaylistCards;