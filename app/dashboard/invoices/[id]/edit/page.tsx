import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import Form from "@/app/ui/invoices/edit-form";
import {fetchCustomers, fetchInvoiceById} from "@/app/lib/data";
import {notFound} from "next/navigation";

interface IParams {
    params: {
        id: string
    }
}
export default async function Page({params}: IParams) {
    const {id} = params;
    const [invoice, customers] = await Promise.all([
        fetchInvoiceById(id),
        fetchCustomers(),
    ])

    if (!invoice) {
        return notFound();
    }

    return (
        <main>
            <Breadcrumbs breadcrumbs={
                [
                    {
                        label: 'Invoices',
                        href: '/dashboard/invoices'
                    },
                    {
                        label: 'Edit Invoice',
                        href: `/dashboard/invoices/${id}/edit`,
                        active: true,
                    },
                ]
            }></Breadcrumbs>
            <Form customers={customers} invoice={invoice}></Form>
        </main>
    )
}