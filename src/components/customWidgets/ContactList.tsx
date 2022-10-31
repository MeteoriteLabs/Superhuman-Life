import {useState} from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { GET_CONTACTS } from './queries';
import { useQuery } from "@apollo/client";
import { flattenObj } from '../utils/responseFlatten';

const ContactList = (props: any) => {
     function handleReturnType(value){
          if(typeof value === 'string'){
               return JSON.parse(value);
          }else {
               return value;
          }
     }

     const [multiSelections, setMultiSelections] = useState<any[]>(
          props.value?.length > 0 ? handleReturnType(props.value) : []
        );
        const [contactList, setContactList] = useState<any[]>([]);

     function FetchData(){
          useQuery(GET_CONTACTS, {onCompleted: loadData})
      }

     function loadData(data: any) {
                    const flattenedData = flattenObj({...data});
                    console.log(flattenedData);
                    setContactList(
                        [...flattenedData.contacts].map((currValue) => {
                            return {
                                id: currValue.id,
                                name: currValue.firstname
                            }
                        })
                    );
               }

     function OnChange(e) {
          const unique = [...new Map(e.map((m) => [m.id, m])).values()];
          setMultiSelections(unique);
     }

     if(multiSelections.length > 0){
          props.onChange(JSON.stringify(multiSelections));
     }else {
          props.onChange(undefined);
     }

    FetchData();

     return (
          <div>
               <label>Things you Need</label>
               <Typeahead
               id="basic-typeahead-multiple"
               labelKey="name"
               onChange={OnChange}
               options={contactList}
               placeholder="Choose Contact..."
               selected={multiSelections}
               // disabled={props.uiSchema.readonly}
               />
          </div>
     )
}

export default ContactList;