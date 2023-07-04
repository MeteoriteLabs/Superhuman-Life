import React, { useContext, useState, useRef } from 'react';
import Form from '@rjsf/core';
import { widgets } from '../../profileSchema';
import { FETCH_USER_PROFILE_DATA, UPDATE_USER_PROFILE_DATA } from '../../queries/queries';
import { useMutation, useQuery } from '@apollo/client';
import AuthContext from '../../../../context/auth-context';
import { flattenObj } from '../../../../components/utils/responseFlatten';
import Toaster from '../../../../components/Toaster';
import { Col } from 'react-bootstrap';
import UploadImageToS3WithNativeSdk, {
    UploadImageToS3WithNativeSdkProps
} from '../../../../components/upload/upload';

interface AccountVerificationDetail {
    Verification_ID: string;
}

const SocialAccount: React.FC = () => {
    const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
    const formRef = useRef<any>(null);
    const accountVerificationJson: {
        [name: string]: any;
    } = require('./AccountVerification.json');
    const auth = useContext(AuthContext);
    const [webpageDetails, setWebPageDetails] = useState<AccountVerificationDetail>(
        {} as AccountVerificationDetail
    );

    const schema: any = {
        Verification_ID: {
            'ui:widget': (props: UploadImageToS3WithNativeSdkProps) => (
                <UploadImageToS3WithNativeSdk
                    value={props.value}
                    onChange={(event: string) => {
                        props.onChange(event);
                    }}
                    allowImage={true}
                    allowVideo={false}
                    removePicture={() => {
                        updateProfile({
                            variables: {
                                id: auth.userid,
                                data: {
                                    Verification_ID: null
                                }
                            }
                        });
                    }}
                />
            ),
            'ui:help': 'Upload Verification ID photo'
        }
    };

    const fetch = useQuery(FETCH_USER_PROFILE_DATA, {
        variables: { id: auth.userid },
        onCompleted: (r: any) => {
            const flattenData = flattenObj({ ...r });
            FillDetails(flattenData.usersPermissionsUser);
        }
    });

    const [updateProfile] = useMutation(UPDATE_USER_PROFILE_DATA, {
        onCompleted: () => {
            setIsFormSubmitted(!isFormSubmitted);
            fetch.refetch();
        },
        refetchQueries: [FETCH_USER_PROFILE_DATA]
    });

    function updateVerificationDetails(frm: any) {
        updateProfile({
            variables: {
                id: auth.userid,
                data: {
                    Verification_ID:
                        frm.formData.Verification_ID && frm.formData.Verification_ID !== ''
                            ? frm.formData.Verification_ID
                            : null
                }
            }
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
                widgets={widgets as any}
                onSubmit={(frm: any) => {
                    OnSubmit(frm);
                }}
                showErrorList={false}
            />
            {/* success toaster notification */}
            {isFormSubmitted ? (
                <Toaster
                    handleCallback={() => setIsFormSubmitted(!isFormSubmitted)}
                    type="success"
                    msg="Verification document has been uploaded"
                />
            ) : null}
        </Col>
    );
};

export default SocialAccount;
