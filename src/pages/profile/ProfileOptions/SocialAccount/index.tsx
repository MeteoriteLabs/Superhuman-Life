import { useState, useContext, useRef } from 'react';
import Form from "@rjsf/core";
import { FETCH_USER_PROFILE_DATA, UPDATE_USER_PROFILE_DATA } from "../../queries/queries";
import AuthContext from "../../../../context/auth-context";
import { useMutation, useQuery } from "@apollo/client";
import { flattenObj } from "../../../../components/utils/responseFlatten";
import Toaster from '../../../../components/Toaster';
import { Col } from 'react-bootstrap';
import { schema } from './SocialAccountSchema';
import { urlCustomFormats, urlTransformErrors } from '../../../../components/utils/ValidationPatterns';

interface SocialDetails {
    instagram_url: string;
    Facebook_URL: string;
    Youtube_URL: string;
    LinkedIn_URL: string;
    Clubhouse_URL: string;
    Twitter_URL: string;
}

export default function SocialAccount() {
    let [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
    const formRef = useRef<any>(null);
    const socialAccountJson: { [name: string]: any } = require("./SocialAccount.json");
    const auth = useContext(AuthContext);
    const [webpageDetails, setWebPageDetails] = useState<SocialDetails>({} as SocialDetails);

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
        return <Toaster heading="Failed" textColor="text-danger" headingCSS="mr-auto text-danger" msg="Social account details has not been updated" />;
    }

    function updateSocialAccountDetails(frm: any) {
        updateProfile({
            variables: {
                id: auth.userid,
                data: {
                    instagram_url: frm.formData.instagram_url && frm.formData.instagram_url !== '' ? frm.formData.instagram_url : null,
                    Facebook_URL: frm.formData.Facebook_URL && frm.formData.Facebook_URL !== '' ? frm.formData.Facebook_URL : null,
                    Youtube_URL: frm.formData.Youtube_URL && frm.formData.Youtube_URL !== '' ? frm.formData.Youtube_URL : null,
                    LinkedIn_URL: frm.formData.LinkedIn_URL && frm.formData.LinkedIn_URL !== '' ? frm.formData.LinkedIn_URL : null,
                    Clubhouse_URL: frm.formData.Clubhouse_URL && frm.formData.Clubhouse_URL !== '' ? frm.formData.Clubhouse_URL : null,
                    Twitter_URL: frm.formData.Twitter_URL && frm.formData.Twitter_URL !== '' ? frm.formData.Twitter_URL : null
                },
            },
        });
    }

    function OnSubmit(frm: any) {
        updateSocialAccountDetails(frm);
    }

    //fillDetails
    function FillDetails(data: any) {
        if (data) {
            setWebPageDetails({ ...data });
        }
    }

    return (
        <Col md={{ span: 8, offset: 2 }} className="pb-3">

            {/* Social Account details form */}
            <Form
                ref={formRef}
                schema={socialAccountJson}
                formData={webpageDetails}
                onSubmit={(frm: any) => { OnSubmit(frm); }}
                showErrorList={false}
                uiSchema={schema}
                customFormats={urlCustomFormats}
                transformErrors={urlTransformErrors}
            />

            {/* success toaster notification */}
            {isFormSubmitted ?
                <Toaster handleCallback={() => setIsFormSubmitted(!isFormSubmitted)} heading="Success" textColor="text-success" headingCSS="mr-auto text-success" msg="Social account details has been updated" />
                : null
            }

        </Col>
    )
}
