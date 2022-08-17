import React, { useContext, useState, useRef} from 'react';
import { Container, Col, Row, ProgressBar } from "react-bootstrap";
import AuthContext from "../../../../context/auth-context";
import { useQuery } from "@apollo/client";
import { FETCH_USER_PROFILE_DATA } from "../../queries/queries";
import ChangePasswordPage from '../../../changePassword/changePassword.json';
import DisplayImage from '../../../../components/DisplayImage/index';
import UploadImageToS3WithNativeSdk from '../../../../components/upload/upload';

export default function ProfileCard() {
    const auth = useContext(AuthContext);
    const [key, setKey] = useState("profile");
    const editProfileComponent = useRef<any>(null);
    const [profileData, setProfileData] = useState<any>({});

    useQuery(FETCH_USER_PROFILE_DATA, {
        variables: { id: auth.userid },
        onCompleted: (r: any) => {
            setProfileData(r.usersPermissionsUser.data.attributes);
        },
    });
    let now = 60;
    if(profileData) {
        console.log('photo id', profileData.Photo_ID);
    }
    return (
        <>
            {/* <UploadImageToS3WithNativeSdk/> */}
            <Container className="justify-content-center w-75 rounded ">
                <Container className="bg-dark w-75 rounded">
                    <Row className="justify-content-end p-3"><img src="assets/profile_icons/share.svg" alt="share" height="20" /></Row>
                    <Row>
                        <DisplayImage/>

                        <Col>
                            <Row className="text-white"><h3>{profileData
                                ? `${profileData.First_Name} ${profileData.Last_Name}`
                                : "Full Name"}</h3></Row>
                            <Row className="text-white"><h5>Designation</h5></Row>
                            <Row className="text-white">"Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Row>
                        </Col>
                    </Row>

                </Container>
                <Container className="justify-content-center w-75 pt-3 shadow-lg rounded">
                    <Row className="p-2 ml-3">
                        <Col><img src="assets/profile_icons/telephone.svg" alt="phone" className='pr-2' /> {profileData
                                ? `${profileData.Phone_Number}`
                                : `${null}`}</Col>
                        <Col><img src="assets/profile_icons/website.svg" alt="website" className='pr-2' /> www.abcdefg.com</Col>
                    </Row>
                    <Row className="p-2 ml-3">
                        <Col><img src="assets/profile_icons/email.svg" alt="email" className='pr-2' /> www.abcdefg.com</Col>
                        <Col><img src="assets/profile_icons/location.svg" alt="location" className='pr-2' /> Bengalore</Col>
                    </Row>
                </Container>
            </Container>
            <Container className='d-flex justify-content-center'>
                <ProgressBar className="mt-5 w-75" variant="success" now={now} label={`${now}%`} />
            </Container>
        </>
    )
}
