export interface KnownService {
  name: string;
  aliases?: string[];
}

export const knownServices: KnownService[] = [
  // Streaming / Entertainment
  { name: "Netflix" },
  { name: "Disney+", aliases: ["Disney Plus"] },
  { name: "Amazon Prime", aliases: ["Prime Video"] },
  { name: "Apple TV+", aliases: ["Apple TV Plus"] },
  { name: "HBO Max", aliases: ["Max"] },
  { name: "Hulu" },
  { name: "YouTube Premium", aliases: ["YouTube Music"] },
  { name: "Twitch Turbo" },
  { name: "Crunchyroll" },

  // Music
  { name: "Spotify" },
  { name: "Apple Music" },
  { name: "Tidal" },

  // Cloud & Dev Tools
  { name: "GitHub Pro", aliases: ["GitHub Copilot"] },
  { name: "Vercel Pro" },
  { name: "AWS", aliases: ["Amazon Web Services"] },
  { name: "Google Cloud", aliases: ["GCP"] },
  { name: "Azure" },
  { name: "DigitalOcean" },
  { name: "Cloudflare" },
  { name: "Heroku" },
  { name: "JetBrains", aliases: ["IntelliJ", "WebStorm", "PyCharm"] },

  // Productivity
  { name: "Notion" },
  { name: "Figma" },
  { name: "Slack" },
  { name: "Zoom" },
  { name: "Microsoft 365", aliases: ["Office 365"] },
  { name: "Google Workspace", aliases: ["Google One"] },
  { name: "Dropbox" },
  { name: "1Password" },
  { name: "Todoist" },
  { name: "Linear" },

  // AI
  { name: "ChatGPT Plus", aliases: ["OpenAI"] },
  { name: "Claude Pro", aliases: ["Anthropic"] },
  { name: "Midjourney" },
  { name: "Perplexity Pro" },

  // Korean Services
  { name: "쿠팡 로켓와우", aliases: ["Coupang", "로켓와우"] },
  { name: "네이버 플러스", aliases: ["Naver Plus", "네이버플러스"] },
  { name: "카카오톡 이모티콘 플러스", aliases: ["카카오 이모티콘"] },
  { name: "TVING", aliases: ["티빙"] },
  { name: "Wavve", aliases: ["웨이브"] },
  { name: "Watcha", aliases: ["왓챠"] },
  { name: "멜론", aliases: ["Melon"] },
  { name: "밀리의 서재", aliases: ["밀리"] },
  { name: "리디 셀렉트", aliases: ["리디북스", "RIDI"] },
  { name: "요기패스", aliases: ["요기요"] },

  // Japanese Services
  { name: "U-NEXT" },
  { name: "dアニメストア", aliases: ["d Anime Store"] },
  { name: "Abema Premium", aliases: ["AbemaTV"] },
];
