import { HandPalm, Play } from 'phosphor-react';
import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from './styles';

import { useContext } from 'react';
import { NewCycleForm } from './Components/NewCycleForm';
import { Countdown } from './Components/Countdown';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { CycleContext } from '../../contexts/CyclesContext';

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod
    .number()
    .min(5, 'O ciclo precisa ser no mínimo de 5 minutos')
    .max(60, 'O ciclo precisa ser no máximo de 60 minutos'),
});

type NewCycleFormaData = zod.infer<typeof newCycleFormValidationSchema>;

export function Home() {

  const {activeCycle, createNewCycle, interruptCurrentCycle} = useContext(CycleContext)

  const newCycleForm = useForm<NewCycleFormaData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  });

  const { handleSubmit, watch, reset } = newCycleForm;

  function handlerCreateNewCycle(data: NewCycleFormaData) {
    createNewCycle(data)
    reset()
  }

  const task = watch('task');
  const isSubmitDisabled = !task;

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handlerCreateNewCycle)} action="">
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>
        <Countdown />

        {activeCycle ? (
          <StopCountdownButton onClick={interruptCurrentCycle} type="button">
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  );
}
