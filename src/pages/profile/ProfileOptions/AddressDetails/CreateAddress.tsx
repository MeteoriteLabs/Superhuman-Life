import React, { useImperativeHandle, useState, useContext } from "react";
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

    function FetchData() {
        useQuery(FETCH_USER_PROFILE_DATA, {
            skip: (operation.type === 'create'),
            variables: { id: auth.userid },
            onCompleted: (r: any) => {
                const flattenData = flattenObj({ ...r });

                const addressIds = flattenData.usersPermissionsUser.addresses && flattenData.usersPermissionsUser.addresses?.length ? flattenData.usersPermissionsUser.addresses.map((currentValue: any) => currentValue.id) : null;
                setAddressData(addressIds);

                let selectedAddressArrayToUpdate = r.usersPermissionsUser.data.attributes.addresses.data && r.usersPermissionsUser.data.attributes.addresses.data.length ? r.usersPermissionsUser.data.attributes.addresses.data.filter((currValue: any) => (currValue.id === operation.id)) : null;

                // passing selected address details to prefill form
                FillDetails(selectedAddressArrayToUpdate);
            },
        });
    }

    const [updateProfile] = useMutation(UPDATE_USER_PROFILE_DATA, {
        onCompleted: (r: any) => { props.callback(); },
    });

    const [updateAddress] = useMutation(UPDATE_ADDRESS_DATA, {
        onCompleted: (r: any) => { props.callback(); },
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

            if (msg && !msg.id) {
                modalTrigger.next(true);
            }
        },
    }));

    //Prefill details for form
    function FillDetails(data: any) {
        let details: any = {};

        details.address1 = data && data.length ? data[0].attributes.address1 : '';
        details.address2 = data && data.length ? data[0].attributes.address2 : '';
        details.city = data && data.length ? data[0].attributes.city : '';
        details.country = data && data.length ? data[0].attributes.country : '';
        details.state = data && data.length ? data[0].attributes.state : '';
        details.zipcode = data && data.length ? data[0].attributes.zipcode : '';
        details.type_address = data && data.length ? data[0].attributes.type_address : '';
        details.House_Number = data && data.length ? data[0].attributes.House_Number : '';
        details.Title = data && data.length ? data[0].attributes.Title : '';

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
    }

    // submit function
    function OnSubmit(frm: any) {
        switch (operation.type) {
            case "create":
                CreateUserAddress(frm);
                break;
            case 'edit':
                UpdateUserAddress(frm);
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
            formData={operation.type === 'create' ? emptyAddressState : addressDetails }
        />
    );
}

export default React.forwardRef(CreateAddress);
