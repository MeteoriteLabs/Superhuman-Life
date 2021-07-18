import { useState, useRef } from 'react';
import { InputGroup, FormControl, Container } from 'react-bootstrap';
import { gql, useQuery} from "@apollo/client";

const EquipmentList = (props: any) => {

     const [fitnessEquipments, setFitnessEquipments] = useState<any[]>([]);
     const [searchInput, setSearchInput] = useState(null);
     const [selected, setSelected] = useState<any[]>([]);
     const inputField = useRef<any>();
     let skipval: Boolean = true;

     
     
    const GET_EQUIPMENTLIST = gql`
     query equipmentListQuery($filter: String!) {
          equipmentLists(sort: "updatedAt", where: { name_contains: $filter}){
               id
               name
          }
     }
     `
     
     function FetchEquipmentList(_variable: {} = { filter: " "}){
          useQuery(GET_EQUIPMENTLIST, { variables: _variable ,onCompleted: loadEquipmentList, skip: !searchInput});
     }

     function loadEquipmentList(data: any){
          setFitnessEquipments(
          [...data.equipmentLists].map((equipment) => {
               return {
                    id: equipment.id,
                    name: equipment.name
               }
          })
          );
     }
     
     function EquipmentSearch(data: any) {
          if(data.length > 0){
               setSearchInput(data);
               skipval = false;
          }else {
               setFitnessEquipments([]);
          }
     }

     function handleSelectedEquipmentAdd(name: any, id: any) {
          const values = [...selected];
          let a = values.find((e) => e.id === id);
          if (!a){
               values.push({ value: name, id: id}); 
               setSelected(values);
          }
          props.onChange(values.map((e) => {
               return e.id;
          }).join(','))
          inputField.current.value = "";
          setFitnessEquipments([]);
          skipval = true;
     }

     function handleSelectedEquipmentRemove(name: any) {
          const values = [...selected];
          values.splice(name, 1);
          setSelected(values);
          props.onChange(values.map((e) => {
               return e.id;
          }).join(','))
     }

     FetchEquipmentList({filter: searchInput, skip: skipval});

     return (
          <>
          <label style={{ fontSize: 17}}>Equipment</label>
               <InputGroup>
                    <FormControl aria-describedby="basic-addon1" placeholder="Search For Equipment" id="searchInput" ref={inputField}
                              onChange={(e) => {e.preventDefault();
                                   EquipmentSearch(e.target.value);
                         }} autoComplete="off"
                    />
               </InputGroup>
               <>
                    {fitnessEquipments.slice(0,5).map((equipment) => {
                         return (
                              <Container className="pl-0">
                                   <option 
                                        style={{cursor: 'pointer'}}
                                        className="m-2 p-1 shadow-sm rounded bg-white"
                                        value={equipment.id} 
                                        onClick={(e) => {e.preventDefault(); 
                                             handleSelectedEquipmentAdd(equipment.name, equipment.id);
                                             }}>
                                             {equipment.name}
                                   </option>
                              </Container>
                         );
                    })}
               </>
               <> 
                    {selected.map((val) => {
                         return (
                              <div className="text-center mt-2 mr-2" style={{ 
                                   display: 'inline-block',
                                   height: '32px',
                                   padding: '0px 12px',
                                   fontSize: '14px',
                                   lineHeight: '32px',
                                   borderRadius: '16px',
                                   color: 'rgba(0,0,0,0.8)',
                                   backgroundColor: '#bebdb8',
                              }}>
                                   {val.value}
                                   <i className="close fas fa-times" 
                                        style={{ fontSize: '14px', 
                                        cursor: 'pointer', 
                                        float: 'right', 
                                        paddingLeft: '8px', 
                                        lineHeight: '32px',
                                        height: '32px'
                                   }} 
                                        onClick={() => handleSelectedEquipmentRemove(val.value)}></i>
                              </div>
                         )
                    })}
               </>
          </>
     )
}

export default EquipmentList;

