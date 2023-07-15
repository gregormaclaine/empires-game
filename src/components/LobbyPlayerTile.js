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
  border-radius: 5px;
  padding: 8px 20px;
  background-color: ${({ me }) =>
    me ? 'rgba(255, 185, 0, 0.95)' : 'rgba(255, 255, 255, 0.9)'};
`;

const Profile = styled.div`
  grid-column: 1;
  margin: 4px;
  height: 1.8rem;
  width: 1.8rem;
  border-radius: 30%;
  background-color: ${({ color }) => color};
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover > img {
    display: block;
  }
`;

const DeleteIcon = styled.img`
  display: none;
  width: 70%;
  height: 70%;
  cursor: pointer;
`;

const Name = styled.span`
  grid-column: 2;
  margin: 8px 12px;
  font-size: 1.2rem;
`;

const HostCrown = styled.img`
  grid-column: 3;
  height: 2.5rem;
  width: auto;
`;

const LobbyPlayerTile = ({ name, id, host, admin }) => {
  const dispatch = useDispatch();
  const is_me = id === socket.id();

  return (
    <Wrapper me={is_me}>
      <Profile color={get_color_from_name(name, id)}>
        {admin && !is_me && (
          <DeleteIcon
            src={cross_img}
            alt='Kick User'
            onClick={() => dispatch(kick_player(id))}
          />
        )}
      </Profile>
      <Name>{name}</Name>
      {host && <HostCrown src={crown_img} alt='Host' />}
    </Wrapper>
  );
};

export default LobbyPlayerTile;
