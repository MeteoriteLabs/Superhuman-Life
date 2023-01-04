import { useMutation, useQuery } from "@apollo/client";
import React, { useContext, useImperativeHandle, useState } from "react";
import { Subject } from "rxjs";
import FinanceModal from "../../../components/financeModal/FinanceModal";
import moment from "moment";
import StatusModal from "../../../components/StatusModal/StatusModal";
import authContext from "../../../context/auth-context";
import { CREATE_UPI } from "../graphQL/mutations";
import { flattenObj } from "../../../components/utils/responseFlatten";
import {
  GET_UPI_DETAILS,
  DELETE_UPI,
  GET_BANK_DETAILS,
  GET_BANK_DETAIL,
  UPDATE_UPI,
  CREATE_BANK_DETAIL,
  DELETE_BANK_DETAILS,
  UPDATE_BANK_DETAILS,
  GET_UPI_DETAIL,
  GET_BANK_DETAILS_IS_PRIMARY,
  GET_UPI_DETAILS_IS_PRIMARY,
} from "./queries";
import Toaster from "../../../components/Toaster";
// import '../finance.css';

interface Operation {
  id: string;
  modal_status: boolean;
  actionType:
    | "bank"
    | "upi"
    | "createUPI"
    | "editUPI"
    | "deleteUPI"
    | "createBankDetails"
    | "editBankDetails"
    | "deleteBankDetails"
    | "viewBankDetails"
    | "viewUPIDetails";
}

interface bankDetails {
  Full_Name: string;
  Account_Number: string;
  IFSC_Code: string;
  Is_Primary: boolean;
  Bank_Name: string;
  Company_Address: string;
  Company_Name: string;
  PAN_Number?: string;
  GST?: string;
  GST_Number?: string;
}

interface upiDetails {
  Full_Name: string;
  phone_number: string;
  UPI_ID: string;
  users_permissions_user: string;
  publishedAt: Date;
  Is_Primary: boolean;
}

interface PrimaryUPIDetails {
  Full_Name: string;
  phone_number: string;
  UPI_ID: string;
  createdAt: Date;
  updatedAt: Date;
  Is_Primary: boolean;
  id: string;
}

interface PrimaryBankDetails {
  Full_Name: string;
  updatedAt: Date;
  Is_Primary: boolean;
  id: string;
  Account_Number: string;
  IFSC_Code: string;
  Bank_Name: string;
  Company_Address: string;
  Company_Name: string;
  PAN_Number?: string;
  GST_Number?: string;
}

function PaymentMethodsAction(props: any, ref: any) {
  const auth = useContext(authContext);
  const [operation, setOperation] = useState<Operation>({} as Operation);
  const modalTrigger = new Subject();
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  let [formBankData, setFormBankData] = useState<bankDetails>(
    {} as bankDetails
  );
  let [formUPIData, setUPIFormData] = useState<upiDetails>({} as upiDetails);
  let [isUPIDeleted, setIsUPIDeleted] = useState<boolean>(false);
  let [isUPIUpdated, setIsUPIUpdated] = useState<boolean>(false);
  let [isBankDetailsDeleted, setIsBankDetailsDeleted] =
    useState<boolean>(false);
  let [isBankDetailsUpdated, setIsBankDetailsUpdated] =
    useState<boolean>(false);
  let [isPrimaryBankDetails, setIsPrimaryBankDetails] = useState<
    PrimaryBankDetails[]
  >([]);
  let [isPrimaryUPIDetails, setIsPrimaryUPIDetails] = useState<
    PrimaryUPIDetails[]
  >([]);

  useImperativeHandle(ref, () => ({
    TriggerForm: (msg: Operation) => {
      setOperation(msg);

      //show delete modal
      if (
        msg.actionType === "deleteUPI" ||
        msg.actionType === "deleteBankDetails"
      ) {
        setShowDeleteModal(true);
      }

      //restrict form to render on delete
      if (
        msg.actionType !== "deleteUPI" &&
        msg.actionType !== "deleteBankDetails"
      ) {
        modalTrigger.next(true);
      }
    },
  }));

  // UPI
  const [createUPI] = useMutation(CREATE_UPI, {
    onCompleted: (r: any) => {
      modalTrigger.next(false);
    },
    refetchQueries: [GET_UPI_DETAILS],
  });

  const CreateUPI = (form: any) => {
    createUPI({
      variables: {
        Full_Name: form.Full_Name,
        phone_number: form.phone_number,
        UPI_ID: form.UPI_ID,
        users_permissions_user: form.user_permissions_user,
        publishedAt: moment().format(),
        Is_Primary: form.Is_Primary ? true : false,
      },
      onCompleted: (data) => {
        const flattenData = flattenObj({
          ...data.createUpiDetailsChangemaker.data,
        });

        const isPrimary: boolean = flattenData.Is_Primary;

        const arr: PrimaryUPIDetails[] = isPrimaryUPIDetails.splice(-1);

        if (isPrimary) {
          for (let currentValue of arr) {
            updateUPIDetail({
              variables: {
                id: currentValue.id,
                data: {
                  Is_Primary: false,
                },
              },
            });
          }
        }
      },
    });
  };

  const [updateUPIDetail] = useMutation(UPDATE_UPI, {
    onCompleted: (data: any) => {
      modalTrigger.next(false);
      setIsUPIUpdated(!isUPIUpdated);
    },
    refetchQueries: [GET_UPI_DETAILS],
  });

  function UpdateUPI(form: any) {
    updateUPIDetail({
      variables: {
        id: operation.id,
        data: {
          Full_Name: form.Full_Name,
          phone_number: form.phone_number,
          UPI_ID: form.UPI_ID,
          users_permissions_user: form.user_permissions_user,
          publishedAt: moment().format(),
          Is_Primary: form.Is_Primary ? true : false,
        },
      },
      onCompleted: (data) => {
        
        const flattenData = flattenObj({
          ...data.updateUpiDetailsChangemaker.data,
        });

        const isPrimary: boolean = flattenData.Is_Primary;

        if (isPrimary) {
          for (let currentValue of isPrimaryUPIDetails) {
            updateUPIDetail({
              variables: {
                id: currentValue.id,
                data: {
                  Is_Primary: false,
                },
              },
            });
          }
        }
      },
    });
  }

  const [deleteUPI] = useMutation(DELETE_UPI, {
    onCompleted: (data: any) => {
      setIsUPIDeleted(!isUPIDeleted);
    },
    refetchQueries: [GET_UPI_DETAILS],
  });

  //Bank Account
  const [deleteBankDetails] = useMutation(DELETE_BANK_DETAILS, {
    onCompleted: (data: any) => {
      setIsBankDetailsDeleted(!isBankDetailsDeleted);
    },
    refetchQueries: [GET_BANK_DETAILS],
  });

  const [createBankDetail] = useMutation(CREATE_BANK_DETAIL, {
    onCompleted: (r: any) => {
      modalTrigger.next(false);
    },
    refetchQueries: [GET_BANK_DETAILS],
  });

  const CreateBankDetail = (form: any) => {
    createBankDetail({
      variables: {
        data: {
          Full_Name: form.Full_Name,
          Account_Number: form.Account_Number,
          Bank_Name: form.Bank_Name,
          IFSC_Code: form.IFSC_Code,
          PAN_Number: form.PAN_Number,
          GST_Number: form.GST_Number || "",
          Company_Name: form.Company_Name || "",
          Company_Address: form.Company_Address || "",
          users_permissions_user: form.user_permissions_user,
          Is_Primary: form.Is_Primary ? true : false,
        },
      },
      onCompleted: (data) => {
        console.log(data);
        const flattenData = flattenObj({ ...data.createBankDetail.data });
        const isPrimary: boolean = flattenData.Is_Primary;

        const arr: PrimaryBankDetails[] = isPrimaryBankDetails.splice(-1);
        console.log(arr);

        if (isPrimary) {
          for (let currentValue of arr) {
            updateBankDetail({
              variables: {
                id: currentValue.id,
                data: {
                  Is_Primary: false,
                },
              },
            });
          }
        }
      },
    });
  };

  useQuery(GET_UPI_DETAILS_IS_PRIMARY, {
    variables: { id: auth.userid },
    onCompleted: (data: any) => {
      const flattenUpiDetail = flattenObj({ ...data.upiDetailsChangemakers });
      setIsPrimaryUPIDetails(flattenUpiDetail);
    },
  });

  useQuery(GET_BANK_DETAILS_IS_PRIMARY, {
    variables: { id: auth.userid },
    onCompleted: (data: any) => {
      const flattenBankDetail = flattenObj({ ...data.bankDetails });
      setIsPrimaryBankDetails(flattenBankDetail);
    },
  });

  useQuery(GET_BANK_DETAIL, {
    variables: { id: operation.id },
    skip: !operation.id || operation.actionType === "deleteUPI",
    onCompleted: (e: any) => {
      FillBankDetails(e);
    },
  });

  function FillBankDetails(data: any) {
    const flattenData = flattenObj({ ...data.bankDetail });

    let detail = {} as bankDetails;

    if (flattenData) {
      detail.Full_Name = flattenData.Full_Name;
      detail.Account_Number = flattenData.Account_Number;
      detail.IFSC_Code = flattenData.IFSC_Code;
      detail.Is_Primary = flattenData.Is_Primary;
      detail.Bank_Name = flattenData.Bank_Name;
      detail.Company_Address = flattenData.Company_Address;
      detail.Company_Name = flattenData.Company_Name;
      detail.PAN_Number = flattenData.PAN_Number;
      detail.GST = flattenData.GST_Number ? "GST" : "None";
      detail.GST_Number = flattenData.GST_Number
        ? flattenData.GST_Number
        : null;
      detail.Company_Name = flattenData.Company_Name
        ? flattenData.Company_Name
        : null;
      detail.Company_Address = flattenData.Company_Address
        ? flattenData.Company_Address
        : null;
    }

    setFormBankData(detail);
  }

  useQuery(GET_UPI_DETAIL, {
    variables: { id: operation.id },
    skip: !operation.id || operation.actionType === "deleteUPI",
    onCompleted: (e: any) => {
      FillUPIDetails(e);
    },
  });

  function FillUPIDetails(data: any) {
    const flattenData = flattenObj({ ...data.upiDetailsChangemaker });

    let detail = {} as upiDetails;

    if (flattenData) {
      detail.Full_Name = flattenData.Full_Name;
      detail.phone_number = flattenData.phone_number;
      detail.UPI_ID = flattenData.UPI_ID;
      detail.Is_Primary = flattenData.Is_Primary;
      detail.publishedAt = flattenData.publishedAt;
      detail.users_permissions_user = flattenData.users_permissions_user;
    }

    setUPIFormData(detail);
  }

  const [updateBankDetail] = useMutation(UPDATE_BANK_DETAILS, {
    onCompleted: (data: any) => {
      setIsBankDetailsUpdated(!isBankDetailsUpdated);
      modalTrigger.next(false);
    },
    refetchQueries: [GET_BANK_DETAILS],
  });

  function UpdateBank(form: any) {
    updateBankDetail({
      variables: {
        id: operation.id,
        data: {
          Full_Name: form.Full_Name,
          Account_Number: form.Account_Number,
          Bank_Name: form.Bank_Name,
          IFSC_Code: form.IFSC_Code,
          PAN_Number: form.PAN_Number,
          GST_Number: form.GST_Number || "",
          Company_Name: form.Company_Name || "",
          Company_Address: form.Company_Address || "",
          users_permissions_user: form.user_permissions_user,
          Is_Primary: form.Is_Primary ? true : false,
        },
      },
      onCompleted: (data) => {
        
        for (let currentValue of isPrimaryBankDetails) {
          updateBankDetail({
            variables: {
              id: currentValue.id,
              data: {
                Is_Primary: false,
              },
            },
          });
        }
      },
    });
  }

  const OnSubmit = (frm: any) => {
    //bind user id
    if (frm) {
      frm.user_permissions_user = auth.userid;
    }

    switch (operation.actionType) {
      case "bank":
        CreateBankDetail(frm);
        break;

      case "upi":
        CreateUPI(frm);
        break;

      case "editUPI":
        UpdateUPI(frm);
        break;

      case "editBankDetails":
        UpdateBank(frm);
        break;
    }
  };

  let name = "";
  let formSchema = {};
  switch (operation.actionType) {
    case "bank": {
      name = "Bank Account";
      formSchema = require("./bankAccount.json");
      break;
    }
    case "upi": {
      name = "UPI";
      formSchema = require("./upi.json");
      break;
    }
    case "editUPI": {
      name = "Update UPI Details";
      formSchema = require("./upi.json");
      break;
    }
    case "editBankDetails": {
      name = "Update bank Details";
      formSchema = require("./bankAccount.json");
      break;
    }
    case "viewBankDetails": {
      name = "View bank Details";
      formSchema = require("./bankAccount.json");
      break;
    }
    case "viewUPIDetails": {
      name = "View UPI Details";
      formSchema = require("./upi.json");
      break;
    }
  }

  const uiSchema: any = {
    GST: {
      "ui:widget": "radio",
      "ui:options": {
        inline: true,
      },
    },
  };

  function DeleteUPI(id: string) {
    deleteUPI({ variables: { id: id } });
  }

  function DeleteBankAccountDetails(id: string) {
    deleteBankDetails({ variables: { id: id } });
  }

  return (
    <div>
      <FinanceModal
        modalTrigger={modalTrigger}
        formSchema={formSchema}
        name={name}
        formSubmit={(frm: any) => OnSubmit(frm)}
        actionType={operation.actionType}
        formData={
          operation.actionType === "upi" || operation.actionType === "bank"
            ? {}
            : operation.actionType === "editBankDetails" ||
              operation.actionType === "viewBankDetails"
            ? formBankData
            : operation.actionType === "editUPI" ||
              operation.actionType === "viewUPIDetails"
            ? formUPIData
            : {}
        }
        formUISchema={uiSchema}
      />
      {/* Delete Modal */}
      {showDeleteModal && (
        <StatusModal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          modalTitle="Delete"
          modalBody={
            operation.actionType === "deleteUPI"
              ? "Do you want to delete this UPI detail?"
              : "Do you want to delete this bank account detail?"
          }
          buttonLeft="Cancel"
          buttonRight="Yes"
          onClick={() => {
            operation.actionType === "deleteUPI"
              ? DeleteUPI(operation.id)
              : DeleteBankAccountDetails(operation.id);
          }}
        />
      )}

      {isUPIDeleted ? (
        <Toaster
          handleCallback={() => setIsUPIDeleted(!isUPIDeleted)}
          type="success"
          msg="UPI Detail has been deleted successfully"
        />
      ) : null}

      {isUPIUpdated ? (
        <Toaster
          handleCallback={() => setIsUPIUpdated(!isUPIUpdated)}
          type="success"
          msg="UPI Detail has been updated successfully"
        />
      ) : null}

      {isBankDetailsDeleted ? (
        <Toaster
          handleCallback={() => setIsBankDetailsDeleted(!isBankDetailsDeleted)}
          type="success"
          msg="Bank Details has been deleted successfully"
        />
      ) : null}

      {isBankDetailsUpdated ? (
        <Toaster
          handleCallback={() => setIsBankDetailsUpdated(!isBankDetailsUpdated)}
          type="success"
          msg="Bank Details has been updated successfully"
        />
      ) : null}
    </div>
  );
}

export default React.forwardRef(PaymentMethodsAction);
