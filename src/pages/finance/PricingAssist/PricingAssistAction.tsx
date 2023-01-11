import { useMutation } from "@apollo/client";
import React, {
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { Subject } from "rxjs";
import PricingAssistEditIcon from "../../../components/customWidget/PricingAssistEditIcon";
import FinanceModal from "../../../components/financeModal/FinanceModal";
import authContext from "../../../context/auth-context";
import {
  CREATE_FITNESS_PRICING_ASSIT,
  UPDATE_FITNESS_PRICING_ASSITS,
} from "../graphQL/mutations";
import { GET_ALL_SUGGESTED_PRICING } from "../graphQL/queries";
import Toaster from "../../../components/Toaster";

interface Operation {
  id: string;
  actionType: "edit";
  rowData: any;
}

function PricingAssistAction(props, ref) {
  const auth = useContext(authContext);
  const [operation, setOperation] = useState<Operation>({} as Operation);
  const modalTrigger = new Subject();
  const [formData, setFormData] = useState<any>();
  const formSchema = require("../PricingAssist/Fitness/fitness.json");
  const [isBasepriceUpdated, setIsBasePriceUpdated] = useState<boolean>(false);
  const [isBasepriceCreated, setIsBasePriceCreated] = useState<boolean>(false);

  enum ENUM_SUGGESTEDPRICING_MODE {
    Online,
    Offline,
  }

  const uiSchema: any = {
    type: {
      "ui:widget": () => <PricingAssistEditIcon rowData={operation.rowData} />,
    },
  };

  useImperativeHandle(ref, () => ({
    TriggerForm: (msg: Operation) => {
      setOperation(msg);
      modalTrigger.next(true);
    },
  }));

  useEffect(() => {
    let updateFormData: any = {};
    updateFormData.mrp = operation?.rowData?.mrp;
    if (operation?.rowData?.id === "") {
      setFormData({});
    } else {
      setFormData(updateFormData);
    }
  }, [operation]);

  // create price
  const [createFitnessPricingAssist] = useMutation(
    CREATE_FITNESS_PRICING_ASSIT,
    {
      onCompleted: (r: any) => {
        modalTrigger.next(false);
        setIsBasePriceCreated(!isBasepriceCreated);
      },
      refetchQueries: [GET_ALL_SUGGESTED_PRICING],
    }
  );

  const CreateFitnessPricingAssist = (form: any) => {
    createFitnessPricingAssist({
      variables: {
        data: {
          fitness_package_type: operation.rowData.packageTypeId,
          users_permissions_users: form.users_permissions_users,
          Mode:
            operation.rowData.modes === "Online"
              ? ENUM_SUGGESTEDPRICING_MODE[0]
              : ENUM_SUGGESTEDPRICING_MODE[1],
          mrp: form.mrp,
        },
      },
    });
  };

  // update price
  const [updateFitnessPricingAssist] = useMutation(
    UPDATE_FITNESS_PRICING_ASSITS,
    {
      onCompleted: (r: any) => {
        modalTrigger.next(false);
        setIsBasePriceUpdated(!isBasepriceUpdated);
      },
      refetchQueries: [GET_ALL_SUGGESTED_PRICING],
    }
  );

  const UpdateFitnessPricingAssist = (form: any) => {
    updateFitnessPricingAssist({
      variables: {
        id: operation.id,
        mrp: form.mrp,
        Duration: operation.rowData.duration,
        fitness_package_type: operation.rowData.packageTypeID,
      },
    });
  };

  const OnSubmit = (frm: any) => {
    //bind user id
    if (frm) {
      frm.id = operation.id;
      frm.users_permissions_users = auth.userid;
    }

    switch (operation.actionType) {
      case "edit":
        if (operation.id === "") {
          CreateFitnessPricingAssist(frm);
        } else {
          UpdateFitnessPricingAssist(frm);
        }
        break;
    }
  };

  return (
    <div>
      <FinanceModal
        modalTrigger={modalTrigger}
        formSchema={formSchema}
        name="Pricing Assist"
        formSubmit={(frm: any) => OnSubmit(frm)}
        actionType={operation.actionType}
        formData={operation.id && formData}
        formUISchema={uiSchema}
      />

      {isBasepriceCreated ? (
        <Toaster
          handleCallback={() => setIsBasePriceCreated(!isBasepriceCreated)}
          type="success"
          msg="Base price has been created"
        />
      ) : null}

      {isBasepriceUpdated ? (
        <Toaster
          handleCallback={() => setIsBasePriceUpdated(!isBasepriceUpdated)}
          type="success"
          msg="Base price has been updated"
        />
      ) : null}
    </div>
  );
}

export default React.forwardRef(PricingAssistAction);
