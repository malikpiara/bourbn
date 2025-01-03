import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Trash2, PackageOpen } from 'lucide-react';
import { useFieldArray, UseFormReturn, Controller } from 'react-hook-form';
import { FormValues } from '@/lib/schema';
import { formatCurrency } from '@/utils/formatCurrency';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DynamicTableProps {
  form: UseFormReturn<FormValues>;
}

export function DynamicTable({ form }: DynamicTableProps) {
  const {
    fields,
    append: fieldArrayAppend,
    remove,
  } = useFieldArray({
    control: form.control,
    name: 'tableEntries',
  });

  const [itemToRemove, setItemToRemove] = useState<number | null>(null);

  const handleAppend = () => {
    const newEntry = {
      id: fields.length,
      ref: '',
      designation: '',
      quantity: 1,
      price: 0,
    };
    fieldArrayAppend(newEntry);
  };

  const handleRemove = (index: number) => {
    setItemToRemove(null);
    remove(index);
  };

  const totalQuantity = fields.reduce((sum, field, index) => {
    const quantity = form.watch(`tableEntries.${index}.quantity`) || 0;
    return sum + quantity;
  }, 0);

  const totalPrice = fields.reduce((sum, field, index) => {
    const quantity = form.watch(`tableEntries.${index}.quantity`) || 0;
    const price = form.watch(`tableEntries.${index}.price`) || 0;
    return sum + quantity * price;
  }, 0);

  if (fields.length === 0) {
    return (
      <Card className='w-full'>
        <CardContent className='flex flex-col items-center justify-center p-6 text-center'>
          <PackageOpen
            strokeWidth={1.2}
            color='#4B0021'
            className='h-12 w-12 text-muted-foreground mb-4'
          />
          <h3 className='text-lg font-semibold mb-2'>
            Ainda não foram adicionados produtos
          </h3>
          <p className='text-sm text-muted-foreground mb-4'>
            Comece por adicionar o seu primeiro produto.
          </p>
          <Button
            size={'lg'}
            onClick={handleAppend}
            className='flex items-center gap-2'
          >
            <PlusCircle className='h-6 w-6' />
            Adicionar Produto
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='space-y-4'>
      <div className='overflow-x-auto'>
        <Table className='w-full'>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[200px] text-neutral-800'>
                Referência
              </TableHead>
              <TableHead className='w-[100px] text-neutral-800'>
                Quantidade
              </TableHead>
              <TableHead className='min-w-[200px] text-neutral-800'>
                Designação
              </TableHead>
              <TableHead className='w-[200px] text-neutral-800'>
                Preço Unitário
              </TableHead>
              <TableHead className='w-[150px] text-neutral-800'>
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="before:content-[''] before:block before:h-4">
            {fields.map((field, index) => (
              <TableRow key={field.id} className='group'>
                <TableCell className='p-2'>
                  <Controller
                    name={`tableEntries.${index}.ref` as const}
                    control={form.control}
                    rules={{ required: 'Required' }}
                    render={({ field, fieldState: { error } }) => (
                      <div>
                        <Input
                          {...field}
                          placeholder='Referência'
                          className='w-full'
                        />
                        {error && (
                          <p className='text-xs text-red-700 mt-1'>
                            {error.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </TableCell>
                <TableCell className='p-2'>
                  <Controller
                    name={`tableEntries.${index}.quantity` as const}
                    control={form.control}
                    rules={{
                      required: 'Required',
                      min: { value: 1, message: 'Min 1' },
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <div>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          defaultValue={field.value.toString()}
                        >
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='Quantidade' />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {error && (
                          <p className='text-xs text-red-700 mt-1'>
                            {error.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </TableCell>
                <TableCell className='p-2'>
                  <Controller
                    name={`tableEntries.${index}.designation` as const}
                    control={form.control}
                    rules={{ required: 'Required' }}
                    render={({ field, fieldState: { error } }) => (
                      <div>
                        <Input
                          {...field}
                          placeholder='Designação'
                          className='w-full'
                        />
                        {error && (
                          <p className='text-xs text-red-700 mt-1'>
                            {error.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </TableCell>
                <TableCell className='p-2'>
                  <Controller
                    name={`tableEntries.${index}.price` as const}
                    control={form.control}
                    rules={{
                      required: 'Required',
                      min: { value: 0, message: 'Min 0' },
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <div>
                        <Input
                          {...field}
                          type='number'
                          step='0.01'
                          placeholder='Preço'
                          className='w-full'
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value))
                          }
                          onFocus={(e) => {
                            if (
                              e.target.value === '0' ||
                              e.target.value === '0.00'
                            ) {
                              e.target.value = '';
                            }
                          }}
                          onBlur={(e) => {
                            field.onBlur();
                            if (e.target.value === '') {
                              e.target.value = '0.00';
                            } else {
                              e.target.value = parseFloat(
                                e.target.value
                              ).toFixed(2);
                            }
                          }}
                        />
                        {error && (
                          <p className='text-xs text-red-700 mt-1'>
                            {error.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </TableCell>
                <TableCell className='p-2'>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        className='group-hover:opacity-80 transition-opacity text-muted-foreground'
                        onClick={() => setItemToRemove(index)}
                      >
                        <Trash2 className='h-4 w-4 mr-2' />
                        Apagar
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Tem a certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação não pode ser anulada. Isto eliminará
                          permanentemente este item da tabela.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            itemToRemove !== null && handleRemove(itemToRemove)
                          }
                        >
                          Continuar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
            <TableRow className='font-semibold'>
              <TableCell colSpan={2} className='text-right'>
                Total:
              </TableCell>
              <TableCell>{totalQuantity}</TableCell>
              <TableCell>{formatCurrency(totalPrice)}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <Button
        type='button'
        onClick={handleAppend}
        className='flex items-center gap-2'
      >
        <PlusCircle className='h-4 w-4' />
        Adicionar Produto
      </Button>
    </div>
  );
}
