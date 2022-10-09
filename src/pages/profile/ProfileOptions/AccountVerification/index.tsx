import { useContext, useState, useRef } from "react";
import Form from "@rjsf/core";
import { widgets } from "../../profileSchema";
import { FETCH_USER_PROFILE_DATA, UPDATE_USER_PROFILE_DATA } from "../../queries/queries";
import { useMutation, useQuery } from "@apollo/client";
import AuthContext from "../../../../context/auth-context";
import { flattenObj } from "../../../../components/utils/responseFlatten";
import Toaster from '../../../../components/Toaster';
import { Col } from 'react-bootstrap';
import UploadImageToS3WithNativeSdk from "../../../../components/upload/upload";

interface AccountVerificationDetail {
    Verification_ID?: string
}

// initial object of type AccountVerificationDetail definition
let initialAccountVerificationState: AccountVerificationDetail = {
    Verification_ID: ''
}

export default function SocialAccount() {
    let [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
    const formRef = useRef<any>(null);
    const accountVerificationJson: { [name: string]: any } = require("./AccountVerification.json");
    const auth = useContext(AuthContext);
    const [webpageDetails, setWebPageDetails] = useState<AccountVerificationDetail>(initialAccountVerificationState);

    const schema: any = {

        Verification_ID: {
            "ui:widget": (props: any) => (
                <UploadImageToS3WithNativeSdk
                    value={props.value}
                    onChange={(event: any) => {
                        props.onChange(event);
                    }}
                    allowImage={true}
                    allowVideo={false}
                    removePicture={
                        () => {
                            updateProfile({
                                variables: {
                                    id: auth.userid,
                                    data: {
                                        Verification_ID: null
                                    },
                                },
                            });
                        }
                    }
                />
            ),
            "ui:help": "Upload Verification ID photo",
        }
    };

    const fetch = useQuery(FETCH_USER_PROFILE_DATA, {
        variables: { id: auth.userid },
        onCompleted: (r: any) => {
            const flattenData = flattenObj({ ...r });
            FillDetails(flattenData.usersPermissionsUser);
        },
    });

    const [updateProfile, { error }] = useMutation(UPDATE_USER_PROFILE_DATA, {
        onCompleted: (r: any) => { setIsFormSubmitted(!isFormSubmitted); fetch.refetch(); }, refetchQueries: [FETCH_USER_PROFILE_DATA]
    });

    if (error) {
        return <Toaster heading="Failed" textColor="text-danger" headingCSS="mr-auto text-danger" msg="Verification document has not been uploaded" />;
    }

    function updateVerificationDetails(frm: any) {
        updateProfile({
            variables: {
                id: auth.userid,
                data: {
                    Verification_ID: frm.formData.Verification_ID && frm.formData.Verification_ID !== '' ? frm.formData.Verification_ID : null,
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
        updateVerificationDetails(frm);
    }

    return (
        <Col md={{ span: 8, offset: 2 }} className="pb-3">
            <Form
                uiSchema={schema}
                schema={accountVerificationJson}
                ref={formRef}
                formData={webpageDetails}
                widgets={widgets}
                onSubmit={(frm: any) => { OnSubmit(frm); }}
                showErrorList={false}
            />

            {/* success toaster notification */}
            {isFormSubmitted ?
                <Toaster handleCallback={() => { setIsFormSubmitted(!isFormSubmitted); }} heading="Success" textColor="text-success" headingCSS="mr-auto text-success" msg="Verification document has been uploaded" />
                : null}

        </Col>
    )
}
