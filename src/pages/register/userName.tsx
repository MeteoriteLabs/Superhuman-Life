import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { gql, useQuery } from '@apollo/client';
import { flattenObj } from '../../components/utils/responseFlatten';

const Email: React.FC<{ value: string; onChange: (args: string) => void }> = (props) => {
    const [userName, setUserName] = useState<string>(props.value);
    const [user, setUser] = useState<{ id: string; userName: string }[]>([]);

    const FETCH_USER = gql`
        query fetchUsers($uname: String) {
            usersPermissionsUsers(filters: { username: { eq: $uname } }) {
                data {
                    id
                    attributes {
                        username
                    }
                }
            }
        }
    `;

    useQuery(FETCH_USER, {
        variables: { uname: userName },
        skip: userName === undefined,
        onCompleted: loadData
    });

    function loadData(data) {
        const flattenedData = flattenObj({ ...data });
        setUser(
            [...flattenedData.usersPermissionsUsers].map((user) => {
                return {
                    id: user.id,
                    userName: user.username
                };
            })
        );
    }

    props.onChange(userName);

    return (
        <div>
            <Form.Group controlId="formBasicEmail">
                <Form.Label>User name</Form.Label>
                <Form.Control
                    className={`${
                        user.length === 0
                            ? `${userName === '' || userName ? 'is-valid' : ''}`
                            : 'is-invalid invalidUname'
                    }`}
                    type="text"
                    value={userName}
                    onChange={(e) => {
                        setUserName(e.target.value);
                    }}
                    placeholder="Enter user name"
                />
                {userName !== undefined && user.length !== 0 ? (
                    <span style={{ fontSize: '13px', color: 'red' }}>
                        This userName is already taken try another.
                    </span>
                ) : (
                    ''
                )}
            </Form.Group>
        </div>
    );
};

export default Email;
