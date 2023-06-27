import React, { useState, useContext, useEffect } from 'react'
import { Typeahead } from 'react-bootstrap-typeahead'
import 'react-bootstrap-typeahead/css/Typeahead.css'
import { GET_CONTACTS, FETCH_CLIENTS } from './queries'
import { useQuery } from '@apollo/client'
import { flattenObj } from '../utils/responseFlatten'
import AuthContext from '../../context/auth-context'
import { GET_LEADS_NEW } from '../../builders/client-builder/leads/queries'

const ClientContactLeadList: React.FC<{
    value: string
    onChange: (params: string | null) => void
}> = (props) => {
    const auth = useContext(AuthContext)
    function handleReturnType(value) {
        if (typeof value === 'string') {
            return JSON.parse(value)
        } else {
            return value
        }
    }

    const [multiSelections, setMultiSelections] = useState<any[]>(
        props.value?.length > 0 ? handleReturnType(props.value) : []
    )
    const [contacts, setContacts] = useState<{ id: string; name: string; email: string }[]>([])
    const [clients, setClients] = useState<{ id: string; name: string; email: string }[]>([])
    const [leads, setLeads] = useState<{ id: string; name: string; email: string }[]>([])

    const { data: get_contacts, refetch: refetch_contacts } = useQuery(GET_CONTACTS, {
        variables: { id: Number(auth.userid) },
        onCompleted: loadData
    })

    const { data: get_clients, refetch: refetch_clients } = useQuery(FETCH_CLIENTS, {
        variables: { id: auth.userid },
        onCompleted: (data) => {
            const flattenedData = flattenObj({ ...data })

            setClients(
                [...flattenedData.clientBookings]
                    .filter((currValue) => currValue.ClientUser.length > 0)
                    .map((currValue) => {
                        return {
                            id:
                                currValue.ClientUser && currValue.ClientUser.length
                                    ? currValue.ClientUser[0].id
                                    : null,
                            name:
                                currValue.ClientUser && currValue.ClientUser.length
                                    ? currValue.ClientUser[0].username &&
                                      currValue.ClientUser[0].username
                                    : null,
                            email:
                                currValue.ClientUser && currValue.ClientUser.length
                                    ? currValue.ClientUser[0].email && currValue.ClientUser[0].email
                                    : null,
                            phone:
                                currValue.ClientUser && currValue.ClientUser.length
                                    ? currValue.ClientUser[0].Phone_Number &&
                                      currValue.ClientUser[0].Phone_Number
                                    : null
                        }
                    })
            )
        }
    })

    const { data: get_leads, refetch: refetch_leads } = useQuery(GET_LEADS_NEW, {
        variables: { id: auth.userid },
        onCompleted: (data: any) => {
            const flattenedData = flattenObj({ ...data })

            setLeads(
                [...flattenedData.websiteContactForms].map((currValue) => {
                    return {
                        id: currValue.id,
                        name:
                            currValue.Details.leadsdetails.name &&
                            currValue.Details.leadsdetails.name,
                        email:
                            currValue.Details.leadsdetails.email &&
                            currValue.Details.leadsdetails.email,
                        phone:
                            currValue.Details.leadsdetails.contact &&
                            currValue.Details.leadsdetails.contact
                    }
                })
            )
        }
    })

    function loadData(data: any) {
        const flattenedData = flattenObj({ ...data })

        setContacts(
            [...flattenedData.contacts].map((currValue) => {
                return {
                    id: currValue.id,
                    name: currValue.firstname && currValue.firstname,
                    email: currValue.email && currValue.email,
                    phone: currValue.phone && currValue.phone
                }
            })
        )
    }

    function OnChange(e) {
        const unique = [...new Map(e.map((m) => [m.id, m])).values()]
        setMultiSelections(unique)
    }

    if (multiSelections.length > 0) {
        props.onChange(JSON.stringify(multiSelections))
    } else {
        props.onChange(null)
    }

    useEffect(() => {
        refetch_leads()
        refetch_contacts()
        refetch_clients()
    }, [get_clients, get_contacts, get_leads])

    return (
        <>
            <Typeahead
                id="basic-typeahead-multiple"
                labelKey="email"
                onChange={OnChange}
                options={[...clients, ...contacts, ...leads]}
                placeholder="Choose Client by email..."
                selected={multiSelections}
            />
        </>
    )
}

export default ClientContactLeadList
