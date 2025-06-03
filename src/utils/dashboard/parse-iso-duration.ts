export function parseISODuration(isoString: string) {
   const match = isoString.match(/PT(?:(\d+)M)?(?:(\d+)S)?/);
   if (!match) {
      return "00:00";
   }
   const minutes = parseInt(match[1] || '0', 10);
   const seconds = parseInt(match[2] || '0', 10);
   const paddedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
   return `${minutes}:${paddedSeconds}`;
}