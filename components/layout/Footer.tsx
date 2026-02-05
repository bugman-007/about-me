import { cn } from "@/lib/utils";
import Link from "next/link";
import { Container } from "./Container";
import { EditableText } from "@/components/owner/EditableText";
import { DEFAULT_SETTINGS } from "@/lib/content/keys";

interface FooterLink {
  label: string;
  href: string;
}

function getFooterLinks(json?: string): FooterLink[] {
  try {
    return json ? (JSON.parse(json) as FooterLink[]) : JSON.parse(DEFAULT_SETTINGS.footer_links_json);
  } catch {
    return [];
  }
}

interface FooterProps {
  className?: string;
  settings?: Record<string, string>;
}

function avatarForUrl(href: string) {
  try {
    // Use unavatar to resolve service avatars from profile URLs (GitHub, LinkedIn, etc.)
    // Example: https://unavatar.io/https://github.com/username
    const encoded = encodeURIComponent(href);
    return `https://unavatar.io/${encoded}`;
  } catch {
    return null;
  }
}

export function Footer({ className, settings = {} }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const textTemplate = DEFAULT_SETTINGS.footer_text;
  const text = textTemplate.replace("{year}", String(currentYear));
  const links = [
    settings.github_url ? { label: "GitHub", href: settings.github_url } : null,
    settings.linkedin_url ? { label: "LinkedIn", href: settings.linkedin_url } : null,
    settings.x_url ? { label: "X", href: settings.x_url } : null,
  ].filter(Boolean) as { label: string; href: string }[];
  const finalLinks = links.length > 0 ? links : getFooterLinks();

  return (
    <footer
      className={cn(
        "border-t border-border/40 bg-background",
        className
      )}
    >
      <Container>
        <div className="flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          {/* Copyright */}
          <p className="text-center text-sm text-muted-foreground md:text-left">
            <EditableText settingKey="footer_text" value={text} />
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {finalLinks.map((link) => {
              const avatar = avatarForUrl(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {avatar && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatar}
                      alt={`${link.label} avatar`}
                      className="h-5 w-5 rounded-full ring-1 ring-border"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </Container>
    </footer>
  );
}
