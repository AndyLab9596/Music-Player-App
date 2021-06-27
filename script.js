/**
 * 
 * 1. Render songs
 * 2. Scropp top
 * 3. Play / pause / seek
 * 4. CD rotate 
 * 5. Next / Prev
 * 6. Random 
 * 7. Next / Repeat when ended
 * 8. Active song
 * 9. Scroll active song into view
 * 10. Playsong when clicking
 * 
 */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const playlist = $('.playlist');
const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');

console.log(randomBtn);

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: 'Bỏ lỡ nhau rồi',
            singer: 'Hải Nam',
            path: './assets/music/song1.mp3',
            image: './assets/img/img1.jpg',
        },
        {
            name: 'Đường tôi chở em về',
            singer: 'Bùi Trường Linh',
            path: './assets/music/song2.mp3',
            image: './assets/img/img2.jpg',
        },
        {
            name: 'Khi em lớn',
            singer: 'Orange & Hoàng Dũng',
            path: './assets/music/song3.mp3',
            image: './assets/img/img3.jpg',
        },
        {
            name: 'Răng khôn',
            singer: 'Phí Phương Anh',
            path: './assets/music/song4.mp3',
            image: './assets/img/img4.jpg',
        },
        {
            name: 'Sài Gòn hôm nay mưa lớn',
            singer: 'JSOL Hoàng Duyên',
            path: './assets/music/song5.mp3',
            image: './assets/img/img5.jpg',
        },
    ],
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div
                class="thumb"
                style="background-image: url('${song.image}');">
                </div>
                <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        playlist.innerHTML = htmls.join('')
    },

    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },

    handleEvents: function () {
        const _this = this;
        // console.log([cd]);
        const cdWidth = cd.offsetWidth;
        // Xử lý CD rotate and stop:
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 15000, // 15s
            iterations: Infinity
        })

        cdThumbAnimate.pause()

        // Xử lý phóng to / thu nhỏ CD
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        // Xử lý khi click play
        playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause();
                
            } else {
                audio.play();
            }
        }
         
        // Khi song được play thì 
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }

        // Khi song pause thì :
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        // Khi tiến độ bài hát thay đổi:
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration*100);
                progress.value = progressPercent;
            }
        }

        // Xử lý khi tua bài hát:
        progress.onchange = function (e) {
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        }

        // Khi next song:
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong();
                audio.play();
                _this.render();
                _this.scrollToActiveSong();
            }
        }

        // Khi prev song:
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong();
                audio.play();
                _this.render();
                _this.scrollToActiveSong();
            }
        }

        // Xử lý bật / tắt random som
        randomBtn.onclick = function (e) {
            _this.isRandom = !_this.isRandom;
            randomBtn.classList.toggle('active', _this.isRandom);
        }

        // Xử lý bật tắt repeat button:
        repeatBtn.onclick = function(e) {
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }

        // Xử lý next song khi audio ending:
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        }

        // lắng nghe hành vi click vào playlist
        playlist.onclick = function (e) {
            // Xử lý khi click vào song
            const songNode = e.target.closest('.song:not(.active)');
            if (songNode || e.target.closest('.option') ) {
                // Xử lý khi click vào song
                if (songNode) {
                    //getAttribute
                    // console.log(songNode.getAttribute('data-index'))
                    // data-set
                    console.log(songNode.dataset.index);
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }

                // Xử lý khi click vào option
                if (e.target.closest('.option')) {

                }
            }
        }
        },

    scrollToActiveSong: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            })
        },500)
    },

    loadCurrentSong: function () {
        
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;

    },

    nextSong: function () {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong()
    },

    prevSong: function () {
        this.currentIndex--;
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong()
    },

    playRandomSong: function () {
        let newIndex; 
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex == this.currentIndex)
        this.currentIndex = newIndex;
        this.loadCurrentSong()
    },

    start: function () {

        // Định nghĩa các thuộc tính cho object
        this.defineProperties()

        // Lắng nghe / xử lý các sự kiện (DOM Events)
        this.handleEvents()

        //Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong()

        // Render Playlist 
        this.render()
    }
}

app.start()

