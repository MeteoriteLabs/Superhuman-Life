import { useState } from 'react';
import { Button, InputGroup, FormControl } from 'react-bootstrap';
import { gql, useQuery,useMutation } from "@apollo/client";

const EquipmentList = () => {

     const [fitnessEquipments, setFitnessEquipments] = useState<any[]>([]);
     const [searchInput, setSearchInput] = useState('');
     const [select, setSelected] = useState<any[]>([]);

     
     function FetchEquipmentList(_variable: {} = { filter: " "}){
          useQuery(GET_EQUIPMENTLIST, { variables: _variable ,onCompleted: loadEquipmentList});
     }

     function loadEquipmentList(data: any){
          console.log(data);
          setFitnessEquipments(
          [...data.equipmentLists].map((equipment) => {
               return {
                    id: equipment.id,
                    name: equipment.name
               }
          })
          );
     }

     
    const GET_EQUIPMENTLIST = gql`
          query equipmentListQuery($filter: String!) {
               equipmentLists(sort: "updatedAt", where: { name_contains: $filter}){
                    id
                    name
               }
          }
     `

     
     function EquipmentSearch(data: any) {
          console.log(data);
          setSearchInput(data);
     }

     
     FetchEquipmentList({filter: searchInput});
     console.log(select);
     return (
          <>
          <label style={{ fontSize: 17}}>Equipment</label>
               <InputGroup className="mb-3" >
                    <FormControl aria-describedby="basic-addon1" placeholder="Search" id="searchInput" 
                         onChange={(e) => {e.preventDefault();
                                   EquipmentSearch(e.target.value);
                         }} autoComplete="off"
                    />
                    <InputGroup.Prepend>
                         <Button variant="outline-secondary" ><i className="fas fa-search"></i></Button>
                    </InputGroup.Prepend>
               </InputGroup>
               <div>
                    {fitnessEquipments.slice(0,5).map((equipment) => {
                         return (
                              <option style={{cursor: 'pointer'}} onClick={(e) => {e.preventDefault(); setSelected(equipment.name)}}>{equipment.name}</option>
                         );
                    })}
               </div> 
          </>
     )
}

export default EquipmentList;

