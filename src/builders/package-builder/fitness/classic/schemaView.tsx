import Upload from '../../../../components/upload/upload';
import DatesConfig from '../../../../components/customWidgets/datesConfig';
import FitnessSelect from '../../../../components/customWidgets/fitnessMultiSelect';
import EquipmentSelect from '../../../../components/customWidgets/equipmentListSelect';
import ClassicProgramDetails from './classicProgramDetails';
import ClassicPricingTable from './classicPricingTable';
import ClassicPreview from './classicPreview';

export const widgets = {
     datesConfig: DatesConfig,
     fitnessSelect: FitnessSelect,
     equipmentSelect: EquipmentSelect,
     classicProgramDetails: ClassicProgramDetails,
     classPricingTable: ClassicPricingTable,
     classicPreview: ClassicPreview,
}

export const schemaView: any = {
     "packagename": {
          "ui:readonly": true
     },
     "disciplines": {
          "ui:widget": "fitnessSelect",
          "readonly": true
     },
     "equipmentList": {
          "ui:widget": "equipmentSelect",
          "readonly": true
     },
     "tags": {
          "ui:readonly": true,
     },
     "level": {
          "ui:widget": "radio",
          "ui:options": {
              "inline": true
          },
          "ui:readonly": true,
      },
     "intensity": {
          "ui:widget": "radio",
          "ui:options": {
              "inline": true
          },
          "ui:readonly": true,
     },
     "classSize": {
          "ui:widget": "radio",
          "ui:options": {
               "inline": true
          },
          "ui:readonly": true,
     },
     "About": {
          "ui:widget": "textarea",
          "ui:autofocus": true,
          "ui:options": {
              "rows": 3
          },
          "ui:placeholder": "About the program",
          "ui:readonly": true,
      },
      "Benifits": {
          "ui:widget": "textarea",
          "ui:options": {
              "rows": 3,
          },
          "ui:placeholder": "Benifits of the program",
          "ui:readonly": true,
      },
     "thumbnail": {
          "ui:widget": (props: any) => {
               return <Upload allowImage={true} allowVideo={true} onChange={props.onChange} value={props.value} title={'Thumbnail'} readonly={true}/>;
          },
      },
     "Upload": {
          "upload": {
               "ui:widget": (props: any) => {
                    console.log(props)
                    return <Upload allowImage={true} allowVideo={true} onChange={props.onChange} value={props.value} readonly={true}/>;
               },
          },  
          "VideoUrl": {
               "ui:placeholder": "https://",
               "ui:readonly": true
          }
     },
     "programDetails": {
          "ui:widget": "classicProgramDetails",
          "ui:readonly": true
     },
     "groupinstantbooking": {
          "ui:widget": "groupConfig",
          "ui:readonly": true
     },
     "pricingDetail": {
          "ui:widget": "classPricingTable",
          "ui:readonly": true
     },
     "carousel": {
          "ui:widget": "classicPreview",
          "ui:readonly": true
     },
     "visibility": {
          "ui:widget": "radio",
          "ui:options": {
              "inline": true
          },
          "ui:readonly": true
      },
     "datesConfig": {
          "ui:widget": "datesConfig",
          "ui:readonly": true
     },
     "config": {
          "acceptBooking": {
              "ui:widget": "radio",
              "ui:options": {
                  "inline": true
              },
              "ui:readonly": true,
          },
          "maxBookingMonth": {
               "ui:readonly": true
          },
          "maxBookingDay": {
               "ui:readonly": true
          }
     },
}