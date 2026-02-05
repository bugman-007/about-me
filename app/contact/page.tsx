import { Container } from "@/components/layout";
import { Reveal } from "@/components/animations/Reveal";
import { HoverCard } from "@/components/animations/HoverCard";
import { Mail, Github, Linkedin, Phone } from "lucide-react";
import { TelegramIcon } from "@/components/icons/Telegram";
import { WhatsAppIcon } from "@/components/icons/WhatsApp";
import { EditableText as Editable } from "@/components/owner/EditableText";
import { getSettings } from "@/lib/data/settings";

export default async function ContactPage() {
  const s = await getSettings();

  const cards: Array<{
    key: string;
    label: string;
    icon: React.ReactNode;
    value: string;
    href?: string;
    empty?: boolean;
  }> = [];

  const email = s.contact_email || "";
  cards.push({ key: "email", label: "Email", icon: <Mail className="h-5 w-5" />, value: email || "Add your email in settings", href: email ? `mailto:${email}` : undefined, empty: !email });

  const github = s.github_url || "";
  cards.push({ key: "github", label: "GitHub", icon: <Github className="h-5 w-5" />, value: github || "Add your GitHub URL in settings", href: github || undefined, empty: !github });

  const linkedin = s.linkedin_url || "";
  cards.push({ key: "linkedin", label: "LinkedIn", icon: <Linkedin className="h-5 w-5" />, value: linkedin || "Add your LinkedIn URL in settings", href: linkedin || undefined, empty: !linkedin });

  const phone = s.phone_number || "";
  cards.push({ key: "phone", label: "Phone", icon: <Phone className="h-5 w-5" />, value: phone || "Add your phone number in settings", href: phone ? `tel:${phone}` : undefined, empty: !phone });

  const telegram = s.telegram_url || (s.telegram_username ? `https://t.me/${s.telegram_username}` : "");
  cards.push({ key: "telegram", label: "Telegram", icon: <TelegramIcon className="h-5 w-5" /> as any, value: telegram || "Add your Telegram in settings", href: telegram || undefined, empty: !telegram });

  const whatsapp = s.whatsapp_url || (s.whatsapp_number ? `https://wa.me/${s.whatsapp_number}` : "");
  cards.push({ key: "whatsapp", label: "WhatsApp", icon: <WhatsAppIcon className="h-5 w-5" /> as any, value: whatsapp || "Add your WhatsApp in settings", href: whatsapp || undefined, empty: !whatsapp });

  return (
    <section id="contact">
      <Container>
        <div className="py-20">
          <Reveal>
            <h1 className="text-4xl font-bold tracking-tight">Contact</h1>
            <p className="mt-2 text-muted-foreground">Reach out on your preferred channel</p>
          </Reveal>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((c, i) => {
              const Inner = (
                <HoverCard className={`flex flex-col items-start gap-3 p-5 ${c.href ? "" : "cursor-default"}`}>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    {c.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-muted-foreground">{c.label}</p>
                    <p className={`text-base ${c.empty ? "italic text-muted-foreground/70" : ""}`}>
                      {/* Editable value */}
                      {/* Use setting keys matching card type */}
                      {c.key === "email" && (
                        <Editable settingKey="contact_email" value={s.contact_email || ""} />
                      )}
                      {c.key === "github" && (
                        <Editable settingKey="github_url" value={s.github_url || ""} />
                      )}
                      {c.key === "linkedin" && (
                        <Editable settingKey="linkedin_url" value={s.linkedin_url || ""} />
                      )}
                      {c.key === "phone" && (
                        <Editable settingKey="phone_number" value={s.phone_number || ""} />
                      )}
                      {c.key === "telegram" && (
                        <Editable settingKey="telegram_url" value={s.telegram_url || (s.telegram_username || "")} />
                      )}
                      {c.key === "whatsapp" && (
                        <Editable settingKey="whatsapp_url" value={s.whatsapp_url || (s.whatsapp_number || "")} />
                      )}
                    </p>
                  </div>
                </HoverCard>
              );
              return (
                <Reveal key={c.key} delay={i * 0.06}>
                  {c.href ? (
                    <a href={c.href} target={c.href?.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                      {Inner}
                    </a>
                  ) : (
                    Inner
                  )}
                </Reveal>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
