import React, {useContext, useState} from 'react';
import {Container, Row, Col} from "react-bootstrap";
import { ImageCaptions } from "./dashboard-data/data";
import {Link} from 'react-router-dom';
import AuthContext from "../../context/auth-context";
import {GET_USER_ORGANIZATIONS} from './queries';
import { flattenObj } from '../../components/utils/responseFlatten';
import { useQuery } from '@apollo/client';

export default function MainLobby() {

    const auth = useContext(AuthContext);

    const [organizations, setOrganizations] = useState([]);

    useQuery(GET_USER_ORGANIZATIONS, {variables: {id: auth.userid}, onCompleted: (data: any) => {
        const flattendData = flattenObj({...data});
        setOrganizations(flattendData.usersPermissionsUsers[0].organizations);
    }});

    return (
        <>
        <Container fluid style={{overflow: 'hidden'}}>
            <Row className="vh-100">
                {ImageCaptions.map((data) => ( 
                    <Col sm key={data.id} className="d-flex justify-content-center align-items-center" style={{background: `${data.color}`}}>
                        <Link to={data.link}>
                            <img style={{width: data.imageWidth}} src={data.image} alt=""/>
                        </Link>
                    </Col>               
                ))}
                {organizations.length > 0 && <Col sm key={'asdfasdfa'}>
                    {organizations.map((data: any) => {
                        return (
                            <Row style={{background: `#${Math.floor(Math.random()*16777215).toString(16)}`, height: `${100/organizations.length}vh`}}>
                                <Col sm className="d-flex justify-content-center align-items-center">
                                    <div className="flex flex-row">
                                        <div className="text-center">
                                        <Link to={'/lobby'}>
                                            <img style={{width: '40px'}} src='/assets/my-org.svg' alt=""/>
                                        </Link>{' '}    
                                        </div>
                                        <div className="text-center mt-2">
                                            <span><b>{data.Organization_Name}</b></span>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        )
                    })}         
                </Col>  }   
            </Row>
                
        </Container>
        </>
    )
}
