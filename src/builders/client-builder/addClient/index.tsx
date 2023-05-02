import React, { useState, useRef, useContext } from 'react';
import { schema, widgets } from './AddClientSchema';
import { CREATE_CLIENT, CREATE_CLIENT_BOOKING } from './mutation';
import { useMutation } from '@apollo/client';
import { withTheme, utils } from '@rjsf/core';
import { Theme as Bootstrap4Theme } from '@rjsf/bootstrap-4';
import { flattenObj } from '../../../components/utils/responseFlatten';
import { Col } from 'react-bootstrap';
import Toaster from '../../../components/Toaster';
import {
  phoneCustomFormats,
  phoneTransformErrors
} from '../../../components/utils/ValidationPatterns';
import AuthContext from '../../../context/auth-context';
import moment from 'moment';

const AddClient: React.FC = () => {
  const auth = useContext(AuthContext);
  const registry = utils.getDefaultRegistry();
  const defaultFileWidget = registry.widgets['FileWidget'];
  (Bootstrap4Theme as any).widgets['FileWidget'] = defaultFileWidget;
  const Form: any = withTheme(Bootstrap4Theme);
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
  const formRef = useRef<any>(null);
  const addClientJson: Record<string, unknown> = require('./addClient.json');

  const [createClientBooking] = useMutation(CREATE_CLIENT_BOOKING, {
    onCompleted: (response) => {
      const flattenReponse = flattenObj({ ...response.createClientBooking });
         window.open(`/summary/?id=${flattenReponse.id}`, "_self");
    }
  });

  const [createClient] = useMutation(CREATE_CLIENT);

  function OnSubmit(frm: any) {
    
    createClient({
      variables: {
        data: {
          email: frm.formData.email,
          First_Name: frm.formData.firstname,
          Last_Name: frm.formData.lastname,
          Phone_Number: frm.formData.phone,
          username: `${frm.formData.firstname}${frm.formData.lastname}`,
          password: `${frm.formData.phone}${frm.formData.firstname}`,
          role: '4'
        }
      },
      onCompleted: (response) => {
        const flattenReponse = flattenObj({ ...response.createUsersPermissionsUser });

        createClientBooking({
          variables: {
            data: {
              ClientUser: flattenReponse.id,
              booking_date: new Date(),
              package_duration: frm.formData.packageDuration,
              OfferingOwner: auth.userid,
              effective_date: moment(frm.formData.effectiveDate),
              fitnesspackages: frm.formData.offerings
            }
          }
        });
      }
    });
  }

  return (
    <div className="col-lg-12">
      <h2>Add Client</h2>
      <div className="pt-3">
        {/* Add Client Form */}
        <Col>
          <Form
            widgets={widgets}
            uiSchema={schema}
            schema={addClientJson}
            ref={formRef}
            onSubmit={(frm: any) => {
              OnSubmit(frm);
            }}
            showErrorList={false}
            customFormats={phoneCustomFormats}
            transformErrors={phoneTransformErrors}
          />
        </Col>
      </div>
      {/* success toaster notification */}
      {isFormSubmitted ? (
        <Toaster
          type="success"
          handleCallback={() => setIsFormSubmitted(!isFormSubmitted)}
          msg="Client has been added successfully"
        />
      ) : null}
    </div>
  );
};

export default AddClient;
