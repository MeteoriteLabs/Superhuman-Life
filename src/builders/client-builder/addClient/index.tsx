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
import { useHistory } from 'react-router-dom';

const AddClient: React.FC = () => {
  const auth = useContext(AuthContext);
  const registry = utils.getDefaultRegistry();
  const defaultFileWidget = registry.widgets['FileWidget'];
  (Bootstrap4Theme as any).widgets['FileWidget'] = defaultFileWidget;
  const Form: any = withTheme(Bootstrap4Theme);
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
  const formRef = useRef<any>(null);
  const addClientJson: Record<string, unknown> = require('./addClient.json');
  const history = useHistory();

  const [createClientBooking] = useMutation(CREATE_CLIENT_BOOKING);

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
        const sessionDetails = frm.formData.offeringFilter === 'Class' ? JSON.parse(frm.formData.classBasedOfferings) : null;
        createClientBooking({
          variables: {
            data: {
              ClientUser: flattenReponse.id,
              booking_date: new Date(),
              package_duration:
                frm.formData.offeringFilter === 'Class' ? 1 : frm.formData.packageDuration,
              OfferingOwner: auth.userid,
              effective_date: moment(frm.formData.effectiveDate),
              fitnesspackages:
                frm.formData.offeringFilter === 'Class'
                  ? sessionDetails.offeringSelected
                  : frm.formData.offerings
            }
          },
          onCompleted: (response) => {
            const flattenReponse = flattenObj({ ...response.createClientBooking });
            history.push(`/summary/?id=${flattenReponse.id}`);
            if (frm.formData.offeringFilter === 'Class') {
              localStorage.setItem(
                'sessionBookingDetails',
                JSON.stringify({
                  session: sessionDetails.sessionId,
                  client: response.createClientBooking.data.id,
                  sessionDate: sessionDetails.sessionDate,
                  Session_booking_status: 'Booked',
                  session_time: sessionDetails.sessionStartTime,
                  session_end_time: sessionDetails.sessionEndTime
                })
              );
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
