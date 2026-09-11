import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import SectionTitle from "./SectionTitle";
import LessonCard from "./LessonCard";
import { lessons } from "../../data/homepage";

export default function LearningSection() {
  return (
    <section className="mx-auto mt-8 max-w-[1660px] px-5 sm:px-8 lg:px-12">
      <SectionTitle
        title="Learn. Grow. Succeed."
        text="Personalized learning that makes you financially smarter."
        action={<Link to="/learn" className="flex items-center gap-3 text-[14px] font-black text-emerald-800">Explore Lessons <ArrowRight size={18} /></Link>}
      />
      <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        {lessons.map((lesson) => <LessonCard key={lesson.title} lesson={lesson} />)}
      </div>
    </section>
  );
}