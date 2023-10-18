import { createContext } from 'react';

// ---

const ChosenClientContext = createContext<string | null>('Abraham');

export default ChosenClientContext;
