import Image from "next/image";
import { OrderSocialLinks } from "./OrderSocialLinks";

type OrderPageHeaderProps = {
  tagline?: string;
  taglineAs?: "h1" | "p";
  trust?: string;
  showSocial?: boolean;
};

export function OrderPageHeader({
  tagline,
  taglineAs = "h1",
  trust,
  showSocial = true,
}: OrderPageHeaderProps) {
  return (
    <header className="habibi-order-header">
      <Image
        src="/brand/logo.png"
        alt="Habibi Restaurant"
        width={300}
        height={300}
        priority
        className="habibi-order-header__logo"
      />
      {tagline &&
        (taglineAs === "h1" ? (
          <h1 className="habibi-order-header__tagline">{tagline}</h1>
        ) : (
          <p className="habibi-order-header__tagline">{tagline}</p>
        ))}
      {trust && <p className="habibi-order-header__trust">{trust}</p>}
      {showSocial && <OrderSocialLinks />}
    </header>
  );
}
