import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { DevTool } from '@hookform/devtools';
import { Controller, useForm } from 'react-hook-form';

import useLocalStorage from '../../hooks/useLocalStorage';
import { useSelectGameStore } from '../../stores/useSelectGameStore';
import { useStageStore } from '../../stores/useStageStore';

import type { Site } from '../../stores/useSelectGameStore';
import type { SubmitHandler } from 'react-hook-form';

interface Inputs {
  username: string;
}

export default function ChessSiteForm({ site }: { site: Site }) {
  const submitUsername = useSelectGameStore(state => state.submitUsername);
  const setStage = useStageStore(state => state.setStage);
  const { item: lastUsername, set } = useLocalStorage(`${site}-username`);
  const { handleSubmit, control, formState, watch } = useForm<Inputs>({ defaultValues: { username: lastUsername || '' } });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    submitUsername(data.username, site);
    set(`${site}-username`, data.username);
    setStage('select-month');
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
        className="h-12 font-semibold text-shadow-xs"
        color="primary"
        isDisabled={watch('username') === '' || !formState.isValid}
        radius="sm"
        type="submit"
      >
        Submit
      </Button>
      {import.meta.env.PROD || <DevTool control={control} />}
    </form>
  );
}
