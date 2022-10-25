import Upload from '../../../../components/upload/upload';
import DatesConfig from '../../../../components/customWidgets/datesConfig';
import FitnessSelect from '../../../../components/customWidgets/fitnessMultiSelect';
import EquipmentSelect from '../../../../components/customWidgets/equipmentListSelect';
import LanguageList from '../../../../components/customWidgets/languageSelect';
import GroupProgramDetails from './groupProgramDetails';
import GroupConfig from './groupConfig';
import GroupPricingTable from './groupPricingTable';
import GroupPreview from './groupPreview';
import GroupBookingConfig from './bookingConfig';

export const widgets = {
     datesConfig: DatesConfig,
     fitnessSelect: FitnessSelect,
     equipmentSelect: EquipmentSelect,
     groupProgramDetails: GroupProgramDetails,
     groupConfig: GroupConfig,
     groupPricingTable: GroupPricingTable,
     groupPreview: GroupPreview,
     groupBookingConfig: GroupBookingConfig,
     languageList: LanguageList
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
                    return <Upload allowImage={true} allowVideo={true} onChange={props.onChange} value={props.value} />;
               },
          },  
          "VideoUrl": {
               "ui:placeholder": "https://"
          }
     },
     "programDetails": {
          "ui:widget": "groupProgramDetails"
     },
     "groupinstantbooking": {
          "ui:widget": "groupConfig"
     },
     "pricingDetail": {
          "ui:widget": "groupPricingTable"
     },
     "carousel": {
          "ui:widget": "groupPreview"
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
     "languages": {
          "ui:widget": "languageList",
     },
     "config": {
          "bookingConfig": {
              "ui:widget": "groupBookingConfig"
          }
     },
}