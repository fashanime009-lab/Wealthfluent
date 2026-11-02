import handler from "../../api/news.js";
import { fromVercelHandler } from "../lib/vercelAdapter.mjs";

export default fromVercelHandler(handler);
export const config = { path: "/api/news" };
