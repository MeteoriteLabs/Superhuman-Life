import React, { useImperativeHandle, useState, useContext, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import ModalView from "../../../../components/modal";
import {
    FETCH_USER_PROFILE_DATA,
    UPDATE_ADDRESS_DATA,
    UPDATE_USER_PROFILE_DATA,
    CREATE_ADDRESS
} from "../../queries/queries";
import { Subject } from "rxjs";
import { schema, widgets } from "../../profileSchema";
import AuthContext from "../../../../context/auth-context";
import { flattenObj } from "../../../../components/utils/responseFlatten";

interface Operation {
    id: string;
    modal_status: boolean;
    type: "create" | "edit" ;
}

const emptyAddressState = {
    address1: '',
    address2: '',
    city: '',
    country: '',
    state: '',
    zipcode: '',
    type_address: '',
    House_Number: '',
    Title: ''
};

function CreateAddress(props: any, ref: any) {
    const auth = useContext(AuthContext);
    const addressJson: { [name: string]: any } = require("./Address.json");
    const [addressData, setAddressData] = useState<any>([]);
    const [operation, setOperation] = useState<Operation>({} as Operation);
    const [addressDetails, setAddressDetails] = useState<any>({});

    console.log(operation.id);
    function FetchData() {
        useQuery(FETCH_USER_PROFILE_DATA, {
            skip: (operation.type === 'create'),
            variables: { id: auth.userid },
            onCompleted: (r: any) => {
                const flattenData = flattenObj({ ...r });

                const addressIds = flattenData.usersPermissionsUser.addresses && flattenData.usersPermissionsUser.addresses?.length ? flattenData.usersPermissionsUser.addresses.map((currentValue: any) => currentValue.id) : null;
                setAddressData(addressIds);

                let selectedAddressArrayToUpdate = r.usersPermissionsUser.data.attributes.addresses.data && r.usersPermissionsUser.data.attributes.addresses.data.length ? r.usersPermissionsUser.data.attributes.addresses.data.filter((currValue: any) => (currValue.id === operation.id)) : null;

                console.log('flattenData', flattenData.usersPermissionsUser.addresses.filter((currValue: any) => currValue.id === operation.id));
                
                console.log('selectedAddressArrayToUpdate',selectedAddressArrayToUpdate)
                // passing selected address details to prefill form
                FillDetails(flattenData.usersPermissionsUser.addresses);
            },
        });
    }

    const [updateProfile] = useMutation(UPDATE_USER_PROFILE_DATA, {
        onCompleted: (r: any) => { props.callback(); },
    });

    const [updateAddress] = useMutation(UPDATE_ADDRESS_DATA, {
        onCompleted: (r: any) => { props.callback();},
    });

    const [createAddress, { error }] = useMutation(CREATE_ADDRESS, {
        onCompleted: (r: any) => {
            modalTrigger.next(false);
            props.callback();

            // concatenate previously stored address ids with currently added address id
            let contatenatedAddressIdArray = addressData !== null ? addressData.concat([r.createAddress.data.id]) : [r.createAddress.data.id];

            updateProfile({
                variables: {
                    id: auth.userid,
                    data: {
                        addresses: contatenatedAddressIdArray
                    },
                },
            });
        },
    });

    if (error) {
        console.log("Oops! Error occured");
    }

    // modal trigger
    const modalTrigger = new Subject();

    useImperativeHandle(ref, () => ({
        TriggerForm: (msg: Operation) => {
            setOperation(msg);
                modalTrigger.next(true);
        },
    }));

    //Prefill details for form
    async function FillDetails(data: any) {
        let details: any = {};

        let selectedAddress = await data && data.length ? data.filter((currValue: any) => currValue.id === operation.id) : null ;
        
        details.address1 = selectedAddress && selectedAddress.length ? selectedAddress[0].address1 : '';
        details.address2 = selectedAddress && selectedAddress.length ? selectedAddress[0].address2 : '';
        details.city = selectedAddress && selectedAddress.length ? selectedAddress[0].city : '';
        details.country = selectedAddress && selectedAddress.length ? selectedAddress[0].country : '';
        details.state = selectedAddress && selectedAddress.length ? selectedAddress[0].state : '';
        details.zipcode = selectedAddress && selectedAddress.length ? selectedAddress[0].zipcode : '';
        details.type_address = selectedAddress && selectedAddress.length ? selectedAddress[0].type_address : '';
        details.House_Number = selectedAddress && selectedAddress.length ? selectedAddress[0].House_Number : '';
        details.Title = selectedAddress && selectedAddress.length ? selectedAddress[0].Title : '';

        setAddressDetails(details);

        //if message exists - show form only for edit and view
        if (['edit'].indexOf(operation.type) > -1)
            modalTrigger.next(true);
        else
            OnSubmit(null);
    }

    // create address function
    function CreateUserAddress(frm: any) {
        createAddress({
            variables: {
                data: {
                    address1: frm.address1,
                    address2: frm.address2,
                    city: frm.city,
                    country: frm.country,
                    state: frm.state,
                    zipcode: frm.zipcode,
                    type_address: frm.type_address,
                    House_Number: frm.House_Number,
                    Title: frm.Title
                }
            },
        });
    }

    // update address function
    function UpdateUserAddress(frm: any) {
        updateAddress({
            variables: {
                id: operation.id,
                data: {
                    address1: frm.address1,
                    address2: frm.address2,
                    city: frm.city,
                    country: frm.country,
                    state: frm.state,
                    zipcode: frm.zipcode,
                    type_address: frm.type_address,
                    House_Number: frm.House_Number,
                    Title: frm.Title
                }
            },
        });
        console.log('id inside update address function', operation.id)
        
    }

    // submit function
    function OnSubmit(frm: any) {
        console.log(operation.type)
        switch (operation.type) {
            case "create":
                CreateUserAddress(frm);
                break;
            case 'edit':
                UpdateUserAddress(frm);
                console.log('edit', frm);
                break;
        }
    }

    FetchData();

    return (
        <ModalView
            name={operation.type === 'create' ? "Create New Address" : "Edit Address Details"}
            isStepper={false}
            formUISchema={schema}
            formSchema={addressJson}
            showing={operation.modal_status}
            formSubmit={(frm: any) => {
                OnSubmit(frm);
            }}
            widgets={widgets}
            modalTrigger={modalTrigger}
            formData={ addressDetails }
        />
    );
}

export default React.forwardRef(CreateAddress);
