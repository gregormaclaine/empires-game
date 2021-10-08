import styled from 'styled-components';
import back_arrow_img from '../assets/img/left-arrow.png';

const Wrapper = styled.div`
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
`;

const Image = styled.img`
  height: 4rem;
  width: auto;
  cursor: pointer;
`;

export default function BackArrow({ onClick }) {
  return (
    <Wrapper>
      <Image alt='Leave' src={back_arrow_img} onClick={onClick} />
    </Wrapper>
  )
}
