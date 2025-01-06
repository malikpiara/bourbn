import { isPossiblePhoneNumber } from 'react-phone-number-input';
import { z } from 'zod';

export const tableEntrySchema = z.object({
  id: z.number(),
  ref: z.string().min(3, 'A referência deve ter pelo menos 3 caracteres.'),
  description: z
    .string()
    .min(5, 'O nome do produto deve ter pelo menos 5 caracteres.'),
  quantity: z.number().min(1, 'A quantidade deve ser pelo menos 1.'),
  unitPrice: z
    .union([
      z.string().transform((str) => {
        if (!str) return 0;
        return parseFloat(str.replace(',', '.'));
      }),
      z.number(),
    ])
    .pipe(z.number().min(0, 'O preço não pode ser negativo.')),
});

export const formSchema = z
  .object({
    tableEntries: z.array(tableEntrySchema),
    name: z.string().min(2, {
      message: 'O nome deve ter pelo menos 2 caracteres.',
    }),
    storeId: z.string({
      required_error: 'Por favor selecione uma loja.',
    }),
    notes: z.string().optional(),
    orderNumber: z.coerce.number().min(4, {
      message: 'O número da encomenda deve ter pelo menos 4 caracteres.',
    }),
    date: z.date({
      required_error: 'A date of birth is required.',
    }),
    email: z
      .union([
        z.string().email().min(5, {
          message: 'O nome deve ter pelo menos 5 caracteres.',
        }),
        z.string().length(0),
      ])
      .optional(),
    phoneNumber: z
      .string()
      .min(1, 'O número de telefone é obrigatório')
      .refine(
        (val) => {
          try {
            return isPossiblePhoneNumber(val);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (error) {
            return false;
          }
        },
        {
          message: 'Número de telefone inválido',
        }
      ),
    nif: z
      .union([
        z
          .string()
          .length(9, { message: 'O número de contribuinte tem 9 caracteres.' })
          .regex(/^\d+$/, { message: 'Apenas números são permitidos.' }),
        z.string().length(0),
      ])
      .optional(),

    // Delivery Address
    address1: z.string().min(5, {
      message: 'A morada deve ter pelo menos 5 caracteres.',
    }),
    address2: z.string().optional(),
    postalCode: z
      .string()
      .length(7, { message: 'O código postal deve ter 7 caracteres.' })
      .regex(/^\d+$/, { message: 'Apenas números são permitidos.' }),
    city: z.string().min(5, {
      message: 'A cidade deve ter pelo menos 5 caracteres.',
    }),
    elevator: z.boolean().default(false).optional(),

    // Same Address Checkbox
    sameAddress: z.boolean().default(true),

    // Billing Address - all optional by default
    billingAddress1: z.string().optional(),
    billingAddress2: z.string().optional(),
    billingPostalCode: z.string().optional(),
    billingCity: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.sameAddress) {
      // Field content validations
      if (data.billingAddress1 && data.billingAddress1.length < 5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'A morada deve ter pelo menos 5 caracteres.',
          path: ['billingAddress1'],
        });
      }

      if (data.billingPostalCode && data.billingPostalCode.length !== 7) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'O código postal deve ter 7 caracteres.',
          path: ['billingPostalCode'],
        });
      }

      if (data.billingCity && data.billingCity.length < 5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'A cidade deve ter pelo menos 5 caracteres.',
          path: ['billingCity'],
        });
      }

      // Required field validations
      if (!data.billingAddress1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Este campo é obrigatório',
          path: ['billingAddress1'],
        });
      }
      if (!data.billingPostalCode) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Este campo é obrigatório',
          path: ['billingPostalCode'],
        });
      }
      if (!data.billingCity) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Este campo é obrigatório',
          path: ['billingCity'],
        });
      }
    }
    return true;
  });

export type TableEntry = z.infer<typeof tableEntrySchema>;
export type FormValues = z.infer<typeof formSchema>;
