import DetailsPreview from "./components/details-preview";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <div
        className="flex flex-col items-center justify-center bg-cover bg-center px-4 py-10 text-center sm:py-16"
        style={{
          backgroundImage:
            "url(https://compare.easyequities.co.za/hubfs/ease-etf-finder-banner.png)",
        }}
      >
        <h2 className="text-2xl font-bold text-white sm:text-3xl md:text-4xl">
          <span className="text-accent">Compare</span> Funds
        </h2>
        <p className="mt-4 max-w-2xl text-base text-white sm:text-lg">
          Welcome to our EasyCompare comparison page, where you can compare
          ETFs and unit trusts available on our site and make your choice
          #Easier.
        </p>
      </div>
      <main className="flex flex-1 flex-col items-center gap-4">
        <DetailsPreview />
      </main>
    </div>
  );
}
