import type { SiteSettings } from "@/sanity/lib/queries";
import { ArrowUpRightIcon, GitHubIcon, InstagramIcon, LinkedInIcon } from "./icons";
import { LetsTalkTrigger } from "./contact/ContactProvider";
import { SplitText } from "./SplitText";

// Dark footer with a huge "Let's Talk" heading that opens the message panel,
// social links on the right and the copyright line. Shared by every page.
// Phones: heading, social links, copyright (stacked). Desktop: a grid with the
// copyright under the heading and the social links on the right.

export function CtaFooter({ settings }: { settings: SiteSettings }) {
  const socials = [
    { label: "LinkedIn", href: settings.linkedinUrl, icon: <LinkedInIcon className="size-full" /> },
    { label: "Instagram", href: settings.instagramUrl, icon: <InstagramIcon className="size-full" /> },
    { label: "GitHub", href: settings.githubUrl, icon: <GitHubIcon className="size-full" /> },
  ].filter((social): social is typeof social & { href: string } => Boolean(social.href));

  return (
    <footer className="mt-16 bg-ink text-page lg:mt-24">
      <div className="mx-auto flex max-w-content flex-col gap-10 px-gutter py-20 lg:grid lg:grid-cols-[1fr_auto] lg:items-center lg:gap-x-10 lg:gap-y-12 lg:py-32">
        <div className="lg:col-start-1 lg:row-start-1">
          <p data-from="down" className="reveal text-label font-semibold uppercase tracking-[0.15em] text-page/80">
            {settings.ctaHeading ?? "Have a project in mind?"}
          </p>
          <h2 className="mt-2 lg:mt-4">
            <LetsTalkTrigger className="group inline-flex cursor-pointer items-center gap-[0.25em] rounded-card text-[clamp(3.25rem,11vw,10rem)] leading-none font-bold uppercase focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-accent">
              <SplitText text="Let’s Talk" />
              <span data-from="scale" className="reveal">
                <ArrowUpRightIcon className="block size-[0.6em] text-accent transition-transform duration-300 group-hover:translate-x-[0.08em] group-hover:-translate-y-[0.08em] motion-reduce:transition-none" />
              </span>
            </LetsTalkTrigger>
          </h2>
        </div>

        {socials.length > 0 && (
          <ul className="flex gap-3 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:flex-col lg:gap-4">
            {socials.map((social) => (
              <li key={social.label} data-from="right" className="reveal">
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  title={social.label}
                  className="flex h-14 w-[4.5rem] items-center justify-center rounded-card border border-page/70 text-page transition-colors duration-200 hover:border-accent hover:bg-accent hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none lg:h-[4.125rem] lg:w-[5.25rem]"
                >
                  <span className="size-7">{social.icon}</span>
                </a>
              </li>
            ))}
          </ul>
        )}

        <p className="reveal text-small text-page/70 lg:col-start-1 lg:row-start-2">
          © {new Date().getFullYear()} {settings.fullName}.
        </p>
      </div>
    </footer>
  );
}
