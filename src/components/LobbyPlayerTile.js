import styled from 'styled-components';
import get_color_from_name from '../utilities/get_color_from_name';
import crown_img from '../assets/img/crown.png';

const Wrapper = styled.div`
  background-color: rgba(255, 255, 255, 0.9);
  display: grid;
  grid-template-columns: 15% auto 15%;
  align-items: center;
  justify-items: center;
  width: 15vw;
  height: 4vw;
  border-radius: 5px;
  padding: 4px 12px;
`;

const Profile = styled.div`
  grid-column: 1;
  height: 2.5vw;
  width: 2.5vw;
  border-radius: 30%;
  background-color: ${({ color }) => color};
`;

const Name = styled.span`
  grid-column: 2;
`;

const HostCrown = styled.img`
  grid-column: 3;
  height: 3.5vw;
  width: auto;
`;

const LobbyPlayerTile = ({ name, id, host }) => {
  return (
    <Wrapper>
      <Profile color={get_color_from_name(name, id)} /> 
      <Name>{name}</Name>
      {host && <HostCrown src={crown_img} alt='Host' />}
    </Wrapper>
  );
}

export default LobbyPlayerTile;
