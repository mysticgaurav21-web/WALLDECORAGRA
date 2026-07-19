export type Product = {
  id: string;
  slug: string;
  name: string;
  sku: string;
  type: "ready-roll" | "custom";
  category: string;
  room: string[];
  style: string[];
  colour: string;
  material: string;
  pattern: string;
  price: number;
  originalPrice?: number;
  rollWidthFt: number;
  rollLengthFt: number;
  patternRepeatIn: number;
  stock: number;
  rating: number;
  reviewCount: number;
  image: string;
  roomImage: string;
  badge?: string;
  description: string;
};

export type Material = {
  id: string;
  name: string;
  code: string;
  pricePerSqFt: number;
  finish: string;
  durability: number;
  washable: string;
  recommendedFor: string;
};

export type CartItem = {
  id: string;
  name: string;
  image: string;
  unitPrice: number;
  quantity: number;
  type: "ready-roll" | "custom" | "service";
  meta?: Record<string, string | number | boolean>;
};

export type RollCalculationInput = {
  wallWidthFt: number;
  wallHeightFt: number;
  numberOfWalls: number;
  excludedAreaSqFt: number;
  rollWidthFt: number;
  rollLengthFt: number;
  patternRepeatIn: number;
  wastagePercent: number;
  pricePerRoll: number;
  installationPerSqFt: number;
  includeInstallation: boolean;
};

export type RollCalculationResult = {
  grossAreaSqFt: number;
  netAreaSqFt: number;
  adjustedDropLengthFt: number;
  totalDrops: number;
  dropsPerRoll: number;
  minimumRolls: number;
  recommendedRolls: number;
  estimatedWastageSqFt: number;
  productCost: number;
  installationCost: number;
  subtotal: number;
  gst: number;
  total: number;
};
