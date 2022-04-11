class Game {
  cell_clicked: any = false;
  self = this;
  selector: any = {
    game_box: <HTMLDivElement>document.querySelector(".game_box"),
    game: <HTMLDivElement>document.querySelector(".game"),
    game_header: <HTMLDivElement>document.querySelector(".game_header"),
    game_content: <HTMLDivElement>document.querySelector(".game_content"),
    game_layer: <HTMLDivElement>document.querySelector(".game_layer"),
    game_layer_running: <HTMLDivElement>(
      document.querySelector(".game_layer.running")
    ),
    game_cell_box: <HTMLDivElement>document.querySelector(".game_cell_box"),
    game_level: <HTMLDivElement>document.querySelector(".game_level"),
    game_runtime_box: <HTMLDivElement>document.querySelector(".game_runtime"),
    game_runtime: <HTMLDivElement>(
      document.querySelector(".game_runtime_running")
    ),
    btn_mute: <HTMLDivElement>document.querySelector(".btn_mute"),
    btn_hint: <HTMLDivElement>document.querySelector(".btn_hint"),
    hint_left: <HTMLDivElement>document.querySelector(".hint_left"),
  };
  data = {
    container_width: this.selector.game_content.clientWidth,
    container_height: this.selector.game_content.clientHeight,
    container_ratio:
      this.selector.game_content.clientWidth /
      this.selector.game_content.clientHeight,
    level_current: 0,
    image_duplicate: 4,
    image_folder: "/images/",
    image_ratio: 1,
    cell_clicked: this.cell_clicked,
    wait_time: false,
    cell_effect_time: 200,
    cell_complete: 0,
    cell_total: 0, //tổng cell
    cell_total_h: 0,
    cell_total_v: 0,
    timeleft: 0,
    timeTotal: 0,
    timeleft_timeout: false,
    hintleft: 0, //lượt gợi ý
    resize_timeout: false,
  };
  level = [
    {
      image_count: 24,
      timeleft: 5 * 60,
      hintleft: 10,
    },
    {
      image_count: 30,
      timeleft: 7 * 60,
      hintleft: 9,
    },
    {
      image_count: 36,
      timeleft: 9 * 60,
      hintleft: 5,
    },
    {
      image_count: 24,
      timeleft: 4 * 60,
      hintleft: 3,
    },
    {
      image_count: 30,
      timeleft: 5 * 60,
      hintleft: 4,
    },
    {
      image_count: 36,
      timeleft: 6 * 60,
      hintleft: 5,
    },
    {
      image_count: 24,
      timeleft: 4 * 60,
      hintleft: 1,
    },
    {
      image_count: 30,
      timeleft: 5 * 60,
      hintleft: 2,
    },
    {
      image_count: 36,
      timeleft: 6 * 60,
      hintleft: 3,
    },
  ];
  render_level(level: any, self: Game) {
    this.selector.game_level.innerHtml = level + 1;
    this.selector.hint_left.innerHtml = this.data.hintleft;

    var image_count: number = this.level[level].image_count;
    this.data.cell_total = image_count * this.data.image_duplicate;
    /*
     * Calculator for game data at this level
     */
    var ar: any[] = [];
    for (var i = 1; i <= image_count; i++) {
      ar.push({
        image:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" +
          i +
          ".png",
        image_index: i,
      });
    }
    ar = [...ar, ...ar, ...ar, ...ar];
    for (let i = ar.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ar[i], ar[j]] = [ar[j], ar[i]];
    }

    var division: any = null;
    for (var i = 1; i < Math.sqrt(this.data.cell_total); i++) {
      if (this.data.cell_total % i == 0) {
        var h = i;
        var v = this.data.cell_total / i;
        if (
          (h < v && this.data.container_width > this.data.container_height) ||
          (h > v && this.data.container_width < this.data.container_height)
        ) {
          var temp = h;
          h = v;
          v = temp;
        }
        var ratio_best_math = Math.abs(
          (h / v) * this.data.image_ratio - this.data.container_ratio
        );
        var division_advice = {
          h: h,
          v: v,
          ratio_best_math: ratio_best_math,
        };
        if (division == null) {
          division = division_advice;
        } else if (division.ratio_best_math > ratio_best_math) {
          division = division_advice;
        }
      }
    }
    this.data.cell_total_h = division.h; //12 cột
    this.data.cell_total_v = division.v; //8 hàng

    /*
     * Render the game cell depend on game data just calculator above
     */
    function chianguyen(a: number, b: any) {
      //(13/8) - (13/8) % 1
      //1.625 - 0.625 (1.625 % 1 = 0.625)
      // = 1
      return a / b - ((a / b) % 1);
    }
    this.selector.game_cell_box.innerHtml = "abc";
    // console.log(self.selector.game_cell_box);
    ar.forEach(function (item, index) {
      //x = cột
      //y = hàng

      var x = index % self.data.cell_total_h;
      var y = chianguyen(index, self.data.cell_total_h);
      self.selector.game_cell_box.innerHTML += `<img style='left: ${
        (x / self.data.cell_total_h) * 100
      }%; top: ${
        (y / self.data.cell_total_v) * 100
      }%' class='game_cell under_cell' src='${
        item.image
      }' id='cell_${x}_${y}' data-image-index='${
        item.image_index
      }'  data-x='${x}' data-y='${y}'>`;
    });

    for (let i = ar.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ar[i], ar[j]] = [ar[j], ar[i]];
    }

    ar.forEach(function (item, index) {
      //x = cột
      //y = hàng

      var x = index % self.data.cell_total_h;
      var y = chianguyen(index, self.data.cell_total_h);
      self.selector.game_cell_box.innerHTML += `<img style='left: ${
        (x / self.data.cell_total_h) * 100 + 0.4
      }%; top: ${(y / self.data.cell_total_v) * 100}%' class='game_cell' src='${
        item.image
      }' id='cell_${x}_${y}' data-image-index='${
        item.image_index
      }'  data-x='${x}' data-y='${y}'>`;
    });

    this.selector.game_cell_box.innerHTML += `<div class='clear_both'></div>`;

    /*
     * Find the hint and auto random cell if not found
     */
    // this.auto_random_cell();
    /*
     * Event trigger
     */
    var check = self.selector.game_cell_box.querySelectorAll(".game_cell");
    for (let i = 0; i < check.length; i++) {
      check[i].addEventListener("click", () => {
        self.cell_click(check[i], self);
      });
    }
    check.forEach((_item: any) => {
      (_item.style.height = 100 / this.data.cell_total_v + "%"),
        (_item.style.width = 100 / this.data.cell_total_h + "%");
    });
  }
  cell_click(cell: any, self: Game) {
    if (
      cell.classList.contains("complete") ||
      cell.classList.contains("open") ||
      this.data.wait_time == true
    ) {
      /*
       * This cell is complete before
       * or in the waiting time for calculating the effect
       */
      return;
    } else if (this.data.cell_clicked == false) {
      /*
       * Click at first of pair cell
       */
      if (!cell.classList.contains("hint")) {
        this.unhint();
      }
      // console.log(cell);
      // console.log(cell.dataset.x);
      // console.log(cell.dataset.y);

      this.data.cell_clicked = cell;
      cell.classList.add("open");
    } else {
      /*
       * Click at second of pair cell
       * Check matches cell
       */
      this.data.wait_time = true;
      if (!cell.classList.contains("hint")) {
        this.unhint();
      }

      var matched_path: boolean | {}[] = false;
      if (
        cell.dataset.imageIndex == this.data.cell_clicked.dataset.imageIndex
      ) {
        matched_path = true;
        // matched_path = this.check_has_path(
        //   this.cell_to_pointer(this.data.cell_clicked),
        //   this.cell_to_pointer(cell)
        // );
        // console.log(
        //   this.check_has_path(
        //     this.cell_to_pointer(this.data.cell_clicked),
        //     this.cell_to_pointer(cell)
        //   )
        // );
      }
      if (matched_path == false) {
        /*
         * The cells is not matched
         */
        cell.classList.add("not_matched");
        this.data.cell_clicked.classList.remove("open");
        this.data.cell_clicked.classList.add("not_matched");
        setTimeout(function () {
          cell.classList.remove("not_matched");
          self.data.cell_clicked.classList.remove("not_matched");
          self.data.cell_clicked = false;
          self.data.wait_time = false;
        }, this.data.cell_effect_time);
      } else {
        /*
         * The cells is matched
         */
        cell.classList.add("matched");
        this.data.cell_clicked.classList.remove("open");
        this.data.cell_clicked.classList.add("matched");
        setTimeout(function () {
          cell.classList.remove("matched");
          cell.classList.add("complete");
          self.data.cell_clicked.classList.remove("matched");
          self.data.cell_clicked.classList.add("complete");
          self.data.cell_clicked = false;
          self.data.cell_complete += 2;
          let checkDone = self.data.cell_complete / self.data.cell_total;
          console.log(checkDone);

          if (checkDone == 2) {
            /*
             * Complete the current level
             */
            self.nextlevel();
          } else {
            // self.auto_random_cell();
          }
          self.data.wait_time = false;
        }, this.data.cell_effect_time);
      }
    }
  }
  unhint() {
    document.querySelector(".game_cell.hint")?.classList.remove("hint");
  }
  start() {
    this.refreshGameContainer();
    this.data.cell_clicked = false;
    this.data.cell_complete = 0;
    this.data.cell_total = 0;
    this.data.wait_time = false;
    this.data.timeleft = this.level[this.data.level_current].timeleft;
    this.data.timeTotal = this.data.timeleft;
    this.data.hintleft = this.level[this.data.level_current].hintleft;
    this.render_level(this.data.level_current, this.self);
    // if (this.data.timeleft_timeout != false) {
    //     clearTimeout(this.data.timeleft_timeout);
    // }
    // this.update_time();
  }
  nextlevel() {
    this.data.level_current++;
    if (this.data.level_current >= this.level.length) {
      this.data.level_current = 0;
    }
    this.start();
  }
  refreshGameContainer() {
    var headerHeight = this.selector.game_header.clientHeight;
    this.selector.game_content.style.top = headerHeight + 5 + "px";
    this.data.container_width = this.selector.game_content.clientWidth;
    this.data.container_height = this.selector.game_content.clientHeight;
    this.data.container_ratio =
      this.data.container_width / this.data.container_height;
  }
}

let pokemon = new Game();
pokemon.start();
