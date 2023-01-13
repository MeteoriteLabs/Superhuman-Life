import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_TABLEDATA } from "./queries";
import { Row, Col } from "react-bootstrap";
import Scheduler from "./scheduler";
import SessionContext from "../../../context/session-context";
import { flattenObj } from "../../../components/utils/responseFlatten";
import Loader from "../../../components/Loader/Loader";

const ProgramManager = (props: any) => {
  const last = window.location.pathname.split("/").pop();
  const [data, setData] = useState<any[]>([]);
  const [show, setShow] = useState(false);
  const [sessionIds, setSessionIds] = useState<any[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setShow(true);
    }, 1500);
  }, [show]);

  const mainQuery = useQuery(GET_TABLEDATA, {
    variables: { id: last },
    onCompleted: loadData,
  });

  function loadData(data: any) {
    const flattenData = flattenObj({ ...data });
    const restDayData = flattenData.fitnessprograms[0].sessions.filter(
      (session: any) => session.Is_restday === true
    );
    const sessionData = flattenData.fitnessprograms[0].sessions.filter(
      (val: any) => !restDayData.includes(val)
    );
    const values = [...sessionIds];
    flattenData.fitnessprograms[0].sessions.forEach((program: any) => {
      values.push(program.id);
    });
    setData(
      [...flattenData.fitnessprograms].map((detail) => {
        return {
          id: detail.id,
          programName: detail.title,
          discipline: detail.fitnessdisciplines
            .map((val: any) => {
              return val.disciplinename;
            })
            .join(", "),
          level: detail.level,
          duration: detail.duration_days,
          details: detail.description,
          restDays: restDayData,
          sessions: sessionData,
        };
      })
    );
    setSessionIds(values);
  }

  function queryCallback() {
    mainQuery.refetch();
    setSessionIds([]);
  }

  if (!show) return <span ><Loader/></span>;
  else
    return (
      <div className="col-lg-12">
        <Row >
          <Col lg={11}>
            <div
              className="p-4 shadow-lg bg-white"
              style={{ borderRadius: "10px" }}
            >
              <Col>
                <Row>
                  <h3 className="text-capitalize">{data[0].programName}</h3>
                </Row>
                <Row className="mt-4">
                  <span>
                    <b>Discpline</b>
                  </span>
                  
                  <span className="ml-4">{data[0].discipline}</span>
                  <div
                    className="ml-3 mt-1"
                    style={{ borderLeft: "1px solid black", height: "20px" }}
                  ></div>
                  <span className="ml-4">{data[0].duration + " days"}</span>
                  <div
                    className="ml-3"
                    style={{ borderLeft: "1px solid black", height: "20px" }}
                  ></div>
                  <span className="ml-4">{"Level: " + data[0].level}</span>
                </Row>
              </Col>
            </div>
            <div className="mt-5">
              <SessionContext.Provider value={{ sessions: data[0].sessions }}>
                <Scheduler
                  templateSessions={data[0].sessions}
                  sessionIds={sessionIds}
                  callback={queryCallback}
                  days={data[0].duration}
                  type={"day"}
                  restDays={data[0].restDays}
                  programId={last}
                />
              </SessionContext.Provider>
            </div>
          </Col>
        </Row>
        </div>
      
    );
};
export default ProgramManager;
