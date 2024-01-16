$(document).ready(function () {
  const data = [
    {
      name: "php",
      img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/php-logo_1.png",
      id: 1,
    },
    {
      name: "css3",
      img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/css3-logo.png",
      id: 2,
    },
    {
      name: "html5",
      img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/html5-logo.png",
      id: 3,
    },
    {
      name: "jquery",
      img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/jquery-logo.png",
      id: 4,
    },
    {
      name: "javascript",
      img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/js-logo.png",
      id: 5,
    },
    {
      name: "node",
      img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/nodejs-logo.png",
      id: 6,
    },
    {
      name: "photoshop",
      img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/photoshop-logo.png",
      id: 7,
    },
    {
      name: "python",
      img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/python-logo.png",
      id: 8,
    },
    {
      name: "rails",
      img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/rails-logo.png",
      id: 9,
    },
    {
      name: "sass",
      img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/sass-logo.png",
      id: 10,
    },
    {
      name: "sublime",
      img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/sublime-logo.png",
      id: 11,
    },
    {
      name: "wordpress",
      img: "https://s3-us-west-2.amazonaws.com/s.cdpn.io/74196/wordpress-logo.png",
      id: 12,
    },
  ];

  function currentTime() {
    let time = new Date();
    let currentHours = time.getHours();
    let currentMinutes = time.getMinutes();
    let currentTime = `${currentHours < 10 ? "0" : ""}${currentHours}:${
      currentMinutes < 10 ? "0" : ""
    }${currentMinutes}`;
    $("#nav-time").text(currentTime);
  }
  currentTime();

  let startTime;

  function updateTime() {
    if (state.totalTime) {
      const currentTime = new Date().getTime();
      const elapsedTime = new Date(currentTime - startTime);
      const minutes = elapsedTime.getMinutes();
      const seconds = elapsedTime.getSeconds();

      const formattedTime = `${minutes < 10 ? "0" : ""}${minutes}:${
        seconds < 10 ? "0" : ""
      }${seconds}`;

      $("#play-time").text(`${formattedTime}`);
      setTimeout(updateTime, 1000);
    }
  }
  // flip counter change vale in html el
  const flips = () => {
    totalFlips.text(`FLIPS ${state.totalFlips}`);
  };
  // **************************************
  // selectors
  const gameWrapper = $(".game-wrapper");
  const totalFlips = $("#total-flips");
  // shuffle array from data
  const shuffle = (array) => {
    const newArray = [...array];

    for (let index = newArray.length - 1; index > 0; index--) {
      const randomIndex = Math.floor(Math.random() * index + 1);
      const original = newArray[index];

      newArray[index] = newArray[randomIndex];
      newArray[randomIndex] = original;
    }
    return newArray;
  };

  let shuffledData = shuffle([...data, ...data]);
  // states of game, use it for start/stop game, timer, flips count
  const state = {
    gameStarted: false,
    flippedCards: 0,
    totalFlips: 0,
    totalTime: false,
    guessed: 0,
  };
  // buttons in nav
  $("#start-game").click(function () {
    if (!state.totalTime & !state.gameStarted) {
      state.totalTime = true;
      startTime = new Date().getTime();
      updateTime();
      state.gameStarted = true;
      eventHandler();
    }
  });
  // stop-game btn use for restart game(delete cards, shuffle data again, and place new cards in el),stop timer
  $("#stop-game").click(function () {
    shuffledData = shuffle([...data, ...data]);
    if (state.gameStarted) {
      gameWrapper.empty();
      renderCards(shuffledData);
      state.totalTime = false;
      state.gameStarted = false;
      state.totalFlips = 0;
      flips();
    }
  });
  // create and render cards in html
  const createCard = (item) => {
    return `<div class='card' data-key=${item.id}>
  <div class="card-front"></div>
  <div class="card-back"><img src=${item.img} alt="logo" /></div>
  </div>`;
  };

  const renderCards = (data) => {
    const cardsHtml = data.map(createCard).join("");
    gameWrapper.append(cardsHtml);
  };

  const checkForWin = () => {
    console.log(state.guessed);
    if (state.guessed === shuffledData.length) {
      const modalWin = $(`<div class="modal-win"><h2>You won!</h2></div>`);
      gameWrapper.append(modalWin);
      state.gameStarted(false);
    }
  };
  // click handler, rotate card, check key value, add class if match
  const eventHandler = () => {
    let firstKey = null;
    $(".card").click(function (e) {
      if (state.flippedCards === 2) {
        return;
      }
      $(this).toggleClass("card--picked");
      state.flippedCards += 1;

      const currentKey = $(this).data("key");
      if (firstKey === null) {
        firstKey = currentKey;
      } else {
        if (firstKey === currentKey) {
          $(`.card.card--picked[data-key=${currentKey}]`).addClass("matched");
          state.flippedCards = 0;
          state.totalFlips += 1;
          state.guessed += 2;
          flips();
          checkForWin();
        } else {
          state.totalFlips += 1;
          flips();

          setTimeout(function () {
            $(".card:not(.matched)").removeClass("card--picked");
            state.flippedCards = 0;
          }, 1000);
        }
        firstKey = null;
      }
    });
  };
  renderCards(shuffledData);
});
