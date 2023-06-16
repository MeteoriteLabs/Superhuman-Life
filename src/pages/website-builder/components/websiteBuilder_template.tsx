import { useLazyQuery } from '@apollo/client';
import { FETECH_SELECTED_TEMPLATE } from '../queries/templates';
import { useEffect, useState } from 'react';

type WebsiteSettings = {
  subdomain: string;
  domain: string;
  selectedTemplate: string;
  error: string;
};

function WebsiteBuilder_template({
  websiteSettings
}: {
  websiteSettings: WebsiteSettings;
}): JSX.Element {
  const [selectedTemplate, setSelectedTemplate] = useState({
    thumbnail: ''
  });
  const [getUserSelectedTemplate, { data, error }] = useLazyQuery(FETECH_SELECTED_TEMPLATE, {
    variables: {
      templateName: websiteSettings.selectedTemplate
    },
    onCompleted: (data) => {
      setSelectedTemplate({
        ...selectedTemplate,
        thumbnail: data?.templates?.data[0]?.attributes?.thumbnail as string
      });
    },
    onError: () => {
      if (error?.message) {
        console.log(error?.message);
      }
    }
  });

  useEffect(() => {
    if (websiteSettings.selectedTemplate) {
      getUserSelectedTemplate();
    }
  }, [websiteSettings.selectedTemplate]);
  return (
    <div className="my-5">
      <hr />
      <h4 className="mb-2 mt-5" style={{ fontSize: 16, fontWeight: 600 }}>
        Preview
      </h4>
      <div style={{ position: 'relative' }}>
        {selectedTemplate.thumbnail ? (
          <div
            style={{
              overflow: 'hidden',
              objectFit: 'cover',
              width: '100%',
              height: 600,
              position: 'absolute',
              top: 0
            }}>
            <img
              src={selectedTemplate.thumbnail}
              alt="template"
              width={1400}
              height={900}
              style={{ objectFit: 'cover', width: '100%', height: 600 }}
            />
          </div>
        ) : null}
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ width: '100%', height: 600, border: '1px solid #ccc' }}>
          <p className="text-center" style={{ fontSize: '100px' }}>
            🌆
          </p>
        </div>
      </div>
    </div>
  );
}

export default WebsiteBuilder_template;
