import './GoalCard.css';

function GoalCard(props: any) {
    return (
        <>
            <div className="d-flex justify-content-center" onClick={props.click}>
                <div
                    className="d-flex flex-column align-items-center justify-content-center mb-2 shadow bg-white rounded"
                    style={{
                        maxWidth: '90%',
                        padding: '25px',
                        width:"100%"
                    }}
                >
                    <img
                        src="/assets/image_placeholder.svg"
                        height="90"
                        className="rounded-circle"
                        width="90"
                        alt="avatar"
                        style={{ backgroundColor: 'gray' }}
                    />
                    <div className="text-center mt-2">
                        <p className="font-weight-bold">Updated By: {props.updatedBy}</p>
                    </div>
                    <div className="text-center mt-3" style={{letterSpacing:"1px"}}>
                        <h2>{props.goalName}</h2>
                    </div>
                    <div style={{ marginTop: '30px'  }}>
                        <div className="d-flex">
                            <p className="font-weight-bold ">Start Date:</p>
                            <p className="">{props.startDate}</p>
                        </div>
                        <div className="d-flex">
                            <p className="font-weight-bold ">End Date:</p>
                            <p className="">{props.endDate}</p>
                        </div>
                        <div className="d-flex">
                            <p className="font-weight-bold ">Updated On:</p>
                            <p className="">{props.updatedOn}</p>
                        </div>
                    </div>
                </div>
            </div>
           </>
    
    );
}

export default GoalCard;
