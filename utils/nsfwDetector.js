let model = null;

export const detectNSFW = async (file) => {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const nsfwjs = await import("nsfwjs");
    await import("@tensorflow/tfjs");

    if (!model) {
      model = await nsfwjs.load();
    }

    const img = new Image();
    img.src = URL.createObjectURL(file);

    await new Promise((resolve) => {
      img.onload = resolve;
    });

    const predictions = await model.classify(img);

    console.log("NSFW Predictions:", predictions);

    const porn = predictions.find(p => p.className === "Porn")?.probability || 0;
    const hentai = predictions.find(p => p.className === "Hentai")?.probability || 0;
    const sexy = predictions.find(p => p.className === "Sexy")?.probability || 0;

    if (porn > 0.6 || hentai > 0.5 || sexy > 0.6) {
      return true;
    }

    return false;

  } catch (error) {
    console.error("NSFW detection error:", error);
    return false;
  }
};