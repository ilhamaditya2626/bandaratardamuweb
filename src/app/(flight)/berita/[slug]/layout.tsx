export default function BeritaDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            header.fixed.left-0.right-0.top-0.z-\\[100\\] {
              background: #132440 !important;
              border-bottom-color: rgba(255, 255, 255, 0.08) !important;
              backdrop-filter: blur(14px) !important;
              -webkit-backdrop-filter: blur(14px) !important;
            }
          `,
        }}
      />
      {children}
    </>
  );
}
