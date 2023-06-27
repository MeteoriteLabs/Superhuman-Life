import { Fragment } from 'react';
import Classes from '../Classes';

type Props = {
    recordedclasses: number;
    packageTypeName: string;
    mode: 'Online' | 'Offline' | 'Hybird' | 'Workout' | 'Online Workout' | 'Offline Workout';
    type: 'One-On-One' | 'Group Class' | 'Custom Fitness' | 'Classic Class';
};

export default function RecordedPricingTable({
    recordedclasses,
    packageTypeName,
    type,
    mode
}: Props) {
    return (
        <Fragment>
            <tr>
                {recordedclasses !== undefined && recordedclasses !== 0 && (
                    <>
                        <td>
                            <img
                                src={`/assets/preview-custom-${packageTypeName}.svg`}
                                alt={`${packageTypeName}`}
                                title={`${packageTypeName}`}
                            />
                        </td>
                        <Classes numberClass={recordedclasses} type={type} mode={mode} />
                    </>
                )}
            </tr>
        </Fragment>
    );
}
