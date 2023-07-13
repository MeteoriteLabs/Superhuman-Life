import React, { useContext, useState } from 'react';
import { FormControl, InputGroup } from 'react-bootstrap';
import { flattenObj } from '../../../components/utils/responseFlatten';
import { gql, useQuery } from '@apollo/client';
import AuthContext from '../../../context/auth-context';

function GroupEmailAndPhone(props: any) {
    const [userEmail, setUserEmail] = useState<string>(props.value);
    const [userPhone, setUserPhone] = useState<string>(props.value);
    const auth = useContext(AuthContext);

    const [user, setUser] = useState<{ id: string; email: string; phone: string }[]>([]);

    const FETCH_USER = gql`
        query contacts($id: ID!, $email: String, $phone: String) {
            contacts(
                filters: {
                    ownedBy: { id: { eq: $id } }
                    or: [{ phone: { eq: $phone } }, { email: { eq: $email } }]
                }
            ) {
                data {
                    id
                    attributes {
                        email
                        phone
                    }
                }
            }
        }
    `;
    props.onChange(JSON.stringify({ userEmail, userPhone }));

    useQuery(FETCH_USER, {
        variables: { id: auth.userid, email: userEmail, phone: userPhone },
        skip: userEmail === undefined && userPhone === undefined,
        onCompleted: loadData
    });

    function loadData(data: any) {
        const flattenedData = flattenObj({ ...data });
        console.log('flatten data', flattenedData);
        setUser(
            [...flattenedData.contacts].map((user) => {
                return {
                    id: user.id,
                    email: user.email,
                    phone: user.phone
                };
            })
        );
    }

    return (
        <>
            <label>Email ID</label>
            <InputGroup className="mb-1">
                <FormControl
                    type="email"
                    value={userEmail}
                    onChange={(e) => {
                        setUserEmail(e.target.value);
                    }}
                    placeholder="Enter Email ID"
                />
            </InputGroup>
            {userEmail && user.length && user.some((u) => u.email === userEmail) ? (
                <span style={{ fontSize: '13px', color: 'red' }}>This email is already taken.</span>
            ) : (
                ''
            )}
            <br />

            <label className="mt-0">Phone Number</label>
            <InputGroup className="mb-1">
                <FormControl
                    type="number"
                    value={userPhone}
                    onChange={(e) => {
                        setUserPhone(e.target.value);
                    }}
                    placeholder="Enter Phone Number"
                />
            </InputGroup>
            {userPhone && user.length && user.some((u) => u.phone === userPhone) ? (
                <span style={{ fontSize: '13px', color: 'red' }}>
                    This Phone Number is already taken.
                </span>
            ) : (
                ''
            )}
        </>
    );
}

export default GroupEmailAndPhone;
