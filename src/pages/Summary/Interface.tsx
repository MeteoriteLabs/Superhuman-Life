interface FitnessPackages {
    End_date: string;
    Start_date: string;
    Status: boolean;
    Thumbnail_ID: string;
    SubscriptionDuration: string[];
    fitnesspackagepricing: {
        classes: number;
        duration: number;
        mrp: string;
        sapienPricing: number;
        suggestedPrice: number;
        voucher: number;
    }[];
    fitnessdisciplines: {
        disciplinename: string;
        id: string;
        __typename: string;
    }[];
    fitness_package_type: {
        id: string;
        type: string;
        __typename: string;
    };
    address: {
        id: string;
        address1: string;
        city: string;
        state: string;
        __typename: string;
    };
    bookingleadday: string | null;
    bookingleadtime: string;
    duration: number;
    groupinstantbooking: boolean;
    groupoffline: number | null;
    grouponline: number | null;
    id: string;
    is_private: boolean;
    level: string;
    mode: string;
    packagename: string;
    ptoffline: number | null;
    ptonline: number | null;
    publishing_date: string;
    recordedclasses: number | null;
    __typename: string;
}

interface ClientUser {
    First_Name: string;
    Last_Name: string;
    Phone_Number: string;
    email: string;
    id: string;
    __typename: string;
}

export interface PackageDetails {
    id: string;
    package_duration: number;
    effective_date: Date;
    ClientUser: ClientUser[];
    fitnesspackages: FitnessPackages[];
    __typename: string;
    booking_date: string;
}
