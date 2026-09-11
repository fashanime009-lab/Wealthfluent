/**
 * Merge class names safely.
 * Similar to clsx / shadcn cn().
 *
 * Usage:
 * cn(
 *   "rounded-xl",
 *   isActive && "bg-blue-600",
 *   disabled && "opacity-50"
 * )
 */

export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}