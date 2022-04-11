"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var Game = /** @class */ (function () {
    function Game() {
        this.cell_clicked = false;
        this.self = this;
        this.selector = {
            game_box: document.querySelector(".game_box"),
            game: document.querySelector(".game"),
            game_header: document.querySelector(".game_header"),
            game_content: document.querySelector(".game_content"),
            game_layer: document.querySelector(".game_layer"),
            game_layer_running: (document.querySelector(".game_layer.running")),
            game_cell_box: document.querySelector(".game_cell_box"),
            game_level: document.querySelector(".game_level"),
            game_runtime_box: document.querySelector(".game_runtime"),
            game_runtime: (document.querySelector(".game_runtime_running")),
            btn_mute: document.querySelector(".btn_mute"),
            btn_hint: document.querySelector(".btn_hint"),
            hint_left: document.querySelector(".hint_left"),
        };
        this.data = {
            container_width: this.selector.game_content.clientWidth,
            container_height: this.selector.game_content.clientHeight,
            container_ratio: this.selector.game_content.clientWidth /
                this.selector.game_content.clientHeight,
            level_current: 0,
            image_duplicate: 4,
            image_folder: "/images/",
            image_ratio: 1,
            cell_clicked: this.cell_clicked,
            wait_time: false,
            cell_effect_time: 200,
            cell_complete: 0,
            cell_total: 0,
            cell_total_h: 0,
            cell_total_v: 0,
            timeleft: 0,
            timeTotal: 0,
            timeleft_timeout: false,
            hintleft: 0,
            resize_timeout: false,
        };
        this.level = [
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
    }
    Game.prototype.render_level = function (level, self) {
        var _a, _b;
        var _this = this;
        this.selector.game_level.innerHtml = level + 1;
        this.selector.hint_left.innerHtml = this.data.hintleft;
        var image_count = this.level[level].image_count;
        this.data.cell_total = image_count * this.data.image_duplicate;
        /*
         * Calculator for game data at this level
         */
        var ar = [];
        for (var i = 1; i <= image_count; i++) {
            ar.push({
                image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" +
                    i +
                    ".png",
                image_index: i,
            });
        }
        ar = __spreadArray(__spreadArray(__spreadArray(__spreadArray([], ar, true), ar, true), ar, true), ar, true);
        for (var i_1 = ar.length - 1; i_1 > 0; i_1--) {
            var j = Math.floor(Math.random() * (i_1 + 1));
            _a = [ar[j], ar[i_1]], ar[i_1] = _a[0], ar[j] = _a[1];
        }
        var division = null;
        for (var i = 1; i < Math.sqrt(this.data.cell_total); i++) {
            if (this.data.cell_total % i == 0) {
                var h = i;
                var v = this.data.cell_total / i;
                if ((h < v && this.data.container_width > this.data.container_height) ||
                    (h > v && this.data.container_width < this.data.container_height)) {
                    var temp = h;
                    h = v;
                    v = temp;
                }
                var ratio_best_math = Math.abs((h / v) * this.data.image_ratio - this.data.container_ratio);
                var division_advice = {
                    h: h,
                    v: v,
                    ratio_best_math: ratio_best_math,
                };
                if (division == null) {
                    division = division_advice;
                }
                else if (division.ratio_best_math > ratio_best_math) {
                    division = division_advice;
                }
            }
        }
        this.data.cell_total_h = division.h; //12 cột
        this.data.cell_total_v = division.v; //8 hàng
        /*
         * Render the game cell depend on game data just calculator above
         */
        function chianguyen(a, b) {
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
            self.selector.game_cell_box.innerHTML += "<img style='left: ".concat((x / self.data.cell_total_h) * 100, "%; top: ").concat((y / self.data.cell_total_v) * 100, "%' class='game_cell under_cell' src='").concat(item.image, "' id='cell_").concat(x, "_").concat(y, "' data-image-index='").concat(item.image_index, "'  data-x='").concat(x, "' data-y='").concat(y, "'>");
        });
        for (var i_2 = ar.length - 1; i_2 > 0; i_2--) {
            var j = Math.floor(Math.random() * (i_2 + 1));
            _b = [ar[j], ar[i_2]], ar[i_2] = _b[0], ar[j] = _b[1];
        }
        ar.forEach(function (item, index) {
            //x = cột
            //y = hàng
            var x = index % self.data.cell_total_h;
            var y = chianguyen(index, self.data.cell_total_h);
            self.selector.game_cell_box.innerHTML += "<img style='left: ".concat((x / self.data.cell_total_h) * 100 + 0.4, "%; top: ").concat((y / self.data.cell_total_v) * 100, "%' class='game_cell' src='").concat(item.image, "' id='cell_").concat(x, "_").concat(y, "' data-image-index='").concat(item.image_index, "'  data-x='").concat(x, "' data-y='").concat(y, "'>");
        });
        this.selector.game_cell_box.innerHTML += "<div class='clear_both'></div>";
        /*
         * Find the hint and auto random cell if not found
         */
        // this.auto_random_cell();
        /*
         * Event trigger
         */
        var check = self.selector.game_cell_box.querySelectorAll(".game_cell");
        var _loop_1 = function (i_3) {
            check[i_3].addEventListener("click", function () {
                self.cell_click(check[i_3], self);
            });
        };
        for (var i_3 = 0; i_3 < check.length; i_3++) {
            _loop_1(i_3);
        }
        check.forEach(function (_item) {
            (_item.style.height = 100 / _this.data.cell_total_v + "%"),
                (_item.style.width = 100 / _this.data.cell_total_h + "%");
        });
    };
    Game.prototype.cell_click = function (cell, self) {
        if (cell.classList.contains("complete") ||
            cell.classList.contains("open") ||
            this.data.wait_time == true) {
            /*
             * This cell is complete before
             * or in the waiting time for calculating the effect
             */
            return;
        }
        else if (this.data.cell_clicked == false) {
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
        }
        else {
            /*
             * Click at second of pair cell
             * Check matches cell
             */
            this.data.wait_time = true;
            if (!cell.classList.contains("hint")) {
                this.unhint();
            }
            var matched_path = false;
            if (cell.dataset.imageIndex == this.data.cell_clicked.dataset.imageIndex) {
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
            }
            else {
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
                    var checkDone = self.data.cell_complete / self.data.cell_total;
                    console.log(checkDone);
                    if (checkDone == 2) {
                        /*
                         * Complete the current level
                         */
                        self.nextlevel();
                    }
                    else {
                        // self.auto_random_cell();
                    }
                    self.data.wait_time = false;
                }, this.data.cell_effect_time);
            }
        }
    };
    Game.prototype.unhint = function () {
        var _a;
        (_a = document.querySelector(".game_cell.hint")) === null || _a === void 0 ? void 0 : _a.classList.remove("hint");
    };
    Game.prototype.start = function () {
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
    };
    Game.prototype.nextlevel = function () {
        this.data.level_current++;
        if (this.data.level_current >= this.level.length) {
            this.data.level_current = 0;
        }
        this.start();
    };
    Game.prototype.refreshGameContainer = function () {
        var headerHeight = this.selector.game_header.clientHeight;
        this.selector.game_content.style.top = headerHeight + 5 + "px";
        this.data.container_width = this.selector.game_content.clientWidth;
        this.data.container_height = this.selector.game_content.clientHeight;
        this.data.container_ratio =
            this.data.container_width / this.data.container_height;
    };
    return Game;
}());
var pokemon = new Game();
pokemon.start();
//# sourceMappingURL=game-main.js.map