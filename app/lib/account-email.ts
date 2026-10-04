import type { Customer } from "@/app/lib/customers";
import { pinLinkUrl } from "@/app/lib/customers";
import { renderNoticeEmail } from "@/app/lib/notice-email";
import { emailBaseUrl } from "@/app/lib/receipt-email";

export function renderPinLinkEmail(customer: Customer, base = emailBaseUrl()) {
  const resetting = Boolean(customer.pinHash);
  return renderNoticeEmail(
    {
      subject: resetting ? "Reset your Nayo PIN" : "Set your Nayo PIN",
      preheader: `Your customer ID is ${customer.id}.`,
      eyebrow: "Your orders",
      title: resetting ? "Choose a new PIN" : "Set your 4-digit PIN",
      intro: resetting
        ? "Someone asked to reset the PIN on your Nayo account. If it was you, use the button below. If not, you can ignore this email."
        : "Set a PIN to follow orders in progress and look back at past orders on nayo.market.",
      panel: {
        label: "Your customer ID",
        lines: [customer.id, `Sign in with this ID or ${customer.email}.`],
      },
      button: { label: resetting ? "Reset my PIN" : "Set my PIN", url: pinLinkUrl(customer, base) },
      footnote: "This link works for 7 days and can be used once.",
    },
    base
  );
}
