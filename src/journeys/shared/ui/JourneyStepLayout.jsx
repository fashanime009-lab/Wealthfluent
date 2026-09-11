import PropTypes from "prop-types";

export default function JourneyStepLayout({
  title,
  description,
  children,
  footer,
}) {
  return (
    <section className="mx-auto max-w-2xl">

      <header>
        <h2 className="text-4xl font-bold tracking-tight text-[var(--text)]">
          {title}
        </h2>

        {description && (
          <p className="mt-3 text-[var(--text-secondary)]">
            {description}
          </p>
        )}
      </header>

      <div className="mt-10">
        {children}
      </div>

      {footer && (
        <div className="mt-10">
          {footer}
        </div>
      )}

    </section>
  );
}

JourneyStepLayout.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  children: PropTypes.node.isRequired,
  footer: PropTypes.node,
};