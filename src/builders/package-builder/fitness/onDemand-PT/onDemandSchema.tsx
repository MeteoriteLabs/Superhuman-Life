import Upload from '../../../../components/upload/upload';
import DatesConfig from '../../../../components/customWidgets/datesConfig';
import FitnessSelect from '../../../../components/customWidgets/fitnessMultiSelect';
import EquipmentSelect from '../../../../components/customWidgets/equipmentListSelect';
import PtProgramDetails from './onDemandProgramDetails';
import PTPricingTable from './onDemandPricingtable';
import PTPreview from './onDemandPreview';

export const widgets = {
     datesConfig: DatesConfig,
     fitnessSelect: FitnessSelect,
     equipmentSelect: EquipmentSelect,
     ptProgramDetails: PtProgramDetails,
     ptPricingTable: PTPricingTable,
     ptPreview: PTPreview,
}

export const schema: any = {  
     "disciplines": {
          "ui:widget": "fitnessSelect",
     },
     "equipmentList": {
          "ui:widget": "equipmentSelect",
     },
     "level": {
          "ui:widget": "radio",
          "ui:options": {
              "inline": true
          }
      },
     "intensity": {
          "ui:widget": "radio",
          "ui:options": {
              "inline": true
          }
     },
     "classSize": {
          "ui:widget": "radio",
          "ui:options": {
               "inline": true
          }
     },
     "About": {
          "ui:widget": "textarea",
          "ui:autofocus": true,
          "ui:options": {
              "rows": 3
          },
          "ui:placeholder": "About the program",
      },
      "Benifits": {
          "ui:widget": "textarea",
          "ui:options": {
              "rows": 3,
          },
          "ui:placeholder": "Benifits of the program",
      },
     "thumbnail": {
          "ui:widget": (props: any) => {
               return <Upload allowImage={true} allowVideo={true} onChange={props.onChange} value={props.value} title={'Thumbnail'} />;
          },
      },
     "Upload": {
          "upload": {
               "ui:widget": (props: any) => {
                    console.log(props)
                    return <Upload allowImage={true} allowVideo={true} onChange={props.onChange} value={props.value} />;
               },
          },  
          "VideoUrl": {
               "ui:placeholder": "https://"
          }
     },
     "programDetails": {
          "ui:widget": "ptProgramDetails"
     },
     "pricingDetail": {
          "ui:widget": "ptPricingTable"
     },
     "carousel": {
          "ui:widget": "ptPreview"
     },
     "visibility": {
          "ui:widget": "radio",
          "ui:options": {
              "inline": true
          }
      },
     "datesConfig": {
          "ui:widget": "datesConfig"
     },
     "config": {
          "acceptBooking": {
              "ui:widget": "radio",
              "ui:options": {
                  "inline": true
              }
          }
     },
}