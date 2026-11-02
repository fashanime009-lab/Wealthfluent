import handler from "../../api/net-worth-share.js";
import { fromVercelHandler } from "../lib/vercelAdapter.mjs";

export default fromVercelHandler(handler);
// The second path is the clean public share URL people actually paste.
export const config = { path: ["/api/net-worth-share", "/net-worth-percentile/share"] };
