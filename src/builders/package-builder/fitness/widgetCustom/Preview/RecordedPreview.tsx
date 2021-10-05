import React from 'react'

export default function RecordedPreview({packageType,recordedclasses }) {
    return (
        <div className='px-4' style={{ borderRight: '1px solid black' }}>
            <img src={`/assets/${packageType}.svg`} alt={`${packageType}`} title={`${packageType}`} />
            <p>{recordedclasses}</p>
        </div>
    )
}
