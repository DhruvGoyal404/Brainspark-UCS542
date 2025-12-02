/**
 * Social Share Card Generator using Canvas API
 * Generates custom result images for social media sharing
 */

export const generateShareCard = async (data) => {
    const {
        score,
        quizTitle,
        username,
        level,
        accuracy,
        streak,
    } = data;

    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630; // Standard social media card size
    const ctx = canvas.getContext('2d');

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#6366f1');
    gradient.addColorStop(1, '#10b981');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add noise texture
    ctx.globalAlpha = 0.05;
    for (let i = 0; i < 10000; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        ctx.fillStyle = Math.random() > 0.5 ? '#fff' : '#000';
        ctx.fillRect(x, y, 1, 1);
    }
    ctx.globalAlpha = 1;

    // White overlay
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fillRect(50, 50, canvas.width - 100, canvas.height - 100);

    // Draw score circle
    const centerX = 300;
    const centerY = canvas.height / 2;
    const radius = 120;

    // Circle background
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#f3f4f6';
    ctx.fill();

    // Progress circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, (Math.PI * 2 * score / 100) - Math.PI / 2);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 20;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Score text
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 80px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${score}%`, centerX, centerY);

    // Quiz title
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 56px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(quizTitle, 500, 150);

    // Username
    ctx.fillStyle = '#6366f1';
    ctx.font = '32px Inter, sans-serif';
    ctx.fillText(`@${username}`, 500, 220);

    // Stats
    const stats = [
        { label: 'Accuracy', value: `${accuracy}%`, y: 320 },
        { label: 'Level', value: level, y: 390 },
        { label: 'Streak', value: `${streak} days 🔥`, y: 460 },
    ];

    stats.forEach(stat => {
        ctx.fillStyle = '#6b7280';
        ctx.font = '24px Inter, sans-serif';
        ctx.fillText(stat.label, 500, stat.y);

        ctx.fillStyle = '#1f2937';
        ctx.font = 'bold 32px Inter, sans-serif';
        ctx.fillText(stat.value, 700, stat.y);
    });

    // BrainSpark logo/branding
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 36px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('BrainSpark 🧠', canvas.width - 100, canvas.height - 80);

    // Convert to blob and return
    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            resolve({
                blob,
                dataUrl: canvas.toDataURL('image/png'),
                canvas,
            });
        }, 'image/png');
    });
};

/**
 * Download share card
 */
export const downloadShareCard = async (data, filename = 'brainspark-result.png') => {
    const { dataUrl } = await generateShareCard(data);

    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
};

/**
 * Share to social media
 */
export const shareToSocial = async (data, platform = 'twitter') => {
    const shareText = `I just scored ${data.score}% on "${data.quizTitle}" on BrainSpark! 🧠✨`;
    const urls = {
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(shareText)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
    };

    if (urls[platform]) {
        window.open(urls[platform], '_blank', 'width=600,height=400');
    }
};

export default {
    generateShareCard,
    downloadShareCard,
    shareToSocial,
};
