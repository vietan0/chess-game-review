import { DevTool } from '@hookform/devtools';
import { Button } from '@nextui-org/button';
import { Card, CardBody, CardFooter } from '@nextui-org/card';
import { Textarea } from '@nextui-org/input';
import { Controller, useForm } from 'react-hook-form';

import { useBoardStore } from '../../stores/useBoardStore';
import { useSelectGameStore } from '../../stores/useSelectGameStore';

import type { SubmitHandler } from 'react-hook-form';

interface Inputs {
  pgn: string;
}

export default function PGNForm() {
  const loadGame = useBoardStore(state => state.loadGame);
  const submitGame = useSelectGameStore(state => state.submitGame);

  const { handleSubmit, control, setError, formState } = useForm<Inputs>({
    defaultValues: {
      pgn: '',
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    try {
      loadGame(data.pgn);
      submitGame();
    }
    catch (error) {
      const err = error as Error;

      setError('pgn', {
        type: 'pgn-parsing',
        message: err.message,
      });
    }
  };

  return (
    <Card
      classNames={{
        base: 'bg-content2 rounded-small',
        header: 'text-sm',
        body: 'p-0',
        footer: 'p-0 rounded-none',
      }}
      fullWidth
      shadow="none"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardBody className="p-0 text-small text-default-400">
          <Controller
            control={control}
            name="pgn"
            render={({ field }) => (
              <Textarea
                classNames={{
                  inputWrapper: 'rounded-none',
                }}
                errorMessage={formState.errors.pgn?.message}
                isInvalid={Boolean(formState.errors.pgn)}
                label="PGN"
                maxRows={3}
                minRows={1}
                {...field}
              />
            )}
          />
        </CardBody>
        <CardFooter>
          <Button
            color="primary"
            disableAnimation
            fullWidth
            isDisabled={!formState.isDirty || !formState.isValid}
            radius="none"
            type="submit"
          >
            Add Game
          </Button>
        </CardFooter>
        <DevTool control={control} />
      </form>
    </Card>
  );
}