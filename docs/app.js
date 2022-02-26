!(function (e) {
  function t(t) {
    for (
      var s, a, c = t[0], o = t[1], h = t[2], p = 0, u = [];
      p < c.length;
      p++
    )
      (a = c[p]),
        Object.prototype.hasOwnProperty.call(n, a) && n[a] && u.push(n[a][0]),
        (n[a] = 0);
    for (s in o) Object.prototype.hasOwnProperty.call(o, s) && (e[s] = o[s]);
    for (l && l(t); u.length; ) u.shift()();
    return r.push.apply(r, h || []), i();
  }
  function i() {
    for (var e, t = 0; t < r.length; t++) {
      for (var i = r[t], s = !0, c = 1; c < i.length; c++) {
        var o = i[c];
        0 !== n[o] && (s = !1);
      }
      s && (r.splice(t--, 1), (e = a((a.s = i[0]))));
    }
    return e;
  }
  var s = {},
    n = { 0: 0 },
    r = [];
  function a(t) {
    if (s[t]) return s[t].exports;
    var i = (s[t] = { i: t, l: !1, exports: {} });
    return e[t].call(i.exports, i, i.exports, a), (i.l = !0), i.exports;
  }
  (a.m = e),
    (a.c = s),
    (a.d = function (e, t, i) {
      a.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: i });
    }),
    (a.r = function (e) {
      "undefined" != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
        Object.defineProperty(e, "__esModule", { value: !0 });
    }),
    (a.t = function (e, t) {
      if ((1 & t && (e = a(e)), 8 & t)) return e;
      if (4 & t && "object" == typeof e && e && e.__esModule) return e;
      var i = Object.create(null);
      if (
        (a.r(i),
        Object.defineProperty(i, "default", { enumerable: !0, value: e }),
        2 & t && "string" != typeof e)
      )
        for (var s in e)
          a.d(
            i,
            s,
            function (t) {
              return e[t];
            }.bind(null, s)
          );
      return i;
    }),
    (a.n = function (e) {
      var t =
        e && e.__esModule
          ? function () {
              return e.default;
            }
          : function () {
              return e;
            };
      return a.d(t, "a", t), t;
    }),
    (a.o = function (e, t) {
      return Object.prototype.hasOwnProperty.call(e, t);
    }),
    (a.p = "");
  var c = (window.webpackJsonp = window.webpackJsonp || []),
    o = c.push.bind(c);
  (c.push = t), (c = c.slice());
  for (var h = 0; h < c.length; h++) t(c[h]);
  var l = o;
  r.push([1, 1]), i();
})([
  ,
  function (e, t, i) {
    "use strict";
    i.r(t);
    var s = i(0),
      n = i.n(s);
    class r extends n.a.Scene {
      constructor(e, t) {
        super(e),
          (this.config = t),
          (this.screenCenter = [t.width / 2, t.height / 2]),
          (this.fontSize = 32),
          (this.lineHeight = 42),
          (this.fontOptions = { fontSize: this.fontSize + "px", fill: "#fff" });
      }
      create() {
        if ((this.add.image(0, 0, "sky").setOrigin(0), this.config.canGoBack)) {
          this.add
            .image(this.config.width - 10, this.config.height - 10, "back")
            .setOrigin(1)
            .setScale(2)
            .setInteractive()
            .on("pointerup", () => {
              this.scene.start("MenuScene");
            });
        }
      }
      createMenu(e, t) {
        let i = 0;
        e.forEach((e) => {
          const s = [this.screenCenter[0], this.screenCenter[1] + i];
          (e.textGO = this.add
            .text(...s, e.text, this.fontOptions)
            .setOrigin(0.5, 1)),
            (i += this.lineHeight),
            t(e);
        });
      }
    }
    var a = r;
    var c = class extends a {
      constructor(e) {
        super("PlayScene", e),
          (this.bird = null),
          (this.pipes = null),
          (this.isPaused = !1),
          (this.pipeHorizontalDistance = 0),
          (this.pipeVerticalDistanceRange = [150, 250]),
          (this.pipeHorizontalDistanceRange = [500, 550]),
          (this.flapVelocity = 300),
          (this.score = 0),
          (this.scoreText = ""),
          (this.currentDifficulty = "easy"),
          (this.difficulty = {
            easy: {
              pipeHorizontalDistanceRange: [300, 350],
              pipeVerticalDistanceRange: [150, 200],
            },
            normal: {
              pipeHorizontalDistanceRange: [280, 330],
              pipeVerticalDistanceRange: [140, 190],
            },
            hard: {
              pipeHorizontalDistanceRange: [250, 310],
              pipeVerticalDistanceRange: [100, 150],
            },
            veryHard: {
              pipeHorizontalDistanceRange: [220, 280],
              pipeVerticalDistanceRange: [100, 150],
            },
          });
      }
      create() {
        (this.currentDifficulty = "easy"),
          super.create(),
          this.createBird(),
          this.createPipes(),
          this.createCollisers(),
          this.createScore(),
          this.createPause(),
          this.handleInput(),
          this.listenToEvents(),
          this.anims.create({
            key: "fly",
            frames: this.anims.generateFrameNumbers("bird", {
              start: 8,
              end: 15,
            }),
            frameRate: 8,
            repeat: -1,
          }),
          this.bird.play("fly");
      }
      update() {
        this.checkGameStatus(), this.recyclePipes();
      }
      listenToEvents() {
        this.pauseEvent ||
          (this.pauseEvent = this.events.on("resume", () => {
            (this.initialTime = 3),
              (this.countDownText = this.add
                .text(
                  ...this.screenCenter,
                  "Fly in: " + this.initialTime,
                  this.fontOptions
                )
                .setOrigin(0.5)),
              (this.timedEvent = this.time.addEvent({
                delay: 1e3,
                callback: this.countDown,
                callbackScope: this,
                loop: !0,
              }));
          }));
      }
      countDown() {
        this.initialTime--,
          this.countDownText.setText("fly in: " + this.initialTime),
          this.initialTime <= 0 &&
            ((this.isPaused = !1),
            this.countDownText.setText(""),
            this.physics.resume(),
            this.timedEvent.remove());
      }
      createBG() {
        this.add.image(0, 0, "sky").setOrigin(0, 0);
      }
      createBird() {
        (this.bird = this.physics.add
          .sprite(
            this.config.startPosition.x,
            this.config.startPosition.y,
            "bird"
          )
          .setFlipX(!0)
          .setScale(2)
          .setOrigin(0)),
          this.bird.setBodySize(this.bird.width, this.bird.height - 5),
          (this.bird.body.gravity.y = 600),
          this.bird.setCollideWorldBounds(!0);
      }
      createPipes() {
        this.pipes = this.physics.add.group();
        for (let e = 0; e < 4; e++) {
          const e = this.pipes
              .create(0, 0, "pipe")
              .setImmovable(!0)
              .setOrigin(0, 1),
            t = this.pipes.create(0, 0, "pipe").setImmovable(!0).setOrigin(0);
          this.placePipe(e, t);
        }
        this.pipes.setVelocityX(-200);
      }
      createCollisers() {
        this.physics.add.collider(
          this.bird,
          this.pipes,
          this.gameOver,
          null,
          this
        );
      }
      createScore() {
        this.score = 0;
        const e = localStorage.getItem("bestScore");
        (this.scoreText = this.add.text(16, 16, "Score: 0", {
          fontSize: "32px",
          fill: "#000",
        })),
          (this.bestScoreText = this.add.text(
            16,
            52,
            "Best Score: " + (e || 0),
            { fontSize: "18px", fill: "#000" }
          ));
      }
      createPause() {
        this.isPaused = !1;
        this.add
          .image(this.config.width - 10, this.config.height - 10, "pause")
          .setInteractive()
          .setScale(3)
          .setOrigin(1)
          .on("pointerdown", () => {
            (this.isPaused = !0),
              this.physics.pause(),
              this.scene.pause(),
              this.scene.launch("PauseScene");
          });
      }
      handleInput() {
        this.input.on("pointerdown", this.flap, this),
          this.input.keyboard.on("keydown_SPACE", this.flap, this);
      }
      checkGameStatus() {
        (this.bird.getBounds().bottom >= this.config.height ||
          this.bird.y <= 0) &&
          this.gameOver();
      }
      placePipe(e, t) {
        const i = this.difficulty[this.currentDifficulty],
          s = this.getRightMostPipe(),
          n = Phaser.Math.Between(...i.pipeVerticalDistanceRange),
          r = Phaser.Math.Between(20, this.config.height - 20 - n),
          a = Phaser.Math.Between(...i.pipeHorizontalDistanceRange);
        (e.x = s + a), (e.y = r), (t.x = e.x), (t.y = e.y + n);
      }
      recyclePipes() {
        const e = [];
        this.pipes.getChildren().forEach((t) => {
          t.getBounds().right <= 0 &&
            (e.push(t),
            2 === e.length &&
              (this.placePipe(...e),
              this.increaseScore(),
              this.saveBestScore(),
              this.increaseDifficulty()));
        });
      }
      increaseDifficulty() {
        4 === this.score && (this.currentDifficulty = "normal"),
          8 === this.score && (this.currentDifficulty = "hard"),
          12 === this.score && (this.currentDifficulty = "veryHard");
      }
      getRightMostPipe() {
        let e = 0;
        return (
          this.pipes.getChildren().forEach(function (t) {
            e = Math.max(t.x, e);
          }),
          e
        );
      }
      saveBestScore() {
        const e = localStorage.getItem("bestScore"),
          t = e && parseInt(e, 10);
        (!t || this.score > t) && localStorage.setItem("bestScore", this.score);
      }
      gameOver() {
        this.physics.pause(),
          this.bird.setTint(15616036),
          this.saveBestScore(),
          this.time.addEvent({
            delay: 1e3,
            callback: () => {
              this.scene.restart();
            },
            loop: !1,
          });
      }
      flap() {
        this.isPaused || (this.bird.body.velocity.y = -this.flapVelocity);
      }
      increaseScore() {
        this.score++, this.scoreText.setText("Score: " + this.score);
      }
    };
    var o = class extends a {
      constructor(e) {
        super("MenuScene", e),
          (this.menu = [
            { scene: "PlayScene", text: "Play" },
            { scene: "ScoreScene", text: "Score" },
            { scene: null, text: "Exit" },
          ]);
      }
      create() {
        super.create(),
          this.createMenu(this.menu, this.setupMenuEvents.bind(this));
      }
      setupMenuEvents(e) {
        const t = e.textGO;
        t.setInteractive(),
          t.on("pointerover", () => {
            t.setStyle({ fill: "#ff0" });
          }),
          t.on("pointerout", () => {
            t.setStyle({ fill: "#fff" });
          }),
          t.on("pointerup", () => {
            e && this.scene.start(e.scene),
              "Exit" === e.text && this.game.destroy(!0);
          });
      }
    };
    class h extends n.a.Scene {
      constructor(e) {
        super("PreloadScene"), (this.config = e);
      }
      preload() {
        this.load.image("sky", "assets/sky.png"),
          this.load.spritesheet("bird", "assets/birdSprite.png", {
            frameWidth: 16,
            frameHeight: 16,
          }),
          this.load.image("pipe", "assets/pipe.png"),
          this.load.image("pause", "assets/pause.png"),
          this.load.image("back", "assets/back.png");
      }
      create() {
        this.scene.start("MenuScene");
      }
    }
    var l = h;
    var p = class extends a {
      constructor(e) {
        super("ScoreScene", { ...e, canGoBack: !0 });
      }
      create() {
        super.create();
        const e = localStorage.getItem("bestScore");
        this.add
          .text(
            ...this.screenCenter,
            "Best Score: " + (e || 0),
            this.fontOptions
          )
          .setOrigin(0.5);
      }
    };
    const u = { width: 400, height: 600, startPosition: { x: 40, y: 300 } },
      d = [
        l,
        o,
        p,
        c,
        class extends a {
          constructor(e) {
            super("PauseScene", e),
              (this.menu = [
                { scene: "PlayScene", text: "Continue" },
                { scene: "MenuScene", text: "Exit" },
              ]);
          }
          create() {
            super.create(),
              this.createMenu(this.menu, this.setupMenuEvents.bind(this));
          }
          setupMenuEvents(e) {
            const t = e.textGO;
            t.setInteractive(),
              t.on("pointerover", () => {
                t.setStyle({ fill: "#ff0" });
              }),
              t.on("pointerout", () => {
                t.setStyle({ fill: "#fff" });
              }),
              t.on("pointerup", () => {
                e.scene && "Continue" === e.text
                  ? (this.scene.stop(), this.scene.resume(e.scene))
                  : (this.scene.stop("PlayScene"), this.scene.start(e.scene));
              });
          }
        },
      ],
      f = (e) => new e(u),
      g = {
        type: n.a.AUTO,
        ...u,
        pixelArt: !0,
        physics: { default: "arcade", arcade: { gravity: {} } },
        scene: d.map(f),
      };
    new n.a.Game(g);
  },
]);
