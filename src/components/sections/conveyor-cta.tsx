import { CTASection } from "@/components/sections/cta-section";
import { CONVEYOR_ACCENT } from "@/data/conveyors";

/** The conveyor section's closing call to action — asks for the line, not a product review */
export function ConveyorCTA() {
  return (
    <CTASection
      accent={CONVEYOR_ACCENT}
      title="Tell us about your line"
      body="Send us the product, the rate, the room it runs in, and how it gets washed down. An AQS engineer comes back with a layout sketch and a budgetary range — no catalog, no sales script."
      buttonLabel="Tell Us About Your Line →"
      href="/contact"
    />
  );
}
