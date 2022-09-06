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
            <Container className="justify-content-center rounded shadow-lg">

                {/* share option */}
                <Row className="justify-content-end p-2" style={{ backgroundColor: "#000" }}><img src="assets/profile_icons/share.svg" alt="share" height="15" className='icons' /></Row>

                {/* user details */}
                <Row lg={12} sm={12} style={{ backgroundColor: "#000" }} className="pb-3">

                    {/* profile picture */}
                    <Col className="pb-1" md={{ span: 2, offset: 1 }} sm={12}>
                        <DisplayImage imageName={profileData ? profileData.Photo_ID : null} defaultImageUrl="assets/image_placeholder.svg" imageCSS="rounded-circle profile_picture text-center img-fluid" />
                    </Col>

                    {/* user information */}
                    <Col md={{ span: 7, offset: 1}} sm={12} className="p-4">
                            <h3 className="text-white">{profileData
                            ? `${profileData.First_Name} ${profileData.Last_Name}`
                            : null}
                            </h3>
                            <h5 className="text-white">{profileData && profileData.designations && (profileData.designations.data.length > 0) ? profileData.designations.data[0].attributes.Designation_title : null}</h5>
                            <h6 className="text-white">{profileData ? profileData.About_User : null}</h6>
                    </Col>
                </Row>

                {/* user contact details */} 
                <Row className="pt-3">
                    {profileData ? <Col sm={12} lg={{ span: 3, offset: 3 }}><img src="assets/profile_icons/telephone.svg" alt="phone" className='pr-2 icons' /> {profileData.Phone_Number}</Col> : null}
                    {profileData ? <Col sm={12} lg={{ span: 2, offset: 1 }} ><img src="assets/profile_icons/website.svg" alt="website" className='pr-2 icons' />  {profileData.Website_URL} </Col> : null}
                </Row>
                <Row className="pb-3">
                    {profileData ? <Col sm={12} lg={{ span: 3, offset: 3 }} ><img src="assets/profile_icons/email.svg" alt="email" className='pr-2 icons' />  {profileData.email} </Col> : null}
                    {profileData && profileData.addresses && (profileData.addresses.data.length > 0) ? <Col sm={12} lg={{ span: 2, offset: 1 }}  ><img src="assets/profile_icons/location.svg" alt="location" className='pr-2 icons' />  {profileData.addresses.data[0].attributes.city} </Col> : null}
                </Row>
                
            </Container>
    )
}
