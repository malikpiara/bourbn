import React from 'react';
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
import { PlusCircle } from 'lucide-react';
import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { FormValues } from '@/lib//schema';

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

  // Here's where we create our new append function that will properly initialize new entries
  const handleAppend = () => {
    const newEntry = {
      id: fields.length,
      ref: '',
      designation: '',
      quantity: 1,
      price: 0,
    };
    console.log('Adding new entry:', newEntry); // Debug log
    fieldArrayAppend(newEntry); // Use the original append function from useFieldArray
  };

  return (
    <div>
      <Table className='mb-4'>
        <TableHeader>
          <TableRow>
            <TableHead>Referência</TableHead>
            <TableHead>Quantidade</TableHead>
            <TableHead>Designação</TableHead>
            <TableHead>Preço Unitário</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fields.map((field, index) => (
            <TableRow key={field.id}>
              <TableCell>
                <Input
                  {...form.register(`tableEntries.${index}.ref` as const)}
                  placeholder='Referência'
                />
              </TableCell>
              <TableCell>
                <Input
                  {...form.register(`tableEntries.${index}.quantity` as const, {
                    valueAsNumber: true,
                  })}
                  type='number'
                  placeholder='Quantidade'
                />
              </TableCell>
              <TableCell>
                <Input
                  {...form.register(
                    `tableEntries.${index}.designation` as const
                  )}
                  placeholder='Designação'
                />
              </TableCell>
              <TableCell>
                <Input
                  {...form.register(`tableEntries.${index}.price` as const, {
                    valueAsNumber: true,
                  })}
                  type='number'
                  step='0.01'
                  placeholder='Preço'
                />
              </TableCell>
              <TableCell>
                <Button
                  type='button'
                  variant='destructive'
                  onClick={() => remove(index)}
                >
                  Remover
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Button
        type='button'
        onClick={handleAppend} // Use our new handler instead of the direct append call
        className='flex items-center gap-2'
      >
        <PlusCircle className='h-4 w-4' />
        Adicionar Produto
      </Button>
    </div>
  );
}
