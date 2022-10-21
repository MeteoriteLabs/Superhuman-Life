import {Spinner} from 'react-bootstrap';
import './loader.css';

function Loader() {
    return (
        <Spinner animation="border" role="status" className='loader'>
            <span className="sr-only">Loading...</span>
        </Spinner>
    );
}

export default Loader;
