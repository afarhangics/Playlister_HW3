import React, { useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import ListCard from './ListCard.js'
import { GlobalStoreContext } from '../store'
import DeleteListModal from './DeleteListModal.js'
/*
    This React component lists all the playlists in the UI.
    
    @author McKilla Gorilla
*/
const ListSelector = () => {
    const { store } = useContext(GlobalStoreContext);
    store.history = useHistory();

    useEffect(() => {
        store.loadIdNamePairs();
    }, []);

    function handleCreateNewList() {
        store.createNewList();
    }

    // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
    // TO SEE IF THEY REALLY WANT TO DELETE THE LIST
    const showDeleteListModal = () => {
        let modal = document.getElementById("delete-list-modal");
        modal.classList.add("is-visible");
    }
    // THIS FUNCTION IS FOR HIDING THE MODAL
    const hideDeleteListModal = () => {
        let modal = document.getElementById("delete-list-modal");
        modal.classList.remove("is-visible");
    }

    const deleteList = () => {
        if(store && store.markDeleteList)
        {
            store.deleteList(store.markDeleteList._id);
        }
        hideDeleteListModal();
    }

    let listCard = "";

    if (store) {
        listCard = store.idNamePairs.map((pair) => (
            <ListCard
                key={pair._id}
                idNamePair={pair}
                selected={store.edittingListId === pair._id}
                edittingListId={store.edittingListId}
                showDeleteListModal={showDeleteListModal}
                markListForDeletion={(list) => store.markListForDeletion(list)}
            />
        ))
    }

    return (
        <div className="root" id="playlist-selector">
            <div id="playlist-selector-heading">
                    <input
                        type="button"
                        id="add-list-button"
                        onClick={handleCreateNewList}
                        className="playlister-button"
                        value="+" />
                    Your Lists
            </div>
            <div id="list-selector-list">
                {listCard}
            </div>
            <DeleteListModal
                    listKeyPair={store.markDeleteList}
                    hideDeleteListModalCallback={hideDeleteListModal}
                    deleteListCallback={deleteList}
                />
        </div>)
}

export default ListSelector;