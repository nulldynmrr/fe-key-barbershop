export const getEmbedUrl = (url, autoplay = false) => {
  if (!url) return null;

  const autoplayParam = autoplay ? "autoplay=1&mute=1" : "autoplay=0";

  // YouTube
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/;
  const youtubeMatch = url.match(youtubeRegex);
  if (youtubeMatch) {
    const separator = url.includes("?") ? "&" : "?";
    return `https://www.youtube.com/embed/${youtubeMatch[1]}?${autoplayParam}&rel=0`;
  }

  // TikTok
  const tiktokRegex = /tiktok\.com\/.*\/video\/(\d+)/;
  const tiktokMatch = url.match(tiktokRegex);
  if (tiktokMatch) {
    return `https://www.tiktok.com/embed/v2/${tiktokMatch[1]}`;
  }

  // Instagram
  const instagramRegex = /instagram\.com\/(?:p|reels|reel)\/([^\/?#&]+)/;
  const instagramMatch = url.match(instagramRegex);
  if (instagramMatch) {
    // Using the /reel/ path can sometimes trigger a better player for reels
    const isReel = url.includes("/reels/") || url.includes("/reel/");
    const path = isReel ? "reel" : "p";
    return `https://www.instagram.com/${path}/${instagramMatch[1]}/embed/?captioned=0`;
  }


  return null;
};

export const getThumbnailUrl = (url) => {
  if (!url) return null;

  // YouTube
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/;
  const youtubeMatch = url.match(youtubeRegex);
  if (youtubeMatch) {
    return `https://img.youtube.com/vi/${youtubeMatch[1]}/maxresdefault.jpg`;
  }

  // Instagram
  const instagramRegex = /instagram\.com\/(?:p|reels|reel)\/([^\/?#&]+)/;
  const instagramMatch = url.match(instagramRegex);
  if (instagramMatch) {
    return `https://www.instagram.com/p/${instagramMatch[1]}/media/?size=l`;
  }

  // TikTok (TikTok doesn't have a simple thumbnail URL pattern, but we can try to use a placeholder or the oembed if needed)
  // For now, we'll return null for TikTok and use a fallback in the UI
  
  return null;
};

