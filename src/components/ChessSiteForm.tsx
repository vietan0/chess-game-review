import { DevTool } from '@hookform/devtools';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { Controller, useForm } from 'react-hook-form';

import { useSelectGameStore } from '../useSelectGameStore';

import type { Site } from '../useSelectGameStore';
import type { SubmitHandler } from 'react-hook-form';

interface Inputs {
  username: string;
}

export default function ChessSiteForm({ site }: { site: Site }) {
  const submitUsername = useSelectGameStore(state => state.submitUsername);
  const { handleSubmit, control, formState } = useForm<Inputs>({ defaultValues: { username: '' } });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    submitUsername(data.username, site);
  };

  return (
    <form className="flex gap-1" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="username"
        render={({ field }) => (
          <Input
            {...field}
            label="Username"
            size="sm"
          />
        )}
      />
      <Button
        className="h-12"
        color="primary"
        isDisabled={!formState.isDirty || !formState.isValid}
        radius="sm"
        type="submit"
      >
        Submit
      </Button>
      <DevTool control={control} />
    </form>
  );
}
