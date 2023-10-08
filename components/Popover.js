import React, { useState } from 'react';
import { withRouter } from 'next/router';
import { Modal } from 'antd';
import { atom, useRecoilState } from 'recoil';

// Create a Recoil atom to manage the modal's open state
const isModalOpenState = atom({
  key: 'isModalOpenState',
  default: false,
});

const scrollablePopupContent = {
  maxHeight: '80vh',
  maxWidth: '90vw',
  overflowY: 'auto',
  overflowX: 'hidden',
};

const PopOver = ({ child, content }) => {
  //userecoilstate to  read  and update the state
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = (e) => {
    setIsModalOpen(true);
    console.log("Showing modal");
    e.stopPropagation();
  };

  const handleModalClose = (e) => {
    
    setIsModalOpen(false);
    console.log("Closing modal");
    e.stopPropagation();
  };
  //function compoennt
  return (
    <div>
      {React.cloneElement(child, { onClick: showModal })}
      <div onClick={(e) => e.stopPropagation()}>
        <Modal
          footer={null}
          open={isModalOpen}
          onCancel={handleModalClose}
          bodyStyle={scrollablePopupContent}
        >
          {content}
        </Modal>
      </div>
    </div>
  );
};

export default withRouter(PopOver);