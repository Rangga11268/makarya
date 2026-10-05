/**
 * Centralized User Role Utilities for Makarya Mobile
 */

export const ROLES = {
  MAHASISWA: "MHS",
  MHS: "MHS",
  UMKM: "UMKM",
  ADMIN: "ADMIN",
};

export function isMahasiswaRole(role) {
  if (!role) return false;
  const r = String(role).toUpperCase();
  return r === "MHS" || r === "MAHASISWA";
}

export function isUmkmRole(role) {
  if (!role) return false;
  const r = String(role).toUpperCase();
  return r === "UMKM";
}

export function isAdminRole(role) {
  if (!role) return false;
  const r = String(role).toUpperCase();
  return r === "ADMIN";
}
