import Header from "./header";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center">
        <p className="text-lg text-zinc-500">Select ETFs to compare</p>
      </main>
    </div>
  );
}
