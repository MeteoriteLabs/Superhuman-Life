import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { gql, useQuery } from '@apollo/client';
import { flattenObj } from '../../components/utils/responseFlatten';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const Number: React.FC<{ value: string; onChange: (args: string) => void }> = (props) => {
    const [userNumber, setUserNumber] = useState<string>(props.value);
    const [user, setUser] = useState<{ id: string; email: string }[]>([]);

    const FETCH_USER = gql`
        query fetchUsersNumber($num: String) {
            usersPermissionsUsers(filters: { Phone_Number: { eq: $num } }) {
                data {
                    id
                    attributes {
                        Phone_Number
                    }
                }
            }
        }
    `;

    useQuery(FETCH_USER, {
        variables: { num: userNumber },
        skip: userNumber === undefined,
        onCompleted: loadData
    });

    function loadData(data) {
        const flattenedData = flattenObj({ ...data });
        setUser(
            [...flattenedData.usersPermissionsUsers].map((user) => {
                return {
                    id: user.id,
                    email: user.Phone_Number
                };
            })
        );
    }

    props.onChange(userNumber);

    return (
        <div>
            <Form.Group controlId="">
                <Form.Label>Contact</Form.Label>
                <PhoneInput
                    country={'in'}
                    onlyCountries={['in']}
                    value={userNumber}
                    onChange={(phone) => setUserNumber(phone)}
                />

                {userNumber && user.length ? (
                    <span className="invalidNumber" style={{ fontSize: '13px', color: 'red' }}>
                        This Phone number is already in use try another.
                    </span>
                ) : (
                    ''
                )}
            </Form.Group>
        </div>
    );
};

export default Number;
