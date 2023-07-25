export const IconBtn = (props) => {
  const { title, img } = props.data;

  const styleTitle = {
    small: { width: '58px', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.8rem' },
    big: { overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '1rem' }
  }

  return (
    <button className={props.openedTab ? 'iconBtn active mb-1' : 'iconBtn mb-1'} onClick={props.onClick}>
      <img src={img} alt='icon app' className={props.size === 'big' ? 'iconImgBig' : 'iconImgSmall'} />
      <h5 className='iconTitle' style={styleTitle[props.size]}>{title}</h5>
    </button>
  )
}