export default function ModalCustomClasses(PTProps) {
    const { props } = PTProps;
    const duration = PTProps.PTProps.properties.title_package.duration;
    const offlineClasses = PTProps.PTProps.properties.offlineClasses.value;
    const onlineClasses = PTProps.PTProps.properties.onlineClasses.value;
    const restDay = PTProps.PTProps.properties.restDay.value;

    PTProps.PTProps.properties.dayAvailable.value =
        duration - offlineClasses - onlineClasses - restDay;

    if (PTProps.PTProps.properties.dayAvailable.value === 0) {
        props.schema.maximum = 30;
    } else if (PTProps.PTProps.properties.dayAvailable.value < 0) {
        props.schema.maximum = 0;
    }

    return (
        <div>
            <div className="text-center text-black py-3 w-25 d-flex justify-content-center align-items-center">
                {props.schema.title === 'Online' ? (
                    <img src="/assets/PT-Online.svg" alt="123" />
                ) : (
                    <img src="/assets/PT-Offline.svg" alt="123" />
                )}
                <label className="d-block font-weight-bold mb-0 mr-5">{props.schema.title}</label>
                <input
                    className="py-2 px-2"
                    pattern="[0-9]+"
                    onChange={(event: any) => {
                        if (props.label === 'Offline') {
                            PTProps.PTProps.properties.offlineClasses.value = parseInt(
                                event.target.value
                            );
                        } else if (props.label === 'Online') {
                            PTProps.PTProps.properties.onlineClasses.value = parseInt(
                                event.target.value
                            );
                        }

                        props.onChange(parseInt(event.target.value));
                    }}
                    type="number"
                    min="0"
                    max="30"
                />
            </div>
        </div>
    );
}
