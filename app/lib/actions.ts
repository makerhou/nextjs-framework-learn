'use server'

import {z} from "zod";
import {sql} from "@vercel/postgres";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";
import {signIn} from "@/auth";
import {AuthError} from "next-auth";

export type State = {
    errors?: {
        customerId?: string[],
        amount?: string[],
        status?: string[],
    },
    message?: string|null,
}

const FormSchema = z.object({
        id: z.string(),
        customerId: z.string({
            invalid_type_error: 'Please select a customer.'
        }),
        amount: z.coerce.number().gt(0, {message: 'Please enter an amount greater then $0'}),
        status: z.enum(['padding', 'paid'], {
            invalid_type_error: 'Please select an invoice status.'
        }),
        date: z.string(),
    }
)
const Create_Invoice = FormSchema.omit({
    id: true,
    date: true,
});

export async function authenticate(prevState: State, formDate: FormData) {
    try {
        await signIn('credentials', formDate);
    } catch (e) {
        if (e instanceof AuthError) {
            switch (e.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials. Please try again.'
                default:
                    return 'Something went wrong. Please try again.'

            }
        }

    }

}


export async function createInvoice(prevState: State, formDate: FormData) {

    const rawFormData = Create_Invoice.safeParse({
        customerId: formDate.get('customerId'),
        amount: formDate.get('amount'),
        status: formDate.get('status'),
    })
    if(!rawFormData.success) {
        return {
            errors: rawFormData.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice'
        }
    }
    const amountInc = rawFormData.data.amount * 100;
    //
    // const amountInc = rawFormData.amount * 100
    const [date] = new Date().toISOString().split('T')
    try {

        await sql`INSERT INTO invoices (customer_id, amount, status, date) VALUES (${rawFormData.data.customerId}), ${amountInc}, ${rawFormData.data.status}, ${date})`;
    } catch (e) {
        return {
            message: 'Database Error, Failed to Create Invoice'
        }
    }
    console.log('----rawFormData----', rawFormData)

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

const UpdateInvoice = FormSchema.omit({
    id: true,
    date: true,
});

export async function updateInvoice(id: string, formDate: FormData) {
    const rawFormData = UpdateInvoice.parse({
        customerId: formDate.get('customerId'),
        amount: formDate.get('amount'),
        status: formDate.get('status'),
    })
    const amountInc = rawFormData.amount * 100
    const [date] = new Date().toISOString().split('T')
    try {
        await sql`UPDATE invoices SET customer_id = ${rawFormData.customerId}, amount = ${amountInc}, status = ${rawFormData.status} WHERE id = ${id};`
        revalidatePath('/dashboard/invoices')
        redirect('/dashboard/invoices')
    } catch (e) {
        return {
            error: e,
            code: -1,
            message: 'Error updating invoice',
        }
    }
}

export async function deleteInvoice(id: string) {
    throw new Error('Failed to Delete Invoice');

    try {
        await sql`DELETE FROM invoices WHERE id = ${id};`
        revalidatePath('/dashboard/invoices');
        return {
            code: 0,
            message: 'Invoice deleted',
            data: null,
        }
    } catch (e) {
        return {
            error: e,
            code: -1,
            message: 'Error deleting invoice',
        }
    }
    revalidatePath('/dashboard/invoices');
}