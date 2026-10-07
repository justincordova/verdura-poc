import { useState, type ReactNode } from "react";
import {
  Mail, Lock, CheckCircle2, ChevronRight, Plus, Sprout, MapPin, ImagePlus, Trash2, Thermometer, Droplets, Sun,
  Router, Wifi, BatteryMedium, Fan, Clock, Flame, UserPlus, Leaf,
} from "lucide-react";
import { Header, Card, Btn, Pill, Field, type Screen } from "./VerduraApp";

type Go = { go: (s: Screen) => void };
const input = "w-full bg-transparent outline-none";

/* ---------- Auth ---------- */
function AuthLogo({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mt-6 flex flex-col items-center text-center">
      <div className="bg-leaf grid size-16 place-items-center rounded-[1.5rem] text-primary-foreground shadow-soft"><Leaf className="size-8" /></div>
      <h1 className="mt-4 text-3xl font-semibold">{title}</h1>
      <p className="mt-1 text-muted-foreground">{sub}</p>
    </div>
  );
}
export function SignUpScreen({ go }: Go) {
  return (
    <div className="px-6 pb-10">
      <AuthLogo title="Create account" sub="Start caring for your greenhouse." />
      <form onSubmit={(e) => { e.preventDefault(); go("home"); }} className="mt-8 space-y-4">
        <Field label="Email" icon={Mail}><input type="email" placeholder="you@farm.co" className={input} /></Field>
        <Field label="Password" icon={Lock}><input type="password" placeholder="At least 8 characters" className={input} /></Field>
        <Field label="Confirm password" icon={Lock}><input type="password" placeholder="Repeat password" className={input} /></Field>
        <Btn type="submit">Create Account</Btn>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">Already have an account? <button onClick={() => go("signin")} className="h-11 font-bold text-primary">Sign in</button></p>
    </div>
  );
}
export function ForgotScreen({ go }: Go) {
  const [sent, setSent] = useState(false);
  return (
    <div className="px-6 pb-10">
      <AuthLogo title="Reset password" sub="We'll email you a link to reset it." />
      {sent ? (
        <Card className="mt-8 text-center">
          <CheckCircle2 className="mx-auto size-10 text-success" />
          <p className="mt-3 font-bold">Check your inbox</p>
          <p className="mt-1 text-sm text-muted-foreground">If an account exists for that email, a reset link is on its way.</p>
        </Card>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="mt-8 space-y-4">
          <Field label="Email" icon={Mail}><input type="email" defaultValue="maya@hillsidefarm.co" className={input} /></Field>
          <Btn type="submit">Send Reset Link</Btn>
        </form>
      )}
      <Btn variant="ghost" className="mt-4" onClick={() => go("signin")}>Back to Sign In</Btn>
    </div>
  );
}

/* ---------- Node management ---------- */
const managed = [
  { name: "Bed A", crop: "Tomatoes", loc: "North row", online: true },
  { name: "Bed B", crop: "Basil", loc: "South row", online: true },
  { name: "Seedling rack", crop: "Mixed seedlings", loc: "Potting bench", online: false },
];
export function NodesScreen({ go }: Go) {
  return (
    <>
      <Header back={() => go("home")} sub="Hillside Greenhouse · Owner" title="Manage nodes" />
      <div className="space-y-3 px-5">
        {managed.map((n) => (
          <Card key={n.name} onClick={() => go("editNode")} className="flex items-center gap-3">
            <span className={`grid size-12 place-items-center rounded-xl ${n.online ? "bg-secondary text-primary" : "bg-muted text-muted-foreground"}`}><Sprout className="size-6" /></span>
            <div className="flex-1">
              <p className="font-bold">{n.name} · {n.crop}</p>
              <p className="flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="size-3.5" />{n.loc}</p>
              <div className="mt-1.5">{n.online ? <Pill tone="ok">Online</Pill> : <Pill tone="muted">Offline</Pill>}</div>
            </div>
            <ChevronRight className="size-5 text-muted-foreground" />
          </Card>
        ))}
        <Btn className="mt-2" onClick={() => go("editNode")}><Plus className="size-5" />Add Node</Btn>
      </div>
    </>
  );
}

function Label({ children }: { children: ReactNode }) {
  return <p className="mb-2 px-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">{children}</p>;
}
function TextRow({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      <input defaultValue={value} className="h-12 w-full rounded-xl border-2 bg-card px-4 outline-none focus:border-ring" />
    </label>
  );
}
function MinMax({ icon: Icon, label, unit, min, max }: { icon: typeof Sun; label: string; unit: string; min: number; max: number }) {
  return (
    <div className="flex items-center gap-3 py-3">
      <Icon className="size-5 shrink-0 text-primary" />
      <span className="flex-1 text-sm font-semibold">{label}</span>
      {[min, max].map((v, i) => (
        <span key={i} className="flex h-10 w-20 items-center rounded-lg border-2 bg-card px-2 text-sm">
          <input defaultValue={v} aria-label={`${label} ${i ? "max" : "min"}`} className="w-full bg-transparent outline-none" />
          <span className="text-xs text-muted-foreground">{unit}</span>
        </span>
      ))}
    </div>
  );
}
export function EditNodeScreen({ go }: Go) {
  return (
    <>
      <Header back={() => go("nodes")} sub="Node settings" title="Edit node" />
      <div className="space-y-5 px-5">
        <button className="flex h-32 w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed bg-muted text-muted-foreground">
          <ImagePlus className="size-7" /><span className="text-sm font-semibold">Add plant photo (optional)</span>
        </button>
        <div className="space-y-3">
          <TextRow label="Node name" value="Bed A" />
          <TextRow label="Crop" value="Tomatoes" />
          <TextRow label="Greenhouse location" value="North row" />
        </div>
        <section>
          <Label>Acceptable ranges · min / max</Label>
          <Card className="divide-y !py-1">
            <MinMax icon={Thermometer} label="Temperature" unit="°C" min={18} max={28} />
            <MinMax icon={Droplets} label="Humidity" unit="%" min={55} max={80} />
            <MinMax icon={Sprout} label="Soil moisture" unit="%" min={35} max={65} />
            <MinMax icon={Sun} label="Light" unit="klx" min={10} max={40} />
          </Card>
        </section>
        <Btn onClick={() => go("nodes")}>Save Changes</Btn>
        <Btn variant="ghost" className="text-destructive" onClick={() => go("nodes")}><Trash2 className="size-5" />Remove Node</Btn>
      </div>
    </>
  );
}

/* ---------- Thresholds ---------- */
const metrics = [
  { icon: Thermometer, label: "Temperature", unit: "°C", lo: 0, hi: 45, warn: [16, 30], crit: [10, 36] },
  { icon: Droplets, label: "Humidity", unit: "%", lo: 0, hi: 100, warn: [50, 85], crit: [35, 95] },
  { icon: Sprout, label: "Soil moisture", unit: "%", lo: 0, hi: 100, warn: [30, 70], crit: [20, 85] },
  { icon: Sun, label: "Light", unit: "klx", lo: 0, hi: 80, warn: [8, 50], crit: [3, 65] },
];
export function ThresholdsScreen({ go }: Go) {
  const [level, setLevel] = useState<"warn" | "crit">("warn");
  return (
    <>
      <Header back={() => go("node")} sub="Bed A · Tomatoes" title="Alert thresholds" />
      <div className="space-y-4 px-5">
        <div className="grid grid-cols-2 rounded-full bg-muted p-1">
          {(["warn", "crit"] as const).map((l) => (
            <button key={l} onClick={() => setLevel(l)} className={`h-10 rounded-full text-sm font-bold ${level === l ? "bg-card shadow-soft" : "text-muted-foreground"}`}>{l === "warn" ? "Warning" : "Critical"}</button>
          ))}
        </div>
        <p className="px-1 text-sm text-muted-foreground">Alert when readings fall outside these ranges.</p>
        {metrics.map((m) => <RangeCard key={m.label} m={m} level={level} />)}
        <section>
          <Label>Preview</Label>
          <div className="grid grid-cols-3 gap-2">
            <PreviewCard tone="ok" title="Normal" value="24°" />
            <PreviewCard tone="warn" title="Warning" value="31°" />
            <PreviewCard tone="bad" title="Critical" value="37°" />
          </div>
        </section>
        <Btn onClick={() => go("node")}>Save thresholds</Btn>
      </div>
    </>
  );
}
function RangeCard({ m, level }: { m: (typeof metrics)[number]; level: "warn" | "crit" }) {
  const [r, setR] = useState<Record<"warn" | "crit", [number, number]>>({ warn: m.warn as [number, number], crit: m.crit as [number, number] });
  const [a, b] = r[level];
  const pct = (v: number) => ((v - m.lo) / (m.hi - m.lo)) * 100;
  const set = (i: number, v: number) => setR((x) => ({ ...x, [level]: i ? [a, Math.max(v, a)] : [Math.min(v, b), b] }));
  return (
    <Card>
      <div className="flex items-center gap-2"><m.icon className="size-5 text-primary" /><p className="flex-1 font-bold">{m.label}</p>
        <span className="text-sm font-semibold">{a}–{b} {m.unit}</span></div>
      <div className="relative mt-4 h-2 rounded-full bg-muted">
        <div className={`absolute h-2 rounded-full ${level === "warn" ? "bg-warning" : "bg-destructive"}`} style={{ left: `${pct(a)}%`, width: `${pct(b) - pct(a)}%` }} />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        {[a, b].map((v, i) => (
          <label key={i} className="text-xs font-semibold text-muted-foreground">{i ? "Max" : "Min"}
            <input type="range" min={m.lo} max={m.hi} value={v} onChange={(e) => set(i, +e.target.value)} className="mt-1 w-full accent-primary" />
          </label>
        ))}
      </div>
    </Card>
  );
}
function PreviewCard({ tone, title, value }: { tone: "ok" | "warn" | "bad"; title: string; value: string }) {
  const c = { ok: "border-success text-success", warn: "border-warning text-accent-foreground", bad: "border-destructive text-destructive" }[tone];
  return (
    <div className={`rounded-2xl border-l-4 bg-card p-3 shadow-soft ${c}`}>
      <Thermometer className="size-4" />
      <p className="mt-2 font-display text-xl text-foreground">{value}</p>
      <p className="text-xs font-bold">{title}</p>
    </div>
  );
}

/* ---------- Access ---------- */
const members = [
  { name: "Maya Okafor", email: "maya@hillsidefarm.co", role: "Owner", you: true },
  { name: "Daniel Reyes", email: "daniel@hillsidefarm.co", role: "Owner" },
  { name: "Priya Shah", email: "priya.shah@mail.com", role: "Viewer" },
];
export function AccessScreen({ go }: Go) {
  const [role, setRole] = useState<"Viewer" | "Owner">("Viewer");
  const [open, setOpen] = useState<string | null>(null);
  return (
    <>
      <Header back={() => go("greenhouse")} sub="Hillside Greenhouse" title="Greenhouse access" />
      <div className="space-y-5 px-5">
        <section>
          <Label>Members</Label>
          <div className="space-y-2">
            {members.map((m) => (
              <Card key={m.email}>
                <button onClick={() => !m.you && setOpen(open === m.email ? null : m.email)} className="flex w-full items-center gap-3 text-left">
                  <span className="bg-leaf grid size-11 shrink-0 place-items-center rounded-full font-display text-primary-foreground">{m.name.split(" ").map((x) => x[0]).join("")}</span>
                  <div className="min-w-0 flex-1"><p className="font-bold">{m.name}{m.you && <span className="font-normal text-muted-foreground"> (you)</span>}</p><p className="truncate text-sm text-muted-foreground">{m.email}</p></div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${m.role === "Owner" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>{m.role}</span>
                </button>
                {open === m.email && (
                  <div className="mt-3 grid grid-cols-2 gap-2 border-t pt-3">
                    <button className="h-10 rounded-xl bg-muted text-sm font-semibold">Change role</button>
                    <button className="h-10 rounded-xl bg-destructive/12 text-sm font-semibold text-destructive">Remove access</button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </section>
        <section>
          <Label>Invite member</Label>
          <Card className="space-y-3">
            <Field label="Email" icon={Mail}><input type="email" placeholder="name@example.com" className={input} /></Field>
            <div className="grid grid-cols-2 rounded-full bg-muted p-1">
              {(["Viewer", "Owner"] as const).map((r) => (
                <button key={r} onClick={() => setRole(r)} className={`h-10 rounded-full text-sm font-bold ${role === r ? "bg-card shadow-soft" : "text-muted-foreground"}`}>{r}</button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">{role === "Viewer" ? "Can view readings and activity." : "Can control devices and manage nodes."}</p>
            <Btn><UserPlus className="size-5" />Send invite</Btn>
          </Card>
        </section>
      </div>
    </>
  );
}

/* ---------- System details ---------- */
export function SystemScreen({ go }: Go) {
  const items = [
    { icon: Router, label: "Hub connection", value: "Connected", tone: "ok" as const, note: "VH-2041 · Strong" },
    { icon: Wifi, label: "Node connection", value: "Good", tone: "ok" as const, note: "Signal -62 dBm" },
    { icon: BatteryMedium, label: "Battery level", value: "76%", tone: "ok" as const, note: "~5 weeks left" },
    { icon: Fan, label: "Fan status", value: "Running", tone: "warn" as const, note: "High speed" },
    { icon: Droplets, label: "Irrigation valve", value: "Closed", tone: "muted" as const, note: "Last change 07:02" },
    { icon: Clock, label: "Last updated", value: "42 s ago", tone: "muted" as const, note: "Today 09:40" },
  ];
  return (
    <>
      <Header back={() => go("node")} sub="Bed A · Tomatoes" title="System details" />
      <div className="space-y-4 px-5">
        <div className="flex gap-3 rounded-2xl border-l-4 border-destructive bg-destructive/12 p-4 text-destructive">
          <Flame className="size-6 shrink-0" />
          <div><p className="font-bold">Thermal Cooling Active</p><p className="text-sm opacity-90">Temperature passed 30°C earlier. Fans are running at high speed until it cools down.</p></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {items.map((i) => (
            <Card key={i.label}>
              <i.icon className="size-5 text-primary" />
              <p className="mt-3 text-sm text-muted-foreground">{i.label}</p>
              <p className="font-display text-xl">{i.value}</p>
              <div className="mt-1.5"><Pill tone={i.tone}>{i.note}</Pill></div>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}

/* ---------- Trends ---------- */
const data: Record<string, { unit: string; range: Record<string, number[]> }> = {
  Temperature: { unit: "°", range: { "24 Hours": [22.1, 21.6, 21.2, 21.8, 23.0, 24.4, 25.2, 24.8, 24.1], "7 Days": [23.1, 24.0, 22.8, 25.1, 24.6, 23.3, 24.1], "30 Days": [20.5, 21.2, 22.8, 21.9, 23.4, 24.7, 23.9, 24.2, 25.0, 24.1] } },
  Humidity: { unit: "%", range: { "24 Hours": [74, 76, 78, 75, 70, 65, 62, 66, 68], "7 Days": [70, 72, 68, 66, 71, 69, 68], "30 Days": [75, 73, 70, 72, 69, 68, 70, 67, 66, 68] } },
  "Soil Moisture": { unit: "%", range: { "24 Hours": [55, 53, 51, 49, 47, 45, 43, 42, 41], "7 Days": [60, 52, 45, 62, 54, 47, 41], "30 Days": [58, 50, 62, 55, 48, 60, 52, 45, 50, 41] } },
  Light: { unit: "k", range: { "24 Hours": [0, 0, 0.5, 6, 14, 22, 25, 20, 18.2], "7 Days": [19, 22, 15, 24, 21, 17, 18], "30 Days": [16, 18, 21, 19, 23, 20, 22, 24, 19, 18] } },
};
const axes: Record<string, string[]> = { "24 Hours": ["00:00", "06:00", "12:00", "Now"], "7 Days": ["Thu", "Sat", "Mon", "Today"], "30 Days": ["Sep 8", "Sep 18", "Sep 28", "Today"] };
export function TrendsCard() {
  const [period, setPeriod] = useState("24 Hours");
  const [metric, setMetric] = useState("Temperature");
  const d = data[metric]!, vals = d.range[period]!;
  const max = Math.max(...vals), min = Math.min(...vals);
  const pts = vals.map((v, i) => `${(i / (vals.length - 1)) * 300},${90 - ((v - min) / (max - min || 1)) * 75}`).join(" ");
  return (
    <Card>
      <div className="grid grid-cols-3 rounded-full bg-muted p-1">
        {Object.keys(axes).map((p) => (
          <button key={p} onClick={() => setPeriod(p)} className={`h-9 rounded-full text-xs font-bold ${period === p ? "bg-card shadow-soft" : "text-muted-foreground"}`}>{p}</button>
        ))}
      </div>
      <div className="no-scrollbar -mx-1 mt-3 flex gap-2 overflow-x-auto px-1">
        {Object.keys(data).map((m) => (
          <button key={m} onClick={() => setMetric(m)} className={`h-8 shrink-0 rounded-full px-3 text-xs font-semibold ${metric === m ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>{m}</button>
        ))}
      </div>
      <div className="mt-3 flex items-baseline justify-between"><p className="font-bold">{metric} · {period}</p><span className="text-sm text-muted-foreground">{min}{d.unit} – {max}{d.unit}</span></div>
      <svg viewBox="0 0 300 95" className="mt-3 h-28 w-full" preserveAspectRatio="none">
        <polygon points={`0,95 ${pts} 300,95`} className="fill-sage/25" />
        <polyline points={pts} fill="none" className="stroke-primary" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
      <div className="mt-1 flex justify-between text-xs text-muted-foreground">{axes[period]!.map((a) => <span key={a}>{a}</span>)}</div>
    </Card>
  );
}
