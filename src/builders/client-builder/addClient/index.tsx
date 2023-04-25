import React, { useState, useRef } from 'react';
import { schema, widgets } from './AddClientSchema';
import { CREATE_CLIENT } from './mutation';
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

const AddClient: React.FC = () => {
  const registry = utils.getDefaultRegistry();
  const defaultFileWidget = registry.widgets['FileWidget'];
  (Bootstrap4Theme as any).widgets['FileWidget'] = defaultFileWidget;
  const Form: any = withTheme(Bootstrap4Theme);
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
  const formRef = useRef<any>(null);
  const addClientJson: Record<string, unknown> = require('./addClient.json');
  const [clients, setClients] = useState<any>({});

  const createClient = useMutation(CREATE_CLIENT);

  function OnSubmit(frm: any) {
    // createClient(
      
    // )
    // EditPaymentModeDetails(frm.formData);
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
            formData={clients}
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
