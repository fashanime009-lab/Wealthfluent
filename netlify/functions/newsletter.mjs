import handler from "../../api/newsletter.js";
import { fromVercelHandler } from "../lib/vercelAdapter.mjs";

export default fromVercelHandler(handler);
export const config = { path: "/api/newsletter" };
