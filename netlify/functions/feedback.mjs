import handler from "../../api/feedback.js";
import { fromVercelHandler } from "../lib/vercelAdapter.mjs";

export default fromVercelHandler(handler);
export const config = { path: "/api/feedback" };
