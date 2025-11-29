export default function AuthenticationLayOut({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="01:bg-background-login01 02:bg-background-login02 2xl:bg-background-login text-neutral-08 h-sreen w-screen bg-cover bg-center bg-no-repeat">
      {children}
    </main>
  );
}
