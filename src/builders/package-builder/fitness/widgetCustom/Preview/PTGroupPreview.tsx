import { Fragment } from 'react'

type Props = {
    packageType: 'personal-training' | 'group' | 'classic' | 'custom'
    offlineClassesType: number | undefined
    onlineClassesType: number | undefined
}

export default function PTGroupPreview({
    packageType,
    offlineClassesType,
    onlineClassesType
}: Props) {
    return (
        <Fragment>
            {offlineClassesType !== null && offlineClassesType !== undefined && (
                <div>
                    <img
                        src={`/assets/${packageType}-Offline.svg`}
                        alt={`${packageType}`}
                        title={`${packageType} offline`}
                    />
                    <p>{offlineClassesType}</p>
                </div>
            )}
            {onlineClassesType !== null && onlineClassesType !== undefined && (
                <div className="px-4" style={{ borderRight: '1px solid black' }}>
                    <img
                        src={`/assets/${packageType}-Online.svg`}
                        alt={`${packageType}`}
                        title={`${packageType} online`}
                    />
                    <p>{onlineClassesType}</p>
                </div>
            )}
        </Fragment>
    )
}
