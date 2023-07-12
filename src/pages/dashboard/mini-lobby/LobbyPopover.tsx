import React, { useContext, useState } from 'react';
import { Row, NavDropdown, Image } from 'react-bootstrap';
import { GET_USER_ORGANIZATIONS } from '../queries';
import { flattenObj } from 'components/utils/responseFlatten';
import { useQuery } from '@apollo/client';
import { LobbyData } from './LobbyData';
import AuthContext from 'context/auth-context';
import { LobbyColors } from '../dashboard-data/colors';
import './miniLobby.css';
import { useHistory } from 'react-router-dom';

export const MiniLobbyComponent: React.FC = () => {
    const history = useHistory();
    const auth = useContext(AuthContext);
    const [organizations, setOrganizations] = useState([]);

    useQuery(GET_USER_ORGANIZATIONS, {
        variables: { id: auth.userid },
        onCompleted: (data: any) => {
            const flattendData = flattenObj({ ...data });
            setOrganizations(flattendData.usersPermissionsUsers[0].organizations);
        }
    });

    const totalNumberOfColors = LobbyColors.length;
    const randomColorInArray = Math.floor(Math.random() * LobbyColors.length);

    const handleLobbyClick = () => {
        history.push('/lobby');
    };

    return (
        <NavDropdown
            alignRight
            title={
                <img
                    src="/assets/navbar_icons/candyBarIcon.svg"
                    className="img-responsive"
                    alt="candy bar"
                    style={{ height: '20px', width: '20px' }}
                />
            }
            id="collasible-nav-dropdown"
            className="position-static"
        >
            <NavDropdown.Item
                xs={12}
                sm={12}
                style={{ textAlign: 'center' }}
                onClick={handleLobbyClick}
            >
                Lobby
            </NavDropdown.Item>
            {LobbyData.map((data, index) => (
                <NavDropdown.Item
                    className="text-white py-3"
                    key={index}
                    href={data.link}
                    style={{
                        background: `${
                            LobbyColors[
                                randomColorInArray + index < totalNumberOfColors
                                    ? randomColorInArray + index
                                    : index
                            ]
                        }`
                    }}
                >
                    <Row>
                        <div className="pr-1">
                            {data.image === null ? (
                                ' '
                            ) : (
                                <Image fluid src={data.image} style={{ width: '25px' }} />
                            )}
                        </div>
                        <div className="ml-1">{data.label}</div>
                    </Row>
                </NavDropdown.Item>
            ))}
            {organizations.length > 0 &&
                organizations.map((data: any, index: number) => {
                    return (
                        <NavDropdown.Item
                            href={'/lobby'}
                            className="py-3"
                            key={index}
                            style={{
                                background: `${
                                    LobbyColors[
                                        randomColorInArray + index + LobbyData.length <
                                        totalNumberOfColors
                                            ? randomColorInArray + index + LobbyData.length
                                            : index
                                    ]
                                }`
                            }}
                        >
                            <Row key={index}>
                                <div className="pr-1">
                                    <img
                                        style={{ width: '20px' }}
                                        src="/assets/miniLobby_icons/organisation.svg"
                                        alt="organisation_icon"
                                    />
                                </div>
                                <div className="text-white ml-1">{data.Organization_Name}</div>
                            </Row>
                        </NavDropdown.Item>
                    );
                })}
        </NavDropdown>
    );
};
