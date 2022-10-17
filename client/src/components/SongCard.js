import React, { useContext, useState, useEffect } from 'react'
import { GlobalStoreContext } from '../store'

function SongCard(props) {
    const [ isDragging, setIsDragging ] = useState(false);
    const [ draggedTo, setDraggedTo ] = useState(false);
    const [ cardClass, setCardClass ] = useState("list-card unselected-list-card playlister-song");

    const { store } = useContext(GlobalStoreContext);

    const handleDragStart = (event) => {
        event.dataTransfer.setData("song", event.target.id);
        setIsDragging(true);
    }
    const handleDragOver = (event) => {
        event.preventDefault();
        setDraggedTo(true);
    }
    const handleDragEnter = (event) => {
        event.preventDefault();
        setDraggedTo(true);
    }
    const handleDragLeave = (event) => {
        event.preventDefault();
        setDraggedTo(false);
    }
    const handleDrop = (event) => {
        event.preventDefault();
        let target = event.target;
        let targetId = target.id;
        targetId = targetId.substring(target.id.indexOf("-") + 1);
        let sourceId = event.dataTransfer.getData("song");
        sourceId = sourceId.substring(sourceId.indexOf("-") + 1);
        console.log({targetId, sourceId })
        if(sourceId.length === "" || targetId === ""){
            alert("please drag the whole song card");
            return;
        }
        setIsDragging(false);
        setDraggedTo(false);
        props.moveCallback(parseInt(sourceId), parseInt(targetId));
    }

    const handleDoubleClick = (event) => {
        if (event.detail === 2) {
            props.editCurrentSongCallback(props.index);
        }
    }

    const getItemNum = () => {
        return props.id.substring("playlist-song-".length);
    }

    const { song, index } = props;
   
    useEffect(()=>{
        if(draggedTo){
            setCardClass(c =>  c + " playlister-song-dragged-to");
        }
   }, [draggedTo])
   
    return (
        <div
            key={index}
            id={'song-' + getItemNum()}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleDoubleClick}
            draggable="true"
            className={cardClass}
        >
            <span>{"" + (parseInt(getItemNum()) + 1)  + ". "} </span>
            <a
                id={'song-' + index + '-link'}
                className="song-link"
                href={"https://www.youtube.com/watch?v=" + song.youTubeId}>
                {song.title} by {song.artist}
            </a>
            
            <input
                type="button"
                id={"remove-song-" + index}
                className="list-card-button"
                value={"\u2715"}
            />
        </div>
    );
}

export default SongCard;