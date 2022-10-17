import React, { useEffect, useState } from 'react';

function EditSongModal(props){

    const [title, setTitle] = useState("");
    const [artist, setArtist] = useState("")
    const [ youTubeId, setYouTubeId] = useState("")

    const { hideEditSongModalCallback, song } = props;
    
    useEffect(() => {
            const { song } = props;
            if(song){
                const { title, artist, youTubeId } = song;
                setTitle(title)
                setArtist(artist)
                setYouTubeId(youTubeId)
                
            }
    }, [song])  
    
    const handleConfirm = (event) => {
        event.preventDefault();
        props.updateSongCallback({
            title, artist, youTubeId
        });
        hideEditSongModalCallback();
    }

        return (
            <div id="edit-song-modal" className="modal" data-animation="slideInOutLeft">
                <div id='edit-song-root' className="modal-root">
                    <div id="edit-song-modal-header" className="modal-north">Edit Song</div>
                    <div id="edit-song-modal-content" className="modal-center">
                        <div id="title-prompt" className="modal-prompt">Title:</div>
                        <input id="edit-song-modal-title-textfield" className='modal-textfield' type="text" 
                        value={title} onChange={(event) => setTitle(event.target.value)}/>
                        <div id="artist-prompt" className="modal-prompt">Artist:</div>
                        <input id="edit-song-modal-artist-textfield" className='modal-textfield' type="text"
                         value={artist} onChange={(event) => setArtist(event.target.value)}/>
                        <div id="you-tube-id-prompt" className="modal-prompt">You Tube Id:</div>
                        <input id="edit-song-modal-youTubeId-textfield" className='modal-textfield' 
                        type="text" value={youTubeId} onChange={(event) => setYouTubeId(event.target.value)} />
                    </div>
                    <div className="modal-south">
                        <input type="button" id="edit-song-confirm-button" className="modal-button"
                         value='Confirm' onClick={handleConfirm} />
                        <input type="button" id="edit-song-cancel-button" className="modal-button" 
                        value='Cancel' onClick={hideEditSongModalCallback} />
                    </div>
                </div>
            </div>
        );
    
}
export default EditSongModal;