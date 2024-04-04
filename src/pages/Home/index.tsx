import { HandPalm, Play } from 'phosphor-react';
import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from './styles';
import { createContext, useEffect, useState } from 'react';
import { NewCycleForm } from './Components/NewCycleForm';
import { Countdown } from './Components/Countdown';

interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  fineshedDate?: Date;
}

interface CycleContextType {
  activeCycle: Cycle | undefined;
  activeCycleId: string | null;
  markCurrentCycleAsFinished: () => void
}

export const CycleContext = createContext({} as CycleContextType);

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  function markCurrentCycleAsFinished() {
    setCycles((states) =>
      states.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, fineshedDate: new Date() };
        } else {
          return cycle;
        }
      }),
    );
  }

  // function handleCreateNewCycle(data: NewCycleFormaData) {
  //   const id = String(new Date().getTime());

  //   const newCycle: Cycle = {
  //     id,
  //     task: data.task,
  //     minutesAmount: data.minutesAmount,
  //     startDate: new Date(),
  //   };

  //   setCycles((state) => [...state, newCycle]);
  //   setActiveCycleId(id);

  //   reset();
  // }

  function handleInterruptCycle() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptedDate: new Date() };
        } else {
          return cycle;
        }
      }),
    );
    setActiveCycleId(null);
  }

  // const task = watch('task');
  // const isSubmitDisabled = !task;

  return (
    <HomeContainer>
      <form /*onSubmit={handleSubmit(handleCreateNewCycle)}*/ action="">
        <CycleContext.Provider value={{ activeCycle, activeCycleId, markCurrentCycleAsFinished }}>
          {/* <NewCycleForm /> */}
          <Countdown />
        </CycleContext.Provider>

        {activeCycle ? (
          <StopCountdownButton onClick={handleInterruptCycle} type="button">
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton /*disabled={isSubmitDisabled}*/ type="submit">
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  );
}
