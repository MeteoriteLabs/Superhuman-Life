import React from 'react';
import {Button} from 'react-bootstrap';

function Expenses() {
  return (
    <div>
      <div className='d-flex justify-content-center pt-2'>
      <Button variant="outline-dark" className='m-1'>Make Monthly settlement</Button>
      <Button variant="outline-dark" className='m-1'>Instant Payout</Button>
      </div>

    </div>
  )
}

export default Expenses;
