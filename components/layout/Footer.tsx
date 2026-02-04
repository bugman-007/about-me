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
}

export function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const textTemplate = DEFAULT_SETTINGS.footer_text;
  const text = textTemplate.replace("{year}", String(currentYear));
  const links = getFooterLinks();

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
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
