import { Container, Row} from 'react-bootstrap';

const email = process.env.REACT_APP_SUPPORT_EMAIL;
const phone = process.env.REACT_APP_SUPPORT_CONTACT_NUMBER;

function DeactiveAccount() {

  return (
    <Container fluid >

        {/* Header */}
        <Row className="text-center bg-dark py-2">
                <h3 className="text-light col-lg-12 col-sm-12">Your Account is Deactivated.</h3>
               <h5 className="text-light col-lg-12 col-sm-12">All your data and account will be deleted 30 days.</h5>
        </Row>

        {/* contact details */}
        <Row className="text-center py-5">
                <h3 className='col-lg-12 col-sm-12'>May we help you with something?</h3>
                <h5 className='col-lg-12 col-sm-12'><a href={`mailto:${email}`} className='text-dark'>{email}</a></h5>
                <h5 className='col-lg-12 col-sm-12'><a href={`tel:${phone}`} className='text-dark'>{phone}</a></h5>
        </Row>

        {/* footer */}
        <Row className="text-center py-4 px-3 fixed-bottom bg-dark">
           <h5 className="text-light col-lg-12 col-sm-12">“Change makers take risks and are ready to die for excellence than to give excuses and live for mediocrity.”</h5>
        </Row>
      
    </Container>
  )
}

export default DeactiveAccount;
