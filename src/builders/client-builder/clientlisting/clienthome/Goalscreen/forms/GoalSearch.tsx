import { useState, useRef } from "react";
import { InputGroup, FormControl, Container } from "react-bootstrap";
import { gql, useQuery } from "@apollo/client";

const GoalSearch = (props: any) => {
     console.log(props.value);
     const [packageLists, setPackageLists] = useState<any[]>([]);
     const [searchInput, setSearchInput] = useState<any>(props.value ? props.value.name : null);
     const [errorMsg, setErrorMsg] = useState("");
     const [selected, setSelected] = useState<any[]>([]);
     const inputField = useRef<any>();
     let skipval: Boolean = true;

     const GET_GOALLIST = gql`
          query GoalsListQuery($filter: String!) {
               goals(sort: "updatedAt", where: { name_contains: $filter }) {
                    id
                    name
               }
          }
     `;

     function FetchPackageList(_variable: {} = { filter: " " }) {
          useQuery(GET_GOALLIST, { variables: _variable, onCompleted: loadPackageList, skip: !searchInput });
     }

     function loadPackageList(data: any) {
          setPackageLists(
               [...data.goals].map((p) => {
                    return {
                         id: p.id,
                         name: p.name,
                    };
               })
          );
     }

     function Search(data: any) {
          if (data.length > 0) {
               setSearchInput(data);
               skipval = false;
          } else {
               setPackageLists([]);
          }
     }

     function handleSelectedPackageAdd(name: any, id: any) {
          const values = [...selected];
          if (values.length === 1) {
               setErrorMsg("(Only One Goal Allowed)");
          } else {
               let a = values.find((e) => e.id === id);
               if (!a) {
                    values.push({ value: name, id: id });
                    setSelected(values);
               }
               props.onChange(
                    values
                         .map((e) => {
                              return e.id;
                         })
                         .join(",")
               );
               inputField.current.value = "";
               setPackageLists([]);
               skipval = true;
          }
     }

     function handleSelectedPackageRemove(name: any) {
          const values = [...selected];
          values.splice(name, 1);
          setSelected(values);
          setErrorMsg("");
          props.onChange(
               values
                    .map((e) => {
                         return e.id;
                    })
                    .join(",")
          );
     }

     FetchPackageList({ filter: searchInput, skip: skipval });

     return (
          <>
               <label style={{ fontSize: 17 }}>Search For Goals</label>
               {errorMsg && <p className="text-danger">{errorMsg}</p>}

               <InputGroup>
                    <FormControl
                         aria-describedby="basic-addon1"
                         placeholder="Search"
                         id="package"
                         ref={inputField}
                         onChange={(e) => {
                              e.preventDefault();
                              Search(e.target.value);
                         }}
                         autoComplete="off"
                    />
               </InputGroup>
               <>
                    {packageLists.slice(0, 5).map((p) => {
                         return (
                              <Container className="pl-0">
                                   <option
                                        style={{ cursor: "pointer" }}
                                        className="m-2 p-1 shadow-sm rounded bg-white"
                                        value={p.id}
                                        onClick={(e) => {
                                             e.preventDefault();
                                             handleSelectedPackageAdd(p.name, p.id);
                                        }}
                                   >
                                        {p.name}
                                   </option>
                              </Container>
                         );
                    })}
               </>
               <>
                    {selected.map((val) => {
                         return (
                              <div
                                   className="text-center mt-2 mr-2"
                                   style={{
                                        display: "inline-block",
                                        height: "32px",
                                        padding: "0px 12px",
                                        fontSize: "14px",
                                        lineHeight: "32px",
                                        borderRadius: "16px",
                                        color: "rgba(0,0,0,0.8)",
                                        backgroundColor: "#bebdb8",
                                   }}
                              >
                                   {val.value}
                                   <i
                                        className="close fas fa-times"
                                        style={{
                                             fontSize: "14px",
                                             cursor: "pointer",
                                             float: "right",
                                             paddingLeft: "8px",
                                             lineHeight: "32px",
                                             height: "32px",
                                        }}
                                        onClick={() => handleSelectedPackageRemove(val.value)}
                                   ></i>
                              </div>
                         );
                    })}
               </>
          </>
     );
};

export default GoalSearch;
