import React, {
  useContext,
  useImperativeHandle,
  useState,
  useEffect,
} from "react";
import { useQuery, useMutation } from "@apollo/client";
import ModalView from "../../../../components/modal";
import {
  GET_SINGLE_PACKAGE_BY_ID,
  GET_FITNESS_PACKAGE_TYPES
} from "../graphQL/queries";
import {
  CREATE_PACKAGE,
  DELETE_PACKAGE,
  EDIT_PACKAGE,
  UPDATE_PACKAGE_STATUS,
  CREATE_NOTIFICATION
} from "../graphQL/mutations";
import { Modal, Button } from "react-bootstrap";
import AuthContext from "../../../../context/auth-context";
import { schema, widgets } from "./personalTraining";
import { schemaView } from "./schemaView";
import { Subject } from "rxjs";
import { flattenObj } from "../../../../components/utils/responseFlatten";
import moment from "moment";
import Toaster from "../../../../components/Toaster";
import {
  youtubeUrlCustomFormats,
  youtubeUrlTransformErrors,
} from "../../../../components/utils/ValidationPatterns";

interface Operation {
  id: string;
  type: "create" | "edit" | "view" | "toggle-status" | "delete";
  current_status: boolean;
}

function CreateEditPt(props: any, ref: any) {
  const auth = useContext(AuthContext);
  const personalTrainingSchema: {
    [name: string]: any;
  } = require("./personal-training.json");
  const [personalTrainingDetails, setPersonalTrainingDetails] = useState<any>(
    {}
  );
  const [fitnessTypes, setFitnessType] = useState<any[]>([]);
  const [operation, setOperation] = useState<Operation>({} as Operation);
  const [deleteModalShow, setDeleteModalShow] = useState<boolean>(false);
  const [statusModalShow, setStatusModalShow] = useState<boolean>(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
  const [isOffeeringDeleted, setisOffeeringDeleted] = useState<boolean>(false);
  const [isOfferingUpdated, setisOfferingUpdated] = useState<boolean>(false);

  let frmDetails: any = {};

  useQuery(GET_FITNESS_PACKAGE_TYPES, {
    variables: { type: "One-On-One" },
    onCompleted: (response) => {
      const flattenData = flattenObj({ ...response });
      setFitnessType(flattenData.fitnessPackageTypes);
    },
  });

  const [createOneOnOneNotification] = useMutation(CREATE_NOTIFICATION, {onCompleted: () => {
    modalTrigger.next(false);
    
    props.refetchTags();
    props.refetchOfferings();
  }});

  const [createPackage] = useMutation(CREATE_PACKAGE, {
    onCompleted: (response) => {
      const flattenData = flattenObj({ ...response });

      props.refetchTags();
      props.refetchOfferings();

      createOneOnOneNotification({
        variables: {
          data: {
            type: "Offerings",
            Title: "New offering",
            OnClickRoute: "/offerings",
            users_permissions_user: auth.userid,
            Body: `New one on one offering ${flattenData.createFitnesspackage.packagename} has been added`,
            DateTime: moment().format(),
            IsRead: false,
            ContactID: flattenData.createFitnesspackage.id,
          },
        },
      });

    },
  });

  const [editPackage] = useMutation(EDIT_PACKAGE, {
    onCompleted: () => {
      modalTrigger.next(false);
      props.refetchTags();
      props.refetchOfferings();
    },
  });

  const [updatePackageStatus] = useMutation(UPDATE_PACKAGE_STATUS, {
    onCompleted: () => {

      props.refetchTags();
      props.refetchOfferings();
      setisOfferingUpdated(!isOfferingUpdated);
    },
  });

  const [deletePackage] = useMutation(DELETE_PACKAGE, {
    onCompleted: () => {
      
      props.refetchTags();
      props.refetchOfferings();
      setisOffeeringDeleted(!isOffeeringDeleted);
    },
  });

  const modalTrigger = new Subject();

  useImperativeHandle(ref, () => ({
    TriggerForm: (msg: Operation) => {
      setOperation(msg);

      if (msg.type === "toggle-status") {
        setStatusModalShow(true);
      }

      if (msg.type === "delete") {
        setDeleteModalShow(true);
      }

      // render modal if msg type is not delete or toggle status
      if (msg.type !== "delete" && msg.type !== "toggle-status") {
        modalTrigger.next(true);
      }
    },
  }));

  enum ENUM_FITNESSPACKAGE_LEVEL {
    Beginner,
    Intermediate,
    Advanced,
  }

  enum ENUM_FITNESSPACKAGE_INTENSITY {
    Low,
    Moderate,
    High,
  }

  enum ENUM_FITNESSPACKAGE_MODE {
    Online,
    Offline,
    Hybrid,
    Online_workout,
    Offline_workout,
    Residential,
  }

  enum ENUM_FITNESSPACKAGE_PTCLASSSIZE {
    Solo,
    Couple,
    Family,
  }

  const PRICING_TABLE_DEFAULT = [
    {
      mrp: null,
      suggestedPrice: null,
      voucher: 0,
      duration: 30,
      sapienPricing: null,
    },
    {
      mrp: null,
      suggestedPrice: null,
      voucher: 0,
      duration: 90,
      sapienPricing: null,
    },
    {
      mrp: null,
      suggestedPrice: null,
      voucher: 0,
      duration: 180,
      sapienPricing: null,
    },
    {
      mrp: null,
      suggestedPrice: null,
      voucher: 0,
      duration: 360,
      sapienPricing: null,
    },
  ];

  function FillDetails(data: any) {
    const flattenedData = flattenObj({ ...data });
    
    const msg = flattenedData.fitnesspackages[0];
  
    const details: any = {};
    for (let i = 0; i < msg.fitnesspackagepricing.length; i++) {
      PRICING_TABLE_DEFAULT[i].mrp = msg.fitnesspackagepricing[i].mrp;
      PRICING_TABLE_DEFAULT[i].suggestedPrice =
        msg.fitnesspackagepricing[i].suggestedPrice;
      PRICING_TABLE_DEFAULT[i].voucher = msg.fitnesspackagepricing[i].voucher;
      PRICING_TABLE_DEFAULT[i].sapienPricing =
        msg.fitnesspackagepricing[i].sapienPricing;
    }
    const clientAddressArray = msg.client_address ? msg.client_address.split("Km") : [];
    details.config = 0;
    details.About = msg.aboutpackage;
    details.Benifits = msg.benefits;
    details.packagename = msg.packagename;
    details.equipmentList = msg.equipment_lists;
    details.disciplines = msg.fitnessdisciplines;
    details.channelinstantBooking = msg.groupinstantbooking;
    details.classSize = ENUM_FITNESSPACKAGE_PTCLASSSIZE[msg.Ptclasssize];
    details.expiryDate = moment(msg.expirydate).format("YYYY-MM-DD");
    details.level = ENUM_FITNESSPACKAGE_LEVEL[msg.level];
    details.intensity = ENUM_FITNESSPACKAGE_INTENSITY[msg.Intensity];
    details.pricingDetail =
      msg.fitnesspackagepricing[0]?.mrp === "free"
        ? "free"
        : JSON.stringify(PRICING_TABLE_DEFAULT);
    details.publishingDate = moment(msg.publishing_date).format("YYYY-MM-DD");
    details.tags = msg?.tags === null ? "" : msg.tags;
    details.user_permissions_user = msg.users_permissions_user.id;
    details.visibility = msg.is_private ? 1 : 0;
   
    details.programDetails = JSON.stringify({
      addressTag: msg.address === null ? "At Client Address" : "At My Address",
      address: [msg.address],
      mode: ENUM_FITNESSPACKAGE_MODE[msg.mode],
      offline: msg.ptoffline,
      online: msg.ptonline,
      rest: msg.restdays,
      distance: msg.client_address ? `${clientAddressArray[0]}Km` : null,
      clientAddress: msg.client_address ? clientAddressArray[1]  : null,
    });
    details.thumbnail = msg.Thumbnail_ID;
    details.Upload =
      msg.Upload_ID === null
        ? { VideoUrl: msg.video_URL }
        : { upload: msg.Upload_ID };
    details.datesConfig = JSON.stringify({
      expiryDate: msg.expiry_date,
      publishingDate: msg.publishing_date,
    });
    details.durationOfOffering = msg.SubscriptionDuration
      ? msg.SubscriptionDuration
      : ["30 days", "90 days", "180 days", "360 days"];
    details.bookingleadday = msg.bookingleadday;
    details.languages = JSON.stringify(msg.languages);
    setPersonalTrainingDetails(details);

    //if message exists - show form only for edit and view
    if (["edit", "view"].indexOf(operation.type) > -1) modalTrigger.next(true);
    else OnSubmit(null);
  }

  useEffect(() => {
    if (operation.type === "create") {
      setPersonalTrainingDetails({});
    }
  }, [operation.type]);

  function FetchData() {
    useQuery(GET_SINGLE_PACKAGE_BY_ID, {
      variables: { id: operation.id },
      skip: operation.type === "create" || !operation.id,
      onCompleted: (e: any) => {
        FillDetails(e);
      },
    });
  }

  function CreatePackage(frm: any) {
    frmDetails = frm;
    frm.equipmentList = JSON.parse(frm.equipmentList)
      .map((x: any) => x.id)
      .join(",")
      .split(",");
    frm.disciplines = JSON.parse(frm.disciplines)
      .map((x: any) => x.id)
      .join(", ")
      .split(", ");
    frm.programDetails = JSON.parse(frm.programDetails);
    frm.datesConfig = frm.datesConfig
      ? JSON.parse(frm.datesConfig)
      : {
          publishingDate: `${moment()
            .add(1, "days")
            .format("YYYY-MM-DDTHH:mm")}`,
          expiry_date: `${moment()
            .add({ days: 1, year: 1 })
            .format("YYYY-MM-DDTHH:mm")}`,
        };
    frm.languages = JSON.parse(frm.languages);

    createPackage({
      variables: {
        packagename: frm.packagename,
        tags: frm?.tags,
        level: ENUM_FITNESSPACKAGE_LEVEL[frm.level],
        SubscriptionDuration: frm.durationOfOffering,
        intensity: ENUM_FITNESSPACKAGE_INTENSITY[frm.intensity],
        aboutpackage: frm.About,
        benefits: frm.Benifits,
        mode: ENUM_FITNESSPACKAGE_MODE[frm.programDetails.mode],
        address: frm.programDetails?.address[0]?.id,
        disciplines: frm.disciplines,
        ptoffline: frm.programDetails?.offline,
        ptonline: frm.programDetails?.online,
        restdays: frm.programDetails?.rest,
        bookingleadday: frm.bookingleadday,
        is_private: frm.visibility === 1 ? true : false,
        fitness_package_type: fitnessTypes[0].id,
        fitnesspackagepricing: JSON.parse(frm.pricingDetail).filter(
          (item: any) => item.mrp !== null
        ),
        ptclasssize: ENUM_FITNESSPACKAGE_PTCLASSSIZE[frm.classSize],
        users_permissions_user: frm.user_permissions_user,
        publishing_date: moment(frm.datesConfig?.publishingDate).toISOString(),
        expiry_date: moment(frm.datesConfig?.expiry_date).toISOString(),
        thumbnail: frm.thumbnail,
        upload: frm?.Upload?.upload,
        equipmentList: frm.equipmentList,
        videoUrl: frm?.Upload?.VideoUrl,
        client_address: `${
          frm.programDetails.distance ? frm.programDetails.distance : null
        } ${
          frm.programDetails.clientAddress
            ? frm.programDetails.clientAddress
            : null
        }`,
        languages: frm.languages
          .map((item: any) => item.id)
          .join(", ")
          .split(", "),
      },
    });
  }

  function EditPackage(frm: any) {
    frmDetails = frm;
    frm.equipmentList = JSON.parse(frm.equipmentList)
      .map((x: any) => x.id)
      .join(",")
      .split(",");
    frm.disciplines = JSON.parse(frm.disciplines)
      .map((x: any) => x.id)
      .join(", ")
      .split(", ");
    frm.programDetails = JSON.parse(frm.programDetails);
    frm.datesConfig = JSON.parse(frm.datesConfig);
    frm.languages = JSON.parse(frm.languages);

    editPackage({
      variables: {
        id: operation.id,
        packagename: frm.packagename,
        SubscriptionDuration: frm.durationOfOffering,
        tags: frm?.tags,
        client_address: `${frm.programDetails.distance ? frm.programDetails.distance : null} ${
          frm.programDetails.clientAddress ? frm.programDetails.clientAddress : null
        }`,
        level: ENUM_FITNESSPACKAGE_LEVEL[frm.level],
        intensity: ENUM_FITNESSPACKAGE_INTENSITY[frm.intensity],
        aboutpackage: frm.About,
        benefits: frm.Benifits,
        mode: ENUM_FITNESSPACKAGE_MODE[frm.programDetails.mode],
        address: frm.programDetails?.address[0]?.id,
        disciplines: frm.disciplines,
        ptoffline: frm.programDetails?.offline,
        is_private: frm.visibility === 1 ? true : false,
        ptonline: frm.programDetails?.online,
        restdays: frm.programDetails?.rest,
        bookingleadday: frm.bookingleadday,
        fitness_package_type: fitnessTypes[0].id,
        fitnesspackagepricing: JSON.parse(frm.pricingDetail).filter(
          (item: any) => item.mrp !== null
        ),
        ptclasssize: ENUM_FITNESSPACKAGE_PTCLASSSIZE[frm.classSize],
        users_permissions_user: frm.user_permissions_user,
        publishing_date: moment(frm.datesConfig?.publishingDate).toISOString(),
        expiry_date: moment(frm.datesConfig?.expiry_date).toISOString(),
        thumbnail: frm.thumbnail,
        upload: frm?.Upload?.upload,
        equipmentList: frm.equipmentList,
        videoUrl: frm?.Upload?.VideoUrl,
        languages: frm.languages
          .map((item: any) => item.id)
          .join(", ")
          .split(", "),
      },
    });
  }

  function deleteChannelPackage(id: any) {
    deletePackage({ variables: { id } });
    setDeleteModalShow(false);
  }

  function updateChannelPackageStatus(id: string, status: boolean) {
    updatePackageStatus({
      variables: { id: id, Status: status ? false : true },
    });
    setStatusModalShow(false);
    operation.type = "create";
  }

  function OnSubmit(frm: any) {
    //bind user id
    if (frm) frm.user_permissions_user = auth.userid;

    switch (operation.type) {
      case "create":
        CreatePackage(frm);
        break;
      case "edit":
        EditPackage(frm);
        break;
      case "toggle-status":
        setStatusModalShow(true);
        break;
      case "delete":
        setDeleteModalShow(true);
        break;
    }
  }

  let name = "";
  if (operation.type === "create") {
    name = "Personal Training Offering";
  } else if (operation.type === "edit") {
    name = `Edit ${personalTrainingDetails.packagename}`;
  } else if (operation.type === "view") {
    name = `Viewing ${personalTrainingDetails.packagename}`;
  }

  FetchData();

  return (
    <>
      <ModalView
        name={name}
        isStepper={true}
        showErrorList={false}
        formUISchema={operation.type === "view" ? schemaView : schema}
        stepperValues={[
          "Creator",
          "Details",
          "Program",
          "Schedule",
          "Pricing",
          "Config",
        ]}
        formSchema={personalTrainingSchema}
        formSubmit={
          name === "View"
            ? () => {
                modalTrigger.next(false);
              }
            : (frm: any) => {
                OnSubmit(frm);
              }
        }
        formData={personalTrainingDetails}
        widgets={widgets}
        modalTrigger={modalTrigger}
        actionType={operation.type}
        customFormats={youtubeUrlCustomFormats}
        transformErrors={youtubeUrlTransformErrors}
      />

      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        show={deleteModalShow}
        centered
      >
        <Modal.Header
          closeButton
          onHide={() => {
            setDeleteModalShow(false);
          }}
        >
          <Modal.Title id="contained-modal-title-vcenter">
            Delete Package
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this package</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={() => {
              setDeleteModalShow(false);
            }}
          >
            No
          </Button>
          <Button
            variant="success"
            onClick={() => {
              deleteChannelPackage(operation.id);
            }}
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        show={statusModalShow}
        centered
      >
        <Modal.Header
          closeButton
          onHide={() => {
            setStatusModalShow(false);
          }}
        >
          <Modal.Title id="contained-modal-title-vcenter">
            Update Status
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to update the status of this package?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={() => {
              setStatusModalShow(false);
            }}
          >
            No
          </Button>
          <Button
            variant="success"
            onClick={() => {
              updateChannelPackageStatus(
                operation.id,
                operation.current_status
              );
            }}
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>

      {isFormSubmitted ? (
        <Toaster
          handleCallback={() => setIsFormSubmitted(false)}
          type="success"
          msg="Offering has been created successfully"
        />
      ) : null}

      {isOffeeringDeleted ? (
        <Toaster
          handleCallback={() => setisOffeeringDeleted(!isOffeeringDeleted)}
          type="success"
          msg="Offering has been deleted successfully"
        />
      ) : null}

      {isOfferingUpdated ? (
        <Toaster
          handleCallback={() => setisOfferingUpdated(!isOfferingUpdated)}
          type="success"
          msg="Offering has been updated successfully"
        />
      ) : null}
    </>
  );
}

export default React.forwardRef(CreateEditPt);
