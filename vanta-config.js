document.addEventListener('DOMContentLoaded', () => {
    VANTA.FOG({
        el: "#vanta-bg",
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        highlightColor: 0x3c7cff, // A bright, techy blue
        midtoneColor: 0x2c51a3,   // A deep blue
        lowlightColor: 0x1a237e,  // A very dark navy/purple
        baseColor: 0x0a0a0a,      // Matches our dark background
        blurFactor: 0.5,
        speed: 1.2,
        zoom: 0.8
    });
}); 