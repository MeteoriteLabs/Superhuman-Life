import React from "react";
import { Spinner } from 'react-bootstrap';
import './loader.css';

const Loader: React.FC<{msg?: string}> = (props) => {
    return (
        <>
            <div className="row loader">
                <div className="col-lg-12 ml-5">
                <Spinner animation="border" role="status" variant="secondary"/>
                </div>
                <div className="col-lg-12">
                <div className='text-muted small mt-2'>{props.msg}</div>
                </div>
            </div>
        </>
    );
}

export default Loader;
