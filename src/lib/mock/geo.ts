// City coords mapped to our stylized SVG viewBox (0..1000 x 0..600).
// Europe + ME composition. Tuned by eye for the stylized map.
export const cityPoints: Record<string, { x: number; y: number; label: string }> = {
  "London, UK": { x: 392, y: 198, label: "London" },
  "Cotswolds, UK": { x: 378, y: 212, label: "Cotswolds" },
  "Lisbon, PT": { x: 308, y: 348, label: "Lisbon" },
  "Porto, PT": { x: 305, y: 318, label: "Porto" },
  "Algarve, PT": { x: 322, y: 372, label: "Algarve" },
  "Comporta, PT": { x: 314, y: 358, label: "Comporta" },
  "Milan, IT": { x: 510, y: 268, label: "Milan" },
  "Dubai, AE": { x: 798, y: 408, label: "Dubai" },
};

export function cityFor(location: string) {
  return cityPoints[location] ?? { x: 500, y: 300, label: location };
}

export function regionFor(location: string): "EU" | "UK" | "ME" {
  if (location.includes("UK")) return "UK";
  if (location.includes("AE")) return "ME";
  return "EU";
}
