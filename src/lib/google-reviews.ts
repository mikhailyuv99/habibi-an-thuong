import { client } from "./client";

/** Google Maps feature id (hex pair from the place URL). */
const FEATURE_ID =
  client.google_feature_id ?? "0x314217005edaf969:0x7d073d9fdceea526";

/** Decimal CID — opens the business in the Google Maps app on mobile. */
const MAPS_CID = client.google_maps_cid ?? "9009237336393688358";

/** Opens the Google Maps write-review screen (Maps app on mobile). */
export const GOOGLE_WRITE_REVIEW_URL = `https://www.google.com/maps/place//data=!4m3!3m2!1s${FEATURE_ID}!12e1`;

/** Opens the Google Maps reviews tab for this business. */
export const GOOGLE_REVIEWS_URL = `https://www.google.com/maps/place//data=!4m4!3m3!1s${FEATURE_ID}!9m1!1b1`;

/** Short link + CID fallback when Maps data URLs fail to hand off on a device. */
export const GOOGLE_MAPS_BUSINESS_URL = client.maps_url;
export const GOOGLE_MAPS_CID_URL = `https://maps.google.com/?cid=${MAPS_CID}`;
