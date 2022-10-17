import React, { useState, useEffect } from 'react'

function SongCard({
    id,
    index,
    song,
    moveCallback,
    editCurrentSongCallback,
    removeCurrentSongCallback,
}) {
    const [ isDragging, setIsDragging ] = useState(false);
    const [ draggedTo, setDraggedTo ] = useState(false);
    const [ cardClass, setCardClass ] = useState("list-card unselected-list-card playlister-song");

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
        if(sourceId.length === "" || targetId === ""){
            alert("please drag the whole song card");
            return;
        }
        setIsDragging(false);
        setDraggedTo(false);
        moveCallback(parseInt(sourceId), parseInt(targetId));
    }

    const handleDoubleClick = (event) => {
        if (event.detail === 2) {
            editCurrentSongCallback(index);
        }
    }

    const getItemNum = () => {
        return id.substring("playlist-song-".length);
    }
   
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
                onClick={()=>removeCurrentSongCallback(index)}
            />
        </div>
    );
}

export default SongCard;