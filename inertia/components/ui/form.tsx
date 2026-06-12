import { cn } from '~/lib/utils'
import { routes } from '@generated/registry'
import { Form as FormPrimitive } from '@base-ui/react/form'
import { Form as InertiaForm, FormProps } from '@adonisjs/inertia/react'

function Form<Route extends keyof typeof routes>({
  className,
  children,
  ...inertiaProps
}: FormProps<Route>) {
  return (
    <InertiaForm {...(inertiaProps as any)}>
      {(slotProps) => (
        <FormPrimitive
          errors={slotProps.errors}
          render={<div />}
          className={cn('flex w-full flex-col gap-4', className)}
        >
          {typeof children === 'function' ? children(slotProps) : children}
        </FormPrimitive>
      )}
    </InertiaForm>
  )
}

export { Form }
