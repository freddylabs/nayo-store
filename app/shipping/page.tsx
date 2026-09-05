import LegalPage, { LegalSection } from "@/app/components/LegalPage";
import {
  DELIVERY_FEE,
  FREE_DELIVERY_THRESHOLD,
} from "@/app/lib/checkout";

export default function ShippingPage() {
  return (
    <LegalPage title="Shipping & Fulfillment" updated="September 5, 2026">
      <p>
        Nayo Ltd. fulfills orders by <strong>pickup</strong> or{" "}
        <strong>delivery</strong> only. We do not ship with third-party
        carriers at this time.
      </p>

      <LegalSection title="Working hours and days">
        <p>
          Pickup and delivery are available on <strong>Mondays</strong>,{" "}
          <strong>Fridays</strong>, and <strong>Saturdays</strong>, from{" "}
          <strong>9:00 AM to 9:00 PM</strong>.
        </p>
        <p>
          Orders placed outside these days or hours will be scheduled for the
          next available working day. We will confirm timing by phone or email
          when needed.
        </p>
      </LegalSection>

      <LegalSection title="Pickup">
        <p>
          Choose pickup at checkout. There is no pickup fee. Have your order
          name or confirmation ready when you collect. Meals are prepared to
          order — please allow time for cooking on busy days.
        </p>
      </LegalSection>

      <LegalSection title="Delivery">
        <p>
          Choose delivery at checkout and enter a complete address. Delivery
          is ${DELIVERY_FEE.toFixed(2)} per order. Delivery is free when your
          subtotal is ${FREE_DELIVERY_THRESHOLD} or more.
        </p>
        <p>
          Someone should be available to receive the order during the agreed
          window. If we cannot complete delivery because of an incomplete
          address or no one to receive it, we will contact you at{" "}
          <a href="tel:+12403083183" className="text-nayo-green font-semibold">
            +1 (240) 308-3183
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="Apparel, food, and health">
        <p>
          Clothing and healthcare uniforms are packed and handed over at
          pickup or delivery. Meals are packed for travel. Please refrigerate
          perishable food promptly and eat it within a safe time.
        </p>
      </LegalSection>

      <LegalSection title="Delays and issues">
        <p>
          Weather, traffic, or kitchen volume can delay a slot. If something
          is missing or damaged, contact us the same day so we can make it
          right. Food that has been prepared cannot usually be returned, but
          we will correct an error on our side.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Questions about an order:{" "}
          <a href="tel:+12403083183" className="text-nayo-green font-semibold">
            +1 (240) 308-3183
          </a>{" "}
          or{" "}
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
