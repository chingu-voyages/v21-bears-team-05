import React, { useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

const LoginModal = (props) => {
  const [modal, setModal] = useState(true);

  const toggle = () => {
    props.toggle();
  };
  const handleDelete = () => {
    toggle();
  };
  console.log("rendering user modal");
  return (
    <>
      <Modal isOpen={true} toggle={toggle}>
        <ModalHeader toggle={toggle}>Please Login</ModalHeader>
        <ModalBody>Please Login</ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={handleDelete}>
            DELETE
          </Button>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default LoginModal;
