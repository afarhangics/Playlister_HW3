import { createContext, useState } from 'react'
import jsTPS from '../common/jsTPS'
import api from '../api'
import MoveSong_Transaction from '../transactions/MoveSong_Transaction.js';
import CreateSong_Transaction from '../transactions/CreateSong_Transaction.js';
import RemoveSong_Transaction from '../transactions/RemoveSong_Transaction.js';
import UpdateSong_Transaction from '../transactions/UpdateSong_Transaction.js';


export const GlobalStoreContext = createContext({});
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    MARK_LIST_DELETE: "MARK_LIST_DELETE",
    DONE_LIST_DELETE: "DONE_LIST_DELETE",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    UPDATE_CURRENT_LIST: "UPDATE_CURRENT_LIST",
    LOAD_CURRENT_SONG: "LOAD_CURRENT_SONG"
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
export const useGlobalStore = () => {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        idNamePairs: [],
        currentList: null,
        edittingListId: "_id",
        markDeleteList:null,
        newListCounter: 0,
        listNameActive: false,
        isEdittingList: false,
        currentListIsSet: false,
        currentSong:null,
        currentSongIndex: null,
    });

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.playlist,
                    edittingListId: "_id",
                    newListCounter: store.newListCounter,
                    markDeleteList:null,
                    listNameActive: false,
                    currentListIsSet: store.currentListIsSet,
                    currentSong: store.currentSong,
                    currentSongIndex: store.currentSongIndex,
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    edittingListId: "_id",
                    newListCounter: null,
                    markDeleteList:null,
                    listNameActive: false,
                    currentListIsSet: false,
                    currentSong: null,
                    currentSongIndex: null,
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                console.log("CREATE_NEW_LIST", payload._id)
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    edittingListId: payload._id,
                    newListCounter: store.newListCounter + 1,
                    isEdittingList: true,
                    markDeleteList:null,
                    listNameActive: true,
                    currentListIsSet: store.currentListIsSet,
                    currentSong: store.currentSong,
                    currentSongIndex: store.currentSongIndex,
                });
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: null,
                    edittingListId: payload.edittingListId,
                    isEdittingList: payload.edittingListId !== "_id",
                    newListCounter: store.newListCounter,
                    markDeleteList:null,
                    listNameActive: false,
                    currentListIsSet: store.currentListIsSet,
                    currentSong: store.currentSong,
                    currentSongIndex: store.currentSongIndex,
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    edittingListId: "_id",
                    newListCounter: store.newListCounter,
                    markDeleteList:null,
                    listNameActive: false,
                    isEdittingList: false,
                    currentListIsSet: store.currentListIsSet,
                    currentSong: store.currentSong,
                    currentSongIndex: store.currentSongIndex,
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    edittingListId: store.edittingListId,
                    isEdittingList: false,
                    currentListIsSet: true,
                    newListCounter: store.newListCounter,
                    markDeleteList:null,
                    listNameActive: false,
                    currentSong: store.currentSong,
                    currentSongIndex: store.currentSongIndex,
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    edittingListId: payload._id,
                    isEdittingList: true,
                    newListCounter: store.newListCounter,
                    markDeleteList: null,
                    listNameActive: true,
                    currentListIsSet: store.currentListIsSet,
                    currentSong: store.currentSong,
                    currentSongIndex: store.currentSongIndex,
                });
            }
            //MARK FOR DELETION
            case GlobalStoreActionType.MARK_LIST_DELETE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    edittingListId: store.edittingListId,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    isEdittingList: false,
                    markDeleteList:payload,
                    currentListIsSet: store.currentListIsSet,
                    currentSong: store.currentSong,
                    currentSongIndex: store.currentSongIndex,

                });
            }
            //DONE LIST DELETE
            case GlobalStoreActionType.DONE_LIST_DELETE: {
                const filteredList = store.idNamePairs.filter(pair => pair._id !== payload);
                return setStore({
                    idNamePairs: filteredList,
                    currentList: store.currentList,
                    edittingListId: "_id",
                    newListCounter: store.newListCounter - 1,
                    listNameActive: false,
                    isEdittingList: false,
                    markDeleteList:null,
                    currentListIsSet: store.currentListIsSet,
                    currentSong: store.currentSong,
                    currentSongIndex: store.currentSongIndex,

                });
            }
            case GlobalStoreActionType.UPDATE_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    edittingListId: "_id",
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    isEdittingList: false,
                    markDeleteList:null,
                    currentListIsSet: store.currentListIsSet,
                    currentSong: store.currentSong,
                    currentSongIndex: store.currentSongIndex,

                });
            }
            case GlobalStoreActionType.LOAD_CURRENT_SONG: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    edittingListId: "_id",
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    isEdittingList: false,
                    markDeleteList:null,
                    currentListIsSet: store.currentListIsSet,
                    currentSong: payload.song,
                    currentSongIndex: payload.index,

                });
            }
            default:
                return store;
        }
    }
    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    store.loadCurrentSong = function (index){
        const song = store.currentList.songs[index];
        storeReducer({
            type: GlobalStoreActionType.LOAD_CURRENT_SONG,
            payload: {
                index,
                song
            }
        });
    }
    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.name = newName;
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncChangeListName(id);
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        tps.clearAllTransactions();
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
    }
    store.addAddSongTransaction = function(){
        let song = {
            title: "Untitled",
            artist: "Unknown",
            youTubeId: "dQw4w9WgXcQ"
        };
        const index = store.currentList.songs.length;
        let transaction = new CreateSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
    }
    store.createSong = function(index, song){
        const { currentList } = store;
        let songs = currentList.songs;
        songs.splice(index, 0, song);
        let content = currentList;
        content.songs = songs;
        store.updatedListContent(content);
    }
    store.removeSong = function(index){
        const { currentList } = store;
        let songs = currentList.songs;
        songs.splice(index, 1);
        let content = currentList;
        content.songs = songs;
        store.updatedListContent(content);
    }
    store.addRemoveSongTransaction = () => {
        const { currentList, currentSongIndex } = store;
        let song = currentList.songs[currentSongIndex];
        let transaction = new RemoveSong_Transaction(store, currentSongIndex, song);
        tps.addTransaction(transaction);
    }
    store.updatedListContent = function(content){
        async function doUpdate(content){
            const response = await api.updatePlaylistById(content._id, content);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.UPDATE_CURRENT_LIST,
                    payload: content
                });
            }
        }
        doUpdate(content);
    }
    store.updateSong = function(index, songData){
        const { currentList } = store;
        let songs = currentList.songs;
        songs[index] = songData;

        let updatedList = currentList;
        updatedList.songs = songs;
        store.updatedListContent(updatedList);
    }
    store.addEditSongTransaction = function(songData){
        const { currentList, currentSongIndex } = store;
        let song = currentList.songs[currentSongIndex];
        let oldData = {
            title: song.title,
            artist: song.artist,
            youTubeId: song.youTubeId
        };
        let newData = {
            title: songData.title,
            artist: songData.artist,
            youTubeId: songData.youTubeId
        };
        let transaction = new UpdateSong_Transaction(store, currentSongIndex, oldData, newData);
        tps.addTransaction(transaction);
    }
    store.moveSong = function(start, end){
        let list = store.currentList;
        if (start < end) {
            let temp = list.songs[start];
            for (let i = start; i < end; i++) {
                list.songs[i] = list.songs[i + 1];
            }
            list.songs[end] = temp;
        }
        else if (start > end) {
            let temp = list.songs[start];
            for (let i = start; i > end; i--) {
                list.songs[i] = list.songs[i - 1];
            }
            list.songs[end] = temp;
        }
        store.updatedListContent(list);
    }
    // THIS FUNCTION ADDS A MoveSong_Transaction TO THE TRANSACTION STACK
    store.addMoveSongTransaction = function (start, end){
        let transaction = new MoveSong_Transaction(store, start, end);
        tps.addTransaction(transaction);
    }
    //MARK LIST FOR DELETION
    store.markListForDeletion = function (list) {
        storeReducer({
            type: GlobalStoreActionType.MARK_LIST_DELETE,
            payload: list
        });
    }

    //DELETE LIST
    store.deleteList = function (id) {
        async function asyncDeleteList(id) {
            const response = await api.deletePlaylistById(id);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.DONE_LIST_DELETE,
                    payload: id
                });
            }
            else {
                console.log("API FAILED TO DELTE LIST WITH ID");
            }
        }
        asyncDeleteList(id);
        
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function (prevId="_id") {
        async function asyncLoadIdNamePairs() {
            const response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: {idNamePairs: pairsArray, edittingListId: prevId}
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
    }

    store.setCurrentList = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist
                    });
                    store.history.push("/playlist/" + playlist._id);
                }
            }
        }
        asyncSetCurrentList(id);
    }
    store.createNewList = function() {
        async function asyncCreateNewList() {
            let newList = {
                name: "Untitled",
                songs: []
            };
            const response = await api.createPlaylist(newList);
            if (response.data.success) {
                let data = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.CREATE_NEW_LIST,
                    payload: data
                });
               store.loadIdNamePairs(data._id);
            }
            else {
                console.log("API FAILED TO CREATE NEW LIST");
            }
        }
        asyncCreateNewList();
    }
    store.getPlaylistSize = function() {
        return store.currentList.songs.length;
    }
    store.undo = function () {
        tps.undoTransaction();
    }
    store.redo = function () {
        tps.doTransaction();
    }
    store.canUndo = function () {
        return tps.hasTransactionToUndo();
    }
    store.canRedo = function () {
        return tps.hasTransactionToRedo();
    }
    store.canAddSong = function () {
        return store.currentListIsSet;
    }
    store.canClose = function () {
        return store.currentListIsSet;
    }
    store.shouldDisableAddList = function () {
        return store.isEdittingList;
    }
    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setIsListNameEditActive = function (playist) {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: playist
        });
    }
    // THIS GIVES OUR STORE AND ITS REDUCER TO ANY COMPONENT THAT NEEDS IT
    return { store, storeReducer };
}
