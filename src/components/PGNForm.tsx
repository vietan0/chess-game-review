import { DevTool } from '@hookform/devtools';
import { Button } from '@nextui-org/button';
import { Card, CardBody, CardFooter } from '@nextui-org/card';
import { Textarea } from '@nextui-org/input';
import { Controller, useForm } from 'react-hook-form';

import { useBoardStore } from '../useBoardStore';

import type { SubmitHandler } from 'react-hook-form';

interface Inputs {
  pgn: string;
}

export default function PGNForm() {
  const loadGame = useBoardStore(state => state.loadGame);

  const { handleSubmit, control, formState } = useForm<Inputs>({
    defaultValues: {
      pgn: '',
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    loadGame(data.pgn);
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
                label="PGN"
                maxRows={3}
                minRows={1}
                placeholder="Paste PGN here"
                {...field}
              />
            )}
          />
        </CardBody>
        <CardFooter>
          <Button
            fullWidth
            isDisabled={!formState.isDirty}
            radius="none"
            type="submit"
          >
            Add Game
          </Button>
        </CardFooter>
      </form>
      <DevTool control={control} />
    </Card>
  );
}