'use client';
import * as React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'O nome deve ter pelo menos 2 caracteres.',
  }),
  notes: z.string(),
  orderNumber: z.coerce.number().min(4, {
    message: 'O número da encomenda deve ter pelo menos 4 caracteres.',
  }),
  dob: z.date({
    required_error: 'A date of birth is required.',
  }),
  email: z.string().email().min(5, {
    message: 'O nome deve ter pelo menos 5 caracteres.',
  }),
  phoneNumber: z.string().min(9, {
    message: 'O número deve ter pelo menos 9 caracteres.',
  }),
  address1: z.string().min(5, {
    message: 'A morada deve ter pelo menos 5 caracteres.',
  }),
  address2: z.string().min(5, {
    message: 'A morada deve ter pelo menos 5 caracteres.',
  }),
  postalCode: z.string().min(5, {
    message: 'O código postal deve ter 5 caracteres.',
  }),
  city: z.string().min(5, {
    message: 'A cidade deve ter pelo menos 5 caracteres.',
  }),
});

export function SalesForm() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      orderNumber: 6111,
      dob: new Date(),
      email: '',
      phoneNumber: '',
      address1: '',
      address2: '',
      postalCode: '',
      city: '',
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <h2 className='scroll-m-20 text-4xl font-extrabold tracking-tight'>
          Nova Encomenda
        </h2>
        <FormField
          control={form.control}
          disabled
          name='orderNumber'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número da Encomenda</FormLabel>
              <FormControl>
                <Input placeholder='6111' autoComplete='off' {...field} />
              </FormControl>
              <FormDescription>
                O número da encomenda é gerado automaticamente.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='dob'
          render={({ field }) => (
            <FormItem className='flex flex-col'>
              <FormLabel>Data da encomenda</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-[240px] pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'PPP')
                      ) : (
                        <span>Escolha uma data</span>
                      )}
                      <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                  <Calendar
                    mode='single'
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date('1900-01-01')
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='notes'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea className='resize-none' {...field} />
              </FormControl>
              <FormDescription>
                Notas importantes que vão ser lidas pela equipa mas que não vão
                para o cliente.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <h2 className='scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0"'>
          Dados do Cliente
        </h2>

        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder='Joana Dias' autoComplete='off' {...field} />
              </FormControl>
              <FormDescription>
                Escreve o primeiro e último nome, ou o nome da empresa.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email do cliente</FormLabel>
              <FormControl>
                <Input
                  placeholder='joana.dias@gmail.com'
                  autoComplete='off'
                  {...field}
                />
              </FormControl>
              <FormDescription>
                O cliente vai receber notificações através deste endereço.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='phoneNumber'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone do cliente</FormLabel>
              <FormControl>
                <Input placeholder='962119084' autoComplete='off' {...field} />
              </FormControl>
              <FormDescription>
                Pode ser usado para auxiliar a entrega.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='address1'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Linha de morada 1</FormLabel>
              <FormControl>
                <Input
                  placeholder='Rua do Carmo 12'
                  autoComplete='off'
                  {...field}
                />
              </FormControl>
              <FormDescription>Nome e número da rua</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='address2'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Linha de morada 2</FormLabel>
              <FormControl>
                <Input
                  placeholder='Lote B, 3dto'
                  autoComplete='off'
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Apartamento, bloco, edificio, andar, etç.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='postalCode'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Código Postal</FormLabel>
              <FormControl>
                <Input autoComplete='off' {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='city'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cidade</FormLabel>
              <FormControl>
                <Input autoComplete='off' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit'>Submeter</Button>
      </form>
    </Form>
  );
}
