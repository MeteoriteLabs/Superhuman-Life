import { useContext, useState } from 'react';
import { FormControl, InputGroup } from 'react-bootstrap';
import { flattenObj } from '../../../components/utils/responseFlatten';
import { useQuery } from '@apollo/client';
import AuthContext from '../../../context/auth-context';
import { FETCH_CONTACTS } from './queries';

interface GroupEmailAndPhoneProps {
    value: string;
    onChange: (data: string) => void;
}

function GroupEmailAndPhone(props: GroupEmailAndPhoneProps) {
    const [userEmail, setUserEmail] = useState<string>(props.value);
    const [userPhone, setUserPhone] = useState<string>(props.value);
    const auth = useContext(AuthContext);
    const [user, setUser] = useState<{ id: string; email: string; phone: string }[]>([]);

    props.onChange(JSON.stringify({ userEmail, userPhone }));

    useQuery(FETCH_CONTACTS, {
        variables: { id: auth.userid, email: userEmail, phone: userPhone },
        skip: userEmail === undefined && userPhone === undefined,
        onCompleted: loadData
    });

    function loadData(data: any) {
        const flattenedData = flattenObj({ ...data });
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
