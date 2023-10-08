import React, { useState } from 'react';
import { withRouter } from 'next/router';
import { Modal } from 'antd';
import popOverStyle from '../styles/Popover.module.css';
import { atom, useRecoilState } from 'recoil';

// Create a Recoil atom to manage the modal's open state
const isModalOpenState = atom({
  key: 'isModalOpenState',
  default: false,
});

const PopOver = ({ child, content }) => {
  //userecoilstate to  read  and update the state
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = (e) => {
    setIsModalOpen(true);
    e.stopPropagation();
  };

  const handleModalClose = (e) => {
    setIsModalOpen(false);
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
          onOk={handleModalClose}
          onCancel={handleModalClose}
        >
          <div className={popOverStyle.scrollablePopupContent}>{content}</div>
        </Modal>
      </div>
    </div>
  );
};

export default withRouter(PopOver);
