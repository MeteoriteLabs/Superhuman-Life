import { useContext, useEffect, useState } from 'react';
import About from './about';
import Classes from './classes';
import Contact from './contact';
import Home from './home';
import { ChangeMakerWebsiteContext } from 'context/changemakerWebsite-context';
import Offerings from './offerings';
import { Accordion, Button } from 'react-bootstrap';
import { ArrowDown } from 'react-bootstrap-icons';
import returnRoute from 'lib/returnRoutes';

function Index(): JSX.Element {
    const { changemakerWebsiteState, setChangemakerWebsiteState } =
        useContext(ChangeMakerWebsiteContext);

    const { currentSelectedRoute } = changemakerWebsiteState;
    const [countClick, setCountClick] = useState(0); // counting clicks to force arrow to rotate on second click to original position

    useEffect(() => {
        if (countClick === 2) {
            setCountClick(0);
        }
    }, [countClick]);

    const pagesArr = ['Home', 'Classes', 'About', 'Contact', 'Offerings'];

    const Page = {
        Home: <Home />,
        Classes: <Classes />,
        About: <About />,
        Contact: <Contact />,
        Offerings: <Offerings />
    };
    return (
        <>
            {pagesArr.map((page, index) => {
                return (
                    <Accordion
                        key={index}
                        className="mt-2"
                        onClick={() => {
                            setChangemakerWebsiteState({
                                ...changemakerWebsiteState,

                                currentSelectedRoute: returnRoute(page)
                            });

                            setCountClick(countClick + 1);
                        }}
                    >
                        <>
                            <Accordion.Toggle
                                as={Button}
                                variant="text"
                                eventKey={index.toString()}
                                style={{
                                    'padding-inline': '20px',
                                    color: '#fff',
                                    width: '100%',
                                    'text-align': 'left',
                                    display: 'flex',
                                    'justify-content': 'space-between',
                                    'align-items': 'baseline'
                                }}
                            >
                                <div
                                    style={{
                                        fontWeight: 600,
                                        fontSize: '.8rem'
                                    }}
                                >
                                    {page}
                                </div>
                                <ArrowDown
                                    className="mb-0"
                                    style={{
                                        height: '12px',
                                        fontWeight: 800,
                                        transform: `${
                                            currentSelectedRoute === returnRoute(page) &&
                                            countClick === 1
                                                ? 'rotate(0deg)'
                                                : 'rotate(180deg)'
                                        }`,
                                        transition: 'transform 0.4s ease-in-out'
                                    }}
                                />
                            </Accordion.Toggle>

                            <Accordion.Collapse eventKey={index.toString()}>
                                {Page[page]}
                            </Accordion.Collapse>
                        </>
                    </Accordion>
                );
            })}
        </>
    );
}

export default Index;
