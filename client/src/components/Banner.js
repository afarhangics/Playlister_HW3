import EditToolbar from "./EditToolbar";
import { useHistory } from 'react-router-dom'
/*
    Our Application's Banner, note we are using function-style
    React. Our banner just has a left-aligned heading and a
    right-aligned toolbar for undo/redo and close list buttons.
    
    @author McKilla Gorilla
*/
function Banner(props) {
    const history = useHistory();

    function goHome(){
        history.push('/');
    }
    return (        
        <div id="playlister-banner">
            <span style={{cursor:'pointer'}} onClick={goHome}>
                Playlister
            </span>
            <EditToolbar />
        </div>
    );
}

export default Banner;