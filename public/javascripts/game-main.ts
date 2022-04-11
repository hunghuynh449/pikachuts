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
      console.log(cell);
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
          // if (self.data.cell_complete >= self.data.cell_total) {
          //     /*
          //      * Complete the current level
          //      */
          //     self.nextlevel();
          // } else {
          //     self.auto_random_cell();
          // }
          self.data.wait_time = false;
        }, this.data.cell_effect_time);
      }
    }
  }
  check_has_path_1(
    pointer_1: { x: number; y: number },
    pointer_2: { x: number; y: number }
  ) {
    if (pointer_1.x == pointer_2.x && pointer_1.y == pointer_2.y) {
      //click 1 cell 2 times => false
      return false;
    }
    if (pointer_1.x == pointer_2.x || pointer_1.y == pointer_2.y) {
      //x:0 y:1, x:1 y:1
      if (pointer_1.x == pointer_2.x) {
        var delta_x = 0;
        var delta_y = 1;
        if (pointer_2.y < pointer_1.y) {
          var delta_y = -1;
        }
      } else {
        var delta_y = 0;
        var delta_x = 1;
        if (pointer_2.x < pointer_1.x) {
          var delta_x = -1;
        }
      }
      var ar_path = [];
      var w_flag = true;
      var i = 0;
      while (w_flag) {
        var pointer_current = {
          //x:0 y:1
          //x:0 y:2
          x: pointer_1.x + i * delta_x,
          y: pointer_1.y + i * delta_y,
        };
        if (
          pointer_current.x == pointer_1.x &&
          pointer_current.y == pointer_1.y
        ) {
          ar_path.push(pointer_current);
        } else {
          if (
            pointer_current.x == pointer_2.x &&
            pointer_current.y == pointer_2.y
          ) {
            ar_path.push(pointer_current);
            return ar_path;
          }
          if (this.check_pointer_is_out(pointer_current)) {
            ar_path.push(pointer_current);
          } else {
            if (
              !this.pointer_to_cell(pointer_current)?.classList.contains(
                "complete"
              )
            ) {
              console.log(false);
              return false;
            }
          }
        }
        i++;
      }
    }
    return false;
  }
  check_has_path_2(
    pointer_1: { x: any; y: any },
    pointer_2: { x: any; y: any }
  ) {
    if (pointer_1.x == pointer_2.x || pointer_1.y == pointer_2.y) {
      return false;
    }
    var pointer = {
      x: pointer_1.x,
      y: pointer_2.y,
    };
    var path = this.check_has_path_of_three(pointer_1, pointer, pointer_2);
    if (path != false) {
      return path;
    }
    var pointer = {
      x: pointer_2.x,
      y: pointer_1.y,
    };
    var path = this.check_has_path_of_three(pointer_1, pointer, pointer_2);
    if (path != false) {
      return path;
    }
    return false;
  }
  check_has_path_3(
    pointer_1: { x: number; y: number },
    pointer_2: { x: number; y: number }
  ) {
    if (pointer_1.x != pointer_2.x) {
      for (var i = -1; i <= this.data.cell_total_v; i++) {
        if (i != pointer_1.y && i != pointer_2.y) {
          var pointer_3 = {
            x: pointer_1.x,
            y: i,
          };
          var pointer_4 = {
            x: pointer_2.x,
            y: i,
          };
          var path = this.check_has_path_of_four(
            pointer_1,
            pointer_3,
            pointer_4,
            pointer_2
          );
          if (path != false) {
            return path;
          }
        }
      }
    }
    if (pointer_1.y != pointer_2.y) {
      for (var i = -1; i <= this.data.cell_total_h; i++) {
        if (i != pointer_1.x && i != pointer_2.x) {
          var pointer_3 = {
            x: i,
            y: pointer_1.y,
          };
          var pointer_4 = {
            x: i,
            y: pointer_2.y,
          };
          var path = this.check_has_path_of_four(
            pointer_1,
            pointer_3,
            pointer_4,
            pointer_2
          );
          if (path != false) {
            return path;
          }
        }
      }
    }

    return false;
  }
  check_has_path_of_three(
    pointer_1: any,
    pointer_2: { x: any; y: any },
    pointer_3: any
  ) {
    if (!this.check_pointer_is_out(pointer_2)) {
      if (!this.pointer_to_cell(pointer_2).classList.contains("complete")) {
        return false;
      }
    }
    var path_1 = this.check_has_path_1(pointer_1, pointer_2);
    if (path_1 == false) {
      return false;
    }
    var path_2 = this.check_has_path_1(pointer_2, pointer_3);
    if (path_2 == false) {
      return false;
    }
    var path: { x: any; y: any }[] = [];
    path_1.forEach(function (item, index) {
      path.push(item);
    });

    path_2.forEach(function (item, index) {
      path.push(item);
    });
    return path;
  }
  check_has_path_of_four(
    pointer_1: any,
    pointer_2: { x: any; y: number },
    pointer_3: { x: any; y: number },
    pointer_4: any
  ) {
    if (!this.check_pointer_is_out(pointer_2)) {
      if (!this.pointer_to_cell(pointer_2).classList.contains("complete")) {
        return false;
      }
    }
    if (!this.check_pointer_is_out(pointer_3)) {
      if (!this.pointer_to_cell(pointer_3).classList.contains("complete")) {
        return false;
      }
    }
    var path_1 = this.check_has_path_1(pointer_1, pointer_2);
    if (path_1 == false) {
      return false;
    }
    var path_2 = this.check_has_path_1(pointer_2, pointer_3);
    if (path_2 == false) {
      return false;
    }
    var path_3 = this.check_has_path_1(pointer_3, pointer_4);
    if (path_3 == false) {
      return false;
    }
    var path: { x: any; y: any }[] = [];
    path_1.forEach(function (item, index) {
      path.push(item);
    });
    path_2.forEach(function (item, index) {
      path.push(item);
    });
    path_3.forEach(function (item, index) {
      path.push(item);
    });
    return path;
  }
  check_pointer_is_out(pointer: { x: any; y: any }) {
    //x:0 y:2
    if (pointer.x < 0 || pointer.x >= this.data.cell_total_h) {
      return true;
    }
    if (pointer.y < 0 || pointer.y >= this.data.cell_total_v) {
      return true;
    }
    return false;
  }
  cell_to_pointer(cell: HTMLImageElement) {
    return {
      x: cell.dataset.x,
      y: cell.dataset.y,
    };
  }
  pointer_to_cell(pointer: { x: any; y: any }) {
    if (this.check_pointer_is_out(pointer)) {
      //   return false;
      console.log(document.getElementById("check_out"));

      return document.getElementById("check_out") as HTMLDivElement;
    }
    return document.getElementById(
      "cell_" + pointer.x + "_" + pointer.y
    ) as HTMLDivElement;
    // $("#cell_" + pointer.x + "_" + pointer.y);
  }
  check_has_path(pointer_1: any, pointer_2: any) {
    var path = this.check_has_path_1(pointer_1, pointer_2);
    if (path != false) {
      return path;
    } else {
      path = this.check_has_path_2(pointer_1, pointer_2);
      if (path != false) {
        return path;
      } else {
        path = this.check_has_path_3(pointer_1, pointer_2);
        if (path != false) {
          return path;
        } else {
          return false;
        }
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
