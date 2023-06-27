type Props = {
    type: string
    mode: string
    classicClasses: number
    ptonline: number
    ptoffline: number
    grouponline: number
    groupoffline: number
    recordedclasses: number
}

export default function ClassesSessions({
    type,
    classicClasses,
    ptonline,
    ptoffline,
    grouponline,
    groupoffline,
    recordedclasses,
    mode
}: Props) {
    const arr = [ptonline, ptoffline, grouponline, groupoffline, recordedclasses]
    let totalClasses = arr.filter((item) => item !== undefined).reduce((acc, cur) => acc + cur)

    const arrNumberClass: number[] = []
    if (type === 'Classic Class') {
        arrNumberClass.push(classicClasses)
    } else if (mode === 'Online Workout' || mode === 'Offline Workout') {
        if (ptonline !== 0) {
            arrNumberClass.push(ptonline)
        } else {
            arrNumberClass.push(ptoffline)
        }
    } else {
        arrNumberClass[0] = totalClasses
        for (let i = 1; i < 4; i++) {
            i === 1 ? (totalClasses *= 3) : (totalClasses *= 2)
            arrNumberClass.push(totalClasses)
        }
    }

    return (
        <>
            {arrNumberClass.map((item, index) => {
                return (
                    <td key={index} className="font-weight-bold">
                        {item} Class
                    </td>
                )
            })}
        </>
    )
}
