import {
  FacebookIcon,
  InstagramIcon,
  SocialLink,
  TikTokIcon,
} from "@/components/habibi/SocialIcons";
import { social } from "@/lib/social";

const ORDER_SOCIAL = [
  { href: social.instagram, label: "Instagram", Icon: InstagramIcon },
  { href: social.facebook, label: "Facebook", Icon: FacebookIcon },
  { href: social.tiktok, label: "TikTok", Icon: TikTokIcon },
] as const;

type OrderSocialLinksProps = {
  className?: string;
};

export function OrderSocialLinks({ className }: OrderSocialLinksProps) {
  return (
    <div
      className={`habibi-order-social${className ? ` ${className}` : ""}`}
      role="navigation"
      aria-label="Social media"
    >
      {ORDER_SOCIAL.map(({ href, label, Icon }) => (
        <SocialLink key={label} href={href ?? undefined} label={label}>
          <Icon className="habibi-order-social__icon" />
        </SocialLink>
      ))}
    </div>
  );
}
