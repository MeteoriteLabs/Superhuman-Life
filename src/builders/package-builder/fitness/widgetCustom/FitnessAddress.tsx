import { useQuery } from '@apollo/client'
import { Fragment, useState, useContext } from 'react';
import { Button } from 'react-bootstrap';
import { flattenObj } from '../../../../components/utils/responseFlatten';
import { GET_ADDRESS } from '../graphQL/queries';
import AddFitnessAddressModal from './AddFitnessAddressModal';
import authContext from '../../../../context/auth-context';

export default function FitnessAddress(props) {

    const auth = useContext(authContext);
    const { widgetProps, actionType } = props;

    const [addressModal, setAddressModal] = useState(false);
    const [addressDetails, setAddressDetails] = useState<any>([]);


    const addressQuery= useQuery(GET_ADDRESS, {variables: {userId: auth.userid}, onCompleted: (data: any) => {
        const flattedData = flattenObj({...data});
        setAddressDetails(flattedData.addresses);
    }});
    // console.log("🚀 ~ file: FitnessAddress.tsx ~ line 11 ~ FitnessAddress ~ data", data)


    // if (loading) return <p>...loading</p>

    const handleChange = (e) => {
        widgetProps.onChange(e.target.value)
    }

    function handleCallback(){
        addressQuery.refetch();
    }


    return <Fragment>

        <label>{widgetProps.label}</label>
        {addressDetails?.map((item: any, index: any) => {
            return <div key={index}>
                <label className='ml-3'>
                    <input type="radio"
                        disabled={actionType === "view" ? true : false}
                        checked={widgetProps.value === item.id}
                        id={item.id} name='address'
                        value={item.id}
                        onChange={(e) => handleChange(e)} />
                    <span className='ml-3'>{item.address1} {item.address2} {item.city} {item.state} {item.country}</span>
                </label>
            </div>
        })}

        <Button variant='outline-info' onClick={() => {setAddressModal(true)}}>+ New</Button>

        <AddFitnessAddressModal
        show={addressModal}
        onHide={() => {setAddressModal(false); handleCallback()}}
        />

    </Fragment>

}
