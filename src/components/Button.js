import styled from 'styled-components';
import { shade } from 'color-helpers';

function background_color(props) {
  if (props.yellow) return props.theme.yellow;
  else if (props.red) return props.theme.red;
  return props.theme.green;
}

function font_color(props) {
  if (props.red) return 'rgba(255, 255, 255, 0.9)';
  return props.theme.blue;
}

export default styled.div`
  padding: 1rem 2rem;

  background-color: ${background_color};
  border-radius: 0.5rem;
  cursor: pointer;
  text-decoration: none;

  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: #${props => shade(background_color(props), -0.1)};
  }

  color: ${font_color};
  text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.2);
  white-space: nowrap;
  font-weight: 600;

  & > span {
    font-size: 2rem;
  }
`;
