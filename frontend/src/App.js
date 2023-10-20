import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import { Button, Container, Dropdown, DropdownButton, FloatingLabel, Form, Modal, Navbar, Spinner } from 'react-bootstrap';
import { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen, faTrashCan } from '@fortawesome/free-regular-svg-icons';

function App() {

  const [user, setUser] = useState("1234");
  const [logining, setLogining] = useState(false);
  const [showMkdir, setShowMkdir] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [hover, setHover] = useState(-1);
  const [nowPath, setNowPath] = useState("root");
  const fileRef = useRef();
  const folderRef = useRef();



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
              <Form.Control type="text" placeholder="Input ID" />
            </FloatingLabel>
            <FloatingLabel
              controlId="floatingPassword"
              label="Password"
              className="mb-3"
            >
              <Form.Control type="password" placeholder="Input Password" />
            </FloatingLabel>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary">회원가입</Button>
            <Button variant="primary">로그인</Button>
          </Modal.Footer>
        </>
      }
      {
        (logining) && <>
          <Modal.Body>
            로그인 중입니다...<Spinner className="ms-2" size="sm" />
          </Modal.Body>
        </>
      }</>
  }

  const pathRenderer = () => {
    return nowPath;
  }

  const fileRenderer = () => {
    const result = [];
    for (let i = 0; i < 20; i++) {
      result.push(<Container key={i*5} onMouseEnter={()=>setHover(i)} onMouseLeave={()=>setHover(-1)} className="border-bottom border-gray w-100 d-flex justify-content-between align-items-center p-2" style={{cursor:"pointer", backgroundColor:(hover == i ? "lightcyan" : "")}}>
        <div key={i*5+1}>
          <FontAwesomeIcon key={i*5+2} className="me-3" icon={faFolderOpen} style={{ color: "#ffd500" }} />
          <span key={i*5+3}>Folder Name</span>
        </div>
        <FontAwesomeIcon key={i*5+4} className="me-2" icon={faTrashCan} onClick={()=>setShowDelete(true)}/>
      </Container>);
    }
    if(result.length == 0){
      return <span className="h5 text-center mt-5">이 폴더는 비어있습니다.</span>;
    }
    return result;
  }


  return (<>
    <Form.Control type="file" ref={fileRef} style={{display:'none'}}/>
    <Form.Control type="file" dir='' webkitdirectory='' ref={folderRef} style={{display:'none'}}/>
    <Container className='d-flex justify-content-center align-item-center w-100 text-black' style={{ minHeight: "100vh" }}>
      {user === "" && <div className="modal show" style={{ display: 'block', position: 'initial' }}>
        <Modal.Dialog>
          <Modal.Header className="">
            <Modal.Title>로그인</Modal.Title>
          </Modal.Header>
          {printLoginPage()}
        </Modal.Dialog>
      </div>}
      {user !== "" && <>
        <div className="d-block w-100 mt-3 rounded" style={{ minHight: "100%", maxHeight: "100%" }}>
          <Navbar className="bg-white border-bottom border-2 rounded-top">
            <Container>
              <Navbar.Brand>
                {pathRenderer()}
              </Navbar.Brand>
              <div className="d-flex flex-row justify-content-end align-items-center">
                <DropdownButton title="작업" drop="start" className="border-0 rounded" style={{ backgroundColor: "#508bfc" }} size='sm'>
                  <Dropdown.Item onClick={()=>setShowMkdir(true)}>디렉토리 만들기</Dropdown.Item>
                  <Dropdown.Item onClick={()=>fileRef.current.click()}>파일 업로드</Dropdown.Item>
                  <Dropdown.Item onClick={()=>folderRef.current.click()}>디렉토리 업로드</Dropdown.Item>
                </DropdownButton>
              </div>
            </Container>
          </Navbar>
          <div className="bg-white mb-3 w-100 rounded-bottom d-flex flex-column overflow-auto" style={{ height: "85vh" }}>
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
          <Form.Control type="text" placeholder="Input Dir Name." />
        </FloatingLabel>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowMkdir(false)}>
          취소
        </Button>
        <Button style={{ backgroundColor: "#508bfc" }} className="border-0" onClick={() => setShowMkdir(false)}>
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
  </>
  );
}

export default App;