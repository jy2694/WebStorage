import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import {
    Button,
    Container,
    Dropdown,
    DropdownButton,
    FloatingLabel,
    Form,
    Modal,
    Navbar,
    Spinner, Toast
} from 'react-bootstrap';
import {useEffect, useRef, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faFolderOpen, faTrashCan} from '@fortawesome/free-regular-svg-icons';
import axios from "axios";

function App() {

    const [user, setUser] = useState("");
    const [logining, setLogining] = useState(false);
    const [register, setRegister] = useState(false);
    const [id, setId] = useState("");
    const [pw, setPw] = useState("");
    const [rid, setRid] = useState("");
    const [rpw, setRpw] = useState("");
    const [remail, setRemail] = useState("");
    const [showMkdir, setShowMkdir] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [hover, setHover] = useState(-1);
    const [nowPath, setNowPath] = useState("/");
    const [errorShow, setErrorShow] = useState(false);
    const [errorTitle, setErrorTitle] = useState("");
    const [errorContent, setErrorContent] = useState("");
    const fileRef = useRef();
    const folderRef = useRef();
    const [fileStructure, setFileStructure] = useState([]);

    const loginProc = () => {
        setLogining(true);
        var sendData = JSON.stringify({
            "userId": id,
            "userPw": pw
        });
        axios({
            method:"POST",
            url: 'http://localhost:8080/api/auth/signin',
            data:sendData,
            headers: {'Content-type': 'application/json'}
        }).then(response => {
            setLogining(false);
            setUser(response.data);
        }).catch(error => {
            setErrorTitle("로그인 실패");
            if(error.response.status === 401){
                setErrorContent("아이디 또는 비밀번호가 일치하지 않습니다.");
                setLogining(false);
                setErrorShow(true);
            } else {
                setErrorContent("서버 내부 오류입니다.");
                setLogining(false);
                setErrorShow(true);
            }
        })
    }

    const registerProc = () => {
        var sendData = JSON.stringify({
            "userId": rid,
            "userPw": rpw,
            "email": remail
        });
        axios({
            method:"POST",
            url: 'http://localhost:8080/api/auth/signup',
            data:sendData,
            headers: {'Content-type': 'application/json'}
        }).then(response => {
            setRegister(false)
            setErrorTitle("회원가입 완료");
            setErrorContent("회원가입이 완료되었습니다.");
            setErrorShow(true);
        }).catch(error => {
            setErrorTitle("회원가입 불가");
            if(error.response.status === 401){
                setErrorContent("이미 존재하는 아이디입니다.");
                setLogining(false);
                setErrorShow(true);
            } else {
                setErrorContent("서버 내부 오류입니다.");
                setLogining(false);
                setErrorShow(true);
            }
        })
    }

    const printLoginPage = () => {
        return <>
            {
                (!logining) && <>
                    <Modal.Body>
                        <FloatingLabel
                            controlId="floatingInput"
                            label="ID"
                            className="mb-3"
                        >
                            <Form.Control type="text" placeholder="Input ID" value={id} onChange={(e) => setId(e.target.value)}/>
                        </FloatingLabel>
                        <FloatingLabel
                            controlId="floatingPassword"
                            label="Password"
                            className="mb-3"
                        >
                            <Form.Control type="password" placeholder="Input Password" value={pw} onChange={(e)=>setPw(e.target.value)}/>
                        </FloatingLabel>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={(e)=>setRegister(true)}>회원가입</Button>
                        <Button variant="primary" onClick={(e)=>loginProc()}>로그인</Button>
                    </Modal.Footer>
                </>
            }
            {
                (logining) && <>
                    <Modal.Body>
                        로그인 중입니다...<Spinner className="ms-2" size="sm"/>
                    </Modal.Body>
                </>
            }
            </>
    }

    const printRegisterPage = () => {
        return <>
            <Modal.Body>
                <FloatingLabel
                    controlId="floatingEmail"
                    label="Email"
                    className="mb-3"
                >
                    <Form.Control type="email" placeholder="Input Email" value={remail} onChange={(e) => setRemail(e.target.value)}/>
                </FloatingLabel>
                <FloatingLabel
                    controlId="floatingInput"
                    label="ID"
                    className="mb-3"
                >
                    <Form.Control type="text" placeholder="Input ID" value={rid} onChange={(e) => setRid(e.target.value)}/>
                </FloatingLabel>
                <FloatingLabel
                    controlId="floatingPassword"
                    label="Password"
                    className="mb-3"
                >
                    <Form.Control type="password" placeholder="Input Password" value={rpw} onChange={(e)=>setRpw(e.target.value)}/>
                </FloatingLabel>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={(e) => setRegister(false)}>로그인</Button>
                <Button variant="primary" onClick={(e)=>registerProc()}>회원가입</Button>
            </Modal.Footer>
        </>
    }

    useEffect(() => {
        if(user === "") return;
        var sendData = JSON.stringify({
            "sessionKey": user,
            "path": nowPath,
        });
        axios({
            method:"POST",
            url: 'http://localhost:8080/api/file/list',
            data:sendData,
            headers: {'Content-type': 'application/json'}
        }).then(response => {
            setFileStructure(response.data);
            console.log(response.data);
        }).catch(error => {
            setErrorTitle("탐색 오류");
            if(error.response.status === 403){
                setErrorContent("파일 조회 권한이 없습니다.");
                setErrorShow(true);
            } else if(error.response.status === 401){
                setErrorContent("세션이 만료되었습니다.");
                setUser("");
                setErrorShow(true);
            } else {
                setErrorContent("서버 내부 오류입니다.");
                setErrorShow(true);
            }
        })
    }, [user, nowPath]);

    const pathRenderer = () => {
        return nowPath;
    }

    const fileRenderer = () => {
        const result = [];
        for (let i = 0; i < 20; i++) {
            result.push(<Container key={i * 5} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(-1)}
                                   className="border-bottom border-gray w-100 d-flex justify-content-between align-items-center p-2"
                                   style={{cursor: "pointer", backgroundColor: (hover == i ? "lightcyan" : "")}}>
                <div key={i * 5 + 1}>
                    <FontAwesomeIcon key={i * 5 + 2} className="me-3" icon={faFolderOpen} style={{color: "#ffd500"}}/>
                    <span key={i * 5 + 3}>Folder Name</span>
                </div>
                <FontAwesomeIcon key={i * 5 + 4} className="me-2" icon={faTrashCan}
                                 onClick={(e) => setShowDelete(true)}/>
            </Container>);
        }
        if (result.length === 0) {
            return <span className="h5 text-center mt-5">이 폴더는 비어 있습니다.</span>;
        }
        return result;
    }


    return (<>
            <Toast
                bg="light"
                className="z-3 position-absolute start-50 translate-middle-x"
                onClose={() => setErrorShow(false)}
                show={errorShow}
                delay={3000}
                autohide
                style={{top:"2%"}}>
                <Toast.Header className="justify-content-center" closeButton={false}>
                    <strong>{errorTitle}</strong>
                </Toast.Header>
                <Toast.Body className="text-center">{errorContent}</Toast.Body>
            </Toast>
            <Form.Control type="file" ref={fileRef} style={{display: 'none'}}/>
            <Form.Control type="file" dir='' webkitdirectory='' ref={folderRef} style={{display: 'none'}}/>
            <div className="z-1 position-absolute top-0 start-0 w-100 h-100">
                <Container className='d-flex justify-content-center align-item-center w-100 text-black'
                           style={{minHeight: "100vh"}}>
                    {user === "" && <div className="modal show" style={{display: 'block', position: 'initial'}}>
                        <Modal.Dialog>
                            <Modal.Header className="">
                                <Modal.Title>{register ? "회원가입" : "로그인"}</Modal.Title>
                            </Modal.Header>
                            {!register && printLoginPage()}
                            {register && printRegisterPage()}
                        </Modal.Dialog>
                    </div>}
                    {user !== "" && <>
                        <div className="d-block w-100 mt-3 rounded" style={{minHight: "100%", maxHeight: "100%"}}>
                            <Navbar className="bg-white border-bottom border-2 rounded-top">
                                <Container>
                                    <Navbar.Brand>
                                        {pathRenderer()}
                                    </Navbar.Brand>
                                    <div className="d-flex flex-row justify-content-end align-items-center">
                                        <DropdownButton title="작업" drop="start" className="border-0 rounded"
                                                        style={{backgroundColor: "#508bfc"}} size='sm'>
                                            <Dropdown.Item onClick={() => setShowMkdir(true)}>디렉토리 만들기</Dropdown.Item>
                                            <Dropdown.Item onClick={() => fileRef.current.click()}>파일 업로드</Dropdown.Item>
                                            <Dropdown.Item onClick={() => folderRef.current.click()}>디렉토리
                                                업로드</Dropdown.Item>
                                            <Dropdown.Divider/>
                                            <Dropdown.Item>로그아웃</Dropdown.Item>
                                        </DropdownButton>
                                    </div>
                                </Container>
                            </Navbar>
                            <div className="bg-white mb-3 w-100 rounded-bottom d-flex flex-column overflow-auto"
                                 style={{height: "85vh"}}>
                                {fileRenderer()}
                            </div>
                        </div>
                    </>}
                </Container>
                <Modal show={showMkdir} onHide={() => setShowMkdir(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>디렉토리 만들기</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <FloatingLabel
                            controlId="dirInput"
                            label="디렉토리 이름을 입력해주세요."
                            className="mb-3"
                        >
                            <Form.Control type="text" placeholder="Input Dir Name."/>
                        </FloatingLabel>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowMkdir(false)}>
                            취소
                        </Button>
                        <Button style={{backgroundColor: "#508bfc"}} className="border-0"
                                onClick={() => setShowMkdir(false)}>
                            만들기
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={showDelete} onHide={() => setShowDelete(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>삭제 확인</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        선택한 폴더 혹은 파일을 삭제할까요?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowDelete(false)}>
                            취소
                        </Button>
                        <Button variant="danger" onClick={() => setShowDelete(false)}>
                            삭제
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    );
}

export default App;