export type GenStatus = "completed" | "processing" | "queued" | "failed";

export type Generation = {
  id: string;
  prompt: string;
  negativePrompt?: string;
  model: string;
  style: string;
  resolution: string;
  aspect: string;
  seed: number;
  steps: number;
  cfg: number;
  credits: number;
  timeSec: number;
  createdAt: string;
  favorite: boolean;
  project: string;
  tags: string[];
  category: string;
  image: string;
  status: GenStatus;
};

const img = (seed: string, w = 800, h = 1000) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

const PROMPTS: Array<[string, string, string]> = [
  ["Futuristic cyberpunk city at night, neon reflections on wet asphalt, cinematic lighting, ultra detailed", "Sci-Fi", "cyberpunk"],
  ["Editorial portrait of a woman in emerald silk, softbox studio lighting, 85mm, shallow depth of field", "Photorealistic", "portrait"],
  ["Minimalist ceramic coffee cup on travertine podium, product photography, soft shadows", "Product Photography", "product"],
  ["Snow-covered mountain range at golden hour, volumetric light, aerial drone shot", "Cinematic", "landscape"],
  ["Anime heroine with silver hair standing in a rain-soaked alley, cel shaded, vibrant", "Anime", "anime"],
  ["Brutalist concrete museum with reflecting pool, overcast light, architectural photography", "Architecture", "architecture"],
  ["Matte black electric hypercar on salt flats, dusk, rim light, 35mm", "Cinematic", "cars"],
  ["Rustic sourdough bread with melted butter, macro food photography, warm window light", "Photorealistic", "food"],
  ["Floating archipelago with waterfalls and ancient ruins, fantasy concept art", "Fantasy", "fantasy"],
  ["Fashion campaign, model in structured trench coat, brutalist backdrop, high contrast", "Fashion", "fashion"],
  ["YouTube thumbnail, shocked creator face, bold gradient background, high saturation", "Illustration", "thumbnail"],
  ["Isometric 3D render of a tiny cozy bookstore, clay materials, soft global illumination", "3D", "3d"],
  ["Watercolor illustration of a Kyoto street in spring, loose brush strokes", "Watercolor", "illustration"],
  ["Astronaut resting on a lunar dune, earthrise in background, cinematic 2.39:1", "Sci-Fi", "scifi"],
  ["Luxury skincare bottle in a splash of water, frozen motion, studio strobes", "Product Photography", "product"],
  ["Pixel art of a neon arcade at midnight, 32-bit palette", "Pixel Art", "pixel"],
  ["Oil painting of a stormy sea with a lone lighthouse, impasto texture", "Oil Painting", "painting"],
  ["Character design sheet, cyber samurai, front side back views, concept art", "Concept Art", "character"],
  ["Interior of a warm Scandinavian living room, morning light, architectural digest", "Architecture", "interior"],
  ["Macro shot of a dew-covered blue butterfly on a fern, natural light", "Photorealistic", "nature"],
];

const MODELS_SHORT = [
  "PixelForge Pro",
  "PixelForge Fast",
  "Flux Pro",
  "Flux Dev",
  "SDXL 1.5",
  "Realistic Vision",
  "Anime Studio",
  "Cinematic XL",
  "Illustration Pro",
];

const PROJECT_NAMES = [
  "E-commerce Campaign",
  "YouTube Thumbnails",
  "Character Design",
  "Product Photography",
  "Marketing Campaign",
  "Brand Refresh 2026",
  "Editorial Shoot",
  "Game Concepts",
  "Food Menu Assets",
  "Travel Series",
];

const RESOLUTIONS = ["1024 × 1024", "1536 × 1024", "2048 × 2048", "1024 × 1792", "3840 × 2160"];
const ASPECTS = ["1:1", "16:9", "4:3", "9:16", "3:2"];

export const generations: Generation[] = Array.from({ length: 36 }, (_, i) => {
  const [prompt, style, cat] = PROMPTS[i % PROMPTS.length]!;
  const tall = i % 3 === 0;
  return {
    id: `gen_${(1000 + i).toString()}`,
    prompt,
    negativePrompt: "blurry, low quality, distorted hands, extra fingers, artifacts",
    model: MODELS_SHORT[i % MODELS_SHORT.length]!,
    style,
    resolution: RESOLUTIONS[i % RESOLUTIONS.length]!,
    aspect: ASPECTS[i % ASPECTS.length]!,
    seed: 100000 + i * 7331,
    steps: 28 + (i % 4) * 6,
    cfg: 4.5 + (i % 5) * 0.5,
    credits: 4 + (i % 6) * 2,
    timeSec: 3.2 + (i % 7) * 1.4,
    createdAt: new Date(Date.now() - i * 3600_000 * 7).toISOString(),
    favorite: i % 5 === 0,
    project: PROJECT_NAMES[i % PROJECT_NAMES.length]!,
    tags: [cat, style.toLowerCase(), "demo"],
    category: cat,
    image: img(`pf-${cat}-${i}`, 800, tall ? 1100 : 800),
    status: "completed",
  };
});

export type Project = {
  id: string;
  name: string;
  assets: number;
  updated: string;
  owner: string;
  storage: string;
  cover: string;
  color: string;
};

export const projects: Project[] = PROJECT_NAMES.map((name, i) => ({
  id: `prj_${i + 1}`,
  name,
  assets: 48 + i * 37,
  updated: ["2 hours ago", "Yesterday", "3 days ago", "Last week"][i % 4]!,
  owner: ["Himanshu Goel", "Aria Chen", "Marcus Webb"][i % 3]!,
  storage: `${(1.2 + i * 0.8).toFixed(1)} GB`,
  cover: generations[(i * 2) % generations.length]!.image,
  color: ["from-violet-500", "from-cyan-500", "from-fuchsia-500", "from-indigo-500"][i % 4]!,
}));

export type AiModel = {
  id: string;
  name: string;
  description: string;
  version: string;
  speed: number;
  quality: number;
  cost: number;
  tags: string[];
  recommended?: boolean;
  preview: string;
};

export const models: AiModel[] = [
  { id: "pf-pro", name: "PixelForge Pro", description: "Our flagship model. Best-in-class prompt adherence and photoreal detail.", version: "v3.2", speed: 3, quality: 5, cost: 8, tags: ["Photoreal", "Flagship"], recommended: true, preview: img("model-pro", 600, 400) },
  { id: "pf-fast", name: "PixelForge Fast", description: "Sub-two-second drafts for rapid ideation and batch exploration.", version: "v3.2", speed: 5, quality: 3, cost: 2, tags: ["Fast", "Draft"], preview: img("model-fast", 600, 400) },
  { id: "flux-pro", name: "Flux Pro", description: "Exceptional typography and complex composition handling.", version: "v1.1", speed: 3, quality: 5, cost: 7, tags: ["Text", "Composition"], preview: img("model-flux", 600, 400) },
  { id: "flux-dev", name: "Flux Dev", description: "Open-weight variant, great for experimentation and LoRA stacking.", version: "v1.0", speed: 4, quality: 4, cost: 4, tags: ["Open", "LoRA"], preview: img("model-fluxdev", 600, 400) },
  { id: "sdxl", name: "SDXL 1.5", description: "Reliable general-purpose diffusion with a huge style ecosystem.", version: "v1.5", speed: 4, quality: 4, cost: 3, tags: ["General"], preview: img("model-sdxl", 600, 400) },
  { id: "realistic", name: "Realistic Vision", description: "Tuned for human skin, fabric and natural lighting realism.", version: "v6.0", speed: 3, quality: 5, cost: 6, tags: ["Portrait", "Photoreal"], preview: img("model-real", 600, 400) },
  { id: "anime", name: "Anime Studio", description: "Clean line art, cel shading and expressive character work.", version: "v4.1", speed: 4, quality: 4, cost: 3, tags: ["Anime", "Character"], preview: img("model-anime", 600, 400) },
  { id: "cinematic", name: "Cinematic XL", description: "Filmic color science, anamorphic flares and dramatic lighting.", version: "v2.4", speed: 3, quality: 5, cost: 7, tags: ["Film", "Moody"], preview: img("model-cine", 600, 400) },
  { id: "illustration", name: "Illustration Pro", description: "Editorial illustration, vector-like shapes and poster design.", version: "v2.0", speed: 4, quality: 4, cost: 4, tags: ["Vector", "Poster"], preview: img("model-illus", 600, 400) },
];

export type BatchJob = {
  id: string;
  name: string;
  total: number;
  completed: number;
  failed: number;
  status: "processing" | "completed" | "queued" | "paused" | "failed";
  credits: number;
  started: string;
  eta: string;
  model: string;
};

export const batchJobs: BatchJob[] = [
  { id: "btc_5001", name: "Spring Catalog — 512 product shots", total: 512, completed: 384, failed: 6, status: "processing", credits: 2048, started: "18 min ago", eta: "7 min", model: "PixelForge Pro" },
  { id: "btc_5002", name: "YouTube Thumbnail A/B set", total: 120, completed: 120, failed: 0, status: "completed", credits: 480, started: "2 hours ago", eta: "—", model: "Illustration Pro" },
  { id: "btc_5003", name: "Character turnaround sheets", total: 96, completed: 41, failed: 2, status: "paused", credits: 384, started: "40 min ago", eta: "Paused", model: "Anime Studio" },
  { id: "btc_5004", name: "Lifestyle backgrounds — Q3", total: 240, completed: 240, failed: 3, status: "completed", credits: 960, started: "Yesterday", eta: "—", model: "Cinematic XL" },
  { id: "btc_5005", name: "Fashion lookbook variations", total: 180, completed: 0, failed: 0, status: "queued", credits: 720, started: "—", eta: "Queued", model: "Realistic Vision" },
  { id: "btc_5006", name: "Food menu hero images", total: 64, completed: 64, failed: 1, status: "completed", credits: 256, started: "2 days ago", eta: "—", model: "PixelForge Pro" },
  { id: "btc_5007", name: "Ad creative sweep — EU", total: 320, completed: 298, failed: 22, status: "failed", credits: 1280, started: "3 days ago", eta: "—", model: "Flux Pro" },
  { id: "btc_5008", name: "Interior style exploration", total: 144, completed: 144, failed: 0, status: "completed", credits: 576, started: "4 days ago", eta: "—", model: "SDXL 1.5" },
  { id: "btc_5009", name: "Game environment concepts", total: 200, completed: 88, failed: 4, status: "processing", credits: 800, started: "12 min ago", eta: "21 min", model: "Flux Dev" },
  { id: "btc_5010", name: "Holiday campaign teasers", total: 80, completed: 80, failed: 0, status: "completed", credits: 320, started: "Last week", eta: "—", model: "Cinematic XL" },
];

export type Template = {
  id: string;
  name: string;
  prompt: string;
  settings: string[];
  uses: number;
  cover: string;
};

export const templates: Template[] = [
  ["Product Hero Shot", "Premium product photography of {{product}} on {{background}}, studio strobes, crisp reflections", ["4K", "16:9", "Cinematic"]],
  ["YouTube Thumbnail", "Bold thumbnail of {{subject}}, dramatic expression, high-contrast gradient backdrop", ["1280×720", "16:9", "Illustration"]],
  ["Instagram Post", "Lifestyle square crop of {{subject}}, warm natural light, editorial grade", ["1024²", "1:1", "Photoreal"]],
  ["Product Listing", "Clean white-background listing image of {{product}}, even lighting, no shadows", ["2048²", "1:1", "Product"]],
  ["Fashion Campaign", "High fashion editorial of {{model}} in {{outfit}}, brutalist set, hard light", ["4K", "3:2", "Fashion"]],
  ["Portrait", "Studio portrait of {{subject}}, 85mm, soft key with rim light, shallow depth", ["2048²", "4:5", "Realistic"]],
  ["Book Cover", "Atmospheric book cover art for {{title}}, moody palette, negative space for type", ["1600×2400", "2:3", "Concept"]],
  ["Logo Concept", "Minimal abstract logo mark for {{brand}}, geometric, monochrome on neutral", ["1024²", "1:1", "Minimal"]],
  ["Ad Creative", "Performance ad creative for {{product}} with bold value proposition space", ["1080²", "1:1", "Marketing"]],
  ["Cinematic Still", "Anamorphic film still of {{scene}}, teal and orange grade, volumetric haze", ["4K", "2.39:1", "Film"]],
  ["Anime Key Visual", "Anime key visual of {{character}}, dynamic pose, dramatic sky", ["2048²", "16:9", "Anime"]],
  ["Architecture Render", "Photoreal exterior render of {{building}}, dusk, warm interior glow", ["4K", "16:9", "Arch"]],
].map(([name, prompt, settings], i) => ({
  id: `tpl_${i + 1}`,
  name: name as string,
  prompt: prompt as string,
  settings: settings as string[],
  uses: 120 + i * 47,
  cover: generations[(i * 3 + 1) % generations.length]!.image,
}));

export type Notification = {
  id: string;
  title: string;
  body: string;
  time: string;
  type: "batch" | "generation" | "credits" | "model" | "export" | "billing";
  unread: boolean;
};

export const notifications: Notification[] = [
  ["Batch completed", "“YouTube Thumbnail A/B set” finished — 120 images ready.", "batch"],
  ["Generation completed", "4 images from “cyberpunk city at night” are ready.", "generation"],
  ["Credits running low", "You have 8,420 credits left (14% of your monthly plan).", "credits"],
  ["New model available", "Cinematic XL v2.4 is live with improved night lighting.", "model"],
  ["Export completed", "batch-5002-results.zip (1.8 GB) is ready to download.", "export"],
  ["Payment successful", "Pro plan renewed — invoice INV-2026-0914 issued.", "billing"],
  ["Batch paused", "“Character turnaround sheets” paused at 41/96.", "batch"],
  ["Upscale finished", "12 images upscaled to 4× with face enhancement.", "generation"],
  ["Team invite accepted", "Aria Chen joined your workspace as Editor.", "model"],
  ["Batch failed items", "22 items failed in “Ad creative sweep — EU”. Retry available.", "batch"],
  ["Storage milestone", "You are using 38.4 GB of 100 GB storage.", "credits"],
  ["Template saved", "“Product Hero Shot” was updated by Marcus Webb.", "export"],
  ["API key created", "Key “production-server” was created.", "billing"],
  ["Model deprecated", "SDXL 1.0 retires on 1 Oct — migrate to SDXL 1.5.", "model"],
  ["Generation failed", "1 image failed: model temporarily unavailable.", "generation"],
  ["Batch started", "“Game environment concepts” started — 200 items.", "batch"],
  ["Weekly summary", "2,418 images generated this month, up 18.2%.", "export"],
  ["Shared project", "Marcus Webb shared “Brand Refresh 2026” with you.", "model"],
  ["Credits added", "5,000 bonus credits applied to your workspace.", "credits"],
  ["Invoice available", "INV-2026-0814 is ready to download.", "billing"],
].map(([title, body, type], i) => ({
  id: `ntf_${i + 1}`,
  title: title as string,
  body: body as string,
  time: i < 3 ? `${(i + 1) * 6} min ago` : i < 8 ? `${i} hours ago` : `${i - 6} days ago`,
  type: type as Notification["type"],
  unread: i < 6,
}));

export const usageSeries = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}`,
  images: 60 + Math.round(Math.sin(i / 2.4) * 28 + i * 1.9 + (i % 5) * 7),
  credits: 260 + Math.round(Math.cos(i / 3) * 90 + i * 8),
  batch: 4 + ((i * 3) % 9),
  storage: 18 + i * 0.7,
  success: 96 + ((i * 7) % 4),
}));

export const invoices = [
  { id: "INV-2026-0914", date: "14 Sep 2026", amount: "$99.00", plan: "Pro Monthly", status: "Paid" },
  { id: "INV-2026-0814", date: "14 Aug 2026", amount: "$99.00", plan: "Pro Monthly", status: "Paid" },
  { id: "INV-2026-0714", date: "14 Jul 2026", amount: "$99.00", plan: "Pro Monthly", status: "Paid" },
  { id: "INV-2026-0614", date: "14 Jun 2026", amount: "$49.00", plan: "Starter Monthly", status: "Paid" },
  { id: "INV-2026-0514", date: "14 May 2026", amount: "$49.00", plan: "Starter Monthly", status: "Refunded" },
];

export const apiKeys = [
  { id: "key_1", name: "production-server", prefix: "pf_live_9f2a••••••••7c41", created: "12 Mar 2026", lastUsed: "4 minutes ago", scope: "Full access" },
  { id: "key_2", name: "batch-worker", prefix: "pf_live_31bd••••••••a902", created: "28 Apr 2026", lastUsed: "2 hours ago", scope: "Batch only" },
  { id: "key_3", name: "staging", prefix: "pf_test_77ce••••••••1f5b", created: "02 Jun 2026", lastUsed: "Yesterday", scope: "Read only" },
  { id: "key_4", name: "zapier-integration", prefix: "pf_live_04aa••••••••be18", created: "19 Aug 2026", lastUsed: "Never", scope: "Generate only" },
];

export const team = [
  { id: "u1", name: "Himanshu Goel", email: "himanshu@pixelforge.ai", role: "Owner", status: "Active", avatar: img("av-himanshu", 200, 200) },
  { id: "u2", name: "Aria Chen", email: "aria@pixelforge.ai", role: "Admin", status: "Active", avatar: img("av-aria", 200, 200) },
  { id: "u3", name: "Marcus Webb", email: "marcus@pixelforge.ai", role: "Editor", status: "Active", avatar: img("av-marcus", 200, 200) },
  { id: "u4", name: "Sofia Almeida", email: "sofia@pixelforge.ai", role: "Editor", status: "Invited", avatar: img("av-sofia", 200, 200) },
  { id: "u5", name: "Nate Brooks", email: "nate@pixelforge.ai", role: "Viewer", status: "Active", avatar: img("av-nate", 200, 200) },
];

export const styles = [
  "Photorealistic", "Cinematic", "Anime", "Illustration", "3D", "Concept Art",
  "Fashion", "Product Photography", "Architecture", "Fantasy", "Sci-Fi",
  "Minimalist", "Watercolor", "Oil Painting", "Pixel Art",
].map((name, i) => ({ name, thumb: img(`style-${name}`, 300, 300), id: `sty_${i}` }));

export const user = {
  name: "Himanshu Goel",
  firstName: "Himanshu",
  email: "himanshu@pixelforge.ai",
  plan: "Pro",
  credits: 8420,
  creditsTotal: 10000,
  avatar: img("av-himanshu", 200, 200),
};

export const randomPrompts = PROMPTS.map((p) => p[0]);
