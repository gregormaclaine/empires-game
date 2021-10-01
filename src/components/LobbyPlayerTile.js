import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import * as socket from '../socket';
import { kick_player } from '../store/room_slice';
import get_color_from_name from '../utilities/get_color_from_name';
import crown_img from '../assets/img/crown.png';
import cross_img from '../assets/img/cross.png';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 15% auto 15%;
  align-items: center;
  justify-items: center;
  width: 15vw;
  height: 4vw;
  border-radius: 5px;
  padding: 4px 12px;
  background-color: ${({ me }) => me ? 'rgba(255, 185, 0, 0.95)' : 'rgba(255, 255, 255, 0.9)'};
`;

const Profile = styled.div`
  grid-column: 1;
  height: 2.5vw;
  width: 2.5vw;
  border-radius: 30%;
  background-color: ${({ color }) => color};
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover > img { display: block; }
`;

const DeleteIcon = styled.img`
  display: none;
  width: 70%;
  height: 70%;
  cursor: pointer;
`;

const Name = styled.span`
  grid-column: 2;
`;

const HostCrown = styled.img`
  grid-column: 3;
  height: 3.5vw;
  width: auto;
`;

const LobbyPlayerTile = ({ name, id, host, admin }) => {
  const dispatch = useDispatch();
  const is_me = id === socket.id();

  return (
    <Wrapper me={is_me}>
      <Profile color={get_color_from_name(name, id)}>
        {admin && !is_me && <DeleteIcon src={cross_img} alt='Kick User' onClick={() => dispatch(kick_player(id))} />}
      </Profile> 
      <Name>{name}</Name>
      {host && <HostCrown src={crown_img} alt='Host' />}
    </Wrapper>
  );
}

export default LobbyPlayerTile;
