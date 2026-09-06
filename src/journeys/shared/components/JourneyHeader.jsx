import PropTypes from "prop-types";

export default function JourneyHeader({
  eyebrow,
  title,
  description,
}) {
  return (
    <header className="mb-10">
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-500">
        {eyebrow}
      </p>

      <h1 className="text-4xl font-bold tracking-tight">
        {title}
      </h1>

      <p className="mt-4 max-w-2xl text-lg text-[var(--text-secondary)]">
        {description}
      </p>
    </header>
  );
}

JourneyHeader.propTypes = {
  eyebrow: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};