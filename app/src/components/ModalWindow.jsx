export const Modal = ({
  activeModal,
  children,
}) => {
  const modalStyles = {
    open: 'container bg-dark bg-gradient d-flex justify-content-center align-items-center fixed-top pe-auto opacity-100 z-2',
    close: 'container bg-dark bg-gradient d-flex justify-content-center align-items-center fixed-top opacity-0 pe-none'
  }

  return (
    <div className={activeModal ? modalStyles.open : modalStyles.close}>
      <div className={activeModal ? 'modalContent active' : 'modalContent'}>
        {children}
      </div>
    </div>
  );
};