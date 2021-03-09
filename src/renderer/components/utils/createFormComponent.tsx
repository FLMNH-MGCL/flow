import React from 'react';
import { useFormContext } from 'react-hook-form';

// this file is not my original work:  github.com/kesne

type FormProps<T extends {}> = Omit<T, 'ref' | 'errors' | 'error'> & {
  // register?: ValidationRules;
  register?: any;
  assignOnChange?: (
    something: Record<string, string>
  ) => Record<string, string>;
};

export default function createFormComponent<Props>(
  Component: React.ComponentType<Props>
): React.ComponentType<FormProps<Props>> {
  function FormComponent({
    assignOnChange,
    register,
    ...props
  }: FormProps<Props>) {
    const form = useFormContext();

    if (assignOnChange) {
      // @ts-ignore We promise this works:
      props.onBlur = () => {
        const values = assignOnChange(form.getValues());
        if (values) {
          Object.entries(values).forEach(([key, value]) => {
            form.setValue(key, value);
          });
        }
      };
    }

    return (
      // @ts-ignore:
      <Component
        ref={register ? form?.register(register) : form?.register}
        errors={form?.errors}
        {...props}
      />
    );
  }

  FormComponent.displayName = `Form${Component.displayName || Component.name}`;

  return FormComponent;
}
