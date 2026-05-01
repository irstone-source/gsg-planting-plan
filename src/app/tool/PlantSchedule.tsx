"use client";

import { Plant } from "./defaultPlants";
import { ProjectSettings } from "./types";
import { downloadScheduleReport, downloadCareReport } from "./exportReports";

interface ScheduleItem extends Plant {
  quantity: number;
}

interface PlantScheduleProps {
  schedule: ScheduleItem[];
  totalCount: number;
  settings: ProjectSettings;
  plants: Plant[];
}

export default function PlantSchedule({ schedule, totalCount, settings, plants }: PlantScheduleProps) {
  const copyToClipboard = () => {
    const header = "Code\tSpecies\tCultivar\tQty";
    const rows = schedule.map((s) => `${s.code}\t${s.name}\t${s.cultivar}\t${s.quantity}`);
    const text = [header, ...rows, `\tTotal\t\t${totalCount}`].join("\n");
    navigator.clipboard.writeText(text);
  };

  const exportCSV = () => {
    const header = "Code,Species,Cultivar,Qty";
    const rows = schedule.map(
      (s) => `${s.code},"${s.name}","${s.cultivar}",${s.quantity}`
    );
    const csv = [header, ...rows, `,Total,,${totalCount}`].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "planting-schedule.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (schedule.length === 0) {
    return (
      <div className="p-4 text-center text-neutral-400 text-xs">
        <p>No plants placed yet.</p>
        <p className="mt-1">Drag plants from the palette onto the canvas.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="overflow-y-auto max-h-[50vh]">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-white">
            <tr className="border-b border-neutral-200 text-neutral-500">
              <th className="text-left py-1.5 px-2 w-8"></th>
              <th className="text-left py-1.5 px-1">Code</th>
              <th className="text-left py-1.5 px-1">Species</th>
              <th className="text-right py-1.5 px-2">Qty</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((item) => (
              <tr key={item.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                <td className="py-1.5 px-2">
                  <div
                    className="w-5 h-5 rounded-full border border-black/10"
                    style={{ backgroundColor: item.colour }}
                  />
                </td>
                <td className="py-1.5 px-1 font-mono font-bold">{item.code}</td>
                <td className="py-1.5 px-1">
                  <span className="text-neutral-800">{item.name}</span>
                  <span className="text-neutral-400 italic ml-1">{item.cultivar}</span>
                </td>
                <td className="py-1.5 px-2 text-right font-mono font-bold">{item.quantity}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-neutral-300 font-bold">
              <td colSpan={3} className="py-2 px-2 text-right text-neutral-600">Total</td>
              <td className="py-2 px-2 text-right font-mono">{totalCount}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="p-2 border-t border-neutral-200 space-y-1.5">
        <div className="flex gap-1">
          <button
            onClick={copyToClipboard}
            className="flex-1 px-2 py-1.5 text-xs border border-neutral-200 rounded hover:bg-neutral-50 text-neutral-600"
          >
            Copy Table
          </button>
          <button
            onClick={exportCSV}
            className="flex-1 px-2 py-1.5 text-xs border border-neutral-200 rounded hover:bg-neutral-50 text-neutral-600"
          >
            Export CSV
          </button>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => downloadScheduleReport(schedule, totalCount, settings, plants)}
            className="flex-1 px-2 py-1.5 text-xs bg-emerald-700 text-white rounded hover:bg-emerald-800 font-medium"
          >
            Full Schedule
          </button>
          <button
            onClick={() => downloadCareReport(schedule, settings, plants)}
            className="flex-1 px-2 py-1.5 text-xs bg-neutral-800 text-white rounded hover:bg-neutral-900 font-medium"
          >
            Care Guide
          </button>
        </div>
      </div>
    </div>
  );
}
