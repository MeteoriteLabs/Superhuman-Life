import React from 'react';
import { Button } from 'react-bootstrap';
// import Icons from '../Icons';

const DrawerTrigger: React.FC<{ toggle: () => void }> = (props) => {
  return (
    // <div onClick={props.toggle} style={{ paddingLeft: '45%' }}>
    //   <Icons name="unreadeye" style={{ cursor: 'pointer' }} />
    // </div>
    <Button onClick={props.toggle} variant='outline-dark'>Preview</Button>
  );
};

export default DrawerTrigger;
