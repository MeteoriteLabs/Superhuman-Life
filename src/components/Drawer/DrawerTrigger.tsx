import React from 'react'
import { Button } from 'react-bootstrap'

const DrawerTrigger: React.FC<{ toggle: () => void }> = (props) => {
    return (
        <Button onClick={props.toggle} variant="outline-dark">
            Preview
        </Button>
    )
}

export default DrawerTrigger
