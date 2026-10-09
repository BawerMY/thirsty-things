import { getThings } from "@/lib/things";
import SortedGrid from "./SortedGrid";

export default function Home() {
  const things = getThings();
  return (
    <>
      <section className="hero">
        <h1>How thirsty are everyday things?</h1>
        <p>The water it takes to produce the things we eat, drink and wear.</p>
      </section>
      {things.length === 0 ? (
        <p className="empty">No things yet. Add some to data/things.json.</p>
      ) : (
        <SortedGrid things={things} />
      )}
    </>
  );
}
