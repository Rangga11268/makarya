import {
  Sparkles,
  Palette,
  Smartphone,
  Code2,
  Video,
  PenTool,
  FileSpreadsheet,
} from "lucide-react-native";

export const CATEGORIES = [
  { id: "ALL", code: "ALL", label: "Semua", Icon: Sparkles },
  { id: "DESIGN", code: "DESIGN", label: "Desain & Logo", Icon: Palette },
  { id: "UIUX", code: "UIUX", label: "UI/UX App", Icon: Smartphone },
  { id: "PEMROGRAMAN", code: "PEMROGRAMAN", label: "Web & Coding", Icon: Code2 },
  { id: "VIDEO", code: "VIDEO", label: "Video Reels", Icon: Video },
  { id: "COPYWRITING", code: "COPYWRITING", label: "Copywriting", Icon: PenTool },
  { id: "ADMIN_DATA", code: "ADMIN_DATA", label: "Admin Data", Icon: FileSpreadsheet },
];

export const getCategorySkills = (kategori) => {
  switch (kategori) {
    case "DESIGN":
      return ["Desain Grafis", "Logo & Brand", "Packaging"];
    case "UIUX":
      return ["UI/UX Design", "Figma App", "Mobile UI"];
    case "PEMROGRAMAN":
      return ["Web Development", "React & Node", "FastAPI"];
    case "VIDEO":
      return ["Video Editing", "Reels & TikTok", "Animasi"];
    case "COPYWRITING":
      return ["Copywriting", "Artikel SEO", "Social Caption"];
    case "ADMIN_DATA":
      return ["Admin Data", "Excel Spreadsheets", "Data Entry"];
    default:
      return ["Digital UMKM", "Freelance"];
  }
};
