export interface UsersPermissionsUser {
    data: {
      attributes: {
        About_User: string;
        Clubhouse_URL: string;
        Document_Verified: boolean;
        Facebook_URL: string;
        First_Name: string;
        Last_Name: string;
        LinkedIn_URL: string;
        Phone_Number: string;
        Photo_ID: string;
        Photo_profile_banner_ID: string;
        Twitter_URL: string;
        Verification_ID: string;
        Website_URL: string;
        Youtube_URL: string;
        about_mini_description: string;
      };
      addresses: {
        data: {
          attributes: {
            House_Number: string;
            Title: string;
            address1: string;
            address2: string;
            city: string;
            country: string;
            is_primary: boolean;
            state: string;
            type: string;
            type_address: string;
            zipcode: string;
          };
          id: string;
        }[];
      };
      designations: {
        data: {
          attributes: {
            Designation_title: string;
            description: string;
          };
          id: string;
        }[];
      };
      educational_details: {
        data: {
          attributes: {
            Institute_Name: string;
            Specialization: string;
            Type_of_degree: string;
            Year: string;
          };
          id: string;
        }[];
      };
      email: string;
      instagram_url: string;
      updatedAt: string;
    };
    id: string;
    __typename: string;
  }
  
  export type FlattenData = {
    usersPermissionsUser: UsersPermissionsUser;
  };
  
  export interface Schema {
    Photo_ID: {
      "ui:widget": (props: any) => JSX.Element;
      "ui:help": string;
    };
    About_User: {
      "ui:placeholder": string;
      "ui:widget": string;
      "ui:options"?: {
        rows: number;
      };
    };
    First_Name: {
      "ui:placeholder": string;
    };
    Last_Name: {
      "ui:placeholder": string;
    };
    about_mini_description: {
      "ui:placeholder": string;
    };
    Website_URL: {
      "ui:placeholder": string;
    };
    Phone_Number: {
      "ui:placeholder": string;
    };
  }
  
  