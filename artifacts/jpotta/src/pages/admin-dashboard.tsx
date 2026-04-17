import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { adminApi, playersApi, newsApi, achievementsApi, committeeApi, reviewsApi } from "@/lib/api";
import type { Review, NewsArticle, Achievement, Player, CommitteeMember } from "@/lib/api";
import { useReviews, useNews, useAchievements, usePlayers, useCommitteeMembers, useRefresh, DataContext } from "@/hooks/use-store";
import { LogOut, Plus, Edit, Trash2, Home, X, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

type Tab = "reviews" | "news" | "achievements" | "players" | "committee";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<Tab>("news");
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [version, setVersion] = useState(0);
  const refresh = useCallback(() => setVersion(v => v + 1), []);
  const { toast } = useToast();

  useEffect(() => {
    if (!adminApi.isLoggedIn()) setLocation("/admin");
  }, []);

  const handleLogout = async () => {
    await adminApi.logout();
    setLocation("/admin");
  };

  const closeModal = () => {
    setAdding(false);
    setEditingId(null);
  };

  const handleTabChange = (v: string) => {
    setActiveTab(v as Tab);
    closeModal();
  };

  return (
    <DataContext.Provider value={{ version, refresh }}>
      <div className="min-h-screen bg-zinc-950 text-white font-sans">
        <header className="bg-black border-b border-white/10 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-black uppercase text-primary tracking-widest drop-shadow-[0_0_10px_rgba(204,0,0,0.5)]">JPOTTA Admin</h1>
              <div className="h-6 w-px bg-white/20 hidden sm:block" />
              <Link href="/" className="hidden sm:flex items-center text-gray-400 hover:text-white text-sm transition-colors">
                <Home className="w-4 h-4 mr-2" /> View Site
              </Link>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="border-white/10 hover:bg-white/5 hover:text-primary">
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <h2 className="text-2xl font-bold">Dashboard</h2>
            <Select value={activeTab} onValueChange={handleTabChange}>
              <SelectTrigger className="w-full sm:w-[200px] bg-zinc-900 border-white/10 text-white">
                <SelectValue placeholder="Select module" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-700 text-white z-[200]" style={{ backgroundColor: "#18181b", color: "#ffffff" }}>
                <SelectItem value="news" className="text-white focus:bg-zinc-800 focus:text-white cursor-pointer">News Articles</SelectItem>
                <SelectItem value="players" className="text-white focus:bg-zinc-800 focus:text-white cursor-pointer">Players</SelectItem>
                <SelectItem value="achievements" className="text-white focus:bg-zinc-800 focus:text-white cursor-pointer">Achievements</SelectItem>
                <SelectItem value="committee" className="text-white focus:bg-zinc-800 focus:text-white cursor-pointer">Committee Members</SelectItem>
                <SelectItem value="reviews" className="text-white focus:bg-zinc-800 focus:text-white cursor-pointer">Reviews</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-black border border-white/10 rounded-xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
              <h3 className="text-xl font-bold text-white capitalize">{activeTab.replace("committee", "Committee Members")}</h3>
              <Button className="bg-primary hover:bg-red-700 text-white" size="sm" onClick={() => { closeModal(); setAdding(true); }}>
                <Plus className="w-4 h-4 mr-2" /> Add New
              </Button>
            </div>

            <div className="overflow-x-auto">
              {activeTab === "news" && <NewsTable onEdit={setEditingId} toast={toast} />}
              {activeTab === "players" && <PlayersTable onEdit={setEditingId} toast={toast} />}
              {activeTab === "achievements" && <AchievementsTable onEdit={setEditingId} toast={toast} />}
              {activeTab === "committee" && <CommitteeTable onEdit={setEditingId} toast={toast} />}
              {activeTab === "reviews" && <ReviewsTable onEdit={setEditingId} toast={toast} />}
            </div>
          </div>
        </main>

        {(adding || editingId !== null) && (
          <Modal onClose={closeModal}>
            {activeTab === "news" && <NewsForm editingId={editingId} onDone={closeModal} toast={toast} />}
            {activeTab === "players" && <PlayerForm editingId={editingId} onDone={closeModal} toast={toast} />}
            {activeTab === "achievements" && <AchievementForm editingId={editingId} onDone={closeModal} toast={toast} />}
            {activeTab === "committee" && <CommitteeForm editingId={editingId} onDone={closeModal} toast={toast} />}
            {activeTab === "reviews" && <ReviewForm editingId={editingId} onDone={closeModal} toast={toast} />}
          </Modal>
        )}
      </div>
    </DataContext.Provider>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-xl shadow-2xl overflow-y-auto max-h-[90vh]">
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 bg-zinc-800 hover:bg-primary rounded-full flex items-center justify-center text-white transition-colors z-10">
          <X className="w-4 h-4" />
        </button>
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-bold text-gray-300 uppercase tracking-widest">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full bg-zinc-800 border border-white/10 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all";
const textareaCls = inputCls + " resize-y min-h-[100px]";

type ToastFn = ReturnType<typeof useToast>["toast"];

// ── NEWS ──────────────────────────────────────────────────────────────────────
function NewsTable({ onEdit, toast }: { onEdit: (id: number) => void; toast: ToastFn }) {
  const news = useNews();
  const refresh = useRefresh();
  const del = async (id: number) => {
    if (!confirm("Delete this article?")) return;
    try { await newsApi.delete(id); refresh(); toast({ title: "Deleted" }); }
    catch { toast({ title: "Error", variant: "destructive" }); }
  };
  if (!news.length) return <Empty label="news article" />;
  return (
    <table className="w-full text-left text-sm">
      <thead className="bg-zinc-900/50 text-gray-400 border-b border-white/10">
        <tr><th className="p-3">Title</th><th className="p-3">Date</th><th className="p-3 text-right">Actions</th></tr>
      </thead>
      <tbody>
        {news.map(item => (
          <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
            <td className="p-3 font-medium text-white">{item.title}</td>
            <td className="p-3 text-gray-400">{new Date(item.publishedAt).toLocaleDateString()}</td>
            <td className="p-3">
              <div className="flex justify-end space-x-2">
                <Button variant="ghost" size="icon" onClick={() => onEdit(item.id)} className="h-8 w-8 text-gray-400 hover:text-white"><Edit className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => del(item.id)} className="h-8 w-8 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function NewsForm({ editingId, onDone, toast }: { editingId: number | null; onDone: () => void; toast: ToastFn }) {
  const all = useNews();
  const refresh = useRefresh();
  const existing = editingId ? all.find(n => n.id === editingId) : undefined;
  const [title, setTitle] = useState(existing?.title ?? "");
  const [summary, setSummary] = useState(existing?.summary ?? "");
  const [content, setContent] = useState(existing?.content ?? "");
  const [imageUrl, setImageUrl] = useState(existing?.imageUrl ?? "");
  const [publishedAt, setPublishedAt] = useState(existing ? existing.publishedAt.slice(0, 10) : new Date().toISOString().slice(0, 10));
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!title.trim()) return toast({ title: "Title is required", variant: "destructive" });
    setSaving(true);
    try {
      const data = { title, summary, content, imageUrl: imageUrl || null, publishedAt: new Date(publishedAt).toISOString() };
      if (editingId) { await newsApi.update(editingId, data); toast({ title: "Article updated" }); }
      else { await newsApi.create(data); toast({ title: "Article added" }); }
      refresh();
      onDone();
    } catch { toast({ title: "Save failed", variant: "destructive" }); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-black text-white uppercase">{editingId ? "Edit Article" : "Add Article"}</h2>
      <Field label="Title"><input className={inputCls} value={title} onChange={e => setTitle(e.target.value)} /></Field>
      <Field label="Summary"><textarea className={textareaCls} value={summary} onChange={e => setSummary(e.target.value)} rows={2} /></Field>
      <Field label="Full Content"><textarea className={textareaCls} value={content} onChange={e => setContent(e.target.value)} /></Field>
      <Field label="Image URL (optional)"><input className={inputCls} value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://..." /></Field>
      <Field label="Published Date"><input type="date" className={inputCls} value={publishedAt} onChange={e => setPublishedAt(e.target.value)} /></Field>
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="outline" onClick={onDone} className="border-white/10">Cancel</Button>
        <Button onClick={save} disabled={saving} className="bg-primary hover:bg-red-700">{saving ? "Saving..." : "Save"}</Button>
      </div>
    </div>
  );
}

// ── PLAYERS ──────────────────────────────────────────────────────────────────
function PlayersTable({ onEdit, toast }: { onEdit: (id: number) => void; toast: ToastFn }) {
  const players = usePlayers();
  const refresh = useRefresh();
  const del = async (id: number) => {
    if (!confirm("Delete this player?")) return;
    try { await playersApi.delete(id); refresh(); toast({ title: "Deleted" }); }
    catch { toast({ title: "Error", variant: "destructive" }); }
  };
  if (!players.length) return <Empty label="player" />;
  return (
    <table className="w-full text-left text-sm">
      <thead className="bg-zinc-900/50 text-gray-400 border-b border-white/10">
        <tr><th className="p-3">Name</th><th className="p-3">District</th><th className="p-3">Best Rank</th><th className="p-3 text-right">Actions</th></tr>
      </thead>
      <tbody>
        {players.map(item => {
          const bestRank = item.internationalRank && item.internationalRank !== "-" ? `Intl ${item.internationalRank}` :
            item.nationalRank && item.nationalRank !== "-" ? `Nat ${item.nationalRank}` :
            item.stateRank && item.stateRank !== "-" ? `State ${item.stateRank}` :
            item.districtRank && item.districtRank !== "-" ? `Dist ${item.districtRank}` : "-";
          return (
            <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td className="p-3 font-medium text-white">
                <div className="flex items-center">
                  {item.photoUrl ? <img src={item.photoUrl} className="w-6 h-6 rounded-full object-cover mr-2" alt="" /> : <div className="w-6 h-6 rounded-full bg-zinc-800 mr-2 flex items-center justify-center text-xs text-gray-500">{item.name.charAt(0)}</div>}
                  {item.name}
                </div>
              </td>
              <td className="p-3 text-gray-400">{item.district || "-"}</td>
              <td className="p-3 text-gray-400">{bestRank}</td>
              <td className="p-3">
                <div className="flex justify-end space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(item.id)} className="h-8 w-8 text-gray-400 hover:text-white"><Edit className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => del(item.id)} className="h-8 w-8 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></Button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function PlayerForm({ editingId, onDone, toast }: { editingId: number | null; onDone: () => void; toast: ToastFn }) {
  const all = usePlayers();
  const refresh = useRefresh();
  const existing = editingId ? all.find(p => p.id === editingId) : undefined;
  const [name, setName] = useState(existing?.name ?? "");
  const [district, setDistrict] = useState(existing?.district ?? "");
  const [state, setState] = useState(existing?.state ?? "");
  const [districtRank, setDistrictRank] = useState(existing?.districtRank ?? "");
  const [stateRank, setStateRank] = useState(existing?.stateRank ?? "");
  const [nationalRank, setNationalRank] = useState(existing?.nationalRank ?? "");
  const [internationalRank, setInternationalRank] = useState(existing?.internationalRank ?? "");
  const [photoUrl, setPhotoUrl] = useState(existing?.photoUrl ?? "");
  const [blade, setBlade] = useState(existing?.blade ?? "");
  const [fhRubber, setFhRubber] = useState(existing?.fhRubber ?? "");
  const [bhRubber, setBhRubber] = useState(existing?.bhRubber ?? "");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!name.trim()) return toast({ title: "Name is required", variant: "destructive" });
    setSaving(true);
    try {
      const data = {
        name,
        district: district || null,
        state: state || null,
        districtRank: districtRank || null,
        stateRank: stateRank || null,
        nationalRank: nationalRank || null,
        internationalRank: internationalRank || null,
        photoUrl: photoUrl || null,
        blade: blade || null,
        fhRubber: fhRubber || null,
        bhRubber: bhRubber || null,
      };
      if (editingId) { await playersApi.update(editingId, data); toast({ title: "Player updated" }); }
      else { await playersApi.create(data); toast({ title: "Player added" }); }
      refresh();
      onDone();
    } catch { toast({ title: "Save failed", variant: "destructive" }); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-black text-white uppercase">{editingId ? "Edit Player" : "Add Player"}</h2>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Name"><input className={inputCls} value={name} onChange={e => setName(e.target.value)} /></Field>
        <Field label="District"><input className={inputCls} value={district} onChange={e => setDistrict(e.target.value)} /></Field>
        <div className="col-span-2"><Field label="State"><input className={inputCls} value={state} onChange={e => setState(e.target.value)} /></Field></div>
      </div>
      <div className="border-t border-white/10 pt-4">
        <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Rankings</p>
        <p className="text-xs text-gray-600 mb-3">Enter a rank like <span className="text-gray-400">#1</span>, <span className="text-gray-400">#3</span> — or leave blank / enter <span className="text-gray-400">-</span> to hide that category on the player card.</p>
        <div className="grid grid-cols-2 gap-3">
          <Field label="District Rank"><input className={inputCls} value={districtRank} onChange={e => setDistrictRank(e.target.value)} placeholder="#1  or leave blank" /></Field>
          <Field label="State Rank"><input className={inputCls} value={stateRank} onChange={e => setStateRank(e.target.value)} placeholder="#1  or leave blank" /></Field>
          <Field label="National Rank"><input className={inputCls} value={nationalRank} onChange={e => setNationalRank(e.target.value)} placeholder="#1  or leave blank" /></Field>
          <Field label="International Rank"><input className={inputCls} value={internationalRank} onChange={e => setInternationalRank(e.target.value)} placeholder="#1  or leave blank" /></Field>
        </div>
      </div>
      <Field label="Photo URL"><input className={inputCls} value={photoUrl} onChange={e => setPhotoUrl(e.target.value)} placeholder="https://..." /></Field>
      <div className="border-t border-white/10 pt-4">
        <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-3">Equipment Setup</p>
        <div className="grid grid-cols-1 gap-3">
          <Field label="Blade"><input className={inputCls} value={blade} onChange={e => setBlade(e.target.value)} /></Field>
          <Field label="FH Rubber"><input className={inputCls} value={fhRubber} onChange={e => setFhRubber(e.target.value)} /></Field>
          <Field label="BH Rubber"><input className={inputCls} value={bhRubber} onChange={e => setBhRubber(e.target.value)} /></Field>
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="outline" onClick={onDone} className="border-white/10">Cancel</Button>
        <Button onClick={save} disabled={saving} className="bg-primary hover:bg-red-700">{saving ? "Saving..." : "Save"}</Button>
      </div>
    </div>
  );
}

// ── ACHIEVEMENTS ─────────────────────────────────────────────────────────────
function AchievementsTable({ onEdit, toast }: { onEdit: (id: number) => void; toast: ToastFn }) {
  const achievements = useAchievements();
  const refresh = useRefresh();
  const del = async (id: number) => {
    if (!confirm("Delete this achievement?")) return;
    try { await achievementsApi.delete(id); refresh(); toast({ title: "Deleted" }); }
    catch { toast({ title: "Error", variant: "destructive" }); }
  };
  if (!achievements.length) return <Empty label="achievement" />;
  return (
    <table className="w-full text-left text-sm">
      <thead className="bg-zinc-900/50 text-gray-400 border-b border-white/10">
        <tr><th className="p-3">Title</th><th className="p-3">Year</th><th className="p-3">Category</th><th className="p-3 text-right">Actions</th></tr>
      </thead>
      <tbody>
        {achievements.map(item => (
          <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
            <td className="p-3 font-medium text-white">{item.title}</td>
            <td className="p-3 text-gray-400">{item.year}</td>
            <td className="p-3 text-gray-400">{item.category || "-"}</td>
            <td className="p-3">
              <div className="flex justify-end space-x-2">
                <Button variant="ghost" size="icon" onClick={() => onEdit(item.id)} className="h-8 w-8 text-gray-400 hover:text-white"><Edit className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => del(item.id)} className="h-8 w-8 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function AchievementForm({ editingId, onDone, toast }: { editingId: number | null; onDone: () => void; toast: ToastFn }) {
  const all = useAchievements();
  const allPlayers = usePlayers();
  const refresh = useRefresh();
  const existing = editingId ? all.find(a => a.id === editingId) : undefined;
  const [title, setTitle] = useState(existing?.title ?? "");
  const [shortDesc, setShortDesc] = useState(existing?.shortDescription ?? "");
  const [longDesc, setLongDesc] = useState(existing?.longDescription ?? "");
  const [year, setYear] = useState(existing?.year?.toString() ?? new Date().getFullYear().toString());
  const [category, setCategory] = useState(existing?.category ?? "");
  const [mainImageUrl, setMainImageUrl] = useState(existing?.mainImageUrl ?? "");
  const [taggedPlayerIds, setTaggedPlayerIds] = useState<number[]>(existing?.taggedPlayerIds ?? []);
  const [saving, setSaving] = useState(false);

  const togglePlayer = (id: number) => setTaggedPlayerIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const save = async () => {
    if (!title.trim()) return toast({ title: "Title is required", variant: "destructive" });
    setSaving(true);
    try {
      const data = { title, shortDescription: shortDesc, longDescription: longDesc, year: parseInt(year), category: category || null, mainImageUrl: mainImageUrl || null, additionalImages: existing?.additionalImages ?? [], taggedPlayerIds };
      if (editingId) { await achievementsApi.update(editingId, data); toast({ title: "Achievement updated" }); }
      else { await achievementsApi.create(data); toast({ title: "Achievement added" }); }
      refresh();
      onDone();
    } catch { toast({ title: "Save failed", variant: "destructive" }); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-black text-white uppercase">{editingId ? "Edit Achievement" : "Add Achievement"}</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2"><Field label="Title"><input className={inputCls} value={title} onChange={e => setTitle(e.target.value)} /></Field></div>
        <Field label="Year"><input type="number" className={inputCls} value={year} onChange={e => setYear(e.target.value)} min="2000" max="2099" /></Field>
        <Field label="Category"><input className={inputCls} value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. National, State" /></Field>
      </div>
      <Field label="Short Description"><textarea className={textareaCls} rows={2} value={shortDesc} onChange={e => setShortDesc(e.target.value)} /></Field>
      <Field label="Long Description"><textarea className={textareaCls} value={longDesc} onChange={e => setLongDesc(e.target.value)} /></Field>
      <Field label="Main Image URL"><input className={inputCls} value={mainImageUrl} onChange={e => setMainImageUrl(e.target.value)} placeholder="https://..." /></Field>
      {allPlayers.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-3">Tag Players</p>
          <div className="flex flex-wrap gap-2">
            {allPlayers.map(p => (
              <button key={p.id} onClick={() => togglePlayer(p.id)} className={`px-3 py-1.5 rounded-full text-sm font-bold border transition-all ${taggedPlayerIds.includes(p.id) ? "bg-primary border-primary text-white" : "bg-zinc-800 border-white/10 text-gray-400 hover:border-white/30"}`}>
                {p.name}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="outline" onClick={onDone} className="border-white/10">Cancel</Button>
        <Button onClick={save} disabled={saving} className="bg-primary hover:bg-red-700">{saving ? "Saving..." : "Save"}</Button>
      </div>
    </div>
  );
}

// ── COMMITTEE ─────────────────────────────────────────────────────────────────
function CommitteeTable({ onEdit, toast }: { onEdit: (id: number) => void; toast: ToastFn }) {
  const committee = useCommitteeMembers();
  const refresh = useRefresh();
  const del = async (id: number) => {
    if (!confirm("Delete this member?")) return;
    try { await committeeApi.delete(id); refresh(); toast({ title: "Deleted" }); }
    catch { toast({ title: "Error", variant: "destructive" }); }
  };
  if (!committee.length) return <Empty label="committee member" />;
  return (
    <table className="w-full text-left text-sm">
      <thead className="bg-zinc-900/50 text-gray-400 border-b border-white/10">
        <tr><th className="p-3">Name</th><th className="p-3">Role</th><th className="p-3 text-right">Actions</th></tr>
      </thead>
      <tbody>
        {committee.map(item => (
          <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
            <td className="p-3 font-medium text-white">{item.name}</td>
            <td className="p-3 text-gray-400">{item.role}</td>
            <td className="p-3">
              <div className="flex justify-end space-x-2">
                <Button variant="ghost" size="icon" onClick={() => onEdit(item.id)} className="h-8 w-8 text-gray-400 hover:text-white"><Edit className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => del(item.id)} className="h-8 w-8 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function CommitteeForm({ editingId, onDone, toast }: { editingId: number | null; onDone: () => void; toast: ToastFn }) {
  const all = useCommitteeMembers();
  const refresh = useRefresh();
  const existing = editingId ? all.find(c => c.id === editingId) : undefined;
  const [name, setName] = useState(existing?.name ?? "");
  const [role, setRole] = useState(existing?.role ?? "");
  const [bio, setBio] = useState(existing?.bio ?? "");
  const [photoUrl, setPhotoUrl] = useState(existing?.photoUrl ?? "");
  const [order, setOrder] = useState(existing?.order?.toString() ?? "10");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!name.trim() || !role.trim()) return toast({ title: "Name and Role are required", variant: "destructive" });
    setSaving(true);
    try {
      const data = { name, role, bio: bio || null, photoUrl: photoUrl || null, order: parseInt(order) || 10 };
      if (editingId) { await committeeApi.update(editingId, data); toast({ title: "Member updated" }); }
      else { await committeeApi.create(data); toast({ title: "Member added" }); }
      refresh();
      onDone();
    } catch { toast({ title: "Save failed", variant: "destructive" }); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-black text-white uppercase">{editingId ? "Edit Member" : "Add Member"}</h2>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Name"><input className={inputCls} value={name} onChange={e => setName(e.target.value)} /></Field>
        <Field label="Role / Title"><input className={inputCls} value={role} onChange={e => setRole(e.target.value)} /></Field>
      </div>
      <Field label="Bio"><textarea className={textareaCls} value={bio} onChange={e => setBio(e.target.value)} rows={3} /></Field>
      <Field label="Photo URL"><input className={inputCls} value={photoUrl} onChange={e => setPhotoUrl(e.target.value)} placeholder="https://..." /></Field>
      <Field label="Display Order (lower = first)"><input type="number" className={inputCls} value={order} onChange={e => setOrder(e.target.value)} /></Field>
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="outline" onClick={onDone} className="border-white/10">Cancel</Button>
        <Button onClick={save} disabled={saving} className="bg-primary hover:bg-red-700">{saving ? "Saving..." : "Save"}</Button>
      </div>
    </div>
  );
}

// ── REVIEWS ──────────────────────────────────────────────────────────────────
function ReviewsTable({ onEdit, toast }: { onEdit: (id: number) => void; toast: ToastFn }) {
  const reviews = useReviews();
  const refresh = useRefresh();
  const del = async (id: number) => {
    if (!confirm("Delete this review?")) return;
    try { await reviewsApi.delete(id); refresh(); toast({ title: "Deleted" }); }
    catch { toast({ title: "Error", variant: "destructive" }); }
  };
  if (!reviews.length) return <Empty label="review" />;
  return (
    <table className="w-full text-left text-sm">
      <thead className="bg-zinc-900/50 text-gray-400 border-b border-white/10">
        <tr><th className="p-3">Author</th><th className="p-3">Rating</th><th className="p-3">Excerpt</th><th className="p-3 text-right">Actions</th></tr>
      </thead>
      <tbody>
        {reviews.map(item => (
          <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
            <td className="p-3 font-medium text-white">{item.authorName}</td>
            <td className="p-3 text-gray-400 flex items-center gap-1">
              {[...Array(5)].map((_, j) => <Star key={j} className={`w-3 h-3 ${j < item.rating ? "text-primary fill-primary" : "text-zinc-700"}`} />)}
            </td>
            <td className="p-3 text-gray-400 max-w-xs truncate">{item.content}</td>
            <td className="p-3">
              <div className="flex justify-end space-x-2">
                <Button variant="ghost" size="icon" onClick={() => onEdit(item.id)} className="h-8 w-8 text-gray-400 hover:text-white"><Edit className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => del(item.id)} className="h-8 w-8 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ReviewForm({ editingId, onDone, toast }: { editingId: number | null; onDone: () => void; toast: ToastFn }) {
  const all = useReviews();
  const refresh = useRefresh();
  const existing = editingId ? all.find(r => r.id === editingId) : undefined;
  const [authorName, setAuthorName] = useState(existing?.authorName ?? "");
  const [authorTitle, setAuthorTitle] = useState(existing?.authorTitle ?? "");
  const [content, setContent] = useState(existing?.content ?? "");
  const [rating, setRating] = useState(existing?.rating ?? 5);
  const [photoUrl, setPhotoUrl] = useState(existing?.photoUrl ?? "");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!authorName.trim() || !content.trim()) return toast({ title: "Author and content are required", variant: "destructive" });
    setSaving(true);
    try {
      const data = { authorName, authorTitle: authorTitle || null, content, rating, photoUrl: photoUrl || null };
      if (editingId) { await reviewsApi.update(editingId, data); toast({ title: "Review updated" }); }
      else { await reviewsApi.create(data); toast({ title: "Review added" }); }
      refresh();
      onDone();
    } catch { toast({ title: "Save failed", variant: "destructive" }); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-black text-white uppercase">{editingId ? "Edit Review" : "Add Review"}</h2>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Author Name"><input className={inputCls} value={authorName} onChange={e => setAuthorName(e.target.value)} /></Field>
        <Field label="Author Title (optional)"><input className={inputCls} value={authorTitle} onChange={e => setAuthorTitle(e.target.value)} placeholder="e.g. Parent, State Player" /></Field>
      </div>
      <Field label="Review Content"><textarea className={textareaCls} value={content} onChange={e => setContent(e.target.value)} /></Field>
      <Field label="Rating">
        <div className="flex gap-2 mt-1">
          {[1, 2, 3, 4, 5].map(n => (
            <button key={n} onClick={() => setRating(n)} className={`w-10 h-10 rounded-full border font-bold text-sm transition-all ${n <= rating ? "bg-primary border-primary text-white" : "bg-zinc-800 border-white/10 text-gray-400 hover:border-white/30"}`}>{n}</button>
          ))}
        </div>
      </Field>
      <Field label="Author Photo URL (optional)"><input className={inputCls} value={photoUrl} onChange={e => setPhotoUrl(e.target.value)} placeholder="https://..." /></Field>
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="outline" onClick={onDone} className="border-white/10">Cancel</Button>
        <Button onClick={save} disabled={saving} className="bg-primary hover:bg-red-700">{saving ? "Saving..." : "Save"}</Button>
      </div>
    </div>
  );
}

function Empty({ label }: { label: string }) {
  return <div className="py-8 text-center text-gray-400">No {label}s found. Click "Add New" to create one.</div>;
}
