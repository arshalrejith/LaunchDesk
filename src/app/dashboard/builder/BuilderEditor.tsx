"use client";

import { useState, useRef, useEffect } from "react";
import type { CSSProperties, ComponentType, DragEvent, MouseEvent as ReactMouseEvent } from "react";
import { ArrowDown, ArrowUp, ChevronDown, Copy, Eye, GripVertical, Monitor, Plus, Smartphone, Trash2, X, MousePointer2, ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import {
  SECTION_TYPES, PRESET_PALETTES, GOOGLE_FONTS_POPULAR, getGoogleFontHref, sectionDefaultsFor,
  HeroSection, StatsSection, FeaturesSection, ProductsSection, GallerySection,
  AboutSection, CtaSection, ContactSection, DividerSection,
  type BuilderSection, type BuilderSectionType, type RealProduct, type RealContact, FEATURE_ICON_OPTIONS, FeatureIcon, normalizeFeatureIcon,
} from "@/components/builder/sections";
import { saveBuilderPage, uploadBuilderImageAction } from "./actions";

const SECTION_RENDERERS: Record<BuilderSectionType, ComponentType<any>> = { // eslint-disable-line @typescript-eslint/no-explicit-any
  hero: HeroSection, stats: StatsSection, features: FeaturesSection,
  products: ProductsSection, gallery: GallerySection, about: AboutSection,
  cta: CtaSection, contact: ContactSection, divider: DividerSection,
};

// Section types whose real content (items/images/contact rows) is always
// pulled live from the business's actual data — the property panel below
// only lets a merchant edit heading/style for these, never fake items.
const REAL_DATA_TYPES = new Set<BuilderSectionType>(["products", "gallery", "contact"]);

function ImageUploadField({ label, value, onChange }: { label: string; value: string | null; onChange: (url: string | null) => void }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    const fd = new FormData();
    fd.set("file", file);
    const result = await uploadBuilderImageAction(fd);
    setUploading(false);
    if (result.error !== undefined) setError(result.error);
    else onChange(result.url ?? null);
  }

  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--builder-muted)", marginBottom: 4 }}>{label}</label>
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" style={{ width: "100%", borderRadius: 10, maxHeight: 140, objectFit: "cover", marginBottom: 6 }} />
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        style={{ display: "none" }}
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
      <div style={{ display: "flex", gap: 6 }}>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          style={{ flex: 1, padding: "0.5rem", background: "var(--builder-control-bg)", color: "var(--builder-text)", border: "1px dashed var(--builder-border)", borderRadius: 8, cursor: "pointer", fontSize: "0.78rem", fontWeight: 600 }}
        >
          {uploading ? "Uploading…" : value ? "Replace photo" : "Upload photo"}
        </button>
        {value && (
          <button type="button" onClick={() => onChange(null)} style={{ padding: "0.5rem 0.75rem", background: "var(--danger-50)", color: "var(--danger-500)", border: "none", borderRadius: 8, cursor: "pointer", fontSize: "0.78rem", fontWeight: 600 }}>
            Remove
          </button>
        )}
      </div>
      {error && <p style={{ color: "var(--danger-500)", fontSize: "0.72rem", marginTop: 4 }}>{error}</p>}
      <p style={{ color: "var(--builder-subtle)", fontSize: "0.68rem", marginTop: 4 }}>JPG, PNG or WEBP, up to 10MB.</p>
    </div>
  );
}

function PropertyEditor({ section, onChange, accent }: { section: BuilderSection; onChange: (s: BuilderSection) => void; accent: string }) {
  const [tab, setTab] = useState<"content" | "style">("content");
  const update = (key: string, val: unknown) => onChange({ ...section, content: { ...section.content, [key]: val } });
  const c = section.content;
  const ipt: CSSProperties = { width: "100%", padding: "0.55rem 0.7rem", borderRadius: 8, border: "1px solid var(--builder-border)", fontSize: "0.82rem", fontFamily: "inherit", boxSizing: "border-box", marginBottom: 8 };
  const lbl: CSSProperties = { display: "block", fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--builder-muted)", marginBottom: 4 };
  const tabBtn = (t: "content" | "style", label: string) => (
    <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "0.5rem", background: tab === t ? accent : "transparent", color: tab === t ? "#fff" : "var(--builder-muted)", border: "none", borderRadius: 8, cursor: "pointer", fontSize: "0.75rem", fontWeight: 600 }}>{label}</button>
  );

  return (
    <div style={{ height: "100%", overflowY: "auto", padding: "1rem" }}>
      <div style={{ display: "flex", gap: 4, marginBottom: "1rem", background: "var(--builder-control-bg)", borderRadius: 10, padding: 4 }}>
        {tabBtn("content", "Content")} {tabBtn("style", "Style")}
      </div>

      {tab === "content" && (
        <div>
          {REAL_DATA_TYPES.has(section.type) && (
            <div style={{ background: "var(--builder-info-bg)", border: "1px solid var(--builder-info-border)", borderRadius: 8, padding: "0.65rem 0.75rem", marginBottom: 10, fontSize: "0.76rem", color: "var(--builder-info-text)", lineHeight: 1.5 }}>
              {section.type === "products" && <>This always shows your real products. Manage them from <Link href="/dashboard/products" style={{ fontWeight: 700, textDecoration: "underline" }}>Products</Link>.</>}
              {section.type === "gallery" && <>This always shows your real photos. Manage them from <Link href="/dashboard/gallery" style={{ fontWeight: 700, textDecoration: "underline" }}>Gallery</Link>.</>}
              {section.type === "contact" && <>This always shows your real phone/WhatsApp/address. Update them from <Link href="/dashboard/business" style={{ fontWeight: 700, textDecoration: "underline" }}>Business details</Link>.</>}
            </div>
          )}
          <label style={lbl}>Heading</label>
          {(section.type === "hero" || section.type === "cta") ? (
            <>
              <input style={ipt} value={c.headline || c.heading || ""} onChange={(e) => update(section.type === "hero" ? "headline" : "heading", e.target.value)} />
              <label style={lbl}>Subline</label>
              <textarea style={{ ...ipt, height: 70, resize: "vertical" }} value={c.subline || ""} onChange={(e) => update("subline", e.target.value)} />
              <label style={lbl}>Primary Button</label>
              <input style={ipt} value={c.cta || ""} onChange={(e) => update("cta", e.target.value)} placeholder="Leave blank to hide" />
              {section.type === "hero" && (
                <>
                  <label style={lbl}>Secondary Button</label>
                  <input style={ipt} value={c.cta2 || ""} onChange={(e) => update("cta2", e.target.value)} placeholder="Leave blank to hide" />
                  <ImageUploadField label="Background Photo" value={c.image ?? null} onChange={(url) => update("image", url)} />
                </>
              )}
            </>
          ) : (
            <input style={ipt} value={c.heading || ""} onChange={(e) => update("heading", e.target.value)} />
          )}

          {section.type === "about" && (
            <>
              <label style={lbl}>Text</label>
              <textarea style={{ ...ipt, height: 100, resize: "vertical" }} value={c.text || ""} onChange={(e) => update("text", e.target.value)} />
              <ImageUploadField label="Photo" value={c.image ?? null} onChange={(url) => update("image", url)} />
            </>
          )}

          {section.type === "features" && (
            <>
              {c.items?.map((item: { icon: string; title: string; desc: string }, i: number) => (
                <div key={i} style={{ background: "var(--builder-control-bg)", borderRadius: 8, padding: "0.75rem", marginBottom: 8 }}>
                  <div style={{ display: "flex", gap: 6, marginBottom: 4 }}>
                    <div style={{ position: "relative", width: 54, flexShrink: 0 }}>
                      <select aria-label={`Feature ${i + 1} icon`} style={{ ...ipt, width: 96, marginBottom: 0, padding: "0.48rem 1.55rem 0.48rem 2rem", appearance: "auto", cursor: "pointer", color: "var(--builder-text)" }} value={normalizeFeatureIcon(item.icon)} onChange={(e) => { const items = [...c.items]; items[i] = { ...items[i], icon: e.target.value }; update("items", items); }}>
                        {FEATURE_ICON_OPTIONS.map(({ name }) => <option key={name} value={name}>{name}</option>)}
                      </select>
                      <span style={{ position: "absolute", left: 9, top: 0, bottom: 0, display: "flex", alignItems: "center", pointerEvents: "none", color: accent }}><FeatureIcon name={item.icon} size={19} /></span>
                    </div>
                    <input style={{ ...ipt, flex: 1, marginBottom: 0 }} placeholder="Title" value={item.title} onChange={(e) => { const items = [...c.items]; items[i] = { ...items[i], title: e.target.value }; update("items", items); }} />
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <input style={{ ...ipt, flex: 1, marginBottom: 0 }} placeholder="Description" value={item.desc} onChange={(e) => { const items = [...c.items]; items[i] = { ...items[i], desc: e.target.value }; update("items", items); }} />
                    <button onClick={() => update("items", c.items.filter((_: unknown, idx: number) => idx !== i))} style={{ background: "none", border: "none", color: "var(--danger-500)", cursor: "pointer", padding: 4 }} aria-label="Remove feature"><Trash2 size={15} /></button>
                  </div>
                </div>
              ))}
              <button onClick={() => update("items", [...(c.items || []), { icon: "CheckCircle2", title: "New Feature", desc: "Description here." }])} style={{ width: "100%", padding: "0.5rem", background: `${accent}15`, color: accent, border: `1px dashed ${accent}55`, borderRadius: 8, cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}><Plus size={14} /> Add Feature</button>
            </>
          )}

          {section.type === "stats" && c.stats?.map((st: { number: string; label: string }, i: number) => (
            <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
              <input style={{ ...ipt, flex: 1, marginBottom: 0 }} placeholder="Number" value={st.number} onChange={(e) => { const stats = [...c.stats]; stats[i] = { ...stats[i], number: e.target.value }; update("stats", stats); }} />
              <input style={{ ...ipt, flex: 1, marginBottom: 0 }} placeholder="Label" value={st.label} onChange={(e) => { const stats = [...c.stats]; stats[i] = { ...stats[i], label: e.target.value }; update("stats", stats); }} />
            </div>
          ))}

          {section.type === "divider" && (
            <>
              <label style={lbl}>Label (optional)</label>
              <input style={ipt} value={c.label || ""} onChange={(e) => update("label", e.target.value)} />
            </>
          )}
        </div>
      )}

      {tab === "style" && (
        <div>
          <label style={lbl}>Background Color</label>
          <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center" }}>
            <input type="color" value={c.bgColor || "#ffffff"} onChange={(e) => update("bgColor", e.target.value)} style={{ width: 40, height: 36, border: "1px solid var(--builder-border)", borderRadius: 8, cursor: "pointer", padding: 2 }} />
            <input style={{ ...ipt, flex: 1, marginBottom: 0, fontFamily: "monospace" }} value={c.bgColor || ""} onChange={(e) => update("bgColor", e.target.value)} />
          </div>
          <label style={lbl}>Text Color</label>
          <div style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "center" }}>
            <input type="color" value={c.textColor || "#0f0f13"} onChange={(e) => update("textColor", e.target.value)} style={{ width: 40, height: 36, border: "1px solid var(--builder-border)", borderRadius: 8, cursor: "pointer", padding: 2 }} />
            <input style={{ ...ipt, flex: 1, marginBottom: 0, fontFamily: "monospace" }} value={c.textColor || ""} onChange={(e) => update("textColor", e.target.value)} />
          </div>
          <label style={lbl}>Quick Palettes</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {PRESET_PALETTES.map((p) => (
              <button key={p.name} onClick={() => { update("bgColor", p.bg); update("textColor", p.text); }} style={{ display: "flex", alignItems: "center", gap: 6, padding: "0.4rem 0.6rem", background: p.bg, border: `1px solid ${p.accent}44`, borderRadius: 8, cursor: "pointer", fontSize: "0.7rem", fontWeight: 600, color: p.text }}>
                <span style={{ width: 14, height: 14, borderRadius: "50%", background: p.accent, flexShrink: 0 }} />
                {p.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function FontPicker({ value, onChange }: { value: string; onChange: (f: string) => void }) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const filtered = GOOGLE_FONTS_POPULAR.filter((f) => f.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = getGoogleFontHref(value);
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, [value]);

  return (
    <div ref={rootRef} style={{ position: "relative" }}>
      <button type="button" onClick={() => setOpen(!open)} style={{ width: "100%", padding: "0.55rem 0.75rem", background: "var(--builder-surface)", color: "var(--builder-text)", border: "1px solid var(--builder-border)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", fontSize: "0.82rem", fontFamily: value }}>
        <span style={{ fontFamily: value }}>{value}</span>
        <span style={{ color: "var(--builder-muted)", fontSize: "0.7rem" }}><ChevronDown size={14} /></span>
      </button>
      {open && (
        <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "var(--builder-surface)", color: "var(--builder-text)", border: "1px solid var(--builder-border)", borderRadius: 10, boxShadow: "var(--shadow-lg)", zIndex: 100, maxHeight: 280, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "0.5rem" }}>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search fonts…" style={{ width: "100%", padding: "0.45rem 0.6rem", border: "1px solid var(--builder-border)", background: "var(--builder-control-bg)", color: "var(--builder-text)", borderRadius: 6, fontSize: "0.8rem", boxSizing: "border-box" }} autoFocus />
          </div>
          <div style={{ overflowY: "auto", flex: 1 }}>
            {filtered.map((font) => (
              <div key={font} onClick={() => { onChange(font); setOpen(false); }} style={{ padding: "0.55rem 0.85rem", cursor: "pointer", fontSize: "0.88rem", fontFamily: font, background: value === font ? "var(--builder-control-bg)" : "transparent", fontWeight: value === font ? 700 : 400 }}>
                {font}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function BuilderEditor({
  initialSections, initialAccent, initialFont, isActiveTemplate, realProducts, realImages, realContact, currency, locale, itemLabel,
}: {
  initialSections: BuilderSection[];
  initialAccent: string;
  initialFont: string;
  isActiveTemplate: boolean;
  realProducts: RealProduct[];
  realImages: string[];
  realContact: RealContact;
  currency?: string;
  locale?: string;
  itemLabel?: string;
}) {
  const [sections, setSections] = useState<BuilderSection[]>(initialSections);
  const [selected, setSelected] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [accent, setAccent] = useState(initialAccent);
  const [font, setFont] = useState(initialFont);
  const [previewMode, setPreviewMode] = useState(false);
  const [leftTab, setLeftTab] = useState<"blocks" | "layers">("blocks");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [isDirty, setIsDirty] = useState(false);
  const [zoom, setZoom] = useState(100);
  const itemLabelText = itemLabel || "Product";

  const selectedSection = sections.find((s) => s.id === selected) ?? null;

  function handleNavigationClick(event: ReactMouseEvent<HTMLDivElement>) {
    if (!isDirty) return;
    const target = event.target as HTMLElement;
    const anchor = target.closest("a");
    const href = anchor?.getAttribute("href");
    if (!href || !href.startsWith("/")) return;
    if (!window.confirm("You have unsaved changes. Leave without saving?")) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirty) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  function addSection(type: BuilderSectionType) {
    const newSection: BuilderSection = { id: `s-${crypto.randomUUID()}`, type, locked: false, content: sectionDefaultsFor(type, accent) };
    setSections((prev) => [...prev, newSection]);
    setIsDirty(true);
    setSelected(newSection.id);
  }

  function updateSection(updated: BuilderSection) {
    setSections((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    setIsDirty(true);
  }

  function deleteSection(id: string) {
    setSections((prev) => prev.filter((s) => s.id !== id));
    setIsDirty(true);
    if (selected === id) setSelected(null);
  }

  function moveSection(id: string, dir: "up" | "down") {
    setIsDirty(true);
    setSections((prev) => {
      const idx = prev.findIndex((s) => s.id === id);
      if (dir === "up" && idx > 0) {
        const arr = [...prev]; [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
        return arr;
      }
      if (dir === "down" && idx < prev.length - 1) {
        const arr = [...prev]; [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
        return arr;
      }
      return prev;
    });
  }

  function duplicateSection(id: string) {
    const sec = sections.find((s) => s.id === id);
    if (!sec) return;
    const dup = { ...sec, id: `s-${crypto.randomUUID()}`, content: { ...sec.content } };
    setSections((prev) => { const idx = prev.findIndex((s) => s.id === id); const arr = [...prev]; arr.splice(idx + 1, 0, dup); return arr; });
    setSelected(dup.id);
    setIsDirty(true);
  }

  function handleDragStart(id: string) { setDragging(id); }
  function handleDragOver(e: DragEvent, id: string) { e.preventDefault(); if (id !== dragging) setDragOver(id); }
  function handleDrop(e: DragEvent, targetId: string) {
    e.preventDefault();
    if (!dragging || dragging === targetId) { setDragging(null); setDragOver(null); return; }
    setSections((prev) => {
      const from = prev.findIndex((s) => s.id === dragging);
      const to = prev.findIndex((s) => s.id === targetId);
      if (from < 0 || to < 0) return prev;
      const arr = [...prev]; const [item] = arr.splice(from, 1); arr.splice(to, 0, item); return arr;
    });
    setIsDirty(true);
    setDragging(null); setDragOver(null);
  }

  function handleAccentChange(value: string) {
    setAccent(value);
    setIsDirty(true);
  }

  function handleFontChange(value: string) {
    setFont(value);
    setIsDirty(true);
  }

  async function handleSave() {
    setSaveState("saving");
    try {
      await saveBuilderPage({ sections, accent, font });
      setSaveState("saved");
      setIsDirty(false);
      setTimeout(() => setSaveState("idle"), 2500);
    } catch {
      setSaveState("error");
    }
  }

  const sideW = 280;
  const propW = 300;
  const toolbarH = isActiveTemplate ? 56 : 92;

  return (
    <div onClickCapture={handleNavigationClick} style={{ display: "flex", flexDirection: "column", height: "100%", fontFamily: "'Inter', ui-sans-serif, sans-serif", background: "var(--builder-bg)", color: "var(--builder-text)", fontSize: 13, overflow: "hidden" }}>
      <div style={{ flexShrink: 0, zIndex: 20 }}>
        {!isActiveTemplate && (
          <div style={{ background: "var(--builder-warning-bg)", color: "var(--builder-warning-text)", padding: "0.5rem 1rem", fontSize: "0.78rem", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span>This design isn&rsquo;t live yet — customers see whichever template is active on <Link href="/dashboard/website" style={{ color: "var(--builder-warning-text)", fontWeight: 700, textDecoration: "underline" }}>Website Design</Link>. Save here, then set the active design to &ldquo;Custom (Visual Builder)&rdquo;.</span>
          </div>
        )}
        <div style={{ height: toolbarH - (isActiveTemplate ? 0 : 36), background: "var(--builder-toolbar)", borderBottom: "1px solid var(--builder-border)", display: "flex", alignItems: "center", padding: "0 1rem", gap: "0.75rem" }}>
          <div style={{ fontWeight: 800, fontSize: "0.95rem", letterSpacing: "-0.02em", color: "var(--builder-text)", marginRight: "0.5rem" }}>
            <Sparkles size={15} strokeWidth={2.2} style={{ color: accent }} /> Page Builder
          </div>

          <div style={{ display: "flex", gap: 4, background: "var(--builder-control-bg)", borderRadius: 8, padding: 3 }}>
            {[["desktop", "Desktop"], ["tablet", "Tablet"]].map(([m, l]) => (
              <button key={m} onClick={() => setZoom(m === "desktop" ? 100 : 75)} style={{ padding: "0.3rem 0.7rem", borderRadius: 6, border: "none", background: zoom === (m === "desktop" ? 100 : 75) ? "var(--builder-control-active)" : "transparent", color: "var(--builder-muted)", cursor: "pointer", fontSize: "0.75rem", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6 }}>
                {m === "desktop" ? <Monitor size={14} /> : <Smartphone size={14} />} {l}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: "auto" }}>
            <span style={{ fontSize: "0.72rem", color: "var(--builder-muted)" }}>Accent</span>
            <input type="color" value={accent} onChange={(e) => handleAccentChange(e.target.value)} style={{ width: 30, height: 28, border: "none", borderRadius: 6, cursor: "pointer", background: "none", padding: 0 }} />

            <span style={{ fontSize: "0.72rem", color: "var(--builder-muted)", marginLeft: 8 }}>Font</span>
            <div style={{ width: 180 }}><FontPicker value={font} onChange={handleFontChange} /></div>

            <button onClick={() => setPreviewMode(!previewMode)} style={{ padding: "0.4rem 1rem", background: previewMode ? "var(--builder-control-active)" : "transparent", border: "1px solid var(--builder-border)", borderRadius: 8, color: "var(--builder-muted)", cursor: "pointer", fontSize: "0.78rem", fontWeight: 600, marginLeft: 8 }}>
              {previewMode ? <><ArrowLeft size={14} /> Edit</> : <><Eye size={14} /> Preview</>}
            </button>

            <button onClick={handleSave} disabled={saveState === "saving"} style={{ padding: "0.4rem 1.1rem", background: saveState === "saved" ? "#10b981" : saveState === "error" ? "#dc2626" : accent, border: "none", borderRadius: 8, color: "#fff", cursor: "pointer", fontSize: "0.78rem", fontWeight: 700 }}>
              {saveState === "saving" ? "Saving…" : saveState === "saved" ? "Saved" : saveState === "error" ? "Couldn't save — retry" : isDirty ? "Save changes" : "Saved"}
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {!previewMode && (
          <div style={{ width: sideW, background: "var(--builder-panel)", borderRight: "1px solid var(--builder-border)", display: "flex", flexDirection: "column", flexShrink: 0 }}>
            <div style={{ display: "flex", borderBottom: "1px solid var(--builder-border)" }}>
              {(["blocks", "layers"] as const).map((t) => (
                <button key={t} onClick={() => setLeftTab(t)} style={{ flex: 1, padding: "0.7rem", background: leftTab === t ? "var(--builder-control-active)" : "transparent", border: "none", color: leftTab === t ? "var(--builder-text)" : "var(--builder-muted)", cursor: "pointer", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{t}</button>
              ))}
            </div>

            {leftTab === "blocks" && (
              <div style={{ padding: "0.75rem", overflowY: "auto", flex: 1 }}>
                <p style={{ fontSize: "0.67rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--builder-subtle)", marginBottom: "0.6rem" }}>Add Section</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                  {SECTION_TYPES.map(({ type, icon: Icon, label }) => (
                    <button key={type} onClick={() => addSection(type)} style={{ padding: "0.65rem 0.5rem", background: "var(--builder-control-bg)", border: "1px solid var(--builder-border)", borderRadius: 10, color: "var(--builder-muted)", cursor: "pointer", fontSize: "0.75rem", fontWeight: 600, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <span style={{ display: "inline-flex", color: accent }}><Icon size={20} strokeWidth={1.8} /></span>
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
                <div style={{ marginTop: "1.25rem", paddingTop: "1rem", borderTop: "1px solid var(--builder-border)" }}>
                  <p style={{ fontSize: "0.67rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--builder-subtle)", marginBottom: "0.6rem" }}>Palette Presets</p>
                  {PRESET_PALETTES.map((p) => (
                    <button key={p.name} onClick={() => setAccent(p.accent)} style={{ width: "100%", marginBottom: 4, padding: "0.45rem 0.7rem", background: "var(--builder-control-bg)", border: `1px solid ${accent === p.accent ? p.accent + "88" : "var(--builder-border)"}`, borderRadius: 8, color: "var(--builder-muted)", cursor: "pointer", fontSize: "0.78rem", fontWeight: 600, display: "flex", alignItems: "center", gap: 8, textAlign: "left" }}>
                      <span style={{ width: 16, height: 16, borderRadius: "50%", background: p.accent, flexShrink: 0 }} />
                      {p.name}
                      {accent === p.accent && <span style={{ marginLeft: "auto", color: p.accent, fontSize: "0.7rem" }}>✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {leftTab === "layers" && (
              <div style={{ padding: "0.75rem", overflowY: "auto", flex: 1 }}>
                <p style={{ fontSize: "0.67rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--builder-subtle)", marginBottom: "0.6rem" }}>Page Layers — drag to reorder</p>
                {sections.map((sec, idx) => {
                  const meta = SECTION_TYPES.find((t) => t.type === sec.type);
                  return (
                    <div key={sec.id} draggable={!previewMode} onDragStart={() => handleDragStart(sec.id)} onDragOver={(e) => handleDragOver(e, sec.id)} onDrop={(e) => handleDrop(e, sec.id)}
                      onClick={() => setSelected(sec.id)}
                      style={{ marginBottom: 4, padding: "0.55rem 0.65rem", background: selected === sec.id ? `${accent}33` : dragOver === sec.id ? "var(--builder-control-active)" : "var(--builder-control-bg)", border: `1px solid ${selected === sec.id ? `${accent}66` : "var(--builder-border)"}`, borderRadius: 8, cursor: "grab", display: "flex", alignItems: "center", gap: 8, color: "var(--builder-text)", fontSize: "0.8rem", fontWeight: 600, userSelect: "none" }}>
                      <GripVertical size={15} strokeWidth={2} color="var(--builder-subtle)" />
                      {meta?.icon && <meta.icon size={16} strokeWidth={1.8} />}
                      <span style={{ flex: 1 }}>{meta?.label || sec.type}</span>
                      <div style={{ display: "flex", gap: 2 }}>
                        <button onClick={(e) => { e.stopPropagation(); moveSection(sec.id, "up"); }} disabled={idx === 0} style={{ background: "none", border: "none", color: "var(--builder-subtle)", cursor: idx === 0 ? "default" : "pointer", padding: 3, opacity: idx === 0 ? 0.35 : 1 }} aria-label="Move section up"><ArrowUp size={14} /></button>
                        <button onClick={(e) => { e.stopPropagation(); moveSection(sec.id, "down"); }} disabled={idx === sections.length - 1} style={{ background: "none", border: "none", color: "var(--builder-subtle)", cursor: idx === sections.length - 1 ? "default" : "pointer", padding: 3, opacity: idx === sections.length - 1 ? 0.35 : 1 }} aria-label="Move section down"><ArrowDown size={14} /></button>
                        <button onClick={(e) => { e.stopPropagation(); deleteSection(sec.id); }} style={{ background: "none", border: "none", color: "var(--builder-subtle)", cursor: "pointer", padding: 3 }} aria-label="Delete section"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <div style={{ flex: 1, overflowY: "auto", background: "var(--builder-canvas)", padding: "1.5rem" }}>
          <div style={{ maxWidth: zoom === 75 ? 768 : "100%", margin: "0 auto", background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.5)" }}>
            {sections.length === 0 && (
              <div style={{ height: 400, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1rem", color: "var(--builder-subtle)" }}>
                <Sparkles size={40} strokeWidth={1.5} style={{ color: accent, opacity: 0.8 }} />
                <p style={{ fontWeight: 700, fontSize: "1.1rem" }}>Your canvas is empty</p>
                <p style={{ fontSize: "0.85rem" }}>Add sections from the left panel to build your page</p>
              </div>
            )}
            {sections.map((sec, idx) => {
              const Renderer = SECTION_RENDERERS[sec.type];
              if (!Renderer) return null;
              const extra =
                sec.type === "products" ? { products: realProducts, catalogueHref: null, currency, locale, itemLabel: itemLabelText } :
                sec.type === "gallery" ? { images: realImages } :
                sec.type === "contact" ? { contact: realContact } : {};
              return (
                <div key={sec.id} draggable={!previewMode} onDragStart={() => handleDragStart(sec.id)} onDragOver={(e) => handleDragOver(e, sec.id)} onDrop={(e) => handleDrop(e, sec.id)}
                  style={{ position: "relative", cursor: previewMode ? "default" : "pointer", outline: !previewMode && selected === sec.id ? `2px solid ${accent}` : "none", outlineOffset: -2, opacity: dragging === sec.id ? 0.5 : 1, borderTop: dragOver === sec.id ? `3px solid ${accent}` : "3px solid transparent" }}
                  onClick={() => !previewMode && setSelected(sec.id === selected ? null : sec.id)}>
                  <Renderer content={sec.content} accent={accent} font={font} interactive={previewMode} {...extra} />
                  {!previewMode && selected === sec.id && (
                    <div style={{ position: "absolute", top: 8, right: 8, display: "flex", gap: 4, zIndex: 10 }}>
                      {([[<ArrowUp size={14} />, () => moveSection(sec.id, "up"), idx === 0, "Move section up"], [<ArrowDown size={14} />, () => moveSection(sec.id, "down"), idx === sections.length - 1, "Move section down"], [<Copy size={14} />, () => duplicateSection(sec.id), false, "Duplicate section"], [<Trash2 size={14} />, () => deleteSection(sec.id), false, "Delete section"]] as const).map(([icon, fn, disabled, label]) => (
                        <button key={label} aria-label={label} title={label} onClick={(e) => { e.stopPropagation(); fn(); }} disabled={disabled} style={{ width: 30, height: 30, background: disabled ? "rgba(0,0,0,0.3)" : label === "Delete section" ? "#ef4444" : accent, color: "#fff", border: "none", borderRadius: 6, cursor: disabled ? "default" : "pointer", fontWeight: 800, fontSize: "0.8rem", display: "flex", alignItems: "center", justifyContent: "center", opacity: disabled ? 0.4 : 1 }}>{icon}</button>
                      ))}
                    </div>
                  )}
                  {!previewMode && selected === sec.id && (
                    <div style={{ position: "absolute", top: 8, left: 8, background: accent, color: "#fff", fontSize: "0.65rem", fontWeight: 700, padding: "0.2rem 0.5rem", borderRadius: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{SECTION_TYPES.find((t) => t.type === sec.type)?.label}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {!previewMode && selectedSection && (
          <div style={{ width: propW, background: "var(--builder-panel)", borderLeft: "1px solid var(--builder-border)", display: "flex", flexDirection: "column", flexShrink: 0 }}>
            <div style={{ padding: "0.85rem 1rem", borderBottom: "1px solid var(--builder-border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--builder-subtle)" }}>Edit Section</p>
                <p style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--builder-text)", marginTop: 1, display: "flex", alignItems: "center", gap: 7 }}>{(() => { const Icon = SECTION_TYPES.find((t) => t.type === selectedSection.type)?.icon; return Icon ? <Icon size={16} /> : null; })()} {SECTION_TYPES.find((t) => t.type === selectedSection.type)?.label}</p>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: "var(--builder-control-active)", border: "none", color: "var(--builder-muted)", cursor: "pointer", borderRadius: 6, width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center" }} aria-label="Close section editor"><X size={14} /></button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", color: "var(--builder-muted)" }}>
              <PropertyEditor section={selectedSection} onChange={updateSection} accent={accent} />
            </div>
          </div>
        )}

        {!previewMode && !selectedSection && (
          <div style={{ width: propW, background: "var(--builder-panel)", borderLeft: "1px solid var(--builder-border)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.75rem", flexShrink: 0, color: "var(--builder-subtle)" }}>
            <MousePointer2 size={36} strokeWidth={1.5} style={{ color: accent, opacity: 0.8 }} />
            <p style={{ fontSize: "0.85rem", fontWeight: 600, textAlign: "center", lineHeight: 1.4 }}>Click any section<br />to edit its properties</p>
          </div>
        )}
      </div>
    </div>
  );
}
