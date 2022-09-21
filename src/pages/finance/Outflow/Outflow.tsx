import React from 'react';
import { Link } from 'react-router-dom';
import {Button} from 'react-bootstrap';

function Outflow() {
  return (
    <div>
      <div className='d-flex justify-content-center pt-2'>
      <Link to={'add_payee'}><Button variant="outline-dark" className='m-1'><i className="fas fa-plus-circle"></i>  Add Payee</Button></Link>
      <Button variant="outline-dark" className='m-1'>Make Monthly settlement</Button>
      <Button variant="outline-dark" className='m-1'>Instant Payout</Button>
      </div>
    </div>
  )
}

export default Outflow
