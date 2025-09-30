export default function ProgressBar({ stats = {} }) {
  const statuses = ["Applied", "Interview", "Offer", "Rejected"];
  const total = statuses.reduce((s, k) => s + (stats[k] || 0), 0);

  const percent = (v) => (total === 0 ? 0 : Math.round((v / total) * 100));

  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <h3 className="font-semibold mb-3">Application Progress</h3>
      <div className="space-y-3">
        {statuses.map((s) => {
          const count = stats[s] || 0;
          const p = percent(count);
          const colorClass = s === "Applied" ? "bg-blue-500" :
                             s === "Interview" ? "bg-yellow-400" :
                             s === "Offer" ? "bg-green-500" :
                             "bg-red-500";
          return (
            <div key={s}>
              <div className="flex justify-between text-sm mb-1">
                <span>{s}</span>
                <span>{count} ({p}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded h-3 overflow-hidden">
                <div className={`${colorClass} h-3`} style={{ width: `${p}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
