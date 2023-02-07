import PersonaTrainingMode from "./PersonaTrainingMode";

export default function FitnessMode(props) {
  const { widgetProps, PTProps, type, userData, actionType, groupProps } = props;

  return (
    <div>
      <div>
        <PersonaTrainingMode
          type={type}
          actionType={actionType}
          widgetProps={widgetProps}
          PTProps={PTProps}
          groupProps={groupProps}
          userData={userData}
        />
      </div>

      <div
        className="text-center font-weight-bold mx-auto w-50 py-3 px-2 mt-5"
        style={{ boxShadow: "0px 7px 15px -5px #000000", borderRadius: "5px" }}
      >
        <p className="m-0">
          Set for {PTProps.properties.duration.default} days
        </p>
      </div>
    </div>
  );
}
