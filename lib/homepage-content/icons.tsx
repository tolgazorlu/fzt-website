import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Hand,
  Bone,
  Dumbbell,
  Brain,
  Heart,
  Users,
  GraduationCap,
  TrendingUp,
  Award,
} from "lucide-react";
import type { HomepageIconName } from "./schema";

const MAP: Record<HomepageIconName, LucideIcon> = {
  Activity,
  Hand,
  Bone,
  Dumbbell,
  Brain,
  Heart,
  Users,
  GraduationCap,
  TrendingUp,
  Award,
};

export function getHomepageIcon(name: HomepageIconName): LucideIcon {
  return MAP[name] ?? Activity;
}
