import { useRef, useState } from 'react';
import { Form, InputGroup, Overlay, Tooltip } from 'react-bootstrap';

type WebsiteSettings = {
  subdomain: string;
  domain: string;
  selectedTemplate: string;
  error: string;
};

function WebsiteBuilder_settings({
  websiteSettings,
  setWebsiteSettings
}: {
  websiteSettings: WebsiteSettings;
  setWebsiteSettings: (websiteSettings: WebsiteSettings) => void;
}): JSX.Element {
  //   const [showEditTemplate, setShowEditTemplate] = useState(false);
  const [edit, setEdit] = useState({
    subdomain: false,
    domain: false,
    selectedTemplate: false
  });

  const editTemplate = useRef(null);
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
            <InputGroup className="mb-3">
              <Form.Control
                placeholder="example-domain.sapien.systems"
                aria-label="subdomain"
                disabled={!edit.subdomain}
                value={websiteSettings.subdomain}
                onChange={(e) =>
                  setWebsiteSettings({ ...websiteSettings, subdomain: e.target.value })
                }
              />
              <InputGroup.Text onClick={() => setEdit({ ...edit, subdomain: !edit.subdomain })}>
                🖋️
              </InputGroup.Text>
            </InputGroup>
          </div>
          <div className="mb-4">
            <h4 style={{ fontSize: 16, fontWeight: 600 }} className="mb-2">
              Personal Website
            </h4>
            <InputGroup className="mb-3">
              <Form.Control
                placeholder="www.example-domain.com"
                aria-label="subdomain"
                disabled={!edit.domain}
                value={websiteSettings.domain}
                onChange={(e) => setWebsiteSettings({ ...websiteSettings, domain: e.target.value })}
              />
              <InputGroup.Text onClick={() => setEdit({ ...edit, domain: !edit.domain })}>
                🖋️
              </InputGroup.Text>
            </InputGroup>
          </div>
          <div className="mb-4">
            <h4 style={{ fontSize: 16, fontWeight: 600 }} className="mb-2">
              Selected Template
            </h4>
            <InputGroup className="mb-3">
              <Form.Control
                placeholder="example-domain.sapien.systems"
                aria-label="subdomain"
                disabled
                value={websiteSettings.selectedTemplate}
                onChange={(e) =>
                  setWebsiteSettings({ ...websiteSettings, selectedTemplate: e.target.value })
                }
              />
              <InputGroup.Text
                onClick={() => setEdit({ ...edit, selectedTemplate: !edit.selectedTemplate })}>
                →
              </InputGroup.Text>
              <Overlay target={editTemplate.current} show={edit.selectedTemplate} placement="right">
                {(props) => (
                  <Tooltip id="overlay-example" {...props}>
                    My Tooltip
                  </Tooltip>
                )}
              </Overlay>
            </InputGroup>
          </div>
        </div>
      </div>
    </>
  );
}

export default WebsiteBuilder_settings;
