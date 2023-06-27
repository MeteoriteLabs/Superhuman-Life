import React, { useContext, useImperativeHandle, useState, useEffect } from 'react';
import { useMutation, useQuery, useLazyQuery } from '@apollo/client';
import ModalView from '../../components/modal';
import StatusModal from '../../components/StatusModal/StatusModal';
import AuthContext from '../../context/auth-context';
import { Subject } from 'rxjs';
import {
    widgets,
    UploadImageToS3WithNativeSdkComponent,
    UploadVideoToS3WithNativeSdkComponent
} from './webpageSchema';
import {
    CREATE_WEBPAGE_DETAILS,
    FETCH_WEBSITE_DATA,
    FETCH_TEMPLATE_SCHEMA_FORM,
    UPDATE_WEBSITE_DATA
} from './queries';

interface Operation {
    id: string;
    type: 'create' | 'edit' | 'view' | 'toggle-status' | 'delete' | 'select';
    current_status: boolean;
    template_id: string;
}

interface WebsiteData {
    users_permissions_user: string;
    form_data: unknown;
    website_template: string;
}

const CreateWebpageDetails = (props: any, ref: any) => {
    const auth = useContext(AuthContext);
    const [webpageDetails, setWebPageDetails] = useState<any>({});
    const [schemaData, setSchemaData] = useState<any>(null);
    const [formJsonData, setFormJsonData] = useState<any>(null);
    const [stepperValues, setStepperValues] = useState<any>([]);
    const [websiteTemplateId, setWebsiteTemplateId] = useState<string>('');
    const [operation, setOperation] = useState<Operation>({} as Operation);
    const [websiteDataRecordId, setWebsiteDataRecordId] = useState<any>();
    const [name, setName] = useState<string>('Webpage Details');

    const { templateId, newTemplateId } = props;

    useEffect(() => {
        fetchData();
    }, [newTemplateId]);

    useEffect(() => {
        fetchTemplate();
    }, []);

    const modalTrigger = new Subject();

    useImperativeHandle(ref, () => ({
        TriggerForm: (msg: Operation) => {
            setOperation(msg);

            fetchTemplate();

            if (msg && !msg.id) modalTrigger.next(true);
        }
    }));

    useQuery(FETCH_WEBSITE_DATA, {
        variables: { id: auth.userid },
        fetchPolicy: 'network-only',
        onCompleted: (r: any) => {
            FillDetails(r);

            if (r.websiteData[0]) {
                setSchemaData(replaceSchema({ ...r.websiteData[0].website_template.schema_json }));
                setStepperValues(r.websiteData[0].website_template.Stepper_Title);
                setFormJsonData(r.websiteData[0].website_template.form_json);
                setWebsiteDataRecordId(r.websiteData[0].id);
                setWebsiteTemplateId(r.websiteData[0].website_template.id);
            }
        }
    });

    const [fetchData] = useLazyQuery(FETCH_WEBSITE_DATA, {
        variables: { id: auth.userid },
        fetchPolicy: 'network-only',
        onCompleted: (r: any) => {
            FillDetails(r);
            if (r.websiteData[0]) {
                setSchemaData(replaceSchema({ ...r.websiteData[0].website_template.schema_json }));
                setWebsiteTemplateId(r.websiteData[0].website_template.id);
                setStepperValues(r.websiteData[0].website_template.Stepper_Title);
                setFormJsonData(r.websiteData[0].website_template.form_json);
                setWebsiteDataRecordId(r.websiteData[0].id);
            } else {
                return;
            }
        }
    });

    const [fetchTemplate] = useLazyQuery(FETCH_TEMPLATE_SCHEMA_FORM, {
        variables: { id: templateId ? templateId : websiteTemplateId },
        fetchPolicy: 'network-only',
        onCompleted: (r: any) => {
            setSchemaData(replaceSchema({ ...r.websiteTemplate.schema_json }));
            setFormJsonData(r.websiteTemplate.form_json);
            setStepperValues(r.websiteTemplate.Stepper_Title);
        }
    });

    function replaceSchema(schema1) {
        const schema = {};
        const keys = Object.keys(schema1);

        if (keys.length) {
            keys.forEach((key) => {
                if (typeof schema1[key] == 'object') {
                    schema[key] = replaceSchema({ ...schema1[key] });
                } else {
                    if (key === 'ui:widget' && schema1[key] === 'uploadImageToS3WithNativeSdk') {
                        schema[key] = UploadImageToS3WithNativeSdkComponent;
                    } else if (
                        key === 'ui:widget' &&
                        schema1[key] === 'uploadVideoToS3WithNativeSdkComponent'
                    ) {
                        schema[key] = UploadVideoToS3WithNativeSdkComponent;
                    } else {
                        schema[key] = schema1[key];
                    }
                }
            });
        }

        return schema;
    } //end function replaceSchema

    const [createDetails] = useMutation(CREATE_WEBPAGE_DETAILS, {
        onCompleted: (r: any) => {
            modalTrigger.next(false);
        }
    });

    const [updateDetails] = useMutation(UPDATE_WEBSITE_DATA, {
        onCompleted: () => {
            modalTrigger.next(false);
        },
        refetchQueries: [{ query: FETCH_WEBSITE_DATA, variables: { id: auth.userid } }]
    });

    function FillDetails(data: any) {
        if (data.websiteData.length) {
            const msg = { ...data.websiteData[0].form_data.data };
            msg.website_template = data.websiteData[0].website_template.id;

            setWebPageDetails(msg);
        }

        //if message exists - show form only for edit and view
        if (['edit', 'view'].indexOf(operation.type) > -1) modalTrigger.next(true);
        else OnSubmit(null);
    }

    function CreateWebpage(data: any) {
        createDetails({
            variables: {
                user: data.users_permissions_user,
                template_id: templateId,
                frm: { data: data.form_data }
            }
        });
    }

    function EditWebpage(data: any) {
        updateDetails({
            variables: {
                record_id: websiteDataRecordId,
                user: data.users_permissions_user,
                template_id: templateId ? templateId : data.website_template,
                frm: { data: data.form_data }
            }
        });
    }

    function ViewWebpage(frm: any) {
        console.log('view message');
    }

    // eslint-disable-next-line
    function DeleteWebpage(id: any) {
        console.log('delete message');
        // deleteExercise({ variables: { id: id }});
    }

    // eslint-disable-next-line
    function OnSubmit(frm: any) {
        //bind user id

        const data: WebsiteData = {
            users_permissions_user: auth.userid,
            form_data: frm,
            website_template: frm ? frm.website_template : ''
        };

        if (frm) frm.users_permissions_user = auth.userid;

        switch (operation.type) {
            case 'create':
                CreateWebpage(data);
                break;
            case 'edit':
                EditWebpage(data);
                break;
            case 'view':
                {
                    setName('View');
                }
                ViewWebpage(frm);
                break;
        }
    }

    return (
        <>
            {schemaData && formJsonData && (
                <ModalView
                    name={name}
                    isStepper={true}
                    stepperValues={stepperValues}
                    formUISchema={schemaData}
                    formSchema={formJsonData}
                    formSubmit={
                        name === 'View'
                            ? () => {
                                  modalTrigger.next(false);
                              }
                            : // eslint-disable-next-line
                              (frm: any) => {
                                  OnSubmit(frm);
                              }
                    }
                    formData={webpageDetails}
                    widgets={widgets}
                    modalTrigger={modalTrigger}
                />
            )}

            {operation.type === 'delete' && (
                <StatusModal
                    show={true}
                    onHide={() => {
                        true;
                    }}
                    modalTitle="Delete"
                    // EventConnectedDetails={webpageDetails}
                    // ExistingEventId={operation.id}
                    modalBody="Do you want to delete this message?"
                    buttonLeft="Cancel"
                    buttonRight="Yes"
                    onClick={() => {
                        DeleteWebpage(operation.id);
                    }}
                />
            )}
        </>
    );
};

export default React.forwardRef(CreateWebpageDetails);
