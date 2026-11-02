import handler from "../../api/contact.js";
import { fromVercelHandler } from "../lib/vercelAdapter.mjs";

export default fromVercelHandler(handler);
export const config = { path: "/api/contact" };
