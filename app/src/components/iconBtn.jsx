export const IconBtn = (props) => {
  const { title, icon } = props.data;

  const styleTitle = {
    small: { overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.8rem' },
    big: { overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '1rem' }
  }

  let classes = props.openedTab ? 'iconBtn active' : 'iconBtn';
  classes += " p-1 pb-0";

  return (
    <button className={classes} onClick={props.onClick}>
      <img src={icon} alt='' className={props.size === 'big' ? 'iconImgBig' : 'iconImgSmall'} />
      {props.size === 'big' && (
	<h5 className='iconTitle' style={styleTitle[props.size]}>{title}</h5>
      )}
      {props.size === 'small' && (
	<div className='iconTitle' style={styleTitle[props.size]}>{title}</div>
      )}
    </button>
  )
}
