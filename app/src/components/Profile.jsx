import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { BsFillPersonFill } from "react-icons/bs";

export const Profile = (props) => {

  const { npub } = props.profile;

  const crop = (s, n) => {
    if (s.length > n)
      return s.trim().substring(0, n-1) + "...";
    return s.trim();
  };
  
  const name = crop(props.profile?.name || props.profile?.display_name || npub, 15);
  const about = crop(props.profile?.about || "", 25);
  const picture = props.profile?.picture || "";

  return (
    <Card style={{ minWidth: '40%', marginRight: '5px' }}>
      <Card.Body style={{padding: "6px"}}>
	<center>
	  {picture
	  ? (<img src={picture} style={{borderRadius: "50%", width: "60%", aspectRatio: "1 / 1", objectFit: "cover"}} />)
	  : (<BsFillPersonFill color='black' size={55} />)
	  }
	  <Card.Title style={{marginBottom: "3px"}}>{name}</Card.Title>
	  <small>{crop(npub, 13)}</small>
	  <Card.Text style={{marginBottom: "3px", overflowWrap: "break-word"}}>{about}</Card.Text>
	  <Button onClick={() => props.onClick(npub)}>View</Button>
	</center>
      </Card.Body>
    </Card>
  );
}

export default Profile;
