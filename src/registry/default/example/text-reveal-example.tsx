import { TextReveal } from "@/registry/default/ui/text-reveal";

export default function TextRevealExample() {
  return (
    <div className="w-full px-8 py-10 md:py-20 lg:py-80">
      <TextReveal
        start="25%"
        className="text-center font-medium text-md leading-[1.3] [--color-accent:var(--color-lime-100)] sm:text-2xl lg:text-3xl"
        text="Build enchanting, interactive interfaces that mesmerize users and elevate the digital experience with the power of Mahou"
      />
    </div>
  );
}
