// Shown while a page's code is still downloading (pages are lazy-loaded).
// A quiet skeleton in the page colours, inside the normal layout, instead
// of a bare "Loading..." line that replaced the whole screen, menu included.
export default function PageLoading() {
  return (
    <div className="min-h-[70vh] bg-[#eef1ec] dark:bg-[#0b1210]" aria-busy="true">
      <span className="sr-only">Loading…</span>
      <div className="mx-auto max-w-5xl animate-pulse px-5 py-16 motion-reduce:animate-none sm:px-8 lg:px-12" aria-hidden="true">
        <div className="h-3 w-24 bg-[#111814]/10 dark:bg-[#eef1ec]/10" />
        <div className="mt-4 h-9 w-2/3 max-w-xl bg-[#111814]/10 dark:bg-[#eef1ec]/10" />
        <div className="mt-6 h-3 w-full max-w-2xl bg-[#111814]/[0.07] dark:bg-[#eef1ec]/[0.07]" />
        <div className="mt-3 h-3 w-5/6 max-w-xl bg-[#111814]/[0.07] dark:bg-[#eef1ec]/[0.07]" />
        <div className="mt-10 h-64 w-full border border-[#111814]/10 dark:border-[#eef1ec]/10" />
      </div>
    </div>
  );
}
