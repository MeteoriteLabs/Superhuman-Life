import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';

function Rating(props: any) {
    props.onChange(
        JSON.stringify({
            rpm: props.value1,
            mood: props.value2,
            note: props.editorData,
            rpm_max: props.max1,
            mood_max: props.max2,
            rpm_id: props.rpmId,
            mood_id: props.moodId
        })
    );

    return (
        <div className="mt-3">
            <div>
                <h5>{props.heading1}</h5>
                <div className="slider w-75 ml-1">
                    <Slider
                        min={props.min1}
                        max={props.max1}
                        value={props.value1}
                        onChange={props.handleChange1}
                    />
                    <p className="">{props.title1}</p>
                </div>
            </div>
            <div>
                <h5>{props.heading2}</h5>
                <div className="slider w-75 ml-1">
                    <Slider
                        min={props.min2}
                        max={props.max2}
                        value={props.value2}
                        onChange={props.handleChange2}
                    />
                    <img src={`/assets/ratingicons/${props.icon}`} alt="" />
                </div>
            </div>
        </div>
    );
}

export default Rating;
