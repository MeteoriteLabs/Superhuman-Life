import React from 'react';
import './Backdrop.css';

const Backdrop: React.FC<{ close: () => void }> = (props) => {
    return (
        <>
            <div className="backdrop" onClick={props.close} />
        </>
    );
};

export default Backdrop;
