import React, { useContext, useImperativeHandle, useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import ModalView from '../../../../components/modal';
import {
  CREATE_CHANNEL_PACKAGE,
  DELETE_PACKAGE,
  UPDATE_PACKAGE_STATUS,
  UPDATE_CHANNEL_COHORT_PACKAGE,
  CREATE_NOTIFICATION,
  CREATE_OFFERING_INVENTORY,
  UPDATE_OFFERING_INVENTORY,
  CREATE_TAG,
  DELETE_OFFERING_INVENTORY
} from '../graphQL/mutations';
import {
  GET_FITNESS_PACKAGE_TYPE,
  GET_SINGLE_PACKAGE_BY_ID,
  GET_INVENTORY
} from '../graphQL/queries';
import AuthContext from '../../../../context/auth-context';
import { schema, widgets } from './channelSchema';
import { schemaView } from './schemaView';
import { editLiveStreamSchema } from './editLiveStreamSchema';
import { Subject } from 'rxjs';
import { flattenObj } from '../../../../components/utils/responseFlatten';
import moment from 'moment';
import { Modal, Button } from 'react-bootstrap';
import Toaster from '../../../../components/Toaster';
import {
  youtubeUrlCustomFormats,
  youtubeUrlTransformErrors
} from '../../../../components/utils/ValidationPatterns';
import { OfferingInventory } from '../../interface/offeringInventory';

interface Operation {
  id: string;
  packageType: 'Cohort' | 'Live Stream Channel';
  type: 'create' | 'edit' | 'view' | 'toggle-status' | 'delete';
  current_status: boolean;
  total_records: number|null;
}

function CreateEditChannel(props: any, ref: any) {
  const auth = useContext(AuthContext);
  const programSchema: { [name: string]: any } = require('./channel.json');
  const [programDetails, setProgramDetails] = useState<any>({});
  const [operation, setOperation] = useState<Operation>({} as Operation);
  const [fitnessPackageTypes, setFitnessPackageTypes] = useState<any>([]);
  const [deleteModalShow, setDeleteModalShow] = useState<boolean>(false);
  const [deleteValidationModalShow, setDeleteValidationModalShow] = useState<boolean>(false);
  const [statusModalShow, setStatusModalShow] = useState<boolean>(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
  const [isOffeeringDeleted, setisOffeeringDeleted] = useState<boolean>(false);
  const [isOfferingUpdated, setisOfferingUpdated] = useState<boolean>(false);
  const [offeringInventoryDetails, setOfferingInventoryDetails] = useState<OfferingInventory>(
    {} as OfferingInventory
  );

  let frmDetails: any = {};

  // eslint-disable-next-line
  const { data: inventories, refetch: refetch_inventories } = useQuery(
    GET_INVENTORY,

    {
      variables: { changemaker_id: auth.userid, fitnesspackageid: operation.id, pageSize: props.totalRecords },
      skip: !operation.id,
      onCompleted: (response) => {
        console.log(response);
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

  const [editPackageDetails] = useMutation(UPDATE_CHANNEL_COHORT_PACKAGE, {
    onCompleted: (data) => {
      modalTrigger.next(false);

      props.refetchTags();
      props.refetchOfferings();
      setisOfferingUpdated(!isOfferingUpdated);
      const flattenData = flattenObj({ ...data });

      updateOfferingInventory({
        variables: {
          id: offeringInventoryDetails.id,
          data: {
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

  const [deleteOfferingInventory] = useMutation(DELETE_OFFERING_INVENTORY);

  const [deletePackage] = useMutation(DELETE_PACKAGE, {
    onCompleted: () => {
      // delete offering inventory
      deleteOfferingInventory({
        variables: { id: offeringInventoryDetails.id }
      });

      props.refetchTags();
      props.refetchOfferings();
      setisOffeeringDeleted(!isOffeeringDeleted);
    }
  });

  const [createTag] = useMutation(CREATE_TAG, {
    onCompleted: (response) => {
      modalTrigger.next(false);

      props.refetchTags();
      props.refetchOfferings();
      setIsFormSubmitted(!isFormSubmitted);
      window.open(`channel/session/scheduler/${response.createTag.data.id}`, '_self');
    }
  });

  const [createLiveStreamNotification] = useMutation(CREATE_NOTIFICATION);
  const [createOfferingInventory] = useMutation(CREATE_OFFERING_INVENTORY);
  const [updateOfferingInventory] = useMutation(UPDATE_OFFERING_INVENTORY);

  const [CreatePackage] = useMutation(CREATE_CHANNEL_PACKAGE, {
    onCompleted: (response) => {
      const flattenData = flattenObj({ ...response });

      createOfferingInventory({
        variables: {
          data: {
            fitnesspackage: flattenData.createFitnesspackage.id,
            ActiveBookings: 0,
            ClassSize: 5000,
            ClassAvailability: 5000,
            changemaker_id: auth.userid,
            InstantBooking: flattenData.createFitnesspackage.groupinstantbooking,
            ClientBookingDetails: []
          }
        }
      });

      createLiveStreamNotification({
        variables: {
          data: {
            type: 'Offerings',
            Title: 'New offering',
            OnClickRoute: '/offerings',
            users_permissions_user: auth.userid,
            Body: `New live stream offering ${flattenData.createFitnesspackage.packagename} has been added`,
            DateTime: moment().format(),
            IsRead: false,
            ContactID: flattenData.createFitnesspackage.id
          }
        }
      });

      createTag({
        variables: {
          id: response.createFitnesspackage.data.id,
          tagName: frmDetails.channelName
        }
      });
    }
  });

  useQuery(GET_FITNESS_PACKAGE_TYPE, {
    onCompleted: (data) => {
      const flattenData = flattenObj({ ...data });
      setFitnessPackageTypes(flattenData.fitnessPackageTypes);
    }
  });
  
  const modalTrigger = new Subject();
  useImperativeHandle(ref, () => ({
    TriggerForm: (msg: Operation) => {
      setOperation(msg);
      schema.startDate = props.startDate;
      schema.duration = props.duration;

      if (msg.type === 'toggle-status') {
        setStatusModalShow(true);
      }

      if (msg.type === 'delete' && offeringInventoryDetails.ActiveBookings !== null ) {
        if (offeringInventoryDetails.ActiveBookings === 0 )
        setDeleteModalShow(true);
        else
        setDeleteValidationModalShow(true);
      }

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

  const PRICING_TABLE_DEFAULT = [
    {
      mrp: null,
      suggestedPrice: null,
      voucher: 0,
      duration: 30,
      sapienPricing: null
    },
    {
      mrp: null,
      suggestedPrice: null,
      voucher: 0,
      duration: 90,
      sapienPricing: null
    },
    {
      mrp: null,
      suggestedPrice: null,
      voucher: 0,
      duration: 180,
      sapienPricing: null
    },
    {
      mrp: null,
      suggestedPrice: null,
      voucher: 0,
      duration: 360,
      sapienPricing: null
    }
  ];

  const PRICING_TABLE_DEFAULT_WITH_INSTANTBOOKING = [
    {
      mrp: null,
      suggestedPrice: null,
      voucher: 0,
      duration: 1,
      sapienPricing: null
    },
    {
      mrp: null,
      suggestedPrice: null,
      voucher: 0,
      duration: 30,
      sapienPricing: null
    },
    {
      mrp: null,
      suggestedPrice: null,
      voucher: 0,
      duration: 90,
      sapienPricing: null
    },
    {
      mrp: null,
      suggestedPrice: null,
      voucher: 0,
      duration: 180,
      sapienPricing: null
    },
    {
      mrp: null,
      suggestedPrice: null,
      voucher: 0,
      duration: 360,
      sapienPricing: null
    }
  ];

  function FillDetails(data: any) {
    const flattenData = flattenObj({ ...data });
    const msg: any = flattenData.fitnesspackages[0];
    const details: any = {};

    if (msg.groupinstantbooking) {
      for (let i = 0; i < msg.fitnesspackagepricing.length; i++) {
        PRICING_TABLE_DEFAULT_WITH_INSTANTBOOKING[i].mrp = msg.fitnesspackagepricing[i].mrp;
        PRICING_TABLE_DEFAULT_WITH_INSTANTBOOKING[i].suggestedPrice =
          msg.fitnesspackagepricing[i].suggestedPrice;
        PRICING_TABLE_DEFAULT_WITH_INSTANTBOOKING[i].voucher = msg.fitnesspackagepricing[i].voucher;
        PRICING_TABLE_DEFAULT_WITH_INSTANTBOOKING[i].sapienPricing =
          msg.fitnesspackagepricing[i].sapienPricing;
      }
    } else {
      for (let j = 0; j < msg.fitnesspackagepricing.length; j++) {
        PRICING_TABLE_DEFAULT[j].mrp = msg.fitnesspackagepricing[j].mrp;
        PRICING_TABLE_DEFAULT[j].suggestedPrice = msg.fitnesspackagepricing[j].suggestedPrice;
        PRICING_TABLE_DEFAULT[j].voucher = msg.fitnesspackagepricing[j].voucher;
        PRICING_TABLE_DEFAULT[j].sapienPricing = msg.fitnesspackagepricing[j].sapienPricing;
      }
    }
    details.About = msg.aboutpackage;
    details.Benifits = msg.benefits;
    details.channelName = msg.packagename;
    details.equipment = msg.equipment_lists;
    details.discpline = JSON.stringify(msg.fitnessdisciplines);
    details.channelinstantBooking = JSON.stringify({
      instantBooking: msg.groupinstantbooking,
      freeDemo: msg.Is_free_demo
    });
    details.dates = JSON.stringify({
      startDate: moment(msg.Start_date).format('YYYY-MM-DD'),
      endDate: moment(msg.End_date).format('YYYY-MM-DD')
    });
    details.level = ENUM_FITNESSPACKAGE_LEVEL[msg.level];
    details.pricing =
      msg.fitnesspackagepricing[0]?.mrp === 'free'
        ? 'free'
        : JSON.stringify(
            msg.groupinstantbooking
              ? PRICING_TABLE_DEFAULT_WITH_INSTANTBOOKING
              : PRICING_TABLE_DEFAULT
          );
    details.durationOfOffering = msg.SubscriptionDuration
      ? msg.SubscriptionDuration
      : ['1 day', '30 days', '90 days', '180 days', '360 days'];
    details.publishingDate = moment(msg.publishing_date).format('YYYY-MM-DD');
    details.tag = msg?.tags === null ? '' : msg.tags;
    details.user_permissions_user = msg.users_permissions_user.id;
    details.visibility = msg.is_private === true ? 1 : 0;
    details.thumbnail = msg.Thumbnail_ID;
    details.Upload =
      msg.Upload_ID === null ? { VideoUrl: msg.video_URL } : { upload: msg.Upload_ID };
    details.datesConfig = JSON.stringify({
      expiryDate: msg.expiry_date,
      publishingDate: msg.publishing_date
    });
    details.bookingConfigId = msg.booking_config?.id;
    details.languages = JSON.stringify(msg.languages);
    setProgramDetails(details);

    //if message exists - show form only for edit and view
    if (['edit', 'view'].indexOf(operation.type) > -1) modalTrigger.next(true);
    else OnSubmit(null);
  }

  useEffect(() => {
    if (operation.type === 'create') {
      setProgramDetails({});
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

  function findPackageType(creationType: any) {
    const foundType = fitnessPackageTypes.find((item: any) => item.type === creationType);
    return foundType.id;
  }

  function calculateDuration(sd, ed) {
    const start = moment(sd);
    const end = moment(ed);
    const duration: number = end.diff(start, 'days');
    return duration;
  }

  function CreateChannelPackage(frm: any) {
    frmDetails = frm;
    frm.datesConfig = frm.datesConfig
      ? JSON.parse(frm.datesConfig)
      : {
          publishingDate: `${moment().add(1, 'days').format('YYYY-MM-DDTHH:mm')}`,
          expiry_date: `${moment().add({ days: 1, year: 1 }).format('YYYY-MM-DDTHH:mm')}`
        };
    frm.dates = frm.dates
      ? JSON.parse(frm.dates)
      : {
          startDate: `${moment().add(1, 'days').format('YYYY-MM-DD')}`,
          endDate: `${moment(frm.dates.startDate).add(360, 'days')}`
        };

    if (frm.equipment) {
      frm.equipment = JSON.parse(frm?.equipment);
    }
    if (frm.discpline) {
      frm.discpline = JSON.parse(frm?.discpline);
    }
    frm.languages = JSON.parse(frm.languages);

    CreatePackage({
      variables: {
        SubscriptionDuration: frm.durationOfOffering,
        aboutpackage: frm.About,
        benefits: frm.Benifits,
        packagename: frm.channelName,
        channelinstantBooking: JSON.parse(frm.channelinstantBooking).instantBooking,
        Is_free_demo: JSON.parse(frm.channelinstantBooking).freeDemo,
        expiry_date: moment(frm.datesConfig?.expiryDate).toISOString(),
        level: ENUM_FITNESSPACKAGE_LEVEL[frm.level],
        equipmentList:
          frm?.equipment?.length > 0
            ? frm.equipment
                .map((item: any) => item.id)
                .join(', ')
                .split(', ')
            : [],
        fitnessdisciplines:
          frm?.discpline?.length > 0
            ? frm.discpline
                .map((item: any) => item.id)
                .join(', ')
                .split(', ')
            : [],
        duration:
          frm.dates.startDate === frm.dates.endDate
            ? 1
            : calculateDuration(frm.dates.startDate, frm.dates.endDate),
        fitnesspackagepricing:
          frm.pricing === 'free'
            ? [{ mrp: 'free' }]
            : JSON.parse(frm.pricing).filter((item: any) => item.mrp !== null),
        publishing_date: moment(frm.datesConfig?.publishingDate).toISOString(),
        tags: frm?.tag,
        users_permissions_user: frm.user_permissions_user,
        fitness_package_type: findPackageType(operation.packageType),
        is_private: frm.visibility === 0 ? false : true,
        thumbnail: frm.thumbnail,
        upload: frm.Upload?.upload,
        videoUrl: frm.Upload?.VideoUrl,
        languages: frm.languages
          .map((item: any) => item.id)
          .join(', ')
          .split(', '),
        Start_date: moment.utc(frm.dates.startDate).format(),
        End_date: moment(frm.dates.startDate).add(360, 'days').toISOString()
      }
    });
  }

  function editChannelPackege(frm: any) {
    frmDetails = frm;
    frm.datesConfig = JSON.parse(frm.datesConfig);
    frm.dates = JSON.parse(frm.dates);
    if (frm.equipment) {
      frm.equipment = JSON.parse(frm?.equipment);
    }
    if (frm.discpline) {
      frm.discpline = JSON.parse(frm?.discpline);
    }
    frm.languages = JSON.parse(frm.languages);

    editPackageDetails({
      variables: {
        SubscriptionDuration: frm.durationOfOffering,
        id: operation.id,
        aboutpackage: frm.About,
        benefits: frm.Benifits,
        packagename: frm.channelName,
        channelinstantBooking: JSON.parse(frm.channelinstantBooking).instantBooking,
        Is_free_demo: JSON.parse(frm.channelinstantBooking).freeDemo,
        expiry_date: moment(frm.datesConfig?.expiryDate).toISOString(),
        level: ENUM_FITNESSPACKAGE_LEVEL[frm.level],
        equipmentList:
          frm?.equipment?.length > 0
            ? frm.equipment
                .map((item: any) => item.id)
                .join(', ')
                .split(', ')
            : [],
        fitnessdisciplines:
          frm?.discpline?.length > 0
            ? frm.discpline
                .map((item: any) => item.id)
                .join(', ')
                .split(', ')
            : [],
        duration:
          frm.dates.startDate === frm.dates.endDate
            ? 1
            : calculateDuration(frm.dates.startDate, frm.dates.endDate),
        fitnesspackagepricing:
          frm.pricing === 'free'
            ? [{ mrp: 'free' }]
            : JSON.parse(frm.pricing).filter((item: any) => item.mrp !== null),
        publishing_date: moment(frm.datesConfig?.publishingDate).toISOString(),
        tags: frm?.tag,
        users_permissions_user: frm.user_permissions_user,
        fitness_package_type: findPackageType(operation.packageType),
        is_private: frm.visibility === 0 ? false : true,
        thumbnail: frm.thumbnail,
        upload: frm.Upload?.upload,
        videoUrl: frm.Upload?.VideoUrl,
        languages: frm.languages
          .map((item: any) => item.id)
          .join(', ')
          .split(', '),
        Start_date: moment(frm.dates.startDate).toISOString(),
        End_date: moment(frm.dates.startDate).add(360, 'days').toISOString()
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
    if (frm) {
      frm.user_permissions_user = auth.userid;
    }

    switch (operation.type) {
      case 'create':
        CreateChannelPackage(frm);
        break;
      case 'edit':
        editChannelPackege(frm);
        break;
      case 'toggle-status':
        setStatusModalShow(true);
        break;
    
    }
  }

  FetchData();

  let name = '';
  if (operation.type === 'create') {
    name = 'Live Stream Offering';
  } else if (operation.type === 'edit') {
    name = `Edit ${programDetails.channelName}`;
  } else if (operation.type === 'view') {
    name = `Viewing ${programDetails.channelName}`;
  }

  return (
    <>
      <ModalView
        type={operation.type}
        name={name}
        isStepper={true}
        showErrorList={false}
        formUISchema={
          operation.type === 'view'
            ? schemaView
            : operation.type === 'edit'
            ? editLiveStreamSchema
            : schema
        }
        formSchema={programSchema}
        formSubmit={
          name === 'View'
            ? () => {
                modalTrigger.next(false);
              }
            : (frm: any) => {
                OnSubmit(frm);
              }
        }
        formData={programDetails}
        widgets={widgets}
        stepperValues={['Creator', 'Details', 'Schedule', 'Pricing', 'Config']}
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
      </Modal> : null
      }
      

      {/* Delete modal */}
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
      </Modal>
      : null

      }
      

      {/* Change status modal */}
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

export default React.forwardRef(CreateEditChannel);
