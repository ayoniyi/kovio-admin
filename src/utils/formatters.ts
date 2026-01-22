import { format } from "date-fns";

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(price);
};

export const capitalizeName = (name: string) => {
  if (!name) return "";
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};

export const cleanUrlPath = (url: string): string => {
  return url
    .replace(/%20/g, " ")
    .replace(/%26/g, "&")
    .replace(/%2F/g, "/")
    .replace(/%3A/g, ":")
    .replace(/%3B/g, ";")
    .replace(/%3D/g, "=")
    .replace(/%3F/g, "?")
    .replace(/%40/g, "@")
    .replace(/%23/g, "#")
    .replace(/%25/g, "%")
    .replace(/%28/g, "(")
    .replace(/%29/g, ")")
    .replace(/%2A/g, "*")
    .replace(/%2B/g, "+")
    .replace(/%2C/g, ",")
    .replace(/%2E/g, ".")
    .replace(/%2F/g, "/")
    .replace(/%/g, "_")
    .replace(/\s+/g, " ")
    .replace(/%[0-9A-F]{2}/gi, "_")
    .replace(/-+/g, "_")
    .replace(/^-+|-+$/g, "");
};

export const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return "";

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return format(dateObj, "MMM d, yyyy");
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
};

export const formatTime = (time: string | null | undefined): string => {
  if (!time) return "";

  try {
    // Parse time string (format: "HH:mm")
    const [hours, minutes] = time.split(":").map(Number);

    if (isNaN(hours) || isNaN(minutes)) {
      return time;
    }

    // Convert to 12-hour format
    const period = hours >= 12 ? "pm" : "am";
    const hour12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;

    // Format with leading zero for minutes if needed
    const formattedMinutes = minutes.toString().padStart(2, "0");

    return `${hour12}:${formattedMinutes}${period}`;
  } catch (error) {
    console.error("Error formatting time:", error);
    return time || "";
  }
};

export const formatTimestamp = (
  timestamp: string | Date | null | undefined
): string => {
  if (!timestamp) return "";

  try {
    const dateObj =
      typeof timestamp === "string" ? new Date(timestamp) : timestamp;
    // Format to "h:mm a" (e.g., "11:46 AM") then convert to lowercase
    return format(dateObj, "h:mm a").toLowerCase();
  } catch (error) {
    console.error("Error formatting timestamp:", error);
    return "";
  }
};
