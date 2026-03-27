import Header from "./header";
import EtfDetailsPreview from "./components/etf-details-preview";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center gap-4">
        <EtfDetailsPreview />
      </main>
    </div>
  );
}
