import React, { useEffect, useState } from 'react';

function DeleteSongModal({ song, deleteSongCallback, hideDeleteSongModalCallback }){
        const [title, setTitle] = useState('');
       useEffect(()=>{
        if(song && song.title)
        {
            setTitle(song.title)
        }
       },[song])

        return (
            <div className="modal" id="remove-song-modal" data-animation="slideInOutLeft">
            <div className="modal-root" id='verify-remove-song-root'>
                <div className="modal-north">
                    Remove song?
                </div>                            
                <div className="modal-center">
                    <div className="modal-center-content">
                        Are you sure you wish to permanently remove <span id="remove-song-span">{title}</span> from the playlist?
                    </div>
                </div>
                <div className="modal-south">
                    <input type="button" id="remove-song-confirm-button" className="modal-button" 
                    value='Confirm' onClick={deleteSongCallback}/>
                    <input type="button" id="remove-song-cancel-button" className="modal-button" 
                    value='Cancel' onClick={hideDeleteSongModalCallback} />
                </div>
            </div>
        </div>
        );
    }
export default DeleteSongModal;