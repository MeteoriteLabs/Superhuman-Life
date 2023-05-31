import React, { useContext, useImperativeHandle, useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import ModalView from '../../../../components/modal';
import {
  GET_SINGLE_PACKAGE_BY_ID,
  GET_FITNESS_PACKAGE_TYPES,
  GET_INVENTORY
} from '../graphQL/queries';
import {
  CREATE_PACKAGE,
  DELETE_PACKAGE,
  EDIT_PACKAGE,
  UPDATE_PACKAGE_STATUS,
  CREATE_NOTIFICATION,
  CREATE_OFFERING_INVENTORY,
  UPDATE_OFFERING_INVENTORY,
  CREATE_TAG,
  DELETE_OFFERING_INVENTORY
} from '../graphQL/mutations';
import { Modal, Button } from 'react-bootstrap';
import AuthContext from '../../../../context/auth-context';
import { schema, widgets } from './classicSchema';
import { schemaView } from './schemaView';
import { Subject } from 'rxjs';
import { flattenObj } from '../../../../components/utils/responseFlatten';
import moment from 'moment';
import Toaster from '../../../../components/Toaster';
import {
  youtubeUrlCustomFormats,
  youtubeUrlTransformErrors
} from '../../../../components/utils/ValidationPatterns';
import { OfferingInventory } from '../../interface/offeringInventory';

interface Operation {
  id: string;
  type: 'create' | 'edit' | 'view' | 'toggle-status' | 'delete';
  current_status: boolean;
}

function CreateEditPackage(props: any, ref: any) {
  const auth = useContext(AuthContext);
  const personalTrainingSchema: {
    [name: string]: any;
  } = require('./classic.json');
  const [classicDetails, setClassicDetails] = useState<any>({});
  const [fitnessTypes, setFitnessType] = useState<any[]>([]);
  const [operation, setOperation] = useState<Operation>({} as Operation);
  const [deleteModalShow, setDeleteModalShow] = useState<boolean>(false);
  const [deleteValidationModalShow, setDeleteValidationModalShow] = useState<boolean>(false);
  const [statusModalShow, setStatusModalShow] = useState<boolean>(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
  const [isOffeeringDeleted, setisOffeeringDeleted] = useState<boolean>(false);
  const [isOfferingUpdated, setisOfferingUpdated] = useState<boolean>(false);
  const [offeringInventoryDetails, setOfferingInventoryDetails] = useState<OfferingInventory>({} as OfferingInventory);

  let frmDetails: any = {};

  // eslint-disable-next-line
  const { data: inventories, refetch: refetch_inventories } = useQuery(
    GET_INVENTORY,

    {
      variables: { changemaker_id: auth.userid, fitnesspackageid: operation.id },
      skip: !operation.id,
      onCompleted: (response) => {
        const flattenInventoryData = flattenObj({ ...response.offeringInventories });

        if (flattenInventoryData && flattenInventoryData.length)
          setOfferingInventoryDetails(flattenInventoryData[0]);
        
        if (operation.type === "delete" && flattenInventoryData && flattenInventoryData.length && flattenInventoryData[0] && flattenInventoryData[0].ActiveBookings === 0)
          setDeleteModalShow(true);
        else
          setDeleteValidationModalShow(true);
      }
    }
  );

  useQuery(GET_FITNESS_PACKAGE_TYPES, {
    variables: { type: 'Classic Class' },
    onCompleted: (response) => {
      const flattenData = flattenObj({ ...response });
      setFitnessType(flattenData.fitnessPackageTypes);
    }
  });

  const [createTag] = useMutation(CREATE_TAG, {
    onCompleted: (response) => {
      modalTrigger.next(false);
     
      props.refetchTags();
      props.refetchOfferings();
      setIsFormSubmitted(!isFormSubmitted);
      window.open(`classic/session/scheduler/${response.createTag.data.id}`, '_self');
    }
  });

  const [createCohortNotification] = useMutation(CREATE_NOTIFICATION);
  const [createOfferingInventory] = useMutation(CREATE_OFFERING_INVENTORY);
  const [updateOfferingInventory] = useMutation(UPDATE_OFFERING_INVENTORY, {
    onCompleted: () => {
      modalTrigger.next(false);
     
      props.refetchTags();
      props.refetchOfferings();
      setisOfferingUpdated(!isOfferingUpdated);
    }
  });

  const [deleteOfferingInventory] = useMutation(DELETE_OFFERING_INVENTORY);

  const [createPackage] = useMutation(CREATE_PACKAGE, {
    onCompleted: (response) => {
      modalTrigger.next(false);
     
      props.refetchTags();
      props.refetchOfferings();
      const flattenData = flattenObj({ ...response });

      createOfferingInventory({
        variables: {
          data: {
            fitnesspackage: flattenData.createFitnesspackage.id,
            ClassSize: 5000,
            ClassAvailability: 5000,
            ActiveBookings: 0,
            changemaker_id: auth.userid,
            ClientBookingDetails: []
          }
        }
      });

      createCohortNotification({
        variables: {
          data: {
            type: 'Offerings',
            Title: 'New offering',
            OnClickRoute: '/offerings',
            users_permissions_user: auth.userid,
            Body: `New recorded offering ${flattenData.createFitnesspackage.packagename} has been added`,
            DateTime: moment().format(),
            IsRead: false
          }
        }
      });

      createTag({
        variables: {
          id: response.createFitnesspackage.data.id,
          tagName: frmDetails.packageName
        }
      });
    }
  });

  const [editPackage] = useMutation(EDIT_PACKAGE, {
    onCompleted: (data) => {
      const flattenData = flattenObj({ ...data });

      updateOfferingInventory({
        variables: {
          id: offeringInventoryDetails.id,
          data: {
            ClassSize: flattenData.updateFitnesspackage.classsize,
            InstantBooking: flattenData.updateFitnesspackage.groupinstantbooking
          }
        }
      });

    }
  });

  const [updatePackageStatus] = useMutation(UPDATE_PACKAGE_STATUS, {
    onCompleted: () => {
   
      props.refetchTags();
      props.refetchOfferings();
      setisOfferingUpdated(!isOfferingUpdated);
    }
  });

  const [deletePackage] = useMutation(DELETE_PACKAGE, {
    onCompleted: () => {
      // delete offering inventory

      deleteOfferingInventory({
        variables: { id: offeringInventoryDetails.id },
      });

      props.refetchTags();
      props.refetchOfferings();
      setisOffeeringDeleted(!isOffeeringDeleted);
    }
  });

  const modalTrigger = new Subject();

  useImperativeHandle(ref, () => ({
    TriggerForm: (msg: Operation) => {
      setOperation(msg);

      if (msg.type === 'toggle-status') {
        setStatusModalShow(true);
      }

      if (msg.type === 'delete' && offeringInventoryDetails.ActiveBookings !== null ) {
        if (offeringInventoryDetails.ActiveBookings === 0 )
        setDeleteModalShow(true);
        else
        setDeleteValidationModalShow(true);
      }

      // restrict to render for delete and toggle status operation
      if (msg.type !== 'delete' && msg.type !== 'toggle-status') {
        modalTrigger.next(true);
      }
    }
  }));

  enum ENUM_FITNESSPACKAGE_LEVEL {
    Beginner,
    Intermediate,
    Advanced
  }

  enum ENUM_FITNESSPACKAGE_INTENSITY {
    Low,
    Moderate,
    High
  }

  enum ENUM_FITNESSPACKAGE_MODE {
    Online,
    Offline,
    Hybrid,
    Online_workout,
    Offline_workout,
    Residential
  }

  const PRICING_TABLE_DEFAULT = [
    {
      mrp: null,
      suggestedPrice: null,
      voucher: 0,
      duration: 1,
      sapienPricing: null
    }
  ];

  function FillDetails(data: any) {
    const flattenedData = flattenObj({ ...data });
    const msg = flattenedData.fitnesspackages[0];
    const bookingConfig: any = {};
    const details: any = {};

    for (let i = 0; i < msg.fitnesspackagepricing.length; i++) {
      PRICING_TABLE_DEFAULT[i].mrp = msg.fitnesspackagepricing[i].mrp;
      PRICING_TABLE_DEFAULT[i].suggestedPrice = msg.fitnesspackagepricing[i].suggestedPrice;
      PRICING_TABLE_DEFAULT[i].voucher = msg.fitnesspackagepricing[i].voucher;
      PRICING_TABLE_DEFAULT[i].sapienPricing = msg.fitnesspackagepricing[i].sapienPricing;
      PRICING_TABLE_DEFAULT[i].duration = msg.recordedclasses;
    }
    details.About = msg.aboutpackage;
    details.Benifits = msg.benefits;
    details.packagename = msg.packagename;
    details.equipmentList = msg.equipment_lists;
    details.disciplines = msg.fitnessdisciplines;
    details.channelinstantBooking = msg.groupinstantbooking;
    details.expiryDate = moment(msg.expirydate).format('YYYY-MM-DD');
    details.level = ENUM_FITNESSPACKAGE_LEVEL[msg.level];
    details.intensity = ENUM_FITNESSPACKAGE_INTENSITY[msg.Intensity];
    details.pricingDetail =
      msg.fitnesspackagepricing[0]?.mrp === 'free' ? 'free' : JSON.stringify(PRICING_TABLE_DEFAULT);
    details.publishingDate = moment(msg.publishing_date).format('YYYY-MM-DD');
    details.tags = msg?.tags === null ? '' : msg.tags;
    details.user_permissions_user = msg.users_permissions_user.id;
    details.visibility = msg.is_private === true ? 1 : 0;
    bookingConfig.config = msg.booking_config?.isAuto === true ? 'Auto' : 'Manual';
    bookingConfig.bookings = msg.booking_config?.bookingsPerDay;
    bookingConfig.fillSchedule = msg.booking_config?.is_Fillmyslots;
    details.config = { bookingConfig: JSON.stringify(bookingConfig) };
    details.programDetails = JSON.stringify({
      duration: msg.duration,
      online: msg.recordedclasses,
      rest: msg.restdays
    });
    details.thumbnail = msg.Thumbnail_ID;
    details.Upload =
      msg.Upload_ID === null ? { VideoUrl: msg.video_URL } : { upload: msg.Upload_ID };
    details.datesConfig = JSON.stringify({
      expiryDate: msg.expiry_date,
      publishingDate: msg.publishing_date
    });
    details.bookingleadday = msg.bookingleadday;
    details.bookingConfigId = msg.booking_config?.id;
    details.languages = JSON.stringify(msg.languages);
    setClassicDetails(details);

    //if message exists - show form only for edit and view
    if (['edit', 'view'].indexOf(operation.type) > -1) modalTrigger.next(true);
    else OnSubmit(null);
  }

  useEffect(() => {
    if (operation.type === 'create') {
      setClassicDetails({});
    }
  }, [operation.type]);

  function FetchData() {
    useQuery(GET_SINGLE_PACKAGE_BY_ID, {
      variables: { id: operation.id },
      skip: operation.type === 'create' || !operation.id,
      onCompleted: (e: any) => {
        FillDetails(e);
      }
    });
  }

  function CreatePackage(frm: any) {
    frmDetails = frm;
    frm.equipmentList = JSON.parse(frm.equipmentList)
      .map((x: any) => x.id)
      .join(',')
      .split(',');
    frm.disciplines = JSON.parse(frm.disciplines)
      .map((x: any) => x.id)
      .join(', ')
      .split(', ');
    frm.programDetails = JSON.parse(frm.programDetails);
    frm.datesConfig = frm.datesConfig
      ? JSON.parse(frm.datesConfig)
      : {
          publishingDate: `${moment().add(1, 'days').format('YYYY-MM-DDTHH:mm')}`,
          expiry_date: `${moment().add({ days: 1, year: 1 }).format('YYYY-MM-DDTHH:mm')}`
        };
    frm.languages = JSON.parse(frm.languages);

    createPackage({
      variables: {
        packagename: frm.packagename,
        tags: frm?.tags,
        level: ENUM_FITNESSPACKAGE_LEVEL[frm.level],
        intensity: ENUM_FITNESSPACKAGE_INTENSITY[frm.intensity],
        aboutpackage: frm.About,
        benefits: frm.Benifits,
        mode: ENUM_FITNESSPACKAGE_MODE[frm.programDetails.mode],
        disciplines: frm.disciplines,
        duration: frm.programDetails?.duration,
        recordedclasses: frm.programDetails?.online,
        restdays: frm.programDetails?.rest,
        is_private: frm.visibility === 1 ? true : false,
        bookingleadday: frm.bookingleaddat,
        fitness_package_type: fitnessTypes[0].id,
        fitnesspackagepricing:
          frm.pricingDetail === 'free'
            ? [{ mrp: 'free', duration: frm.programDetails.duration }]
            : JSON.parse(frm.pricingDetail),
        users_permissions_user: frm.user_permissions_user,
        publishing_date: moment(frm.datesConfig?.publishingDate).toISOString(),
        expiry_date: moment(frm.datesConfig?.expiryDate).toISOString(),
        thumbnail: frm.thumbnail,
        upload: frm?.Upload?.upload,
        equipmentList: frm.equipmentList,
        videoUrl: frm?.Upload?.VideoUrl,
        languages: frm.languages
          .map((item: any) => item.id)
          .join(', ')
          .split(', ')
      }
    });
  }

  function EditPackage(frm: any) {
    frmDetails = frm;
    frm.equipmentList = JSON.parse(frm.equipmentList)
      .map((x: any) => x.id)
      .join(',')
      .split(',');
    frm.disciplines = JSON.parse(frm.disciplines)
      .map((x: any) => x.id)
      .join(', ')
      .split(', ');
    frm.programDetails = JSON.parse(frm.programDetails);
    frm.datesConfig = JSON.parse(frm.datesConfig);
    frm.languages = JSON.parse(frm.languages);

    editPackage({
      variables: {
        id: operation.id,
        packagename: frm.packagename,
        tags: frm?.tags,
        level: ENUM_FITNESSPACKAGE_LEVEL[frm.level],
        intensity: ENUM_FITNESSPACKAGE_INTENSITY[frm.intensity],
        aboutpackage: frm.About,
        benefits: frm.Benifits,
        mode: ENUM_FITNESSPACKAGE_MODE[frm.programDetails.mode],
        disciplines: frm.disciplines,
        duration: frm.programDetails?.duration,
        recordedclasses: frm.programDetails?.online,
        restdays: frm.programDetails?.rest,
        is_private: frm.visibility === 1 ? true : false,
        bookingleadday: frm.bookingleaddat,
        fitness_package_type: fitnessTypes[0].id,
        fitnesspackagepricing:
          frm.pricingDetail === 'free'
            ? [{ mrp: 'free', duration: frm.programDetails.duration }]
            : JSON.parse(frm.pricingDetail),
        users_permissions_user: frm.user_permissions_user,
        publishing_date: moment(frm.datesConfig?.publishingDate).toISOString(),
        expiry_date: moment(frm.datesConfig?.expiryDate).toISOString(),
        thumbnail: frm.thumbnail,
        upload: frm?.Upload?.upload,
        equipmentList: frm.equipmentList,
        videoUrl: frm?.Upload?.VideoUrl,
        languages: frm.languages
          .map((item: any) => item.id)
          .join(', ')
          .split(', ')
      }
    });
  }

  function deleteChannelPackage(id: any) {
    deletePackage({ variables: { id } });
    setDeleteModalShow(false);
  }

  function updateChannelPackageStatus(id: any, status: any) {
    updatePackageStatus({ variables: { id: id, Status: status } });
    setStatusModalShow(false);
    operation.type = 'create';
  }

  function OnSubmit(frm: any) {
    //bind user id
    if (frm) frm.user_permissions_user = auth.userid;

    switch (operation.type) {
      case 'create':
        CreatePackage(frm);
        break;
      case 'edit':
        EditPackage(frm);
        break;
      case 'toggle-status':
        setStatusModalShow(true);
        break;
      case 'delete':
        if (offeringInventoryDetails.ActiveBookings === 0) setDeleteModalShow(true);
        else setDeleteValidationModalShow(true);
        break;
    }
  }

  let name = '';
  if (operation.type === 'create') {
    name = 'Recorded Offering';
  } else if (operation.type === 'edit') {
    name = `Edit ${classicDetails.packagename}`;
  } else if (operation.type === 'view') {
    name = `Viewing ${classicDetails.packagename}`;
  }

  FetchData();

  return (
    <>
      <ModalView
        name={name}
        isStepper={true}
        showErrorList={false}
        formUISchema={operation.type === 'view' ? schemaView : schema}
        stepperValues={['Creator', 'Details', 'Program', 'Pricing', 'Config']}
        formSchema={personalTrainingSchema}
        formSubmit={
          name === 'View'
            ? () => {
                modalTrigger.next(false);
              }
            : (frm: any) => {
                OnSubmit(frm);
              }
        }
        formData={classicDetails}
        widgets={widgets}
        modalTrigger={modalTrigger}
        actionType={operation.type}
        customFormats={youtubeUrlCustomFormats}
        transformErrors={youtubeUrlTransformErrors}
      />

      {/* Delete modal validation (if classAvailability is greater than zero show this dailouge box) */}
      {
        offeringInventoryDetails && offeringInventoryDetails.ActiveBookings > 0 ? 
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        show={deleteValidationModalShow}
        centered>
        <Modal.Header
          closeButton
          onHide={() => {
            setDeleteValidationModalShow(false);
          }}>
          <Modal.Title id="contained-modal-title-vcenter">
            Oops!! Can&apos;t delete this Package
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Oops !! You are having <strong>active clients</strong> for this offering , So, you
            can&apos;t delete it.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="success"
            onClick={() => {
              setDeleteValidationModalShow(false);
            }}>
            Close
          </Button>
        </Modal.Footer>
      </Modal> : null }

      {/* Delete Modal */}
      {
        offeringInventoryDetails && offeringInventoryDetails.ActiveBookings === 0 ? 
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        show={deleteModalShow}
        centered>
        <Modal.Header
          closeButton
          onHide={() => {
            setDeleteModalShow(false);
          }}>
          <Modal.Title id="contained-modal-title-vcenter">Delete Package</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this package</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={() => {
              setDeleteModalShow(false);
            }}>
            No
          </Button>
          <Button
            variant="success"
            onClick={() => {
              deleteChannelPackage(operation.id);
            }}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal> : null }

      {/* Change Status modal */}
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        show={statusModalShow}
        centered>
        <Modal.Header
          closeButton
          onHide={() => {
            setStatusModalShow(false);
          }}>
          <Modal.Title id="contained-modal-title-vcenter">Update Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to update the status of this package?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={() => {
              setStatusModalShow(false);
            }}>
            No
          </Button>
          <Button
            variant="success"
            onClick={() => {
              updateChannelPackageStatus(operation.id, operation.current_status);
            }}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>

      {isFormSubmitted ? (
        <Toaster
          handleCallback={() => setIsFormSubmitted(false)}
          type="success"
          msg="Offering has been Created successfully"
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

export default React.forwardRef(CreateEditPackage);
