import { Container } from "react-bootstrap";
import HomeTopNav from "./header";
import HomeFooter from "./footer";

const HomeLayout: React.FC = (props: any) => {
    
    return (
        <>
            <header>
                <Container fluid>
                    <HomeTopNav />
                </Container>
            </header>
            <main className="bg-light min-vh-100 pt-5">
                <Container fluid>
                    {props.children}
                </Container>
            </main>
            <footer className="py-2 mt-5">
                <Container fluid>
                    <HomeFooter />
                </Container>
            </footer>
        </>
    );
}

export default HomeLayout;