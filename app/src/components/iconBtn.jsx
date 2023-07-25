export const IconBtn = (props) => {
  const { title, img } = props.data;

  return (
    <button className='iconBtn' onClick={props.onClick}>
      <img src={img} alt='icon app' className='iconImg' />
      <h5 className='iconTitle'>{title}</h5>
    </button>
  )
}
