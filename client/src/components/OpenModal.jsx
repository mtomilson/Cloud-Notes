import React from 'react';
import Modal from '@mui/material/Modal';
import Camera from './camera';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxWidth: '900px',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 2,
  borderRadius: '8px',
};

export default function OpenModal({ open, handleClose }) {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="camera-modal"
    >
      <div style={style}>
        <button
          onClick={handleClose}
          style={{
            position: 'flex-align-center',
            top: '10px',
            right: '10px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          ✖
        </button>
        <Camera />
      </div>
    </Modal>
  );
}