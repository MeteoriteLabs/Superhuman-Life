import { useQuery } from '@apollo/client'
import React from 'react'
import { GET_ADDRESS } from '../graphQL/queries'

export default function FitnessAddress(props) {

    const { widgetProps, actionType } = props
    const { data, loading, error } = useQuery(GET_ADDRESS);

    if (loading) return <p>...loading</p>

    // ptSchema[3].properties.address.enum = data.address.map(item => item.id)
    return <div>
        <label>{widgetProps.label}</label>
        {data.addresses?.map((item: any, index: any) => {
            return <div key={index}>
                <label className='ml-3'>
                    <input type="radio"
                        disabled={actionType === "view" ? true : false}
                        checked={widgetProps.value === item.id}
                        id={item.id} name='address'
                        value={item.id}
                        onChange={(event) => widgetProps.onChange(event.target.value)} />
                    <span className='ml-3'>{item.address1} {item.address2} {item.city} {item.state} {item.country}</span>
                </label>
            </div>
        })}
    </div>

}
