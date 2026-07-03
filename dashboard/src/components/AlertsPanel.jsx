function AlertItem({ alert }) {
  return (
    <div className="rounded-lg p-3 border mb-2 bg-red-500/10 border-red-500/40">
      <p className="text-sm text-white">{alert.message}</p>
      <p className="text-xs text-slate-400 mt-1">
        {alert.timestamp ? new Date(alert.timestamp).toLocaleTimeString() : ""}
      </p>
    </div>
  );
}

export default function AlertsPanel({ alerts }) {
  return (
    <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
      <h2 className="text-lg font-bold text-white mb-4">
        Active Alerts {alerts.length > 0 && (
          <span className="text-sm font-normal text-red-400">({alerts.length})</span>
        )}
      </h2>
      {alerts.length === 0 ? (
        <p className="text-sm text-slate-500">No active alerts.</p>
      ) : (
        alerts.map((a, i) => <AlertItem key={a.id ?? i} alert={a} />)
      )}
    </div>
  );
}