import { useState, useRef, useContext } from "react";
import { InputGroup, FormControl, Container } from "react-bootstrap";
import { gql, useQuery } from "@apollo/client";
import AuthContext from "../../../../../context/auth-context";
import { CHECK_NOTES_NEW } from "./queries";
import { flattenObj } from "../../../../../components/utils/responseFlatten";

const TagSearch = (props: any) => {
     const last = window.location.pathname.split("/").pop();
     const [packageLists, setPackageLists] = useState<any[]>([]);
     const [searchInput, setSearchInput] = useState(null);
     const [errorMsg, setErrorMsg] = useState("");
     const [selected, setSelected] = useState<any[]>([]);
     const inputField = useRef<any>();
     const auth = useContext(AuthContext);
     let skipval: Boolean = true;
     const Arr: any = [];
     const [idArray, setIdArray] = useState<any>();

     const GET_GOALLIST = gql`
          query TagListQuery($filter: String!, $id: ID) {
               workouts(filters: {
                    workouttitle: {
                      containsi: $filter
                    },
                    users_permissions_user:{
                      id: {
                        eq: $id
                      }
                    }
                  }, sort: ["updatedAt"]){
                    data{
                      id
                      attributes{
                        workouttitle
                      }
                    }
                  }
          }
     `;

     const GET_GOALLIST_ID = gql`
          query TagListQuery($id: ID) {
               workouts(filters: {
                    id: {
                      eq: $id
                    }
                  }){
                    data{
                      id
                      attributes{
                        workouttitle
                      }
                    }
                  }
          }
     `;

     useQuery(GET_GOALLIST_ID, { variables: { id: props.value }, onCompleted: storeName, skip: !props.value });
     function storeName(e: any) {
          const flattenData = flattenObj({...e});
          setSelected([{ value: flattenData.workouts[0].workouttitle, id: props.value }]);
     }

     function FetchPackageList(_variable: {} = { filter: " ", id: auth.userid }) {
          useQuery(GET_GOALLIST, { variables: _variable, onCompleted: loadPackageList, skip: !searchInput });
     }

     function loadPackageList(data: any) {
          const flattenData = flattenObj({...data});
          setPackageLists(
               [...flattenData.workouts].map((p) => {
                    if (!idArray.includes(p.id)) {
                         return {
                              id: p.id,
                              name: p.workouttitle,
                         };
                    }
                    return {};
               })
          );
     }
     function FetchNotes(_variable: {} = { id: auth.userid, clientid: last }) {
          useQuery(CHECK_NOTES_NEW, { variables: _variable, onCompleted: loadNotes });
     }
     function loadNotes(d: any) {
          const flattenData = flattenObj({...d});
          for (let i = 0; i < flattenData.feedbackNotes.length; i++) {
               Arr.push(flattenData.feedbackNotes[i].resource_id);
          }
          setIdArray(Arr);
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
               setErrorMsg("(Only One Tag Allowed)");
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
     FetchNotes({ id: auth.userid, clientid: last });
     FetchPackageList({ filter: searchInput, skip: skipval });
     return (
          <>
               <label style={{ fontSize: 17 }}>Tag</label>
               {errorMsg && <p className="text-danger">{errorMsg}</p>}

               <InputGroup>
                    <FormControl
                         aria-describedby="basic-addon1"
                         placeholder="Search For Tag"
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
                         if (p.id) {
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
                         }
                         return "";
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

export default TagSearch;
