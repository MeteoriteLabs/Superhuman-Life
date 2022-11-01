interface paymentDetailInterface {
    upi: string;
    phoneNumber: string;
    branch: string;
    IFSCCode: string;
    bankName: string;
    accountType: string;
    accountNumber: number;
  }
  
interface organisationDetailsInterface {
    organisationName: string;
    gst: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    country: string;
    zipcode: string;
    organisationEmail: string;
  }
  
export interface PayeeDetails {
    id?: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    isPayee: boolean;
    type: string;
    ownedBy: string;
    organisationDetails?: organisationDetailsInterface;
    paymentDetails?: paymentDetailInterface;
  }

  interface breakdownInterface {
    basicPay: string;
    HRA: string;
    Gratuity: string;
    LTA: string;
    ESI: string;
    MedicalReimbursement: string;
    ChildCare: string;
    SpecialAllowance: string;
    ProfessionalTax: string;
    TDS: string;
    ProvidentFund: string;
  }

  export interface PaymentScheduleDetails {
    PaymentCatagory: string;
    Source_User_ID: number;
    Destination_Contacts_ID: number;
    Destination_User_ID: number;
    frequency: number;
    Payment_Cycle: number;
    Total_Amount: number | null;
    Payment_DateTime: Date;
    Reminder_DateTime: Date;
    Effective_Date: Date;
    Total_Amount_Breakdown?: breakdownInterface
  }
  