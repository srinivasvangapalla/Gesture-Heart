
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

export function captureFrameAsBase64(videoElement: HTMLVideoElement): string | null {
    if (!ctx) return null;

    const { videoWidth, videoHeight } = videoElement;
    if (videoWidth === 0 || videoHeight === 0) {
        return null;
    }
    
    canvas.width = videoWidth;
    canvas.height = videoHeight;
    
    ctx.drawImage(videoElement, 0, 0, videoWidth, videoHeight);
    
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    
    // Strip the data URL prefix to get the pure base64 string
    const base64Prefix = 'data:image/jpeg;base64,';
    if (dataUrl.startsWith(base64Prefix)) {
        return dataUrl.substring(base64Prefix.length);
    }
    
    return null;
}
