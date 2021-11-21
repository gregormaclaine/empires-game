import styled from 'styled-components';
import refresh_icon from '../assets/img/refresh.png';

const Wrapper = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
`;

const Image = styled.img`
  height: 2rem;
  width: auto;
  cursor: pointer;
`;

export default function RefreshButton({ onClick }) {
  return (
    <Wrapper>
      <Image alt='Refresh' src={refresh_icon} onClick={onClick} />
    </Wrapper>
  )
}
