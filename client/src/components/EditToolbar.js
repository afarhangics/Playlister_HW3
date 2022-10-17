import { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import { useHistory } from 'react-router-dom'
/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar() {
    const { store } = useContext(GlobalStoreContext);
    const { canUndo, canRedo, canAddSong, canClose } = store;
    const history = useHistory();

    const keydownHandler = (e) => {
        if(e.key==='y' && e.ctrlKey && canRedo) handleRedo();
        if(e.key==='z' && e.ctrlKey && canUndo) handleUndo();
    };

    // USE THIS USE EFFECT BOTH AS COMPONENTDIDMOUNT AND COMPONENTWILLUNMOUNT
    useEffect(() => {
        document.addEventListener('keydown', keydownHandler);
        return () => {
            document.removeEventListener('keydown', keydownHandler);
          };
    }, []);

    function handleUndo() {
        store.undo();
    }
    function handleRedo() {
        store.redo();
    }
    function handleClose() {
        store.closeCurrentList();
        history.push("/");
    }
    function handleAddSong(){
        store.addAddSongTransaction();
    }
    let editStatus = false;
    if (store.isListNameEditActive) {
        editStatus = true;
    }

    let addSongClass = "playlister-button";
    let undoClass = "playlister-button";
    let redoClass = "playlister-button";
    let closeClass = "playlister-button";

    if (!canAddSong()) addSongClass += " disabled";
    if (!canUndo()) undoClass += " disabled";
    if (!canRedo()) redoClass += " disabled";
    if (!canClose()) closeClass += " disabled";

    return (
        <span id="edit-toolbar">
            <input
                type="button"
                id='add-song-button'
                disabled={!canAddSong()}
                value="+"
                className={addSongClass}
                onClick={handleAddSong}
            />
            <input
                type="button"
                id='undo-button'
                disabled={!canUndo()}
                value="⟲"
                className={undoClass}
                onClick={handleUndo}
            />
            <input
                type="button"
                id='redo-button'
                disabled={!canRedo()}
                value="⟳"
                className={redoClass}
                onClick={handleRedo}
            />
            <input
                type="button"
                id='close-button'
                disabled={!canClose()}
                value="&#x2715;"
                className={closeClass}
                onClick={handleClose}
            />
        </span>);
}

export default EditToolbar;