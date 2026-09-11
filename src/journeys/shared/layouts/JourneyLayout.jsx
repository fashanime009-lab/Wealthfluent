import PropTypes from "prop-types";

export default function JourneyLayout({ children }) {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <div className="mx-auto w-full max-w-7xl px-6 py-10">
        {children}
      </div>
    </div>
  );
}

JourneyLayout.propTypes = {
  children: PropTypes.node.isRequired,
};