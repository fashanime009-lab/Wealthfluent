// A worked-example table for calculator pages: a caption, a header row and
// body rows whose first cell is the row label. Numbers use the tabular
// mono font; the wrapper scrolls sideways on narrow screens instead of
// squeezing the columns (the same pattern as the EMI and risk pages).
export default function CalcTable({ caption, columns, rows }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[480px] text-left text-[13px]">
        {caption && (
          <caption className="pb-2 text-left text-[12.5px] text-[#111814]/60 dark:text-[#eef1ec]/55">{caption}</caption>
        )}
        <thead>
          <tr className="border-b border-[#111814]/15 text-[#111814] dark:border-[#eef1ec]/15 dark:text-[#eef1ec]">
            {columns.map((col, i) => (
              <th key={col} scope="col" className={`py-2 font-semibold ${i < columns.length - 1 ? "pr-4" : ""}`}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="font-mono-tech tabular-nums">
          {rows.map(([label, ...cells]) => (
            <tr key={label} className="border-b border-[#111814]/10 dark:border-[#eef1ec]/10">
              <th scope="row" className="py-2 pr-4 font-sans font-semibold text-[#111814] dark:text-[#eef1ec]">
                {label}
              </th>
              {cells.map((cell, i) => (
                <td key={i} className={`py-2 ${i < cells.length - 1 ? "pr-4" : ""}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

