import React from 'react';
import styled from 'styled-components';
import Card from '../Card';

type Props = {
  children: React.ReactNode;
  className?: string;
  isOpen: boolean;
  onClose?: () => void;
}

export const useModal = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return {
    openModal,
    closeModal,
    isModalOpen
  }
};

const ModalOverlay = styled.div`
  position: fixed;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  bottom: 0;
  display: flex;
  justify-content: center;
  left: 0;
  right: 0;
  top: 0;
  z-index: 100;
`
ModalOverlay.displayName = 'ModalOverlay'

const StyledModal = styled(Card)`
  position: relative;
  width: 100%;
  max-width: 600px;
  padding: 2rem;
  border-radius: 20px;
  background: #fff;
  z-index: 100;

  @media (max-width: 414px) {
    width: 95%;
  }
`
StyledModal.displayName = 'StyledModal'

const StyledModalContent = styled.div`

`

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 20px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  &:hover {
    color: #abfe2c;
  }
`

const Modal = ({ className, isOpen, onClose, children }: Props) => {
  if (!isOpen) return null;

  const _className = [
    'modal',
    className || ''
  ].join(' ');

  return (
    <ModalOverlay className="modal-overlay">
      <StyledModal className={_className}>
        <CloseButton onClick={onClose}>✖</CloseButton>
        <StyledModalContent>
          {children}
        </StyledModalContent>
      </StyledModal>
    </ModalOverlay>
  );
};

export default Modal;
