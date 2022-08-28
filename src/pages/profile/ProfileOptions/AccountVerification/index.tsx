import { useContext, useState, useRef } from "react";
import Form from "@rjsf/core";
import { schema, widgets } from "../../profileSchema";
import { FETCH_USER_PROFILE_DATA, UPDATE_USER_PROFILE_DATA } from "../../queries/queries";
import { useMutation, useQuery } from "@apollo/client";
import AuthContext from "../../../../context/auth-context";
import { flattenObj } from "../../../../components/utils/responseFlatten";
import Toaster from '../../../../components/Toaster';
import { Col } from 'react-bootstrap';

export default function SocialAccount() {
    let [isFormSubmitted, setIsFormSubmitted] = useState(false);
    let [isFormSubmissionFailed, setIsFormSubmissionFailed] = useState(false);
    const formRef = useRef<any>(null);
    const accountVerificationJson: { [name: string]: any } = require("./AccountVerification.json");
    const auth = useContext(AuthContext);
    const [webpageDetails, setWebPageDetails] = useState<any>({});
    const [profileData, setProfileData] = useState<any>();

    useQuery(FETCH_USER_PROFILE_DATA, {
        variables: { id: auth.userid },
        onCompleted: (r: any) => {
            const flattenData = flattenObj({ ...r });
            FillDetails(flattenData.usersPermissionsUser);
        },
    });

    const [updateProfile, { error }] = useMutation(UPDATE_USER_PROFILE_DATA, {
        onCompleted: (r: any) => { setIsFormSubmitted(!isFormSubmitted); },
    });

    if (error) {
        setIsFormSubmissionFailed(!isFormSubmissionFailed);
    }

    function updateVerificationDetails(frm: any) {
        updateProfile({
            variables: {
                id: auth.userid,
                data: profileData ? profileData : {
                    Verification_ID: frm.formData.Verification_ID,
                },
            },
        });
    }

    //fillDetails
    function FillDetails(data: any) {
        if (data) {
            setWebPageDetails({ ...data });
        }
    }

    function OnSubmit(frm: any) {
        setProfileData(frm);
        updateVerificationDetails(frm);
    }

    return (
        <Col md={{span:8, offset: 2}}>
            <Form
                uiSchema={schema}
                schema={accountVerificationJson}
                ref={formRef}
                formData={webpageDetails}
                widgets={widgets}
                onSubmit={(frm: any) => { OnSubmit(frm); }}
            />

            {/* success toaster notification */}
            {isFormSubmitted ?
                <Toaster heading="Success" textColor="text-success" headingCSS="mr-auto text-success" msg="Basic Profile details has been updated" />
                : null}

            {/* failure toaster notification */}
            {isFormSubmissionFailed ?
                <Toaster heading="Failed" textColor="text-danger" headingCSS="mr-auto text-danger" msg="Basic Profile details has not been updated" />
                : null}
        </Col>
    )
}
