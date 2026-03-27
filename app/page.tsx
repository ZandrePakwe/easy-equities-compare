import Header from "./header";
import EtfSelect from "./components/etf-select";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center gap-4">
        <p className="text-lg text-zinc-500">Select ETFs to compare</p>
        <EtfSelect />
      </main>
    </div>
  );
}
