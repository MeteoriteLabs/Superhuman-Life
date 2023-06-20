import React, { useImperativeHandle, useState, useContext } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import ModalView from '../../../../components/modal';
import {
  UPDATE_ADDRESS_DATA,
  CREATE_ADDRESS,
  DELETE_ADDRESS,
  ADDRESSES_IS_PRIMARY,
  ADDRESS,
  ADDRESSES
} from '../../queries/queries';
import { Subject } from 'rxjs';
import { schema, widgets } from '../../profileSchema';
import AuthContext from '../../../../context/auth-context';
import { flattenObj } from '../../../../components/utils/responseFlatten';
import StatusModal from '../../../../components/StatusModal/StatusModal';
import {
  zipcodeCustomFormats,
  zipcodeTransformErrors
} from '../../../../components/utils/ValidationPatterns';
import Toaster from '../../../../components/Toaster/index';

export interface BasicAddressDetails {
  id: string;
  address1: string;
  address2: string;
  city: string;
  country: string;
  state: string;
  zipcode: string;
  type_address: string;
  House_Number: string;
  Title: string;
  is_primary: boolean;
}

interface Operation {
  id: string;
  modal_status: boolean;
  type: 'create' | 'edit' | 'delete';
}

function CreateAddress(props: any, ref: any): JSX.Element {
  const auth = useContext(AuthContext);
  const addressJson: any = require('./Address.json');
  const [operation, setOperation] = useState<Operation>({} as Operation);
  const [addressDetails, setAddressDetails] = useState({} as BasicAddressDetails);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
  const [isAddressDeleted, setIsAddressDeleted] = useState<boolean>(false);
  const [isAddressUpdated, setIsAddressUpdated] = useState<boolean>(false);
  const [nonPrimaryAddressDetails, setNonPrimaryAddressDetails] = useState<BasicAddressDetails[]>(
    []
  );
  const [isPrimaryAddressDetails, setIsPrimaryAddressDetails] = useState<BasicAddressDetails[]>([]);

  const {
    // eslint-disable-next-line
    data: get_address,
    // eslint-disable-next-line
    loading: loading_address_details,
    // eslint-disable-next-line
    refetch: refetch_address
  } = useQuery(ADDRESS, {
    variables: { id: operation.id },
    skip: !operation.id || operation.type === 'delete',
    onCompleted: (response) => {
      const flattenData = flattenObj({ ...response.address });
      FillDetails(flattenData);
    }
  });

  // get primary addresses
  useQuery(ADDRESSES_IS_PRIMARY, {
    variables: { id: auth.userid, is_primary: true },
    onCompleted: (response) => {
      const flattenDetail = flattenObj({ ...response.addresses });
      setIsPrimaryAddressDetails(flattenDetail);
    }
  });

  // get non primary addresses
  useQuery(ADDRESSES_IS_PRIMARY, {
    variables: { id: auth.userid, is_primary: false },
    onCompleted: (response) => {
      const flattenDetail = flattenObj({ ...response.addresses });
      setNonPrimaryAddressDetails(flattenDetail);
    }
  });

  const [updateAddress] = useMutation(UPDATE_ADDRESS_DATA, {
    onCompleted: () => {
      props.callback();
      modalTrigger.next(false);
      setIsAddressUpdated(!isAddressUpdated);
    },
    refetchQueries: [ADDRESSES]
  });

  const [deleteAddress] = useMutation(DELETE_ADDRESS, {
    onCompleted: (response) => {
      setIsAddressDeleted(!isAddressDeleted);

      const flattenData = flattenObj({
        ...response.deleteAddress.data
      });
      const isPrimary = flattenData.is_primary;
      const lastAddressDetailIndex = nonPrimaryAddressDetails.length - 1;

      if (isPrimary) {
        updateAddress({
          variables: {
            id: nonPrimaryAddressDetails[lastAddressDetailIndex].id,
            data: {
              is_primary: true
            }
          }
        });
      }
    },
    refetchQueries: [ADDRESSES]
  });

  const [createAddress] = useMutation(CREATE_ADDRESS);

  // modal trigger
  const modalTrigger = new Subject();

  useImperativeHandle(ref, () => ({
    TriggerForm: (msg: Operation) => {
      setOperation(msg);

      //show delete modal
      if (msg.type === 'delete') {
        setShowDeleteModal(true);
      }

      //restrict form to render on delete
      if (msg.type !== 'delete') {
        modalTrigger.next(true);
      }
    }
  }));

  function FillDetails(selectedAddress: any) {
    const details = {} as BasicAddressDetails;
    details.address1 = selectedAddress ? selectedAddress.address1 : '';
    details.address2 = selectedAddress ? selectedAddress.address2 : '';
    details.city = selectedAddress ? selectedAddress.city : '';
    details.country = selectedAddress ? selectedAddress.country : '';
    details.state = selectedAddress ? selectedAddress.state : '';
    details.zipcode = selectedAddress ? selectedAddress.zipcode : '';
    details.type_address = selectedAddress ? selectedAddress.type_address : '';
    details.House_Number = selectedAddress ? selectedAddress.House_Number : '';
    details.Title = selectedAddress ? selectedAddress.Title : '';
    (details.is_primary = selectedAddress && selectedAddress.is_primary ? true : false),
      setAddressDetails(details);
  }

  // create address function
  function CreateUserAddress(frm: any) {
    createAddress({
      variables: {
        data: {
          users_permissions_user: auth.userid,
          address1: frm.address1,
          address2: frm.address2,
          city: frm.city,
          country: frm.country,
          state: frm.state,
          zipcode: frm.zipcode,
          type_address: frm.type_address,
          House_Number: frm.House_Number,
          Title: frm.Title,
          is_primary: frm.is_primary
        }
      },
      onCompleted: (data) => {
        setIsFormSubmitted(!isFormSubmitted);
        modalTrigger.next(false);

        const flattenData = flattenObj({
          ...data.createAddress.data
        });

        const isPrimary = flattenData.is_primary;

        const arr: BasicAddressDetails[] = isPrimaryAddressDetails.splice(-1);

        if (isPrimary) {
          for (const currentValue of arr) {
            updateAddress({
              variables: {
                id: currentValue.id,
                data: {
                  is_primary: false
                }
              }
            });
          }
        }
      },
      refetchQueries: [ADDRESSES]
    });
  }

  // update address function
  function UpdateUserAddress(frm: any) {
    updateAddress({
      variables: {
        id: operation.id,
        data: {
          address1: frm.address1,
          address2: frm.address2 ? frm.address2 : null,
          city: frm.city,
          country: frm.country,
          state: frm.state,
          zipcode: frm.zipcode,
          type_address: frm.type_address,
          House_Number: frm.House_Number,
          Title: frm.Title,
          is_primary: frm.is_primary ? true : false
        }
      },
      onCompleted: (data) => {
        const flattenData = flattenObj({
          ...data.updateAddress.data
        });
        const isUpdatedAddressAlreadyPrimary = isPrimaryAddressDetails.filter(
          (currentValue) => currentValue.id === flattenData.id
        );

        const isPrimary: boolean = flattenData.is_primary;

        if (isPrimary && isUpdatedAddressAlreadyPrimary.length !== 1) {
          const arr: BasicAddressDetails[] = isPrimaryAddressDetails.filter(
            (currentValue) => currentValue.id !== flattenData.id
          );
          for (const currentValue of arr) {
            updateAddress({
              variables: {
                id: currentValue.id,
                data: {
                  is_primary: false
                }
              }
            });
          }
        }
      }
    });
  }

  function DeleteAddress(id: any) {
    deleteAddress({ variables: { id: id } });
  }

  // submit function
  function OnSubmit(frm: any) {
    switch (operation.type) {
      case 'create':
        CreateUserAddress(frm);
        break;
      case 'edit':
        UpdateUserAddress(frm);
        break;
    }
  }

  return (
    <>
      {/* Create and Edit Modal */}
      <ModalView
        name={operation.type === 'create' ? 'Create New Address' : 'Edit Address Details'}
        isStepper={false}
        formUISchema={schema}
        formSchema={addressJson}
        showing={operation.modal_status}
        formSubmit={(frm: any) => {
          OnSubmit(frm);
        }}
        widgets={widgets}
        modalTrigger={modalTrigger}
        formData={operation.type === 'create' ? {} : addressDetails}
        showErrorList={false}
        customFormats={zipcodeCustomFormats}
        transformErrors={zipcodeTransformErrors}
      />

      {/* Delete Modal */}
      {showDeleteModal && (
        <StatusModal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          modalTitle="Delete"
          modalBody="Do you want to delete this address detail?"
          buttonLeft="Cancel"
          buttonRight="Yes"
          onClick={() => {
            DeleteAddress(operation.id);
          }}
        />
      )}

      {/* success toaster notification */}
      {isFormSubmitted ? (
        <Toaster
          handleCallback={() => setIsFormSubmitted(!isFormSubmitted)}
          type="success"
          msg="Address has been added successfully"
        />
      ) : null}

      {isAddressDeleted ? (
        <Toaster
          handleCallback={() => setIsAddressDeleted(!isAddressDeleted)}
          type="success"
          msg="Address has been deleted successfully"
        />
      ) : null}

      {isAddressUpdated ? (
        <Toaster
          handleCallback={() => setIsAddressUpdated(!isAddressUpdated)}
          type="success"
          msg="Address has been updated successfully"
        />
      ) : null}
    </>
  );
}

export default React.forwardRef(CreateAddress);
