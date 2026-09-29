import * as nsfwjs from "nsfwjs";
import * as tf from "@tensorflow/tfjs";

let model = null;

// ✅ Load NSFW model
export const loadModel = async () => {
  if (!model) {
    model = await nsfwjs.load();
  }
};

// ✅ Main video check using Native Browser Processing (Zero FFmpeg Crashes)
export const checkVideo = async (videoFile) => {
  try {
    // 🛑 File size limit (prevent memory freezing)
    if (videoFile.size > 20 * 1024 * 1024) {
      console.error("Video too large");
      return false; // Over 20MB block
    }

    await loadModel();

    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.src = URL.createObjectURL(videoFile);
      video.muted = true;
      video.playsInline = true;
      video.preload = "auto";
      
      // Force hardware decoding by appending it invisibly to the DOM
      video.style.position = "fixed";
      video.style.top = "-9999px";
      video.style.opacity = "0";
      document.body.appendChild(video);

      const cleanup = () => {
        if (video.parentNode) {
          video.parentNode.removeChild(video);
        }
        URL.revokeObjectURL(video.src);
      };

      video.onloadeddata = async () => {
        // Automatically bypass audio-only files
        if (video.videoWidth === 0 || video.videoHeight === 0) {
          cleanup();
          return resolve(true);
        }

        let isSafe = true;
        const duration = video.duration && !isNaN(video.duration) && video.duration !== Infinity ? video.duration : 1;
        
        const checks = 4;
        let successfulFrames = 0;
        
        for (let i = 0; i < checks; i++) {
          video.currentTime = (duration / (checks + 1)) * (i + 1);
          
          await new Promise((res) => {
            let scanTimeout;

            const onSeeked = () => {
              video.removeEventListener("seeked", onSeeked);
              clearTimeout(scanTimeout);

              // Give codec a fractional second to buffer the pixel pipeline 
              setTimeout(async () => {
                try {
                  const canvas = document.createElement("canvas");
                  canvas.width = video.videoWidth || 224;
                  canvas.height = video.videoHeight || 224;
                  const ctx = canvas.getContext("2d");
                  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                  // Detect if canvas drew completely black (decoder failed)
                  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
                  let isBlank = true;
                  // Skip alpha channel (i += 4)
                  for (let p = 0; p < pixels.length; p += 4) {
                    if (pixels[p] !== 0 || pixels[p+1] !== 0 || pixels[p+2] !== 0) {
                      isBlank = false;
                      break;
                    }
                  }

                  // Only scan non-blank true frames
                  if (!isBlank) {
                    successfulFrames++;
                    const predictions = await model.classify(canvas);
                    const porn = predictions.find(p => p.className === "Porn")?.probability || 0;
                    const hentai = predictions.find(p => p.className === "Hentai")?.probability || 0;
                    const sexy = predictions.find(p => p.className === "Sexy")?.probability || 0;
                    
                    // We catch generic obvious explicit content. 
                    if (porn > 0.4 || hentai > 0.4 || sexy > 0.8) {
                      isSafe = false;
                    }
                  }
                } catch (e) {
                  console.error("Frame evaluation failed:", e);
                }
                res();
              }, 50); // slight delay handles race conditions
            };
            
            video.addEventListener("seeked", onSeeked);
            
            scanTimeout = setTimeout(() => {
              video.removeEventListener("seeked", onSeeked);
              res();
            }, 6000);
          });

          if (!isSafe) break;
        }

        cleanup();

        // If no frames successfully drew (OS codec failure), return false in strict mode
        if (successfulFrames === 0) {
          console.error("Hardware codec failed to render explicitly checking frames.");
          return resolve(false); 
        }

        resolve(isSafe); 
      };

      video.onerror = () => {
        cleanup();
        resolve(true); 
      };
    });
  } catch (err) {
    console.error("❌ Video moderation error:", err);
    return false; // Strict fallback handling
  }
};