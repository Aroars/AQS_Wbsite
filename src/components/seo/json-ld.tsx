/** One <script type="application/ld+json"> per non-null schema object */
export function JsonLd({ data }: { data: (object | null | undefined)[] }) {
  return (
    <>
      {data
        .filter((d): d is object => !!d)
        .map((d, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }}
          />
        ))}
    </>
  );
}
