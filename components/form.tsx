'use client';
import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DynamicTable } from './table';
import { formSchema, FormValues } from '@/lib/schema';

export function SalesForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      orderNumber: 6111,
      dob: new Date(),
      email: '',
      phoneNumber: '',
      nif: '',
      address1: '',
      address2: '',
      postalCode: '',
      city: '',
      tableEntries: [],
    },
  });

  function onSubmit(values: FormValues) {
    // Add validation logging
    const result = formSchema.safeParse(values);
    if (!result.success) {
      console.error('Validation Errors:', result.error.errors);
      return;
    }
    console.log('Form Submitted:', values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <h2 className='scroll-m-20 text-4xl font-extrabold tracking-tight'>
          Nova Encomenda
        </h2>
        <FormField
          control={form.control}
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
          name='storeId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loja</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Selecione a loja onde a venda foi executada' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='1'>1 - Clássica</SelectItem>
                  <SelectItem value='3'>3 - Moderna</SelectItem>
                  <SelectItem value='6'>6 - Iluminação</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <h2 className='scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0"'>
          Produtos
        </h2>
        <FormField
          control={form.control}
          name='tableEntries'
          render={() => (
            <FormItem>
              <FormControl>
                <DynamicTable form={form} />
              </FormControl>
              <FormDescription>
                Adicione os produtos da encomenda aqui.
              </FormDescription>
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
                <Input autoComplete='off' {...field} />
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
                <Input autoComplete='off' {...field} />
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
          name='nif'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de contribuinte</FormLabel>
              <FormControl>
                <Input autoComplete='off' {...field} />
              </FormControl>
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

        <FormField
          control={form.control}
          name='elevator'
          render={({ field }) => (
            <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className='space-y-1 leading-none'>
                <FormLabel>Há elevador</FormLabel>
                <FormDescription>
                  Se o elevador não estiver operacional, por favor deixe a caixa
                  vazia.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <Button type='submit'>Submeter</Button>
      </form>
    </Form>
  );
}
