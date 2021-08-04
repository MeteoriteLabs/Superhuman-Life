import { useQuery } from '@apollo/client'
import React, { Fragment } from 'react'
import { useState } from 'react'
import { GET_ADDRESS } from '../graphQL/queries'

export default function FitnessAddress(props) {

    const { widgetProps, actionType, PTProps } = props


    const { data, loading, error } = useQuery(GET_ADDRESS);


    if (loading) return <p>...loading</p>

    const handleChange = (e) => {
        widgetProps.onChange(e.target.value)
    }




    return <Fragment>

        <label>{widgetProps.label}</label>
        {data.addresses?.map((item: any, index: any) => {
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


    </Fragment>

}
