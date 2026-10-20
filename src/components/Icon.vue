<script setup lang="ts">
import { computed } from "vue";
import {
  Leaf,
  MapPin,
  ArrowUpRight,
  ArrowRight,
  Search,
  ChevronDown,
  Menu,
  X,
  Monitor,
  BatteryMedium,
  Droplets,
  Pill,
  Newspaper,
  Milk,
  Wine,
  Package,
  Lightbulb,
  CircleDot,
  Armchair,
  ShieldCheck,
  Check,
  Navigation,
  Map,
  List,
  LocateFixed,
  Recycle,
  Sprout,
  Heart,
  Plus,
  ExternalLink,
  Clock,
  AlertCircle,
  ArrowLeft,
  Share2,
  Download,
  LogOut,
  Pencil,
  CheckCircle2,
  LoaderCircle,
  CircleHelp,
  Mail,
  LockKeyhole,
} from "@lucide/vue";
const props = defineProps<{
  name: string;
  size?: number;
  strokeWidth?: number;
}>();
const icons: Record<string, any> = {
  Leaf,
  MapPin,
  ArrowUpRight,
  ArrowRight,
  Search,
  ChevronDown,
  Menu,
  X,
  Monitor,
  BatteryMedium,
  Droplets,
  Pill,
  Newspaper,
  Milk,
  Wine,
  Package,
  Lightbulb,
  CircleDot,
  Armchair,
  ShieldCheck,
  Check,
  Navigation,
  Map,
  List,
  LocateFixed,
  Recycle,
  Sprout,
  Heart,
  Plus,
  ExternalLink,
  Clock,
  AlertCircle,
  ArrowLeft,
  Share2,
  Download,
  LogOut,
  Pencil,
  CheckCircle2,
  LoaderCircle,
  CircleHelp,
  Mail,
  LockKeyhole,
};
const icon = computed(() => icons[props.name] || Leaf);
</script>
<template>
  <component
    :is="icon"
    :size="size || 20"
    :stroke-width="strokeWidth || 1.7"
    aria-hidden="true"
  />
</template>
