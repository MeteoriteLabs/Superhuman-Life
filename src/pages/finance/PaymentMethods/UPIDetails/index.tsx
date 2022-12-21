import { useRef, useContext, useState } from "react";
import { Button, Row, Col, Card, Dropdown, Badge } from "react-bootstrap";
import PaymentMethodsAction from "../PaymentMethodsAction";
import Loader from '../../../../components/Toaster';
import { useQuery } from "@apollo/client";
import { GET_UPI_DETAILS } from "../queries";
import { flattenObj } from "../../../../components/utils/responseFlatten";
import AuthContext from "../../../../context/auth-context";

function UPIDetails() {
  const paymentMethodActionRef = useRef<any>(null);
  const auth = useContext(AuthContext);
  const [upiDetails, setUpiDetails] = useState<{}[]>([])

  const { data: get_upi_details, refetch: refetch_contacts } = useQuery(
    GET_UPI_DETAILS,
    {
      variables: { id: auth.userid },
      onCompleted: (data) => {
        const flattenUPIData = flattenObj({ ...data.upiDetailsChangemakers });
        setUpiDetails(flattenUPIData);
      },
    }
  );


  return (
    <div>
      <PaymentMethodsAction ref={paymentMethodActionRef} />
      <Row className="mt-3">
        <Col md={{ offset: 10 }}>
          <Button
            variant={true ? "outline-secondary" : "light"}
            size="sm"
            onClick={() => {
              paymentMethodActionRef.current.TriggerForm({ actionType: "upi" });
            }}
          >
            <i className="fas fa-plus-circle"></i> Add UPI
          </Button>
        </Col>
      </Row>
      <Row className="mt-4 pb-3">
                {
                    upiDetails ? upiDetails.map((currValue: any) =>
                        <Col lg={12} key={currValue.id}>
                            <Card className="m-2" key={currValue.id}>
                                <Card.Body key={currValue.id}>
                                    <Row className='justify-content-end' key={currValue.id}>

                                        <Dropdown key={currValue.id}>
                                            <Dropdown.Toggle variant="bg-light" id="dropdown-basic">
                                                <img
                                                    src="/assets/kebabcase.svg"
                                                    alt="notification"
                                                    className="img-responsive "
                                                    style={{ height: '20px', width: '20px' }}
                                                />
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu key={currValue.id}>
                                                <Dropdown.Item key={1} >Delete</Dropdown.Item>
                                                <Dropdown.Item key={2} >Edit</Dropdown.Item>
                                                <Dropdown.Item key={2} >View</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>

                                    </Row>

                                    <Row>
                                    <Col sm={12} lg={3}><b>Full Name: </b>{currValue.Full_Name ? currValue.Full_Name : null}</Col>
                                        <Col sm={12} lg={3}><b>UPI ID : </b>{currValue.UPI_ID && currValue.UPI_ID}</Col>
                                        <Col sm={12} lg={3}><b>Phone no. : </b>{currValue.phone_number && currValue.phone_number}</Col>
                                        <Col sm={12} lg={3}>{currValue.Is_Primary ? <Badge pill variant="primary" className="p-2"> Primary </Badge>: null}</Col>
                                    </Row>

                                </Card.Body>
                            </Card>
                        </Col>
                    ) : <Loader msg={'UPI Details loading'}/>
                }

            </Row>
    </div>
  );
}

export default UPIDetails;
