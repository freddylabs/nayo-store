import LegalPage, { LegalSection } from "@/app/components/LegalPage";

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="September 5, 2026">
      <p>
        These terms govern your use of the Nayo Ltd. website and any purchase
        of apparel, meals, or healthcare uniforms. By placing an order you
        agree to them. If you do not agree, please do not use the shop.
      </p>

      <LegalSection title="Who we are">
        <p>
          Nayo Ltd. sells NAYO Apparel, NAYO Foods, and NAYO Health products
          online. Orders are fulfilled by pickup or delivery only, during our
          working hours.
        </p>
      </LegalSection>

      <LegalSection title="Orders and payment">
        <p>
          Prices are shown in US dollars and may change before you pay.
          Checkout is completed through Stripe. An order is confirmed when
          payment succeeds. We may decline or cancel an order if an item is
          unavailable, a price is shown in error, or we cannot fulfill pickup
          or delivery.
        </p>
        <p>
          Meal orders may include extras you select. If you skip extras, the
          plate is prepared as listed, minus any sides you asked to leave off.
          Plate price does not change when you drop an included side.
        </p>
      </LegalSection>

      <LegalSection title="Pickup and delivery">
        <p>
          We offer pickup and delivery only. We do not offer in-store browsing
          hours beyond scheduled pickup. See our{" "}
          <a href="/shipping" className="text-nayo-green font-semibold">
            Shipping &amp; fulfillment
          </a>{" "}
          page for hours, fees, and how orders are handed over.
        </p>
      </LegalSection>

      <LegalSection title="Food orders">
        <p>
          Meals are prepared to order. Please tell us about allergies when you
          order. We cannot guarantee a kitchen free of common allergens.
          Perishable food is not returnable once prepared, except where the
          order is wrong or unsafe. Contact us as soon as you can if there is
          a problem with a meal.
        </p>
      </LegalSection>

      <LegalSection title="Apparel and health products">
        <p>
          Clothing and uniforms should be checked on arrival. If an item
          arrives damaged or incorrect, contact us within 7 days of receipt.
          Unworn items in original condition may be eligible for exchange or
          refund at our discretion. Return shipping, if required, will be
          explained when you get in touch.
        </p>
      </LegalSection>

      <LegalSection title="Your account and conduct">
        <p>
          You are responsible for the accuracy of the details you give at
          checkout. Do not misuse the site, attempt unauthorized access, or
          use it for unlawful purposes.
        </p>
      </LegalSection>

      <LegalSection title="Intellectual property">
        <p>
          The Nayo name, logo, product photos, and site content belong to Nayo
          Ltd. or our licensors. You may not copy or reuse them for commercial
          purposes without our written permission.
        </p>
      </LegalSection>

      <LegalSection title="Limitation of liability">
        <p>
          To the fullest extent allowed by law, Nayo Ltd. is not liable for
          indirect or consequential loss arising from your use of the site or
          from an order. Nothing in these terms limits liability that cannot
          be limited by law, including for death or personal injury caused by
          negligence, or for fraud.
        </p>
      </LegalSection>

      <LegalSection title="Changes">
        <p>
          We may update these terms from time to time. The date at the top of
          this page shows when they were last revised. Continued use of the
          shop after a change means you accept the updated terms.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Nayo Ltd. Phone{" "}
          <a href="tel:+12403083183" className="text-nayo-green font-semibold">
            +1 (240) 308-3183
          </a>
          . Email{" "}
          <a
            href="mailto:hello@nayo.store"
            className="text-nayo-green font-semibold"
          >
            hello@nayo.store
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
