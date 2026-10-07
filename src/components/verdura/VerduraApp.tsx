import { useEffect, useState, type ReactNode } from "react";
import { SignUpScreen, ForgotScreen, NodesScreen, EditNodeScreen, ThresholdsScreen, AccessScreen, SystemScreen, TrendsCard } from "./Extras";
import {
  Leaf, Home, Warehouse, Activity, Settings, Thermometer, Droplets, Sprout, Sun, BatteryMedium,
  ChevronRight, ChevronLeft, Plus, Wifi, WifiOff, Lock, Loader2, Router, CheckCircle2, XCircle,
  Clock, Ban, ShieldAlert, Info, LogOut, FileText, Trash2, User, Mail, RefreshCw,
} from "lucide-react";

export type Screen = "signin" | "signup" | "forgot" | "home" | "greenhouse" | "setup" | "node" | "activity" | "settings" | "nodes" | "editNode" | "thresholds" | "access" | "system";
type ReqState = "idle" | "pending" | "accepted" | "failed" | "rejected" | "timeout";

interface LogEntry { id: number; action: string; state: ReqState; time: string }

export function VerduraApp() {
  const [screen, setScreen] = useState<Screen>("signin");
  const [log, setLog] = useState<LogEntry[]>([
    { id: 1, action: "Irrigation ON · Bed A", state: "accepted", time: "Today 07:02" },
    { id: 2, action: "Irrigation OFF · Bed A", state: "timeout", time: "Yesterday 18:40" },
  ]);
  const tab = (["home", "node", "nodes", "editNode", "thresholds", "system"].includes(screen) ? "home" : ["greenhouse", "setup", "access"].includes(screen) ? "greenhouse" : screen) as Screen;

  return (
    <main className="flex min-h-screen items-center justify-center p-0 sm:p-8">
      <div className="relative h-[100dvh] w-full overflow-hidden bg-background sm:h-[844px] sm:w-[390px] sm:rounded-[3rem] sm:border-[10px] sm:border-device sm:shadow-2xl">
        <StatusBar />
        <div className="no-scrollbar h-[calc(100%-2.75rem)] overflow-y-auto pb-28">
          {screen === "signin" && <SignIn onDone={() => setScreen("home")} go={setScreen} />}
          {screen === "signup" && <SignUpScreen go={setScreen} />}
          {screen === "forgot" && <ForgotScreen go={setScreen} />}
          {screen === "nodes" && <NodesScreen go={setScreen} />}
          {screen === "editNode" && <EditNodeScreen go={setScreen} />}
          {screen === "thresholds" && <ThresholdsScreen go={setScreen} />}
          {screen === "access" && <AccessScreen go={setScreen} />}
          {screen === "system" && <SystemScreen go={setScreen} />}
          {screen === "home" && <HomeScreen go={setScreen} />}
          {screen === "greenhouse" && <GreenhouseScreen go={setScreen} />}
          {screen === "setup" && <SetupScreen go={setScreen} />}
          {screen === "node" && <NodeScreen go={setScreen} onLog={(e) => setLog((l) => [e, ...l.filter((x) => x.id !== e.id)])} />}
          {screen === "activity" && <ActivityScreen log={log} />}
          {screen === "settings" && <SettingsScreen onSignOut={() => setScreen("signin")} go={setScreen} />}
        </div>
        {!["signin", "signup", "forgot"].includes(screen) && <TabBar active={tab} go={setScreen} />}
      </div>
    </main>
  );
}

function StatusBar() {
  return (
    <div className="flex h-11 items-center justify-between px-7 text-xs font-semibold">
      <span>9:41</span>
      <span className="flex items-center gap-1.5"><Wifi className="size-3.5" /><BatteryMedium className="size-4" /></span>
    </div>
  );
}

function TabBar({ active, go }: { active: Screen; go: (s: Screen) => void }) {
  const tabs: [Screen, string, typeof Home][] = [["home", "Home", Home], ["greenhouse", "Greenhouse", Warehouse], ["activity", "Activity", Activity], ["settings", "Settings", Settings]];
  return (
    <nav className="absolute inset-x-0 bottom-0 border-t bg-card/95 px-2 pb-6 pt-2 backdrop-blur">
      <ul className="grid grid-cols-4">
        {tabs.map(([id, label, Icon]) => (
          <li key={id}>
            <button onClick={() => go(id)} aria-current={active === id ? "page" : undefined}
              className={`flex w-full flex-col items-center gap-1 rounded-xl py-2 text-[11px] font-semibold transition-colors ${active === id ? "text-primary" : "text-muted-foreground"}`}>
              <span className={`rounded-full px-4 py-1 ${active === id ? "bg-secondary" : ""}`}><Icon className="size-5" /></span>
              {label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* ---------- shared bits ---------- */
export function Header({ title, sub, back }: { title: string; sub?: string; back?: () => void }) {
  return (
    <header className="px-5 pb-4 pt-2">
      {back && <button onClick={back} className="-ml-2 mb-2 flex h-11 items-center gap-1 rounded-full px-2 text-sm font-semibold text-primary"><ChevronLeft className="size-5" />Back</button>}
      {sub && <p className="text-sm font-medium text-muted-foreground">{sub}</p>}
      <h1 className="text-[28px] font-semibold leading-tight">{title}</h1>
    </header>
  );
}
export const Card = ({ children, className = "", onClick }: { children: ReactNode; className?: string; onClick?: () => void }) =>
  onClick ? <button onClick={onClick} className={`w-full rounded-2xl bg-card p-4 text-left shadow-soft transition-transform active:scale-[0.98] ${className}`}>{children}</button>
    : <div className={`rounded-2xl bg-card p-4 shadow-soft ${className}`}>{children}</div>;

export function Btn({ children, variant = "primary", ...p }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "outline" | "danger" | "ghost" }) {
  const v = { primary: "bg-primary text-primary-foreground", outline: "border-2 border-primary/20 bg-card text-primary", danger: "bg-destructive text-destructive-foreground", ghost: "text-primary" }[variant];
  return <button {...p} className={`flex h-14 w-full items-center justify-center gap-2 rounded-2xl text-base font-bold transition active:scale-[0.98] disabled:opacity-50 ${v} ${p.className ?? ""}`}>{children}</button>;
}
export const Pill = ({ tone, children }: { tone: "ok" | "warn" | "bad" | "muted"; children: ReactNode }) => {
  const t = { ok: "bg-success/15 text-success", warn: "bg-warning/20 text-accent-foreground", bad: "bg-destructive/12 text-destructive", muted: "bg-muted text-muted-foreground" }[tone];
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${t}`}><span className="size-1.5 rounded-full bg-current" />{children}</span>;
};

/* ---------- 1. Sign in ---------- */
function SignIn({ onDone, go }: { onDone: () => void; go: (s: Screen) => void }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("maya@hillsidefarm.co");
  const [pw, setPw] = useState("••••••••");
  const submit = (e: React.FormEvent) => { e.preventDefault(); setLoading(true); setTimeout(onDone, 900); };
  return (
    <div className="flex min-h-full flex-col px-6">
      <div className="mt-10 flex flex-col items-center text-center">
        <div className="bg-leaf grid size-20 place-items-center rounded-[1.75rem] text-primary-foreground shadow-soft"><Leaf className="size-10" /></div>
        <h1 className="mt-5 text-4xl font-semibold">Verdura</h1>
        <p className="mt-2 text-muted-foreground">Calm care for your greenhouse.</p>
      </div>
      <form onSubmit={submit} className="mt-12 space-y-4">
        <Field label="Email" icon={Mail}><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-transparent outline-none" /></Field>
        <Field label="Password" icon={Lock}><input type="password" value={pw} onChange={(e) => setPw(e.target.value)} className="w-full bg-transparent outline-none" /></Field>
        <div className="text-right"><button type="button" onClick={() => go("forgot")} className="h-11 text-sm font-semibold text-primary">Forgot password?</button></div>
        <Btn type="submit" disabled={loading}>{loading ? <><Loader2 className="size-5 animate-spin" />Signing in…</> : "Sign in"}</Btn>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">New to Verdura? <button onClick={() => go("signup")} className="h-11 font-bold text-primary underline-offset-4 hover:underline">Create account</button></p>
      <p className="mt-auto pb-10 pt-8 text-center text-xs text-muted-foreground">Prototype · any credentials work</p>
    </div>
  );
}
export function Field({ label, icon: Icon, children }: { label: string; icon: typeof Mail; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      <span className="flex h-14 items-center gap-3 rounded-2xl border-2 bg-card px-4 focus-within:border-ring"><Icon className="size-5 text-muted-foreground" />{children}</span>
    </label>
  );
}

/* ---------- Home ---------- */
const nodes = [
  { id: "a", name: "Bed A · Tomatoes", status: "online" as const, temp: 24.1, hum: 68, soil: 41 },
  { id: "b", name: "Bed B · Basil", status: "online" as const, temp: 23.4, hum: 72, soil: 22 },
  { id: "c", name: "Seedling rack", status: "offline" as const, temp: 0, hum: 0, soil: 0 },
];
function HomeScreen({ go }: { go: (s: Screen) => void }) {
  return (
    <>
      <Header sub="Good morning, Maya" title="Hillside Greenhouse" />
      <div className="space-y-4 px-5">
        <div className="bg-leaf rounded-3xl p-5 text-primary-foreground shadow-soft">
          <div className="flex items-center justify-between"><span className="text-sm opacity-80">Inside now</span><span className="flex items-center gap-1.5 text-xs font-semibold"><Wifi className="size-3.5" />Hub online</span></div>
          <p className="mt-2 font-display text-5xl">23.8°</p>
          <p className="mt-1 text-sm opacity-80">70% humidity · 2 of 3 nodes reporting</p>
        </div>
        <Card className="flex gap-3 border-l-4 border-terracotta">
          <Droplets className="size-5 shrink-0 text-terracotta" />
          <div><p className="font-bold">Bed B soil is dry (22%)</p><p className="text-sm text-muted-foreground">Consider watering soon.</p></div>
        </Card>
        <div className="flex items-center justify-between pt-2">
          <h2 className="text-xl font-semibold">Nodes</h2>
          <button onClick={() => go("nodes")} className="flex h-10 items-center gap-1.5 rounded-full bg-secondary px-4 text-sm font-bold text-secondary-foreground"><Settings className="size-4" />Manage nodes</button>
        </div>
        {nodes.map((n) => (
          <Card key={n.id} onClick={() => n.status === "online" && go("node")} className="flex items-center gap-3">
            <div className={`grid size-12 place-items-center rounded-xl ${n.status === "online" ? "bg-secondary text-primary" : "bg-muted text-muted-foreground"}`}><Sprout className="size-6" /></div>
            <div className="min-w-0 flex-1">
              <p className="font-bold">{n.name}</p>
              <p className="text-sm text-muted-foreground">{n.status === "online" ? `${n.temp}° · ${n.hum}% · soil ${n.soil}%` : "Last seen 2 h ago"}</p>
            </div>
            {n.status === "online" ? <ChevronRight className="size-5 text-muted-foreground" /> : <Pill tone="muted">Offline</Pill>}
          </Card>
        ))}
      </div>
    </>
  );
}

/* ---------- 2. Greenhouse selection ---------- */
function GreenhouseScreen({ go }: { go: (s: Screen) => void }) {
  return (
    <>
      <Header title="Your greenhouses" />
      <div className="space-y-4 px-5">
        <Card onClick={() => go("home")}>
          <div className="flex items-start justify-between">
            <div className="bg-leaf grid size-12 place-items-center rounded-xl text-primary-foreground"><Warehouse className="size-6" /></div>
            <Pill tone="ok">Connected</Pill>
          </div>
          <p className="mt-4 font-display text-xl">Hillside Greenhouse</p>
          <p className="text-sm text-muted-foreground">3 nodes · 1 hub · Updated 1 min ago</p>
        </Card>
        <Btn variant="outline" onClick={() => go("access")}><User className="size-5" />Manage access</Btn>
        <Btn variant="outline" onClick={() => go("setup")}><Plus className="size-5" />Add or set up a greenhouse</Btn>
      </div>
    </>
  );
}

/* ---------- 3. Hub & Node setup ---------- */
type SetupState = "loading" | "list" | "empty" | "offline" | "denied";
function SetupScreen({ go }: { go: (s: Screen) => void }) {
  const [hub, setHub] = useState<"idle" | "searching" | "connected">("idle");
  const [st, setSt] = useState<SetupState>("loading");
  useEffect(() => { if (hub !== "searching") return; const t = setTimeout(() => setHub("connected"), 1400); return () => clearTimeout(t); }, [hub]);
  useEffect(() => { if (hub !== "connected" || st !== "loading") return; const t = setTimeout(() => setSt("list"), 1200); return () => clearTimeout(t); }, [hub, st]);

  return (
    <>
      <Header back={() => go("greenhouse")} sub="Setup" title="Hub & sensor nodes" />
      <div className="space-y-4 px-5">
        <Card>
          <div className="flex items-center gap-3">
            <Step n={1} done={hub === "connected"} />
            <div className="flex-1"><p className="font-bold">Connect your Hub</p><p className="text-sm text-muted-foreground">Plug in the Hub and keep your phone nearby.</p></div>
          </div>
          {hub !== "connected" ? (
            <Btn className="mt-4" onClick={() => setHub("searching")} disabled={hub === "searching"}>
              {hub === "searching" ? <><Loader2 className="size-5 animate-spin" />Looking for Hub…</> : <><Router className="size-5" />Find my Hub</>}
            </Btn>
          ) : <div className="mt-4 flex items-center gap-2 rounded-xl bg-secondary p-3 text-sm font-semibold text-secondary-foreground"><CheckCircle2 className="size-5 text-success" />Verdura Hub · VH-2041 connected</div>}
        </Card>

        <Card className={hub !== "connected" ? "opacity-50" : ""}>
          <div className="flex items-center gap-3"><Step n={2} done={false} /><div><p className="font-bold">Find sensor nodes</p><p className="text-sm text-muted-foreground">Nodes near the Hub appear here.</p></div></div>
          {hub === "connected" && <div className="mt-4"><NodeList st={st} retry={() => setSt("loading")} /></div>}
        </Card>

        {hub === "connected" && (
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Preview states</p>
            <div className="flex flex-wrap gap-2">
              {(["loading", "list", "empty", "offline", "denied"] as SetupState[]).map((s) => (
                <button key={s} onClick={() => setSt(s)} className={`h-10 rounded-full px-4 text-sm font-semibold ${st === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{s}</button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
const Step = ({ n, done }: { n: number; done: boolean }) => (
  <span className={`grid size-9 shrink-0 place-items-center rounded-full font-bold ${done ? "bg-success text-primary-foreground" : "bg-muted text-foreground"}`}>{done ? <CheckCircle2 className="size-5" /> : n}</span>
);
function NodeList({ st, retry }: { st: SetupState; retry: () => void }) {
  if (st === "loading") return <div className="space-y-2">{[0, 1, 2].map((i) => <div key={i} className="h-16 animate-pulse rounded-xl bg-muted" />)}<p className="pt-1 text-center text-sm text-muted-foreground">Searching for nodes…</p></div>;
  if (st === "empty") return <Empty icon={Sprout} title="No nodes found yet" body="Make sure each node is switched on and within 10 m of the Hub." action={retry} />;
  if (st === "offline") return <Empty icon={WifiOff} title="Hub went offline" body="Check the Hub's power and Wi‑Fi, then try again." action={retry} tone="bad" />;
  if (st === "denied") return <Empty icon={ShieldAlert} title="Permission needed" body="Allow Bluetooth and nearby devices in your phone settings so Verdura can find nodes." action={retry} actionLabel="Open settings" tone="warn" />;
  return (
    <ul className="space-y-2">
      {nodes.map((n) => (
        <li key={n.id} className="flex items-center gap-3 rounded-xl border p-3">
          <Sprout className="size-5 text-primary" />
          <span className="flex-1 font-semibold">{n.name}</span>
          {n.status === "online" ? <Pill tone="ok">Paired</Pill> : <Pill tone="muted">Offline</Pill>}
        </li>
      ))}
    </ul>
  );
}
function Empty({ icon: Icon, title, body, action, actionLabel = "Try again", tone = "muted" }: { icon: typeof Sprout; title: string; body: string; action: () => void; actionLabel?: string; tone?: "muted" | "bad" | "warn" }) {
  const c = { muted: "bg-muted text-muted-foreground", bad: "bg-destructive/12 text-destructive", warn: "bg-accent text-accent-foreground" }[tone];
  return (
    <div className="flex flex-col items-center py-4 text-center">
      <span className={`grid size-14 place-items-center rounded-full ${c}`}><Icon className="size-7" /></span>
      <p className="mt-3 font-bold">{title}</p><p className="mt-1 text-sm text-muted-foreground">{body}</p>
      <Btn variant="outline" className="mt-4 h-12" onClick={action}><RefreshCw className="size-4" />{actionLabel}</Btn>
    </div>
  );
}

/* ---------- 4 & 5. Node telemetry + safe control ---------- */
function NodeScreen({ go, onLog }: { go: (s: Screen) => void; onLog: (e: LogEntry) => void }) {
  const [confirm, setConfirm] = useState(false);
  const [req, setReq] = useState<ReqState>("idle");
  const [reqId, setReqId] = useState(0);
  const [irrigationOn, setIrrigationOn] = useState(false);
  const target = !irrigationOn;
  const label = `Irrigation ${target ? "ON" : "OFF"} · Bed A`;

  const send = (outcome: ReqState) => {
    setConfirm(false);
    const id = Date.now(); setReqId(id);
    setReq("pending"); onLog({ id, action: label, state: "pending", time: "Just now" });
    setTimeout(() => {
      setReq(outcome); onLog({ id, action: label, state: outcome, time: "Just now" });
      if (outcome === "accepted") setIrrigationOn(target);
    }, 2000);
  };
  void reqId;


  return (
    <>
      <Header back={() => go("home")} sub="Hillside Greenhouse" title="Bed A · Tomatoes" />
      <div className="space-y-4 px-5">
        <div className="flex items-center justify-between">
          <Pill tone="ok">Online</Pill>
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground"><Clock className="size-4" />Updated 42 s ago</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Metric icon={Thermometer} label="Temperature" value="24.1°C" tone="ok" note="Ideal" />
          <Metric icon={Droplets} label="Humidity" value="68%" tone="ok" note="Ideal" />
          <Metric icon={Sprout} label="Soil moisture" value="41%" tone="warn" note="Getting dry" />
          <Metric icon={Sun} label="Light" value="18.2k lx" tone="ok" note="Bright" />
        </div>
        <Card className="flex items-center gap-3">
          <BatteryMedium className="size-6 text-success" />
          <div className="flex-1"><p className="font-bold">Battery 76%</p><div className="mt-1.5 h-2 rounded-full bg-muted"><div className="h-2 w-[76%] rounded-full bg-success" /></div></div>
          <span className="text-sm text-muted-foreground">~5 weeks</span>
        </Card>
        <TrendsCard />
        <div className="grid grid-cols-2 gap-3">
          <Card onClick={() => go("thresholds")}><ShieldAlert className="size-5 text-terracotta" /><p className="mt-2 font-bold">Configure alerts</p><p className="text-xs text-muted-foreground">Warning & critical ranges</p></Card>
          <Card onClick={() => go("system")}><Router className="size-5 text-primary" /><p className="mt-2 font-bold">System details</p><p className="text-xs text-muted-foreground">Hub, battery, valve</p></Card>
        </div>
        <h2 className="pt-2 text-xl font-semibold">Control</h2>
        <Card>
          <div className="flex items-center gap-3">
            <span className={`grid size-12 place-items-center rounded-xl ${irrigationOn ? "bg-primary text-primary-foreground" : "bg-secondary text-primary"}`}><Droplets className="size-6" /></span>
            <div className="flex-1"><p className="font-bold">Irrigation valve</p><p className="text-sm text-muted-foreground">Last reported: <b className="text-foreground">{irrigationOn ? "On" : "Off"}</b></p></div>
          </div>
          {req !== "idle" && <ReqStatus state={req} label={label} onDismiss={() => setReq("idle")} />}
          <Btn className="mt-4" disabled={req === "pending"} onClick={() => setConfirm(true)} variant={target ? "primary" : "outline"}>
            {req === "pending" ? <><Loader2 className="size-5 animate-spin" />Request sent…</> : `Request irrigation ${target ? "on" : "off"}`}
          </Btn>
        </Card>
      </div>

      {confirm && (
        <div className="absolute inset-0 z-20 flex items-end bg-foreground/40 animate-in fade-in" onClick={() => setConfirm(false)}>
          <div role="dialog" aria-modal className="w-full rounded-t-[2rem] bg-card p-6 pb-10 animate-in slide-in-from-bottom" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-muted" />
            <h2 className="text-2xl font-semibold">Turn irrigation {target ? "on" : "off"}?</h2>
            <dl className="mt-4 space-y-2 rounded-2xl bg-muted p-4 text-sm">
              <Row k="Device" v="Bed A valve" /><Row k="Action" v={target ? "Open valve (water on)" : "Close valve (water off)"} /><Row k="Via" v="Hub VH-2041" />
            </dl>
            <div className="mt-4 flex gap-3 rounded-2xl bg-accent p-4 text-sm text-accent-foreground">
              <Info className="size-5 shrink-0" />
              <p>This sends a <b>request</b> to your Hub. The valve may take a moment to respond, or may not change if the device is busy or offline. We'll show the result here and in Activity.</p>
            </div>
            <div className="mt-5 space-y-2">
              <Btn onClick={() => send("accepted")}>Confirm request</Btn>
              <Btn variant="ghost" onClick={() => setConfirm(false)}>Cancel</Btn>
            </div>
            <div className="mt-3 border-t pt-3">
              <p className="mb-2 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">Prototype: simulate outcome</p>
              <div className="grid grid-cols-3 gap-2">
                {(["failed", "rejected", "timeout"] as ReqState[]).map((o) => <button key={o} onClick={() => send(o)} className="h-10 rounded-full bg-muted text-xs font-semibold capitalize">{o === "timeout" ? "Timed out" : o}</button>)}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
const Row = ({ k, v }: { k: string; v: string }) => <div className="flex justify-between gap-4"><dt className="text-muted-foreground">{k}</dt><dd className="text-right font-semibold">{v}</dd></div>;
function Metric({ icon: Icon, label, value, tone, note }: { icon: typeof Sun; label: string; value: string; tone: "ok" | "warn"; note: string }) {
  return (
    <Card className="!p-4">
      <Icon className={`size-5 ${tone === "ok" ? "text-success" : "text-terracotta"}`} />
      <p className="mt-3 text-sm text-muted-foreground">{label}</p>
      <p className="font-display text-2xl">{value}</p>
      <p className={`mt-1 text-xs font-bold ${tone === "ok" ? "text-success" : "text-terracotta"}`}>{note}</p>
    </Card>
  );
}
const reqMeta: Record<Exclude<ReqState, "idle">, { icon: typeof Clock; title: string; body: string; cls: string }> = {
  pending: { icon: Loader2, title: "Pending", body: "Waiting for the Hub to respond…", cls: "bg-muted text-foreground" },
  accepted: { icon: CheckCircle2, title: "Accepted by Hub", body: "The valve should update shortly. Check the reported state above.", cls: "bg-success/12 text-success" },
  failed: { icon: XCircle, title: "Failed to send", body: "We couldn't reach the Hub. Nothing changed.", cls: "bg-destructive/12 text-destructive" },
  rejected: { icon: Ban, title: "Rejected", body: "The Hub declined the request (safety lock active). Nothing changed.", cls: "bg-accent text-accent-foreground" },
  timeout: { icon: Clock, title: "Timed out", body: "No reply in 30 s. The valve state is unknown — check before retrying.", cls: "bg-warning/20 text-accent-foreground" },
};
function ReqStatus({ state, label, onDismiss }: { state: ReqState; label: string; onDismiss: () => void }) {
  if (state === "idle") return null;
  const m = reqMeta[state];
  return (
    <div role="status" className={`mt-4 flex gap-3 rounded-xl p-3 ${m.cls}`}>
      <m.icon className={`size-5 shrink-0 ${state === "pending" ? "animate-spin" : ""}`} />
      <div className="flex-1 text-sm"><p className="font-bold">{m.title} · {label}</p><p className="opacity-90">{m.body}</p></div>
      {state !== "pending" && <button onClick={onDismiss} className="h-8 self-start text-xs font-bold underline">Dismiss</button>}
    </div>
  );
}

/* ---------- Activity ---------- */
function ActivityScreen({ log }: { log: LogEntry[] }) {
  return (
    <>
      <Header title="Activity" sub="Control requests & alerts" />
      <ul className="space-y-3 px-5">
        {log.map((e) => {
          const m = reqMeta[e.state as Exclude<ReqState, "idle">];
          return (
            <li key={e.id}><Card className="flex items-center gap-3">
              <span className={`grid size-10 place-items-center rounded-full ${m.cls}`}><m.icon className={`size-5 ${e.state === "pending" ? "animate-spin" : ""}`} /></span>
              <div className="flex-1"><p className="font-bold">{e.action}</p><p className="text-sm text-muted-foreground">{m.title} · {e.time}</p></div>
            </Card></li>
          );
        })}
        <li><Card className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-full bg-accent text-terracotta"><Droplets className="size-5" /></span>
          <div><p className="font-bold">Bed B soil below 25%</p><p className="text-sm text-muted-foreground">Alert · Today 06:15</p></div>
        </Card></li>
      </ul>
    </>
  );
}

/* ---------- 6. Settings ---------- */
function SettingsScreen({ onSignOut, go }: { onSignOut: () => void; go: (s: Screen) => void }) {
  return (
    <>
      <Header title="Settings" />
      <div className="space-y-5 px-5">
        <Card className="flex items-center gap-4">
          <span className="bg-leaf grid size-14 place-items-center rounded-full font-display text-xl text-primary-foreground">MO</span>
          <div><p className="font-bold">Maya Okafor</p><p className="text-sm text-muted-foreground">maya@hillsidefarm.co</p></div>
        </Card>
        <Group title="Account">
          <Item icon={User} label="Account details" />
          <Item icon={Mail} label="Notifications" />
        </Group>
        <Group title="Greenhouse">
          <Item icon={User} label="Manage access" onClick={() => go("access")} />
        </Group>
        <Group title="Legal">
          <Item icon={FileText} label="Privacy policy" />
          <Item icon={Trash2} label="Delete account" danger />
        </Group>
        <Btn variant="outline" onClick={onSignOut}><LogOut className="size-5" />Sign out</Btn>
        <p className="text-center text-xs text-muted-foreground">Verdura 1.0.0 (prototype)</p>
      </div>
    </>
  );
}
const Group = ({ title, children }: { title: string; children: ReactNode }) => (
  <section><p className="mb-2 px-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</p><div className="divide-y overflow-hidden rounded-2xl bg-card shadow-soft">{children}</div></section>
);
const Item = ({ icon: Icon, label, danger, onClick }: { icon: typeof User; label: string; danger?: boolean; onClick?: () => void }) => (
  <button onClick={onClick} className={`flex h-14 w-full items-center gap-3 px-4 text-left font-semibold ${danger ? "text-destructive" : ""}`}><Icon className="size-5" /><span className="flex-1">{label}</span><ChevronRight className="size-4 text-muted-foreground" /></button>
);
