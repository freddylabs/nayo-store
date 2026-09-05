"use client";

export default function MealExtrasPrompt({
  open,
  title = "Would you like anything extra?",
  body = "You can add more meat, plantain, a drink, or other sides to your meal before you continue.",
  confirmLabel = "Yes, add extras",
  declineLabel = "No thank you",
  onConfirm,
  onDecline,
}: {
  open: boolean;
  title?: string;
  body?: string;
  confirmLabel?: string;
  declineLabel?: string;
  onConfirm: () => void;
  onDecline: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-black/55"
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="meal-extras-title"
        className="relative w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-nayo-white p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.25)]"
      >
        <p className="text-nayo-gold text-[10px] tracking-[0.22em] uppercase font-semibold">
          Nayo Foods
        </p>
        <h2
          id="meal-extras-title"
          className="text-display text-2xl sm:text-3xl font-bold text-nayo-black mt-2 leading-tight"
        >
          {title}
        </h2>
        <p className="mt-3 text-sm text-nayo-black/60 leading-relaxed">{body}</p>
        <div className="mt-6 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onConfirm}
            className="btn-gold w-full py-3 text-xs tracking-widest uppercase font-bold"
          >
            {confirmLabel}
          </button>
          <button
            type="button"
            onClick={onDecline}
            className="btn-outline w-full py-3 text-xs tracking-widest uppercase font-medium"
          >
            {declineLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
