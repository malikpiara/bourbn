import { UseFormReturn } from 'react-hook-form';
import { FormValues } from '@/lib/schema';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface StoreSelectionProps {
  form: UseFormReturn<FormValues>;
  onStoreSelect: (value: string) => void;
}

export const StoreSelection = ({
  form,
  onStoreSelect,
}: StoreSelectionProps) => (
  <div className='space-y-8'>
    <h2 className='scroll-m-20 text-4xl font-semibold tracking-tight'>
      Selecione a Loja
    </h2>
    <FormField
      control={form.control}
      name='storeId'
      render={({ field }) => (
        <FormItem>
          <FormLabel>Loja</FormLabel>
          <Select onValueChange={onStoreSelect} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder='Selecione a loja onde a venda está a ser executada' />
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
  </div>
);
