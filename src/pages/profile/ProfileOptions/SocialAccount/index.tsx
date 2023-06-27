import React, { useState, useContext, useRef } from 'react'
import Form from '@rjsf/core'
import { FETCH_USER_PROFILE_DATA, UPDATE_USER_PROFILE_DATA } from '../../queries/queries'
import AuthContext from '../../../../context/auth-context'
import { useMutation, useQuery } from '@apollo/client'
import { flattenObj } from '../../../../components/utils/responseFlatten'
import Toaster from '../../../../components/Toaster'
import { Col } from 'react-bootstrap'
import { schema } from './SocialAccountSchema'
import {
    urlCustomFormats,
    urlTransformErrors
} from '../../../../components/utils/ValidationPatterns'

interface SocialDetails {
    instagram_url: string
    Facebook_URL: string
    Youtube_URL: string
    LinkedIn_URL: string
    Clubhouse_URL: string
    Twitter_URL: string
}

const SocialAccount: React.FC = () => {
    const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false)
    // eslint-disable-next-line
    const formRef = useRef<any>(null)
    // eslint-disable-next-line
    const socialAccountJson: any = require('./SocialAccount.json')
    const auth = useContext(AuthContext)
    const [webpageDetails, setWebPageDetails] = useState<SocialDetails>({
        instagram_url: '',
        Facebook_URL: '',
        Youtube_URL: '',
        LinkedIn_URL: '',
        Clubhouse_URL: '',
        Twitter_URL: ''
    } as SocialDetails)

    const fetch = useQuery(FETCH_USER_PROFILE_DATA, {
        variables: { id: auth.userid },
        onCompleted: (response) => {
            const flattenData = flattenObj({ ...response })
            FillDetails(flattenData.usersPermissionsUser)
        }
    })

    const [updateProfile] = useMutation(UPDATE_USER_PROFILE_DATA, {
        onCompleted: () => {
            setIsFormSubmitted(!isFormSubmitted)
            fetch.refetch()
        },
        refetchQueries: [FETCH_USER_PROFILE_DATA]
    })

    function updateSocialAccountDetails(frm) {
        updateProfile({
            variables: {
                id: auth.userid,
                data: {
                    instagram_url:
                        frm.formData.instagram_url && frm.formData.instagram_url !== ''
                            ? frm.formData.instagram_url
                            : null,
                    Facebook_URL:
                        frm.formData.Facebook_URL && frm.formData.Facebook_URL !== ''
                            ? frm.formData.Facebook_URL
                            : null,
                    Youtube_URL:
                        frm.formData.Youtube_URL && frm.formData.Youtube_URL !== ''
                            ? frm.formData.Youtube_URL
                            : null,
                    LinkedIn_URL:
                        frm.formData.LinkedIn_URL && frm.formData.LinkedIn_URL !== ''
                            ? frm.formData.LinkedIn_URL
                            : null,
                    Clubhouse_URL:
                        frm.formData.Clubhouse_URL && frm.formData.Clubhouse_URL !== ''
                            ? frm.formData.Clubhouse_URL
                            : null,
                    Twitter_URL:
                        frm.formData.Twitter_URL && frm.formData.Twitter_URL !== ''
                            ? frm.formData.Twitter_URL
                            : null
                }
            }
        })
    }

    function OnSubmit(frm) {
        updateSocialAccountDetails(frm)
    }

    //fillDetails
    function FillDetails(data) {
        if (data) {
            data.Clubhouse_URL = data.Clubhouse_URL || ''
            data.instagram_url = data.instagram_url || ''
            data.Facebook_URL = data.Facebook_URL || ''
            data.LinkedIn_URL = data.LinkedIn_URL || ''
            data.Twitter_URL = data.Twitter_URL || ''
            data.Youtube_URL = data.Youtube_URL || ''

            setWebPageDetails({ ...data })
        }
    }

    return (
        <Col md={{ span: 8, offset: 2 }} className="pb-3">
            {/* Social Account details form */}
            <Form
                ref={formRef}
                schema={socialAccountJson}
                formData={webpageDetails}
                onSubmit={(frm) => {
                    OnSubmit(frm)
                }}
                showErrorList={false}
                uiSchema={schema}
                customFormats={urlCustomFormats}
                transformErrors={urlTransformErrors}
            />

            {/* success toaster notification */}
            {isFormSubmitted ? (
                <Toaster
                    handleCallback={() => setIsFormSubmitted(!isFormSubmitted)}
                    type="success"
                    msg="Social account details has been updated"
                />
            ) : null}
        </Col>
    )
}

export default SocialAccount
