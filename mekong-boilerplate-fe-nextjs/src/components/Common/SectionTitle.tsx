const SectionTitle = ({
  title,
  paragraph,
  width = "570px",
  center,
  mb = "100px",
}: {
  title: string;
  paragraph: string;
  width?: string;
  center?: boolean;
  mb?: string;
}) => {
  return (
    <>
      <div
        className={`wow fadeInUp w-full ${center ? "mx-auto text-center" : ""}`}
        data-wow-delay=".1s"
        style={{ maxWidth: width, marginBottom: mb }}
      >
        <h2 className="mb-4 text-3xl font-bold !leading-tight text-black dark:text-white sm:text-4xl md:text-5xl">
          {title}
        </h2>
        <p className="text-base !leading-extra-relaxed text-body-color dark:text-gray-400 md:text-lg font-medium">
          {paragraph}
        </p>
      </div>
    </>
  );
};

export default SectionTitle;
