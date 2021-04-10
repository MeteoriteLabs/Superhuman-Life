import { useFirestoreCollectionData } from 'reactfire';
import { Button, Col, Row } from 'reactstrap';
import { Link } from 'react-router-dom';

function SubRows({ coll, row, rowProps, visibleColumns }) {
    const lotRef = coll.doc(row.original.id).collection("lots");
    const { status, data } = useFirestoreCollectionData(lotRef, { idField: "id" });

    if (status === "loading") {
        return (
            <tr>
                <td colSpan={visibleColumns.length - 1}>
                    Loading...
                </td>
            </tr>
        );
    }

    return (
        <>
            {data.map((x, i) => (
                <tr {...rowProps} key={`${rowProps.key}-expanded-${i}`}>
                    <td colSpan={visibleColumns.length}>
                        <Row>
                            <Col sm="2">
                                <p className="text-muted">
                                    Lot #: <Link
                                        to={{
                                            pathname: `/orders/${row.original.id}/lot/${x.id}`,
                                            state: { ...x, batchId: x.batchId.id, ...row.original }
                                        }}
                                    >
                                        {x["lot#"]}
                                    </Link>
                                </p>
                            </Col>
                            <Col sm="2">
                                <p className="text-muted">Batch #: {x["batch#"]}</p>
                            </Col>
                            <Col sm="4">
                                <Button color="info" size="sm">
                                    <i className="fas fa-edit"></i>{" "}Edit
                                </Button>{" "}
                                <Button
                                    color="danger"
                                    onClick={() => x.batchId.delete()}
                                    size="sm"
                                >
                                    <i className="far fa-trash-alt"></i>{" "}Delete
                                </Button>
                            </Col>
                        </Row>
                    </td>
                </tr>
            ))}
        </>
    );
}

export default SubRows;