import { useContext, useState } from 'react';
import { Form, InputGroup, Tooltip, Button, OverlayTrigger } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { ChangeMakerWebsiteContext } from '../../../context/changemakerWebsite-context';

function WebsiteBuilder_settings(): JSX.Element {
  //   const [showEditTemplate, setShowEditTemplate] = useState(false);
  const [edit, setEdit] = useState({
    subdomain: false,
    domain: false
  });
  const navigate = useHistory();

  const { setChangemakerWebsiteState, changemakerWebsiteState } =
    useContext(ChangeMakerWebsiteContext);

  return (
    <>
      <h1>Website Builder</h1>
      <hr />
      <div>
        <div className="mt-5">
          <div className="mb-4">
            <h4 className="mb-2" style={{ fontSize: 16, fontWeight: 600 }}>
              Community Website
            </h4>
            <InputGroup className="mb-3" style={{ cursor: 'pointer' }}>
              <Form.Control
                placeholder="example-domain.sapien.systems"
                aria-label="subdomain"
                disabled={!edit.subdomain}
                value={changemakerWebsiteState.subdomain ? changemakerWebsiteState.subdomain : ''}
                onChange={(e) =>
                  setChangemakerWebsiteState({
                    ...changemakerWebsiteState,
                    subdomain: e.target.value
                  })
                }
              />
              <Button
                className="btn-light ml-1"
                onClick={() => setEdit({ ...edit, subdomain: !edit.subdomain })}>
                🖋️
              </Button>
            </InputGroup>
          </div>
          <div className="mb-4">
            <h4 style={{ fontSize: 16, fontWeight: 600 }} className="mb-2">
              Personal Website
            </h4>
            <InputGroup className="mb-3" style={{ cursor: 'pointer' }}>
              <Form.Control
                placeholder="www.example-domain.com"
                aria-label="subdomain"
                disabled={!edit.domain}
                value={changemakerWebsiteState.domain ? changemakerWebsiteState.domain : ''}
                onChange={(e) =>
                  setChangemakerWebsiteState({
                    ...changemakerWebsiteState,
                    domain: e.target.value
                  })
                }
              />
              <Button
                className="btn-light ml-1"
                onClick={() => setEdit({ ...edit, domain: !edit.domain })}>
                🖋️
              </Button>
            </InputGroup>
          </div>
          <div className="mb-4">
            <h4 style={{ fontSize: 16, fontWeight: 600 }} className="mb-2">
              Selected Template
            </h4>
            <InputGroup className="mb-3" style={{ cursor: 'pointer' }}>
              <Form.Control
                placeholder="example-domain.sapien.systems"
                aria-label="subdomain"
                disabled
                value={
                  changemakerWebsiteState.selectedTemplate
                    ? changemakerWebsiteState.selectedTemplate
                    : ''
                }
                onChange={(e) =>
                  setChangemakerWebsiteState({
                    ...changemakerWebsiteState,
                    selectedTemplate: e.target.value
                  })
                }
              />
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id="overlay-example">Browse Templates</Tooltip>}>
                <Button
                  className="btn-light ml-1"
                  onClick={() => navigate.push('/website/templates')}>
                  →
                </Button>
              </OverlayTrigger>
            </InputGroup>
          </div>
        </div>
      </div>
    </>
  );
}

export default WebsiteBuilder_settings;
