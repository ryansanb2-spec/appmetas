import { useMemo } from 'react';

import addSound from '../assets/sounds/add.mp3';
import completeSound from '../assets/sounds/complete.mp3';
import goalCompleteSound from '../assets/sounds/goal_complete.mp3';
import stepSound from '../assets/sounds/step.mp3';

export default function useSound() {
  const sounds = useMemo(() => ({
    add: new Audio(addSound),
    complete: new Audio(completeSound),
    goal_complete: new Audio(goalCompleteSound),
    step: new Audio(stepSound),
  }), []);

  const play = (id) => {
    const audio = sounds[id];
    if (audio) {
      audio.currentTime = 0;
      audio.play();
    }
  };

  return { play };
}
