import { useContext, useState } from 'react';
import { Container, Col, Row } from "react-bootstrap";
import AuthContext from "../../../../context/auth-context";
import { useQuery } from "@apollo/client";
import { FETCH_USER_PROFILE_DATA } from "../../queries/queries";
import DisplayImage from '../../../../components/DisplayImage/index';
import './profilecard.css';

export default function ProfileCard() {
    const auth = useContext(AuthContext);
    const [profileData, setProfileData] = useState<any>({});

    useQuery(FETCH_USER_PROFILE_DATA, {
        variables: { id: auth.userid },
        onCompleted: (r: any) => {
            setProfileData(r.usersPermissionsUser.data.attributes);
        },
    });

    return (
            <Container fluid className="justify-content-center rounded shadow-lg">

                {/* share option */}
                <Row className="justify-content-end p-3" style={{ backgroundColor: "#000" }}><img src="assets/profile_icons/share.svg" alt="share" height="15" className='icons' /></Row>

                {/* user details */}
                <Row lg={12} sm={12} style={{ backgroundColor: "#000" }} className="pb-3">

                    {/* profile picture */}
                    <Col className="pb-1" lg={4} sm={12}>
                        <DisplayImage imageName={profileData ? profileData.Photo_ID : null} defaultImageUrl="assets/image_placeholder.svg" imageCSS="rounded-circle profile_picture text-center img-fluid" />
                    </Col>

                    {/* user information */}
                    <Col className="mx-3" lg={6} sm={12}>
                        <Row className="text-white"><h3>{profileData
                            ? `${profileData.First_Name} ${profileData.Last_Name}`
                            : null}</h3></Row>
                        <Row className="text-white"><h5>{profileData && profileData.designations && (profileData.designations.data.length > 0) ? profileData.designations.data[0].attributes.Designation_title : null}</h5></Row>
                        <Row className="text-white">{profileData ? profileData.About_User : null}</Row>
                    </Col>
                </Row>

                {/* user contact details */}
                <Row>
                    {profileData ? <Col sm={12} lg={6}><img src="assets/profile_icons/telephone.svg" alt="phone" className='pr-2 icons' /> {profileData.Phone_Number}</Col> : null}
                    {profileData ? <Col sm={12} lg={6}><img src="assets/profile_icons/website.svg" alt="website" className='pr-2 icons' />  {profileData.Website_URL} </Col> : null}
                </Row>
                <Row>
                    {profileData ? <Col sm={12} lg={6}><img src="assets/profile_icons/email.svg" alt="email" className='pr-2 icons' />  {profileData.email} </Col> : null}
                    {profileData && profileData.addresses && (profileData.addresses.data.length > 0) ? <Col sm={12} lg={6}><img src="assets/profile_icons/location.svg" alt="location" className='pr-2 icons' />  {profileData.addresses.data[0].attributes.city} </Col> : null}
                </Row>

            </Container>
    )
}
