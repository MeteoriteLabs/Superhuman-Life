import React, { useContext, useState } from 'react';
import { Row, NavDropdown, Image } from "react-bootstrap";
import { GET_USER_ORGANIZATIONS } from '../queries';
import { flattenObj } from '../../../components/utils/responseFlatten';
import { useQuery } from '@apollo/client';
import { LobbyData } from "./LobbyData";
import { Link } from "react-router-dom";
import AuthContext from "../../../context/auth-context";
import { LobbyColors } from "../dashboard-data/colors";
import './miniLobby.css';

export const MiniLobbyComponent = () => {
  const auth = useContext(AuthContext);
  const randomColorInArray = Math.floor(Math.random() * LobbyColors.length);
  const [organizations, setOrganizations] = useState([]);

  useQuery(GET_USER_ORGANIZATIONS, {
    variables: { id: auth.userid }, onCompleted: (data: any) => {
      const flattendData = flattenObj({ ...data });
      setOrganizations(flattendData.usersPermissionsUsers[0].organizations);
    }
  });

  return (
    <NavDropdown
      title={<img
        src="/assets/navbar_icons/candyBarIcon.svg"
        className="img-responsive"
        alt="candy bar"
        style={{ height: '20px', width: '20px' }}
      />}
      id="collasible-nav-dropdown"
    >
      <NavDropdown.Item style={{ textAlign: 'center'}}>Lobby</NavDropdown.Item>
      {LobbyData.map((data, index) => (
        <NavDropdown.Item className="text-white" as={Link} to={data.link} style={{ background: `${LobbyColors[randomColorInArray + index]}`}}>
          <Row className="justify-content-between">
            <div>
              {data.image === null ? " " : <Image fluid src={data.image} style={{ width: '25px' }} />}
            </div>
            <div>
              {data.label}
            </div>
          </Row>
        </NavDropdown.Item>
      ))}
      {organizations.length > 0 && 
        organizations.map((data: any, index: number) => {
          return (
            <NavDropdown.Item key={index} style={{ background: `${LobbyColors[randomColorInArray + index + LobbyData.length]}` }}>
            <Row  className="justify-content-between" as={Link} to={'/lobby'} key={index}>
              <div className="float-left">
                <img style={{ width: '20px' }} src='/assets/miniLobby_icons/organisation.svg' alt="organisation_icon" />
              </div>
              <div className="float-right text-white">
                {data.Organization_Name}
              </div>
            </Row>
            </NavDropdown.Item>
          )
        })
      }
    </NavDropdown>
  );
};
