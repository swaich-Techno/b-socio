import {
  BadgeCheck,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  FileImage,
  Handshake,
  Layout,
  MapPin,
  Megaphone,
  MessageCircle,
  Palette,
  QrCode,
  ScanLine,
  Share2,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Video
} from "lucide-react";

export const iconMap = {
  BadgeCheck,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  FileImage,
  Handshake,
  Layout,
  MapPin,
  Megaphone,
  MessageCircle,
  Palette,
  QrCode,
  ScanLine,
  Share2,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Video
};

export function PublicIcon({ name, className = "", size = 22 }) {
  const Icon = iconMap[name] || Sparkles;
  return <Icon size={size} className={className} aria-hidden="true" />;
}
