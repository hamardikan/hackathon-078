// Create audio manager
class AudioManager {
    constructor() {
        this.bgm = new Audio('./assets/audio/Aves - Coffee Stop.mp3'); // Add your music file
        this.bgm.loop = true;
        this.bgm.volume = 0.5; // Set default volume to 50%
        this.isMuted = false;
        
        // Initialize audio controls
        this.createAudioControls();
    }

    createAudioControls() {
        const controls = document.createElement('div');
        controls.id = 'audio-controls';
        controls.innerHTML = `
            <button id="toggle-music" class="audio-btn">
                <span class="music-on">🔊</span>
                <span class="music-off" style="display: none;">🔇</span>
            </button>
            <input type="range" id="volume-slider" min="0" max="100" value="50">
        `;
        document.body.appendChild(controls);

        // Add event listeners
        const toggleBtn = document.getElementById('toggle-music');
        const volumeSlider = document.getElementById('volume-slider');

        toggleBtn.addEventListener('click', () => this.toggleMusic());
        volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value / 100));
    }

    playMusic() {
        const playPromise = this.bgm.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Autoplay prevented:", error);
            });
        }
    }

    pauseMusic() {
        this.bgm.pause();
    }

    toggleMusic() {
        const toggleBtn = document.getElementById('toggle-music');
        const musicOn = toggleBtn.querySelector('.music-on');
        const musicOff = toggleBtn.querySelector('.music-off');

        if (this.isMuted) {
            this.bgm.volume = document.getElementById('volume-slider').value / 100;
            musicOn.style.display = 'inline';
            musicOff.style.display = 'none';
            this.playMusic();
        } else {
            this.bgm.volume = 0;
            musicOn.style.display = 'none';
            musicOff.style.display = 'inline';
            this.pauseMusic();
        }
        
        this.isMuted = !this.isMuted;
    }

    setVolume(value) {
        if (!this.isMuted) {
            this.bgm.volume = value;
        }
    }
}

// Initialize audio manager
const audioManager = new AudioManager();

// Auto-play music on user interaction
document.addEventListener('keydown', () => {
    audioManager.playMusic();
}, { once: true });