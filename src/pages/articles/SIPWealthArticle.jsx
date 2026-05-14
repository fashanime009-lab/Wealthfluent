import ArticleLayout from "../../components/ArticleLayout";
import { Link } from "react-router-dom";

export default function SIPWealthArticle() {
  return (
    <ArticleLayout
      title="How SIP Investments Build Long-Term Wealth"
      description="Learn how disciplined SIP investing and compounding create sustainable long-term wealth growth."
      category="INVESTING GUIDE"
      readTime="5 min read"
    >
      {/* Intro */}
      <p>
        Systematic Investment Plans (SIPs) are one of the most
        popular investment methods for long-term wealth creation.
        SIP investing allows individuals to invest regularly into
        mutual funds using disciplined monthly contributions.
      </p>

      <p>
        Long-term investing combined with compounding can
        significantly increase investment value over time.
      </p>

      {/* What Is SIP */}
      <div className="bg-white/5 border border-white/10 rounded-[36px] p-10">
        <h2 className="text-5xl font-black mb-8">
          What Is SIP?
        </h2>

        <p className="text-slate-300 text-lg leading-relaxed">
          SIP stands for Systematic Investment Plan. It allows
          investors to contribute fixed amounts regularly into
          mutual funds rather than investing lump sums.
        </p>
      </div>

      {/* Benefits */}
      <div className="bg-white/5 border border-white/10 rounded-[36px] p-10">
        <h2 className="text-5xl font-black mb-10">
          Benefits Of SIP Investing
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-3xl font-black text-cyan-400 mb-4">
              Disciplined Investing
            </h3>

            <p className="text-slate-400 leading-relaxed">
              SIPs encourage consistent investing habits
              regardless of market conditions.
            </p>
          </div>

          <div>
            <h3 className="text-3xl font-black text-cyan-400 mb-4">
              Rupee Cost Averaging
            </h3>

            <p className="text-slate-400 leading-relaxed">
              Investors purchase more units when prices fall
              and fewer when prices rise.
            </p>
          </div>

          <div>
            <h3 className="text-3xl font-black text-cyan-400 mb-4">
              Long-Term Growth
            </h3>

            <p className="text-slate-400 leading-relaxed">
              Compounding over long durations can significantly
              increase wealth creation.
            </p>
          </div>

          <div>
            <h3 className="text-3xl font-black text-cyan-400 mb-4">
              Flexible Investing
            </h3>

            <p className="text-slate-400 leading-relaxed">
              Investors can start with relatively small
              monthly contributions.
            </p>
          </div>
        </div>
      </div>

      {/* Compounding */}
      <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-400/10 rounded-[36px] p-10">
        <h2 className="text-5xl font-black mb-8">
          Power Of Compounding
        </h2>

        <p className="text-slate-300 text-lg leading-relaxed mb-8">
          Compounding helps investments generate returns
          on previous returns. Longer investment periods
          allow compounding to become significantly more powerful.
        </p>

        <Link
          to="/sip-calculator"
          className="bg-cyan-500 hover:bg-cyan-400 transition px-8 py-4 rounded-2xl text-black font-black inline-block"
        >
          Calculate SIP Returns
        </Link>
      </div>

      {/* Final */}
      <div className="bg-white/5 border border-white/10 rounded-[36px] p-10">
        <h2 className="text-5xl font-black mb-8">
          Final Thoughts
        </h2>

        <p className="text-slate-300 text-lg leading-relaxed">
          SIP investing can become a powerful wealth-building
          strategy when combined with patience, consistency,
          and long-term financial planning.
        </p>
      </div>
    </ArticleLayout>
  );
}