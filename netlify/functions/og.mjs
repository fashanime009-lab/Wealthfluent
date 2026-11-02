import handler from "../../api/og/index.js";
import { fromVercelHandler } from "../lib/vercelAdapter.mjs";

export default fromVercelHandler(handler);
export const config = { path: "/api/og" };
