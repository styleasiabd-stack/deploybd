import { db } from "@/db";
import { deploymentTasks } from "@/db/schema";
import { asc } from "drizzle-orm";
import Header from "@/components/header";
import Hero from "@/components/hero";
import DeployChecklist from "@/components/deploy-checklist";
import DeployGuide from "@/components/deploy-guide";
import PaymentDemo from "@/components/payment-demo";
import SubscribeForm from "@/components/subscribe-form";
import Footer from "@/components/footer";

export const revalidate = 0;

export default async function Home() {
  const tasks = await db.query.deploymentTasks.findMany({
    orderBy: [asc(deploymentTasks.orderIndex)],
  });

  const total = tasks.length;
  const done = tasks.filter((t) => t.done).length;
  const progress = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <>
      <Header />
      <main>
        <Hero total={total} done={done} progress={progress} />
        <DeployChecklist initialTasks={tasks} />
        <DeployGuide />
        <PaymentDemo />
        <SubscribeForm />
      </main>
      <Footer />
    </>
  );
}
