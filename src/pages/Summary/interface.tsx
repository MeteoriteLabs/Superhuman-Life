export interface ClientUserType {
  ClientUser: {
    id: string;
    First_Name: string;
    Last_Name: string;
    Phone_Number: string;
    email: string;
  }[];
  booking_date: string;
  effective_date: Date;
  fitnesspackages: {
    End_date: string;
    Start_date: string;
    Status: boolean;
    SubscriptionDuration: null;
    Thumbnail_ID: string;
    address: null;
    bookingleadday: null;
    bookingleadtime: null;
    duration: number;
    fitness_package_type: {
      id: string;
      type: string;
      __typename: string;
    };
    fitnessdisciplines: {
      disciplinename: string;
      id: undefined;
      __typename: string;
    }[];
    fitnesspackagepricing: {
      duration: number;
      foodPrice: number;
      mrp: string;
      privateRoomPrice: number;
      sapienPricing: number;
      suggestedPrice: number;
      threeSharingPrice: number;
      twoSharingPrice: number;
      voucher: number;
    }[];
    groupinstantbooking: null;
    groupoffline: null;
    grouponline: null;
    id: string;
    is_private: boolean;
    level: string;
    mode: string;
    packagename: string;
    ptoffline: null;
    ptonline: null;
    publishing_date: string;
    recordedclasses: null;
    __typename: string;
  }[];
  id: string;
  package_duration: number;
  __typename: string;
}

export interface ClientBooking {
  clientBooking: {
    id: string;
    effective_date: string;
    attributes: {
      bookingleadday: null;
      bookingleadtime: null;
      duration: null;
      fitness_package_type: {
        data: {
          attributes: {
            type: string;
          };
          id: string;
          __typename: string;
        };
        __typename: string;
      };
      fitnessdisciplines: {
        data: {
          attributes: {
            disciplinename: string;
          };
          __typename: string;
        }[];
        __typename: string;
        length: number;
      };
      fitnesspackagepricing: {
        duration: number;
        mrp: string;
        sapienPricing: number;
        suggestedPrice: number;
        voucher: number;
        __typename: string;
      }[];
      groupinstantbooking: null;
      groupoffline: null;
      grouponline: null;
      is_private: boolean;
      level: string;
      mode: string;
      packagename: string;
      ptoffline: null;
      ptonline: number;
      publishing_date: string;
      recordedclasses: null;
      __typename: string;
    };
    clientUser: {
      data: {
        attributes: {
          First_Name: string;
          Last_Name: string;
          Phone_Number: string;
          email: string;
        };
        __typename: string;
      }[];
      __typename: string;
    };
    fitnesspackages: {
      data: {
        attributes: {
          End_date: null;
          Start_date: null;
          Status: boolean;
          SubscriptionDuration: null;
          Thumbnail_ID: string;
        };
        address: {
          data: null;
          __typename: string;
        };
        __typename: string;
        id: string;
        length: number;
      }[];
      __typename: string;
    };
    __typename: string;
  };
}
export interface Booking {
  End_date: null;
  Start_date: null;
  Status: boolean;
  SubscriptionDuration: null;
  Thumbnail_ID: string;
  address: null;
  bookingleadday: null;
  bookingleadtime: null;
  duration: null;
  fitness_package_type: {
    id: string;
    type: string;
    __typename: string;
  };
  fitnessdisciplines: {
    disciplinename: string;
    id: undefined;
    __typename: string;
  }[];
  fitnesspackagepricing: {
    duration: number;
    mrp: string;
    sapienPricing: number;
    suggestedPrice: number;
    voucher: number;
  }[];
  groupinstantbooking: null;
  groupoffline: null;
  grouponline: null;
  id: string;
  is_private: boolean;
  level: string;
  mode: string;
  packagename: string;
  ptoffline: null;
  ptonline: number;
  publishing_date: string;
  recordedclasses: null;
  __typename: string;
}
