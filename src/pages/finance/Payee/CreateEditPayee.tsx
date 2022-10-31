import React, {
  useContext,
  useImperativeHandle,
  useState
} from "react";
import ModalView from "../../../components/modal/index";
// import { useQuery, useMutation } from "@apollo/client";
import AuthContext from "../../../context/auth-context";
import { schema, widgets } from "./PayeeSchema";
import { Subject } from "rxjs";
// import {flattenObj} from '../../../../components/utils/responseFlatten';

interface Operation {
  id: string;
  packageType: "Cohort" | "Live Stream Channel";
  type: "create";
  current_status: boolean;
}

const emptyPayeeDetailsState = {
  PayeeCategory: "All contacts",
  TypeofPayee: "Individual",
  PaymentMode: "UPI",
  FrequencyOfPayment: "One Time",
  provideBreakdown: "No",
  search: "",
};

function CreateEditPayee(props: any, ref: any) {
  const [operation, setOperation] = useState<Operation>({} as Operation);
  const auth = useContext(AuthContext);
  const payeeJson: { } = require("./Payee.json");

  const modalTrigger = new Subject();
  useImperativeHandle(ref, () => ({
    TriggerForm: (msg: Operation) => {
      setOperation(msg);
      modalTrigger.next(true);
    },
  }));

  const onSubmit = (frm: any) => {

  }

  return (
    <ModalView
      name={"Create Payee"}
      isStepper={true}
      showErrorList={false}
      formUISchema={schema}
      formSchema={payeeJson}
      formSubmit={(frm: any) => { onSubmit(frm); }}
      formData={emptyPayeeDetailsState}
      stepperValues={[
        "Payee Basic Details",
        "Payment Settings",
        "Payment Mode",
      ]}
      widgets={widgets}
      modalTrigger={modalTrigger}
    />
  );
}

export default React.forwardRef(CreateEditPayee);
