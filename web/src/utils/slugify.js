/**
 * Convert string into clean URL slug
 */
export function slugify(text) {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Ganti spasi dengan tanda hubung
    .replace(/[^\w\-]+/g, "") // Hapus karakter non-alfanumerik
    .replace(/\-\-+/g, "-") // Hindari multiple strip beruntun
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

/**
 * Generate SEO & Human-Friendly Project URL Path
 * Contoh: /projects/desain-ulang-logo-kopi-nusantara-f222d223-dc5f-41d0-9b16-9d2b5bf5d8ec
 */
export function getProjectUrl(project) {
  if (!project || !project.id) return "/projects";
  const titleSlug = slugify(project.judul || "proyek");
  return `/projects/${titleSlug}-${project.id}`;
}

/**
 * Extract true UUID from a friendly slug path or raw ID
 */
export function extractIdFromSlug(slugOrId) {
  if (!slugOrId) return "";
  const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
  const match = slugOrId.match(uuidRegex);
  if (match) {
    return match[0];
  }
  return slugOrId;
}