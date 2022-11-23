import { useContext, useState } from "react";
import { useQuery } from "@apollo/client";
import {
  GET_EARNINGS_TRANSACTIONS,
  GET_EXPENSES_TRANSACTIONS,
} from "./Queries";
import { Row, Col, Card } from "react-bootstrap";
import { flattenObj } from "../../../components/utils/responseFlatten";
import AuthContext from "../../../context/auth-context";

function Summary() {
  const auth = useContext(AuthContext);
  const [totalEarning, setTotalEarning] = useState<number>(0);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);

  // eslint-disable-next-line
  const { data: get_earnings_transaction } = useQuery(
    GET_EARNINGS_TRANSACTIONS,
    {
      variables: {
        receiverId: auth.userid,
      },
      onCompleted: (data) => {
        const flattenEarnings = flattenObj({ ...data });
        const total: number = 0;
        const totalAmountOfEarnings: number =
          flattenEarnings.transactions.reduce(
            (accumulator: number, currentValue: any) =>
              accumulator + currentValue.TransactionAmount,
            total
          );
        setTotalEarning(totalAmountOfEarnings);
      },
    }
  );

  // eslint-disable-next-line
  const { data: get_expenses_transaction } = useQuery(
    GET_EXPENSES_TRANSACTIONS,
    {
      variables: {
        senderId: auth.userid,
      },
      onCompleted: (data) => {
        const flattenExpenses: any = flattenObj({ ...data });
        const total: number = 0;
        const totalAmountOfExpenses: number =
          flattenExpenses.transactions.reduce(
            (accumulator: number, currentValue: any) =>
              accumulator + currentValue.TransactionAmount,
            total
          );
        setTotalExpenses(totalAmountOfExpenses);
      },
    }
  );

  return (
    <div className="mt-5">
      <Row>
        {/* Earnings */}
        <Col lg={4}>
          <Card className="p-2 m-2">
            <Row>
              <Col lg={9} xs={10}>
                <b>Earnings</b>
              </Col>
              <Col>
                <img src="assets/summary/earnings.svg" alt="earnings" />
              </Col>
            </Row>
            <b style={{ fontSize: "20px" }}>INR {totalEarning}</b>
          </Card>
        </Col>

        {/* Expenses */}
        <Col lg={4}>
          <Card className="p-2 m-2">
            <Row>
              <Col lg={9} xs={10}>
                <b>Expenses</b>
              </Col>
              <Col>
                <img src="assets/summary/expenses.svg" alt="expenses" />
              </Col>
            </Row>
            <b style={{ fontSize: "20px" }}>INR {totalExpenses}</b>
          </Card>
        </Col>

        {/* Profits */}
        <Col lg={4} xs={12}>
          <Card className="p-2 m-2">
            <Row>
              <Col lg={9} xs={10}>
                <b>Profits</b>
              </Col>
              <Col xs={2} >
                <img src="assets/summary/netProfit.svg" alt="profit" />
              </Col>
            </Row>
            <Row>
              <Col>
                <b style={{ fontSize: "20px" }}>
                  INR {totalEarning - totalExpenses}
                </b>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Summary;
