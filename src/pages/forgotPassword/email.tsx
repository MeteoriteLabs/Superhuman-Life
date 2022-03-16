import React, {useState} from 'react';
import {Form} from 'react-bootstrap';
import { gql, useQuery} from '@apollo/client';
import { flattenObj } from "../../components/utils/responseFlatten";

const Email = (props: any) => {

    const [userEmail, setUserEmail] = useState(props.value);
    const [user, setUser] = useState<any>([]);

    const FETCH_USER = gql`
     query fetchUsers($email: String) {
        usersPermissionsUsers(filters: {
            email: { eq: $email }
        }){
            data{
              id
              attributes{
                username
              }
            }
          }
     }
  `;

    useQuery(FETCH_USER, {variables: {email: userEmail}, skip: (userEmail === ""),onCompleted: loadData});

    function loadData(data: any) {
        const flattenedData = flattenObj({...data});
        setUser(
            [...flattenedData.usersPermissionsUsers].map((user) => {
                return {
                    id: user.id,
                    email: user.email
                }
            })
        );
    }

    props.onChange(userEmail);

    return (
        <div>
            <Form.Group controlId="formBasicEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control className={`${user.length === 0 ? `${userEmail === '' || userEmail === undefined ? '' : 'is-invalid invalidEmail'}` : 'is-valid'}`} type="email" value={userEmail} onChange={(e) => {setUserEmail(e.target.value)}} placeholder="" />
                {/* {user.length ===0 && <span style={{fontSize: '13px', color: 'red'}}>This is not a valid email.</span>} */}
            </Form.Group>
        </div>
    );
};

export default Email;