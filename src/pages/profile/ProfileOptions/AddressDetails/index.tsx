import { useState, useContext, useRef, forwardRef } from 'react';
import { Card, Row, Col, Button, Dropdown } from 'react-bootstrap';
import { ADDRESSES } from '../../queries/queries';
import AuthContext from '../../../../context/auth-context';
import { useQuery } from '@apollo/client';
import { flattenObj } from '../../../../components/utils/responseFlatten';
import CreateAddress from './CreateAddress';
import Loader from '../../../../components/Loader/Loader';
import NoDataFound from '../../../../components/NoDataFound';
import { BasicAddressDetails } from './CreateAddress';

const AddressDetails = () => {
  const auth = useContext(AuthContext);
  const [addressData, setAddressData] = useState<BasicAddressDetails[]>([]);
  const CreateAddressComponent = useRef<any>(null);

  const {
    // eslint-disable-next-line
    data: get_address,
    loading: loading_address_details,
    refetch: refetch_address
  } = useQuery(ADDRESSES, {
    variables: { id: auth.userid },
    onCompleted: (response) => {
      const flattenData = flattenObj({ ...response.addresses });
      setAddressData(flattenData);
    }
  });

  const deleteUserAddress = (data) => {
    CreateAddressComponent.current.TriggerForm({ id: data.id, type: 'delete' });
  };

  // calling modal for update option
  function updateAddress(data) {
    CreateAddressComponent.current.TriggerForm({
      id: data.id,
      type: 'edit',
      modal_status: true
    });
  }

  function refetchQueryCallback() {
    refetch_address();
  }

  if (loading_address_details) {
    return <Loader msg={'Loading address details ...'} />;
  }

  return (
    <Col md={{ span: 8, offset: 2 }}>
      <Col md={{ offset: 9, span: 3 }}>
        <Card.Title className="text-center">
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => {
              CreateAddressComponent.current.TriggerForm({
                id: null,
                type: 'create',
                modal_status: true
              });
            }}>
            <i className="fas fa-plus-circle"></i> Add Address
          </Button>
          <CreateAddress
            ref={CreateAddressComponent}
            callback={refetchQueryCallback}></CreateAddress>
        </Card.Title>
      </Col>

      <Row className="mt-4 pb-3">
        {addressData && addressData.length ? (
          addressData.map((currValue) => (
            <Col lg={12} key={currValue.id}>
              <Card key={currValue.id} className="m-2">
                <Card.Body key={currValue.id}>
                  <Row className="justify-content-end">
                    <Dropdown key={currValue.id}>
                      <Dropdown.Toggle variant="bg-light" id="dropdown-basic">
                        <img
                          src="/assets/kebabcase.svg"
                          alt="notification"
                          className="img-responsive "
                          style={{ height: '20px', width: '20px' }}
                        />
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        {
                          addressData.length !== 1 ? 
                          <Dropdown.Item key={1} onClick={() => deleteUserAddress(currValue)}>
                          Delete
                        </Dropdown.Item> : null
                        }
                        
                        <Dropdown.Item key={2} onClick={() => updateAddress(currValue)}>
                          Edit
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Row>

                  <Card.Title>
                    {currValue.Title ? currValue.Title : null}
                    {currValue.type_address ? (
                      <span className="text-white rounded bg-secondary p-1 ml-2">
                        {currValue.type_address}
                      </span>
                    ) : null}
                    {currValue.is_primary ? (
                      <span className="text-white rounded bg-primary p-1 ml-2">Primary</span>
                    ) : null}
                  </Card.Title>

                  <Row className="p-1">
                    <Col xs={12} lg={6}>
                      <b>Address 1 : </b>
                      {currValue.House_Number ? currValue.House_Number : null}{' '}
                      {currValue.address1 ? currValue.address1 : null}
                    </Col>
                    <Col xs={12} lg={6}>
                      {currValue.address2 ? currValue.address2 : null}
                    </Col>
                  </Row>
                  <Row className="p-1">
                    <Col xs={12} lg={3}>
                      <b>City : </b>
                      {currValue.city ? currValue.city : null}
                    </Col>
                    <Col xs={12} lg={3}>
                      <b>State : </b>
                      {currValue.state ? currValue.state : null}
                    </Col>
                    <Col xs={12} lg={3}>
                      <b>Country : </b>
                      {currValue.country ? currValue.country : null}
                    </Col>
                    <Col xs={12} lg={3}>
                      <b>Zipcode : </b>
                      {currValue.zipcode ? currValue.zipcode : null}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <NoDataFound msg={'Oops! No address found'} />
        )}
      </Row>
    </Col>
  );
};

export default forwardRef(AddressDetails);
