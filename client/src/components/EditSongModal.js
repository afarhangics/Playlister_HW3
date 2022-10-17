import React, { Component } from 'react';

export default class EditSongModal extends Component {
    state = {
        title: "",
        artist: "",
        youTubeId: ""
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.song !== this.props.song) {
            const { song } = this.props;
            if(song){
                const { title, artist, youTubeId } = song;
                this.setState({
                    title, artist, youTubeId
                });
            }
        }
     }
    
    handleConfirm = (event) => {
        event.preventDefault();
        this.props.updateSongCallback(this.state);
    }
    render() {
        const { hideEditSongModalCallback } = this.props;
        const { title, artist, youTubeId } = this.state;
        
        return (
            <div id="edit-song-modal" className="modal" data-animation="slideInOutLeft">
                <div id='edit-song-root' className="modal-root">
                    <div id="edit-song-modal-header" className="modal-north">Edit Song</div>
                    <div id="edit-song-modal-content" className="modal-center">
                        <div id="title-prompt" className="modal-prompt">Title:</div>
                        <input id="edit-song-modal-title-textfield" className='modal-textfield' type="text" 
                        value={title} onChange={(event) => this.setState({title: event.target.value})}/>
                        <div id="artist-prompt" className="modal-prompt">Artist:</div>
                        <input id="edit-song-modal-artist-textfield" className='modal-textfield' type="text"
                         value={artist} onChange={(event) => this.setState({artist: event.target.value})}/>
                        <div id="you-tube-id-prompt" className="modal-prompt">You Tube Id:</div>
                        <input id="edit-song-modal-youTubeId-textfield" className='modal-textfield' 
                        type="text" value={youTubeId} onChange={(event) => this.setState({youTubeId: event.target.value})} />
                    </div>
                    <div className="modal-south">
                        <input type="button" id="edit-song-confirm-button" className="modal-button"
                         value='Confirm' onClick={this.handleConfirm} />
                        <input type="button" id="edit-song-cancel-button" className="modal-button" 
                        value='Cancel' onClick={hideEditSongModalCallback} />
                    </div>
                </div>
            </div>
        );
     }
}