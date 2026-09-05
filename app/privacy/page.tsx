import LegalPage, { LegalSection } from "@/app/components/LegalPage";

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="September 5, 2026">
      <p>
        Nayo Ltd. (“Nayo”, “we”, “us”) respects your privacy. This policy
        explains what information we collect when you use our website and
        place orders for apparel, meals, and healthcare uniforms, how we use
        it, and the choices you have.
      </p>

      <LegalSection title="Information we collect">
        <p>We may collect:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            Contact details you give us: name, email address, and phone
            number.
          </li>
          <li>
            Delivery details when you choose delivery: street address, city,
            state, and ZIP code.
          </li>
          <li>
            Order details: products, quantities, meal notes (sides dropped or
            extras added), pickup or delivery, and order total.
          </li>
          <li>
            Payment information processed by Stripe. We do not store your full
            card number on our servers.
          </li>
          <li>
            Basic technical data such as browser type and pages visited, used
            to keep the site working.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="How we use your information">
        <p>We use this information to:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Take, confirm, and fulfill your orders (pickup or delivery).</li>
          <li>Process payment securely through Stripe.</li>
          <li>Contact you about an order, a question, or a change in hours.</li>
          <li>Improve our website, products, and customer service.</li>
          <li>Meet legal, tax, and accounting requirements.</li>
        </ul>
        <p>
          We do not sell your personal information. We do not use your data for
          unrelated marketing unless you ask us to stay in touch.
        </p>
      </LegalSection>

      <LegalSection title="Who we share it with">
        <p>
          We share information only as needed to run the business: Stripe for
          payments, and any delivery partner required to complete a delivery
          order. We may also share information if the law requires it, or to
          protect Nayo Ltd., our customers, or the public.
        </p>
      </LegalSection>

      <LegalSection title="Cookies">
        <p>
          The site uses limited cookies or local storage to keep your cart and
          checkout working. These are needed for the shop to function. You can
          clear them in your browser; doing so may empty your cart.
        </p>
      </LegalSection>

      <LegalSection title="How long we keep information">
        <p>
          We keep order and contact records as long as needed to fulfill
          orders, handle questions, and meet legal record-keeping duties, then
          delete or anonymize them when they are no longer required.
        </p>
      </LegalSection>

      <LegalSection title="Your choices">
        <p>
          You may ask us to access, correct, or delete personal information we
          hold about you, or to explain how we use it. Contact us using the
          details below. We may need to keep some records where the law
          requires it (for example, completed payments).
        </p>
      </LegalSection>

      <LegalSection title="Children">
        <p>
          Our shop is not directed at children under 13, and we do not
          knowingly collect personal information from them.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Questions about this policy: call{" "}
          <a href="tel:+12403083183" className="text-nayo-green font-semibold">
            +1 (240) 308-3183
          </a>{" "}
          or email{" "}
          <a
            href="mailto:hello@nayo.store"
            className="text-nayo-green font-semibold"
          >
            hello@nayo.store
          </a>
          . Nayo Ltd.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
