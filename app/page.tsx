import Image from "next/image";
import Link from "next/link";

import { Button } from "@/app/components/ui/button";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-neutral-00 text-secondary-dark-gray-main">
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-blue-main/90 via-secondary-teal-green-01/60 to-white text-white">
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-white/10 to-transparent" />
        <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 pb-24 pt-20 lg:flex-row lg:items-center">
          <div className="space-y-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 px-4 py-1 text-sm font-medium">
              SSL Logistic · Trucker Web
            </span>
            <div className="space-y-6">
              <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                Coordinate every load from a single login.
              </h1>
              <p className="text-lg text-white/80">
                One secure workspace for every team and role.
              </p>
              <p className="text-lg text-white/80">
                Manage shipments, RFQs, and live operations in one place.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link href="/auth/login">Log in to your workspace</Link>
              </Button>
              <Button variant="main-light" asChild size="lg">
                <Link href="mailto:hello@ssl-logistic.com?subject=Trucker%20Web%20Demo">
                  Talk to our team
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative w-full max-w-xl">
            <div className="absolute -inset-6 rounded-3xl bg-white/10 blur-3xl" />
            <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-white/20 p-3">
                  <Image
                    src="/images/login-page-logo.png"
                    alt="SSL Logistic logo"
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full"
                  />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-wide text-white/70">
                    Live operations
                  </p>
                  <p className="text-lg font-semibold">
                    Bangkok · Nationwide coverage
                  </p>
                </div>
              </div>
              <div className="mt-6 rounded-2xl bg-white/90 p-6 text-secondary-dark-gray-main shadow-card">
                <p className="text-sm font-medium text-secondary-dark-gray-02">
                  One login for every role
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-secondary-dark-gray-main">
                  Ready when your operations are.
                </h3>
                <p className="mt-2 text-base text-secondary-dark-gray-02">
                  Sign in with your company credentials.
                </p>
                <p className="mt-2 text-base text-secondary-dark-gray-02">
                  Switch between organizations and manage shipments easily.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-neutral-00 py-20">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h2 className="text-3xl font-semibold text-secondary-dark-gray-main sm:text-4xl">
            Log in and see your logistics OS in action.
          </h2>
          <p className="mt-4 text-base text-secondary-dark-gray-02">
            Access the same platform used by your teams and partners.
          </p>
          <p className="mt-2 text-base text-secondary-dark-gray-02">
            Keep every shipment moving with a shared real-time view.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/auth/login">Go to login</Link>
            </Button>
            <Button variant="secondary" asChild size="lg">
              <Link href="mailto:support@ssl-logistic.com?subject=Trucker%20Web%20Support">
                Contact support
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-neutral-02 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-secondary-dark-gray-02 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3 text-secondary-dark-gray-main">
            <Image
              src="/images/login-page-logo.png"
              alt="SSL Logistic logo"
              width={36}
              height={36}
              className="h-9 w-9 rounded-full"
            />
            <div>
              <p className="font-semibold text-secondary-dark-gray-main">
                SSL Logistic · Trucker Web
              </p>
              <p>Secure logistics operating system</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-secondary-dark-gray-main">
            <Link
              href="/auth/login"
              className="transition hover:text-secondary-indigo-main"
            >
              Platform login
            </Link>
            <Link
              href="mailto:hello@ssl-logistic.com"
              className="transition hover:text-secondary-indigo-main"
            >
              hello@ssl-logistic.com
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
