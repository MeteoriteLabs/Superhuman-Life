import React from 'react';
import { Table, Button } from 'react-bootstrap';

function Receipt() {
  const printReciept = () => {
    window.print();
  }
  return (
    <div>
      <h4 className='text-center'>Payment Details</h4>
      <div className='d-flex justify-content-between flex-wrap'>
        <div>
          <p><b>Name of Recipient</b> : Nikita Kumawat</p>
          <p><b>Phone Number</b> : 9876543210</p>
          <p><b>Email</b> : nikitakumawat44@gmail.com</p>
          <p><b>Entity</b> : Company Name</p>
        </div>
        <div>
          <p><b>Date of Payment</b> : 19-09-2022</p>
        </div>
      </div>

      <Table striped bordered responsive>
        <thead>
          <tr>
            <th>Payment Cycle</th>
            <th>Payment Frequency</th>
            <th>Type of Payment</th>
            <th>Department</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>30th of every Month</td>
            <td>Monthly</td>
            <td>Salary</td>
            <td>Finance</td>
            <td>Rs. 30000</td>
          </tr>
        </tbody>
      </Table>

      <hr />
      <div className='flex'>
        <p className='float-left'><b>Net Amount</b></p>
        <p className='float-right'><b>Rs. 30000</b></p>
      </div>
      <div className='text-center mt-5'>
        <Button variant="dark" onClick={printReciept}>Print</Button>

      </div>
      
    </div>
  )
}

export default Receipt;
