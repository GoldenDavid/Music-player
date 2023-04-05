const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const btnPlay = $(".btn.btn-toggle-play");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const cd = $(".cd");
const btnNext = $(".btn.btn-next");
const btnPrev = $(".btn.btn-prev");
const btnRandom = $(".btn.btn-random");
const btnRepeat = $(".btn.btn-repeat");
const progress = $(".progress");

const cdThumbAnimation = cdThumb.animate(
  [
    {
      transform: "rotate(0)",
    },
    {
      transform: "rotate(359deg)",
    },
  ],
  {
    duration: 10000,
    iterations: Infinity,
  }
);

cdThumbAnimation.cancel();

const app = {
  currentIndex: 0,
  isRandom: false,
  isRepeat: false,
  isPlaying: false,
  songs: [
    {
      name: "Nevada",
      singer: "Cozi Zuehlsdorff",
      path: "./music/Nevada - Cozi Zuehlsdorff.mp3",
      image: "./CD/nevada.jpg",
    },
    {
      name: "Guillotine ",
      singer: "Death Grips",
      path: "./music/Death Grips - Guillotine.mp3",
      image: "https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg",
    },
    {
      name: "I've Seen Footage",
      singer: "Death Grips",
      path: "./music/Death Grips - I've Seen Footage.mp3",
      image: "https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg",
    },
    {
      name: "Takyon",
      singer: "Death Grips",
      path: "./music/Death Grips - Takyon (Death Yon).mp3",
      image: "https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg",
    },
    {
      name: "From Embrace To Embrace",
      singer: "Joy wants eternity",
      path: "./music/Joy Wants Eternity - From Embrace To Embrace.mp3",
      image: "https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg",
    },
    {
      name: "Ditto",
      singer: "New Jeans",
      path: "./music/Ditto-NewJeans.mp3",
      image: "./CD/DittoNewJeans.jpg",
    },
    {
      name: "After Like",
      singer: "Ive",
      path: "./music/After Like - IVE.mp3",
      image: "./CD/AfterLike.jpg",
    },
  ],
  render() {
    const htmls = this.songs.map((song) => {
      return `
      <div class="song">
        <div
          class="thumb"
          style="
            background-image: url(${song.image});
          "
        ></div>
        <div class="body">
          <h3 class="title">${song.name}</h3>
          <p class="author">${song.singer}</p>
        </div>
        <div class="option">
          <i class="fas fa-ellipsis-h"></i>
        </div>
      </div>
      `;
    });
    $(".playlist").innerHTML = htmls.join("");
    const songElements = $$(".playlist .song");
    songElements[this.currentIndex].classList.add("active");
    $$(".playlist .song")[this.currentIndex].scrollIntoView({
      behavior: "smooth",
    });
    for (let i = 0; i < songElements.length; i++) {
      songElements[i].addEventListener("click", () => {
        this.currentIndex = i;
        this.loadCurrentSong();
        audio.play();
        this.render();
      });
    }
  },
  defineProperties() {
    Object.defineProperty(this, "currentSong", {
      get() {
        return this.songs[this.currentIndex];
      },
    });
  },
  handleEvents() {
    const cdWidth = cd.offsetWidth;
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newWidth = cdWidth - scrollTop;
      cd.style.width = newWidth >= 0 ? newWidth + "px" : 0;
      cd.style.opacity = newWidth / cdWidth;
    };
    btnPlay.onclick = () => {
      if (!this.isPlaying) {
        audio.play();
      } else {
        audio.pause();
      }
    };

    audio.onplay = () => {
      cdThumbAnimation.play();
      btnPlay.classList.add("player", "playing");
      this.isPlaying = true;
    };

    audio.onpause = () => {
      cdThumbAnimation.pause();
      btnPlay.classList.remove("player", "playing");
      this.isPlaying = false;
    };

    audio.ontimeupdate = () => {
      if (audio.duration) {
        progress.value = (audio.currentTime / audio.duration) * 100;
        if (audio.currentTime === audio.duration) {
          if (this.isRepeat) {
            audio.currentTime = 0;
            audio.play();
            cdThumbAnimation.cancel();
          } else {
            this.nextSong();
            audio.play();
            cdThumbAnimation.cancel();
          }
        }
      }
    };

    progress.oninput = () => {
      audio.currentTime = (progress.value / 100) * audio.duration;
    };

    btnNext.onclick = () => {
      this.nextSong();
      audio.play();
      cdThumbAnimation.cancel();
    };

    btnPrev.onclick = () => {
      cdThumbAnimation.cancel();
      this.prevSong();
      audio.play();
    };

    btnRandom.onclick = () => {
      this.isRandom = !this.isRandom;
      btnRandom.classList.toggle("active", this.isRandom);
    };

    btnRepeat.onclick = () => {
      console.log("1");
      this.isRepeat = !this.isRepeat;
      btnRepeat.classList.toggle("active", this.isRepeat);
    };
  },
  random() {
    let randomIndex = Math.floor(Math.random() * this.songs.length);
    while (randomIndex === this.currentIndex) {
      randomIndex = Math.floor(Math.random() * this.songs.length);
    }
    return randomIndex;
  },
  nextSong() {
    $$(".playlist .song")[this.currentIndex].classList.remove("active");
    if (!this.isRandom) {
      if (this.currentIndex < this.songs.length - 1) {
        this.currentIndex++;
      } else {
        this.currentIndex = 0;
      }
    } else this.currentIndex = this.random();
    $$(".playlist .song")[this.currentIndex].classList.add("active");
    $$(".playlist .song")[this.currentIndex].scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "end",
    });
    this.loadCurrentSong();
  },

  prevSong() {
    $$(".playlist .song")[this.currentIndex].classList.remove("active");
    if (!this.isRandom) {
      if (this.currentIndex > 0) {
        this.currentIndex--;
      } else {
        this.currentIndex = this.songs.length - 1;
      }
    } else this.currentIndex = this.random();
    $$(".playlist .song")[this.currentIndex].classList.add("active");
    $$(".playlist .song")[this.currentIndex].scrollIntoView({
      behavior: "smooth",
    });
    this.loadCurrentSong();
  },

  loadCurrentSong() {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },
  start() {
    this.defineProperties();
    this.handleEvents();
    this.loadCurrentSong();
    this.render();
  },
};

app.start();
