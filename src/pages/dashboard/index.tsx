import React, {useContext, useState} from 'react';
import {Container, Row, Col} from "react-bootstrap";
import { ImageCaptions } from "./dashboard-data/data";
import { LobbyColors } from "./dashboard-data/colors";
import {Link} from 'react-router-dom';
import AuthContext from "../../context/auth-context";
import {GET_USER_ORGANIZATIONS} from './queries';
import { flattenObj } from '../../components/utils/responseFlatten';
import { useQuery } from '@apollo/client';
import './mainLobby.css';

export default function Dashboard() {

    const auth = useContext(AuthContext);

    const [organizations, setOrganizations] = useState([]);

    useQuery(GET_USER_ORGANIZATIONS, {variables: {id: auth.userid}, onCompleted: (data: any) => {
        const flattendData = flattenObj({...data});
        setOrganizations(flattendData.usersPermissionsUsers[0].organizations);
    }});

    const totalNumberOfColors = LobbyColors.length; 
    const randomColorInArray = Math.floor(Math.random() * LobbyColors.length);

    return (
        <>

        <Container fluid className="lobby__container pt-5 mt-3"  style={{overflow: 'hidden'}}>
            <Row>
                {ImageCaptions.map((data, index) => ( 
                        <Col as={Link} to={data.link} sm key={data.id} className="d-flex justify-content-center align-items-center lobby__card" style={{background: `${LobbyColors[((randomColorInArray + index ) < totalNumberOfColors) ? (randomColorInArray + index) : index ]}`}}>
                              <img style={{width: data.imageWidth}} src={data.image} alt="icon"/>
                        </Col>
                ))}
                {organizations.length > 0 && <Col className="d-lg-block d-md-block d-sm-none d-none">
                    {organizations.map((data: any, index: number) => {
                        return (
                            <Row key={index} style={{background: `${LobbyColors[((randomColorInArray + index + ImageCaptions.length ) < totalNumberOfColors) ? (randomColorInArray + index + ImageCaptions.length ) : index ]}`, height: `${100/organizations.length}vh`}}>
                                <Col  as={Link} to={'/lobby'} key={index} sm className="d-flex justify-content-center align-items-center lobby__card">
                                    <div className="flex flex-row">
                                        <div className="text-center organisation__image">
                                            <img style={{width: '40px'}} src='/assets/lobby_images/organisation.svg' alt="organisation"/>
                                        </div>
                                        <div className="text-center mt-2 text-white">
                                            <span><b>{data.Organization_Name}</b></span>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        )
                    })}         
                </Col>  }   
                {organizations.length > 0 && <Col className="d-lg-none d-md-none d-sm-block"  key={'asdfasdfa'}>
                    {organizations.map((data: any, index: number) => {
                        return (
                            <Row key={index} style={{background: `${LobbyColors[randomColorInArray + index + ImageCaptions.length]}`}}>
                                <Col  as={Link} to={'/lobby'} key={index} sm className="d-flex justify-content-center align-items-center lobby__card">
                                    <div className="flex flex-row">
                                        <div className="text-center organisation__image">
                                            <img style={{width: '40px'}} src='/assets/lobby_images/organisation.svg' alt=""/>
                                        </div>
                                        <div className="text-center mt-2" style={{color: 'white'}}>
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
