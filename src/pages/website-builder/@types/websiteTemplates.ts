
  
  export interface WebsiteTemplate {
    id: string;
    attributes: {
      template_name: string;
      schema_json: any;
      form_json: any;
      published: boolean;
      Stepper_Title: string;
      website_data: {
        data: {
          id: string;
          attributes: {
            form_data: any;
            website_template: {
              data: {
                id: string;
              };
            };
            subdomain: string;
            createdAt: string;
            updatedAt: string;
          };
        };
      };
    };
  }
  
export default interface FetchTemplatesResponse {
    websiteTemplates: {
      data: WebsiteTemplate[];
    };
  }
  