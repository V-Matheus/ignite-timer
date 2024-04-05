import { ReactNode, createContext, useReducer, useState } from 'react';

interface CreateCycleData {
  task: string;
  minutesAmount: number;
}

interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  fineshedDate?: Date;
}

interface CycleContextType {
  cycles: Cycle[]
  activeCycle: Cycle | undefined;
  activeCycleId: string | null;
  amountSecondsPassed: number;
  markCurrentCycleAsFinished: () => void;
  setSecondsPassed: (seconds: number) => void;
  createNewCycle: (data: CreateCycleData) => void;
  interruptCurrentCycle: () => void;
}

interface CyclesContextProviderProps {
  children: ReactNode
}

export const CycleContext = createContext({} as CycleContextType);

export function CyclesContextProvider({ children }: CyclesContextProviderProps) {
  const [cycles, dispatch] = useReducer((state: Cycle[], action) => {

    if(action.type === 'ADD_NEW_CYCLE') {
      return [...state, action.payload.newCycle]
    }

    return state
  }, [])

  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds);
  }

  function markCurrentCycleAsFinished() {

    dispatch({
      type: 'MARK_CURRENT_CYCLE_AS_FINISHED',
      payload: {
        activeCycleId,
      }
    })

    // setCycles((states) =>
    //   states.map((cycle) => {
    //     if (cycle.id === activeCycleId) {
    //       return { ...cycle, fineshedDate: new Date() };
    //     } else {
    //       return cycle;
    //     }
    //   }),
    // );
  }

  function createNewCycle(data: CreateCycleData) {
    const id = String(new Date().getTime());

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    };

    dispatch({
      type: 'ADD_NEW_CYCLE',
      payload: {
        newCycle,
      }
    })

    // setCycles((state) => [...state, newCycle]);
    setActiveCycleId(id);
    setAmountSecondsPassed(0);
  }

  function interruptCurrentCycle() {

    dispatch({
      type: 'INTERRUPT_CURRENT_CYCLE',
      payload: {
        activeCycleId
      }
    })

    // setCycles((state) =>
    //   state.map((cycle) => {
    //     if (cycle.id === activeCycleId) {
    //       return { ...cycle, interruptedDate: new Date() };
    //     } else {
    //       return cycle;
    //     }
    //   }),
    // );
    setActiveCycleId(null);
  }

  return (
    <CycleContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        markCurrentCycleAsFinished,
        amountSecondsPassed,
        setSecondsPassed,
        createNewCycle,
        interruptCurrentCycle,
      }}
    >
      {children}
    </CycleContext.Provider>
  );
}
