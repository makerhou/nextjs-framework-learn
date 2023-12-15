import {lusitana} from "@/app/ui/fonts";
import {fetchCardData, fetchLatestInvoices} from "@/app/lib/data";
import RevenueChart from "@/app/ui/dashboard/revenue-chart";
import LatestInvoices from "@/app/ui/dashboard/latest-invoices";
import CardWrapper, {Card} from "@/app/ui/dashboard/cards";
import {Suspense} from "react";
import {CardSkeleton, LatestInvoicesSkeleton, RevenueChartSkeleton} from "@/app/ui/skeletons";

export default async function Page() {
    const allInvoices = await fetchCardData()
    // const {totalPaidInvoices, totalPendingInvoices, numberOfInvoices, numberOfCustomers} = allInvoices;
    return <main>
        <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>DashBord Page</h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/*<Card title="Collected" value={totalPaidInvoices} type="collected"/>*/}
            {/*<Card title="Pending" value={totalPendingInvoices} type="pending"/>*/}
            {/*<Card title="Total Invoices" value={numberOfInvoices} type="invoices"/>*/}
            {/*<Card*/}
            {/*    title="Total Customers"*/}
            {/*    value={numberOfCustomers}*/}
            {/*    type="customers"*/}
            {/*/>*/}
            <Suspense fallback={<CardSkeleton />}>
                <CardWrapper />
            </Suspense>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
            {/*<RevenueChart revenue={revenue}/>*/}
            <Suspense fallback={<RevenueChartSkeleton/>}>
                <RevenueChart/>
            </Suspense>
            <Suspense fallback={<LatestInvoicesSkeleton/>}>
                <LatestInvoices/>
            </Suspense>
        </div>
    </main>
}