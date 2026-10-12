import ThirstyApp from "@/components/ThirstyApp";
import { getThings } from "@/lib/things";

export default async function Home() {
  const things = await getThings();
  return <ThirstyApp things={things} />;
}
