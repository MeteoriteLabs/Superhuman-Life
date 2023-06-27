import { useContext, useState } from 'react';
import { NavDropdown } from 'react-bootstrap';
import authContext from '../../../../context/auth-context';
import { useQuery } from '@apollo/client';
import { FETCH_USER_PROFILE_DATA } from '../../../../pages/profile/queries/queries';
import DisplayImage from '../../../../components/DisplayImage/index';
import './ProfileOption.css';

export function ProfileOption() {
    const auth = useContext(authContext);
    const [profileData, setProfileData] = useState<any>({});

    useQuery(FETCH_USER_PROFILE_DATA, {
        variables: { id: auth.userid },
        onCompleted: (r: any) => {
            setProfileData(r.usersPermissionsUser.data.attributes);
        }
    });

    return (
        <NavDropdown
            alignRight
            title={
                <DisplayImage
                    imageName={'Photo_ID' in profileData ? profileData.Photo_ID : null}
                    defaultImageUrl="assets/image_placeholder.svg"
                    imageCSS="rounded-circle display_pic text-center img-fluid"
                />
            }
            id="collasible-nav-dropdown"
            className="position-static"
        >
            <NavDropdown.Item style={{ textDecoration: 'underline', fontWeight: 'bold' }}>
                Hey there!
            </NavDropdown.Item>

            <NavDropdown.Item
                href="/profile"
                style={{ backgroundColor: '#D9D9D9', fontWeight: 'bold' }}
            >
                My Profile
            </NavDropdown.Item>
            <NavDropdown.Item
                href="/settings"
                style={{ backgroundColor: '#D9D9D9', fontWeight: 'bold' }}
            >
                Settings
            </NavDropdown.Item>
            <NavDropdown.Item
                style={{ backgroundColor: '#8B0000', fontWeight: 'bold', color: 'white' }}
                onClick={() => auth.logout()}
            >
                Logout
            </NavDropdown.Item>
        </NavDropdown>
    );
}
