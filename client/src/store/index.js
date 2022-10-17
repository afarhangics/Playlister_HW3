import { createContext, useState } from 'react'
import jsTPS from '../common/jsTPS'
import api from '../api'
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
    ADD_SONG: "ADD_SONG"
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
        listNameActive: false
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
                    listNameActive: false
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    edittingListId: "_id",
                    newListCounter: store.newListCounter,
                    markDeleteList:null,
                    listNameActive: false
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
                    markDeleteList:null,
                    listNameActive: true
                });
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                console.log("loadingpairs", store.edittingListId);
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: null,
                    edittingListId: payload.edittingListId,
                    newListCounter: store.newListCounter,
                    markDeleteList:null,
                    listNameActive: false
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
                    listNameActive: false
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    edittingListId: store.edittingListId,
                    newListCounter: store.newListCounter,
                    markDeleteList:null,
                    listNameActive: false
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    edittingListId: payload._id,
                    newListCounter: store.newListCounter,
                    markDeleteList:null,
                    listNameActive: true
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
                    markDeleteList:payload

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
                    markDeleteList:null,

                });
            }
            case GlobalStoreActionType.ADD_SONG: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    edittingListId: "_id",
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    markDeleteList:null,

                });
            }
            default:
                return store;
        }
    }
    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

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
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
    }
    store.addSong = async function () {
        let song = {
            "title": "Untitled",
            "artist": "Unknown",
            "youTubeId": "dQw4w9WgXcQ"
        };
        const index = store.currentList.songs.length;
        store.createSong(index, song);
    }
    store.createSong = async function(index, song){
        const { currentList } = store;
        let songs = currentList.songs;
        songs.splice(index, 0, song);
        let updatedList = currentList;
        updatedList.songs = songs;
        const response = await api.updatePlaylistById(updatedList._id, updatedList);
        if (response.data.success) {
            storeReducer({
                type: GlobalStoreActionType.ADD_SONG,
                payload: updatedList
            });
        }
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
        let newList = {
            name: "Untitled",
            songs: []
        };

        async function asyncCreateNewList() {
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
