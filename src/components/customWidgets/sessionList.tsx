/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useRef, useContext, useEffect } from "react";
import { FormControl, Row, Button } from "react-bootstrap";
import {
  GET_PROGRAMLIST,
  GET_FITNESSPACKAGE_DETAILS,
  GET_TAGS_BY_TYPE,
  GET_SESSIONS_BY_TAG,
} from "./queries";
import { useQuery } from "@apollo/client";
import AuthContext from "../../context/auth-context";
import "../../builders/program-builder/program-template/styles.css";
import SchedulerEvent from "../../builders/program-builder/program-template/scheduler-event";
import { flattenObj } from "../utils/responseFlatten";
import moment from "moment";

const ProgramList = (props: any) => {
  const auth = useContext(AuthContext);
  const [programList, setProgramList] = useState<any[]>([]);
  const [searchInput, setSearchInput] = useState(null);
  const [selected, setSelected] = useState<any>({});
  const [fitnessPackageTypes, setFitnessPackageTypes] = useState<any>([]);
  const [selectedFitnessPackage, setSelectedFitnessPackage] = useState("");
  const [tagsList, setTagList] = useState<any>([]);
  const [selectedTag, setSelectedTag] = useState("");
  const [packageDuration, setPackageDuration] = useState<any>();
  const [displayDates, setDisplayDate] = useState<any>([]);
  const [startDate, setStartDate] = useState<any>();
  const skipval = true;

  useQuery(GET_FITNESSPACKAGE_DETAILS, {
    onCompleted: (data) => {
      const flattenData = flattenObj({ ...data });
      setFitnessPackageTypes(flattenData.fitnessPackageTypes);
    },
  });

  useQuery(GET_TAGS_BY_TYPE, {
    variables: { id: auth.userid, type: selectedFitnessPackage },
    skip: selectedFitnessPackage === "",
    onCompleted: (data) => {
      const flattenData = flattenObj({ ...data });
      setTagList(flattenData.tags);
    },
  });

  function handleDatesRender(date: any, duration: any) {
    const dates: any = [];
    for (let i = 0; i <= duration; i++) {
      dates.push(moment(date).add(i, "days").format("DD MMM YY"));
    }
    setDisplayDate(dates);
  }

  useQuery(GET_SESSIONS_BY_TAG, {
    variables: { id: selectedTag },
    skip: selectedTag === "",
    onCompleted: (data) => {
      const flattenData = flattenObj({ ...data });
      setStartDate(props.startDate);
      handleDatesRender(props.startDate, props.duration);
      setPackageDuration(props.duration);
      setProgramList(flattenData.tags[0].sessions);
    },
  });

  function FetchEquipmentList(
    _variable: Record<string, unknown> = { id: auth.userid, filter: " " }
  ) {
    useQuery(GET_PROGRAMLIST, {
      variables: _variable,
      onCompleted: loadProgramList,
      skip: !searchInput,
    });
  }

  function loadProgramList(data: any) {
    const flattenedData = flattenObj({ ...data });
    setProgramList(
      [...flattenedData.fitnessprograms].map((program) => {
        return {
          id: program.id,
          name: program.title,
          duration: program.duration_days,
          level: program.level,
          description: program.description,
          discpline: program.fitnessdisciplines,
          events: program.sessions.filter(
            (session: any) => session.Is_restday === false
          ),
        };
      })
    );
  }

  const days: any = [];

  for (let i = 1; i <= packageDuration; i++) {
    days.push(i);
  }

  function renderEventsTable() {
    if (programList.length > 0) {
      return (
        <SchedulerEvent
          callback={props.callback2}
          programDays={days}
          sessionIds={props.sessionIds}
          days={displayDates}
          startDate={startDate}
          programEvents={programList}
          type={"sessions"}
        />
      );
    }
  }

  FetchEquipmentList({ filter: searchInput, skip: skipval, id: auth.userid });

  return (
    <>
      <label style={{ fontSize: 17 }}>Import from existing session</label>
      <Button
        variant="outline-danger"
        className="float-right mb-3"
        onClick={() => {
          props.callback2("none");
          setSelected({});
        }}
      >
        close
      </Button>
      <Row className="mb-3">
        <div className="mr-5">
          <span>
            <b>Select Fitness Package type</b>
          </span>
          <FormControl
            value={selectedFitnessPackage}
            as="select"
            onChange={(e) => setSelectedFitnessPackage(e.target.value)}
          >
            <option>Choose Type</option>
            {fitnessPackageTypes.slice(0, 7).map((item, index: number) => {
              return (
                <option key={index} value={item.type}>
                  {item.type}
                </option>
              );
            })}
          </FormControl>
        </div>
        <div>
          {tagsList.length !== 0 && (
            <>
              <span>
                <b>Select Class</b>
              </span>
              <FormControl
                as="select"
                onChange={(e) => setSelectedTag(e.target.value)}
              >
                <option>Choose Class</option>
                {tagsList.map((item, index: number) => {
                  return (
                    <option key={index} value={item.id}>
                      {item.tag_name}
                    </option>
                  );
                })}
              </FormControl>
            </>
          )}
        </div>
      </Row>
      <>
        <div className="mt-5">{renderEventsTable()}</div>
      </>
    </>
  );
};

export default ProgramList;
