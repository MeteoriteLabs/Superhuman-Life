import { useQuery } from '@apollo/client'
import React, { Fragment, useState, useContext } from 'react'
import { Button } from 'react-bootstrap'
import { flattenObj } from '../../../../components/utils/responseFlatten'
import { GET_ADDRESS } from '../graphQL/queries'
import AddFitnessAddressModal from '../../../../components/customWidgets/AddFitnessAddressModal'
import authContext from '../../../../context/auth-context'

const FitnessAddress: React.FC<{ widgetProps: any; actionType: any; PTProps?: any }> = (props) => {
    const auth = useContext(authContext)
    const [addressModal, setAddressModal] = useState<boolean>(false)
    const [addressDetails, setAddressDetails] = useState<any>([])

    const addressQuery = useQuery(GET_ADDRESS, {
        variables: { userId: auth.userid },
        onCompleted: (data: any) => {
            const flattedData = flattenObj({ ...data })
            setAddressDetails(flattedData.addresses)
        }
    })

    const handleChange = (e) => {
        props.widgetProps.onChange(e.target.value)
    }

    function handleCallback() {
        addressQuery.refetch()
    }

    return (
        <Fragment>
            <label>{props.widgetProps.label}</label>
            {addressDetails?.map((item: any, index: any) => {
                return (
                    <div key={index}>
                        <label className="ml-3">
                            <input
                                type="radio"
                                disabled={props.actionType === 'view' ? true : false}
                                checked={props.widgetProps.value === item.id}
                                id={item.id}
                                name="address"
                                value={item.id}
                                onChange={(e) => handleChange(e)}
                            />
                            <span className="ml-3">
                                {item.address1} {item.address2} {item.city} {item.state}{' '}
                                {item.country}
                            </span>
                        </label>
                    </div>
                )
            })}

            <Button
                variant="outline-info"
                onClick={() => {
                    setAddressModal(true)
                }}
            >
                + New
            </Button>

            <AddFitnessAddressModal
                show={addressModal}
                onHide={() => {
                    setAddressModal(false)
                    handleCallback()
                }}
            />
        </Fragment>
    )
}

export default FitnessAddress
