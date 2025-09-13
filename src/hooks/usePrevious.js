import { useEffect, useRef } from 'react';

// Este Hook customizado serve para guardar o valor anterior de uma variável.
// É útil para comparar o estado antigo com o novo, como fizemos para
// detectar o "Level Up!" dos atributos.
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export default usePrevious;

