import { useSelector } from 'react-redux';
import * as socket from '../socket';
import { Model, ModelSubtitle, ModelTitle, ModelWrapper } from './GameAnswerModel';

function GameEndedModel({ winner }) {
  const room = useSelector(state => state.room);

  const winner_name = room.players.find(p => p.id === winner)?.name || <i>Unknown</i>;

  const we_win = winner === socket.id();

  return (
    <ModelWrapper>
      <Model>
        <ModelTitle>The winner is {winner_name}!!</ModelTitle>
        <ModelSubtitle>{we_win ? 'Congratulations on your win! Make sure to celebrate accordingly :D' : 'Oh No! Well, better luck next time :/'}</ModelSubtitle>
      </Model>
    </ModelWrapper>
  );
}

export default GameEndedModel;
