import { Helmet } from "react-helmet-async";
import {
  Settings,
  Globe,
  Moon,
  Trash2,
  Languages,
  Download,
  Upload,
} from "lucide-react";

import SettingsSection from "../components/settings/SettingsSection";
import SettingRow from "../components/settings/SettingRow";
import { useSettings } from "../context/SettingsContext";
import { currencies } from "../data/currencies";

export default function SettingsPage() {
  const {
  settings,
  setCurrency,
} = useSettings();
  return (
    <>
      <Helmet>
        <title>Settings | FINAIW</title>
      </Helmet>

      <div className="min-h-screen bg-[#f8fafc]">
       <section className="mx-auto max-w-6xl px-6 py-12">

  {/* Header */}

  <div className="mb-10">

    <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
      <Settings size={15} />
      Settings
    </div>

    <h1 className="mt-5 text-5xl font-black tracking-[-0.04em] text-slate-950">
      Personalize FINAIW
    </h1>

    <p className="mt-3 max-w-2xl text-slate-500">
      Configure your workspace once and every calculator,
      dashboard and future AI feature will automatically
      follow your preferences.
    </p>

  </div>

  <div className="space-y-8">

    <SettingsSection
      title="General"
      description="Personal preferences used across FINAIW."
    >

      <div className="flex items-center justify-between px-8 py-6">

  <div className="flex items-center gap-5">

    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
      <Globe size={22} />
    </div>

    <div>
      <h3 className="font-bold text-slate-900">
        Preferred Currency
      </h3>

      <p className="mt-1 text-sm text-slate-500">
        Used across every calculator and dashboard.
      </p>
    </div>

  </div>

  <select
    value={settings.currency}
    onChange={(e) =>
  setCurrency(e.target.value)
}
    className="rounded-xl border border-slate-200 text-slate-500 bg-white px-4 py-2 font-semibold outline-none transition focus:border-emerald-500"
  >
    {currencies.map((item) => (
      <option
        key={item.code}
        value={item.code}
      >
        {item.code} ({item.symbol})
      </option>
    ))}
  </select>

</div>

      <SettingRow
        icon={<Languages size={22} />}
        title="Language"
        description="Display language."
        value="English"
      />

    </SettingsSection>

    <SettingsSection
      title="Appearance"
      description="Customize how FINAIW looks."
    >

      <SettingRow
        icon={<Moon size={22} />}
        title="Theme"
        description="Light, Dark or System."
        value="System"
      />

    </SettingsSection>

    <SettingsSection
      title="Workspace"
      description="Manage your financial data."
    >

      <SettingRow
        icon={<Download size={22} />}
        title="Export Workspace"
        description="Download your saved data."
      />

      <SettingRow
        icon={<Upload size={22} />}
        title="Import Workspace"
        description="Restore previously exported data."
      />

      <SettingRow
        icon={<Trash2 size={22} />}
        title="Reset Workspace"
        description="Delete saved calculations and goals."
        danger
      />

    </SettingsSection>

  </div>

</section>
      </div>
    </>
  );
}