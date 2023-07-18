export const Modal = ({
  activeModal,
  setActive,
  children,
}) => {

  return (
    <div
      className={activeModal ? 'modal active' : 'modal'}
      onClick={() => setActive(false)}
      onTouchMove={(e) => e.preventDefault()}
    >
      <div
        className={
          activeModal ? 'modal__content active' : 'modal__content'
        }
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};