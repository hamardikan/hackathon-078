class AudioManager {
    constructor() {
        this.bgm = new Audio('./assets/audio/04 - Hey, it\'s Your Turn!.mp3');
        this.bgm.loop = true;
        this.bgm.volume = 0.5;
        this.isMuted = false;
        
        // Create controls first
        this.createAudioControls();
        
        // Try to play immediately
        this.bgm.play().catch(error => {
            console.log("Autoplay failed, waiting for user interaction:", error);
            document.addEventListener('click', () => this.bgm.play(), { once: true });
        });
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

        const toggleBtn = document.getElementById('toggle-music');
        const volumeSlider = document.getElementById('volume-slider');

        toggleBtn.addEventListener('click', () => this.toggleMusic());
        volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value / 100));
    }

    toggleMusic() {
        const toggleBtn = document.getElementById('toggle-music');
        const musicOn = toggleBtn.querySelector('.music-on');
        const musicOff = toggleBtn.querySelector('.music-off');

        if (this.isMuted) {
            this.bgm.volume = document.getElementById('volume-slider').value / 100;
            musicOn.style.display = 'inline';
            musicOff.style.display = 'none';
            this.bgm.play();
        } else {
            this.bgm.volume = 0;
            musicOn.style.display = 'none';
            musicOff.style.display = 'inline';
            this.bgm.pause();
        }
        
        this.isMuted = !this.isMuted;
    }

    setVolume(value) {
        if (!this.isMuted) {
            this.bgm.volume = value;
        }
    }
}

// Create the audio manager as soon as the script loads
const audioManager = new AudioManager();