"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import type { SiteCopy } from "@/app/lib/site-data";
import { cardClass, fieldClass } from "./ui";

const copyGroups: { title: string; keys: (keyof SiteCopy)[] }[] = [
  {
    title: "Landing page",
    keys: [
      "landingHeadline",
      "landingSubtitle",
      "brandEyebrow",
      "brandTitle",
      "brandBody",
      "brandCloser",
      "shopEyebrow",
      "shopFoodTitle",
      "shopApparelTitle",
      "shopHealthTitle",
      "landingCloseEyebrow",
      "landingCloseTitle",
      "landingCloseBody",
      "landingCloseCta",
      "testimonialsEyebrow",
      "testimonialsTitle",
      "testimonialsTitleGold",
    ],
  },
  {
    title: "Landing carousel",
    keys: [
      "heroFoodLabel",
      "heroFoodBrand",
      "heroFoodCta",
      "heroFoodCaption1",
      "heroFoodCaption2",
      "heroFoodCaption3",
      "heroFoodCaption4",
      "heroHealthLabel",
      "heroHealthBrand",
      "heroHealthCta",
      "heroHealthCaption1",
      "heroHealthCaption2",
      "heroHealthCaption3",
    ],
  },
  {
    title: "Apparel",
    keys: [
      "apparelEyebrow",
      "apparelTitle",
      "apparelIntro",
      "apparelBand1Title",
      "apparelBand1Body",
      "apparelBand2Title",
      "apparelBand2Body",
      "apparelCollectionTitle",
      "apparelCollectionBody",
      "apparelCloseTitle",
      "apparelCloseBody",
    ],
  },
  {
    title: "Foods",
    keys: [
      "foodEyebrow",
      "foodTitle",
      "foodIntro",
      "foodBand1Title",
      "foodBand1Body",
      "foodBand2Title",
      "foodBand2Body",
      "foodCollectionTitle",
      "foodCollectionBody",
      "foodCloseTitle",
      "foodCloseBody",
    ],
  },
  {
    title: "Health",
    keys: [
      "healthEyebrow",
      "healthTitle",
      "healthIntro",
      "healthCollectionTitle",
      "healthCollectionBody",
      "healthCloseTitle",
      "healthCloseBody",
    ],
  },
  {
    title: "About",
    keys: [
      "aboutEyebrow",
      "aboutTitle",
      "aboutBody1",
      "aboutBody2",
      "aboutBody3",
      "aboutVision",
      "aboutMission",
      "aboutValuesTitle",
      "aboutValuesIntro",
      "aboutFutureTitle",
      "aboutFutureBody",
      "aboutCloseTitle",
      "aboutCloseBody",
    ],
  },
  {
    title: "Contact",
    keys: ["contactEyebrow", "contactTitle", "contactIntro", "contactReplyNote"],
  },
];

const labels: Record<keyof SiteCopy, string> = {
  landingHeadline: "Headline under the carousel",
  landingSubtitle: "Line under the headline",
  brandEyebrow: "Brand band small line",
  brandTitle: "Brand band title",
  brandBody: "Brand band story",
  brandCloser: "Brand band closing line",
  shopEyebrow: "Shop rows small line",
  shopFoodTitle: "Food row title",
  shopApparelTitle: "Apparel row title",
  shopHealthTitle: "Health row title",
  landingCloseEyebrow: "Bottom band small line",
  landingCloseTitle: "Bottom band title",
  landingCloseBody: "Bottom band writing",
  landingCloseCta: "Bottom band button",
  apparelEyebrow: "Small line",
  apparelTitle: "Page title",
  apparelIntro: "Intro paragraph",
  apparelBand1Title: "First cream title",
  apparelBand1Body: "First cream writing",
  apparelBand2Title: "Second cream title",
  apparelBand2Body: "Second cream writing",
  apparelCollectionTitle: "Collection title",
  apparelCollectionBody: "Collection writing",
  apparelCloseTitle: "Bottom title",
  apparelCloseBody: "Bottom writing",
  foodEyebrow: "Small line",
  foodTitle: "Page title",
  foodIntro: "Intro paragraph",
  foodBand1Title: "First cream title",
  foodBand1Body: "First cream writing",
  foodBand2Title: "Second cream title",
  foodBand2Body: "Second cream writing",
  foodCollectionTitle: "Kitchen title",
  foodCollectionBody: "Kitchen writing",
  foodCloseTitle: "Bottom title",
  foodCloseBody: "Bottom writing",
  healthEyebrow: "Small line",
  healthTitle: "Page title",
  healthIntro: "Intro paragraph",
  healthCollectionTitle: "Collection title",
  healthCollectionBody: "Collection writing",
  healthCloseTitle: "Bottom title",
  healthCloseBody: "Bottom writing",
  heroFoodLabel: "Food card tag",
  heroFoodBrand: "Food card title",
  heroFoodCta: "Food card button",
  heroFoodCaption1: "Food photo 1 caption",
  heroFoodCaption2: "Food photo 2 caption",
  heroFoodCaption3: "Food photo 3 caption",
  heroFoodCaption4: "Food photo 4 caption",
  heroHealthLabel: "Health card tag",
  heroHealthBrand: "Health card title",
  heroHealthCta: "Health card button",
  heroHealthCaption1: "Health video caption",
  heroHealthCaption2: "Health photo 2 caption",
  heroHealthCaption3: "Health photo 3 caption",
  testimonialsEyebrow: "Reviews small line",
  testimonialsTitle: "Reviews title",
  testimonialsTitleGold: "Reviews title, gold words",
  aboutEyebrow: "Small line",
  aboutTitle: "Page title",
  aboutBody1: "Story paragraph 1",
  aboutBody2: "Story paragraph 2",
  aboutBody3: "Story paragraph 3",
  aboutVision: "Vision",
  aboutMission: "Mission",
  aboutValuesTitle: "Values title",
  aboutValuesIntro: "Values line",
  aboutFutureTitle: "Future title",
  aboutFutureBody: "Future writing",
  aboutCloseTitle: "Bottom title",
  aboutCloseBody: "Bottom writing",
  contactEyebrow: "Small line",
  contactTitle: "Page title",
  contactIntro: "Intro paragraph",
  contactReplyNote: "Email reply note",
};

const longKeys = new Set<keyof SiteCopy>([
  "brandBody",
  "landingCloseBody",
  "apparelIntro",
  "apparelBand1Body",
  "apparelBand2Body",
  "apparelCollectionBody",
  "apparelCloseBody",
  "foodIntro",
  "foodBand1Body",
  "foodBand2Body",
  "foodCollectionBody",
  "foodCloseBody",
  "healthIntro",
  "healthCollectionBody",
  "healthCloseBody",
  "aboutBody1",
  "aboutBody2",
  "aboutBody3",
  "aboutVision",
  "aboutMission",
  "aboutFutureBody",
  "aboutCloseBody",
  "contactIntro",
]);

export default function CopyView({
  copy,
  query,
  onChange,
  onSave,
}: {
  copy: SiteCopy;
  query: string;
  onChange: (next: SiteCopy) => void;
  onSave: () => Promise<void>;
}) {
  const [groupTitle, setGroupTitle] = useState(copyGroups[0].title);
  const [saving, setSaving] = useState(false);
  const needle = query.toLowerCase();
  const group = copyGroups.find((g) => g.title === groupTitle)!;
  const keys = needle
    ? copyGroups
        .flatMap((g) => g.keys)
        .filter((key) => `${labels[key]} ${copy[key]}`.toLowerCase().includes(needle))
    : group.keys;

  const save = async () => {
    setSaving(true);
    await onSave();
    setSaving(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-display text-3xl sm:text-4xl font-bold text-nayo-black">
            Page writing
          </h1>
          <p className="mt-1 text-sm text-nayo-black/55">
            Headlines and paragraphs across the site.
          </p>
        </div>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="btn-gold hidden sm:inline-flex items-center justify-center gap-2 px-5 py-3 text-xs tracking-widest uppercase disabled:opacity-60"
        >
          <Save size={15} /> {saving ? "Saving…" : "Save writing"}
        </button>
      </div>

      {!needle && (
        <div className="-mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto hide-scrollbar">
          <div className="flex gap-2 min-w-max">
            {copyGroups.map((g) => {
              const active = g.title === groupTitle;
              return (
                <button
                  key={g.title}
                  type="button"
                  onClick={() => setGroupTitle(g.title)}
                  className={`rounded-xl px-5 py-2.5 text-sm font-semibold border transition ${
                    active
                      ? "bg-nayo-green text-white border-nayo-green"
                      : "bg-white text-nayo-black/70 border-nayo-black/[0.07] hover:border-nayo-gold/50"
                  }`}
                >
                  {g.title}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className={`${cardClass} p-5 sm:p-7`}>
        {keys.length ? (
          <div className="grid gap-5 md:grid-cols-2">
            {keys.map((key) => (
              <label key={key} className={`block ${longKeys.has(key) ? "md:col-span-2" : ""}`}>
                <span className="mb-1.5 block text-[11px] uppercase tracking-[0.16em] font-semibold text-nayo-black/50">
                  {labels[key]}
                </span>
                {longKeys.has(key) ? (
                  <textarea
                    value={copy[key]}
                    onChange={(e) => onChange({ ...copy, [key]: e.target.value })}
                    rows={4}
                    className={fieldClass}
                  />
                ) : (
                  <input
                    value={copy[key]}
                    onChange={(e) => onChange({ ...copy, [key]: e.target.value })}
                    className={fieldClass}
                  />
                )}
              </label>
            ))}
          </div>
        ) : (
          <p className="py-10 text-center text-sm text-nayo-black/50">
            No writing matches “{query}”.
          </p>
        )}
      </div>

      <div className="sticky bottom-24 z-10 sm:hidden">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="btn-gold w-full inline-flex items-center justify-center gap-2 py-3.5 text-xs tracking-widest uppercase shadow-lg disabled:opacity-60"
        >
          <Save size={15} /> {saving ? "Saving…" : "Save writing"}
        </button>
      </div>
    </div>
  );
}
