import { useState, useRef } from 'react';
import { InputGroup, FormControl, Container } from 'react-bootstrap';
import { gql, useQuery } from '@apollo/client';
import { flattenObj } from '../utils/responseFlatten';

const ClientsSelect = (props: any) => {
    const [clients, setClients] = useState<any[]>([]);
    const [searchInput, setSearchInput] = useState(null);
    const [selected, setSelected] = useState<any[]>(props.value?.length ? props.value : []);
    const inputField = useRef<any>();
    let skipval: Boolean = true;

    const CLIENTS_QUERY = gql`
        query ClientsQuery($filter: String!) {
            usersPermissionsUsers(filters: { username: { containsi: $filter } }) {
                data {
                    id
                    attributes {
                        username
                    }
                }
            }
        }
    `;

    function FetchMuscleGroupList(_variable: {} = { filter: ' ' }) {
        useQuery(CLIENTS_QUERY, {
            variables: _variable,
            onCompleted: loadMuscleGroupList,
            skip: !searchInput
        });
    }

    function loadMuscleGroupList(data: any) {
        const flattenedData = flattenObj({ ...data });

        setClients(
            [...flattenedData.usersPermissionsUsers].map((client) => {
                return {
                    id: client.id,
                    name: client.username
                };
            })
        );
    }

    function muscleGroupSearch(data: any) {
        if (data.length) {
            setSearchInput(data);
            skipval = false;
        } else {
            setClients([]);
        }
    }

    function handleSeletedMuscleGroupAdd(name: any, id: any) {
        const values = [...selected];
        let a = values.find((e) => e.id === id);
        if (!a) {
            values.push({ name: name, id: id });
            setSelected(values);
        }
        inputField.current.value = '';
        setClients([]);
        skipval = true;
    }

    function handleSelectedMuscleGroupRemove(name: any) {
        const values = [...selected];
        values.splice(name, 1);
        setSelected(values);
    }

    FetchMuscleGroupList({ filter: searchInput, skip: skipval });

    return (
        <>
            <div className="p-3" style={{ width: '100%' }}>
                <InputGroup>
                    <FormControl
                        aria-describedby="basic-addon1"
                        placeholder="Search For Clients"
                        id="muscleGroup"
                        ref={inputField}
                        onChange={(e) => {
                            e.preventDefault();
                            muscleGroupSearch(e.target.value);
                        }}
                        autoComplete="off"
                    />
                </InputGroup>
            </div>
            <>
                {clients?.slice(0, 5).map((client) => {
                    return (
                        <Container className="pl-3">
                            <option
                                style={{ cursor: 'pointer' }}
                                className="m-2 p-1 shadow-sm rounded bg-white"
                                value={client.id}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleSeletedMuscleGroupAdd(client.name, client.id);
                                }}
                            >
                                {client.name}
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
                                display: 'inline-block',
                                height: '32px',
                                padding: '0px 12px',
                                fontSize: '14px',
                                lineHeight: '32px',
                                borderRadius: '16px',
                                color: 'rgba(0,0,0,0.8)',
                                backgroundColor: '#bebdb8'
                            }}
                        >
                            {val.name}
                            <i
                                className="close fas fa-times"
                                style={{
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    float: 'right',
                                    paddingLeft: '8px',
                                    lineHeight: '32px',
                                    height: '32px'
                                }}
                                onClick={() => handleSelectedMuscleGroupRemove(val.name)}
                            ></i>
                        </div>
                    );
                })}
            </>
        </>
    );
};

export default ClientsSelect;
