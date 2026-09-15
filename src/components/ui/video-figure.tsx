import type { VideoRef } from "@/data/conveyors";

/**
 * A short muted loop with a poster frame — the same pattern as the hub hero,
 * sized as a figure. Autoplays inline, no controls, no sound, so it reads as
 * a moving photograph rather than a video player.
 */
export function VideoFigure({ video, aspect = "aspect-video", className = "" }: { video: VideoRef; aspect?: string; className?: string }) {
  return (
    <figure className={`m-0 ${className}`}>
      <div className={`relative ${aspect} rounded-xl overflow-hidden border border-white/[0.08] bg-black/40`}>
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={video.poster}
          aria-label={video.alt}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={video.src} type="video/mp4" />
        </video>
      </div>
      {video.caption && <figcaption className="font-sans text-[0.76rem] text-text-dim mt-2 leading-[1.5]">{video.caption}</figcaption>}
    </figure>
  );
}
