import VerdictFAQ from "@/components/verdict/VerdictFAQ";
import { HOME_FAQ_ITEMS } from "@/data/homeFaq";

export default function HomeFAQ() {
  return (
    <section className="mx-auto max-w-[1240px] px-5 py-14 sm:px-8 lg:px-12">
      <VerdictFAQ items={HOME_FAQ_ITEMS} className="max-w-[68ch]" />
    </section>
  );
}
