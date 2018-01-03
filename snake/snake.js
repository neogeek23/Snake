window.onload=function(){
    block_size = 4;
    block_space = 1;
    initial_tail_length = 3;
    fps = 20;
    ms_in_sec = 1000;
    setup()
};

function setup(){
    var canvas = document.getElementById("board");
    var canvas_context = canvas.getContext('2d');
    var snek = new Snek(2, 2, Direction.Right, canvas_context, "red");
    target = new Block(Math.floor(Math.random() * (canvas.width/(block_size + block_space) - 1)),
                           Math.floor(Math.random() * (canvas.height/(block_size + block_space) - 1)),
                           canvas_context, "green");

    game = window.setInterval(function(){update(canvas, canvas_context, snek)}, ms_in_sec/fps);
    window.addEventListener("keypress", function(e){take_input(snek, e)}, false);
}

function take_input(snek, e){
    var keyCode = e.key;
    if (keyCode == "w" && (snek.get_direction() == Direction.Right || snek.get_direction() == Direction.Left)){
        snek.set_direction(Direction.Up);
    } else if (keyCode == "s" && (snek.get_direction() == Direction.Right || snek.get_direction() == Direction.Left)){
        snek.set_direction(Direction.Down);
    } else if (keyCode == "a" && (snek.get_direction() == Direction.Up || snek.get_direction() == Direction.Down)){
        snek.set_direction(Direction.Left);
    } else if (keyCode == "d" && (snek.get_direction() == Direction.Up || snek.get_direction() == Direction.Down)){
        snek.set_direction(Direction.Right);
    }
};

function update(canvas, canvas_context, snek){
    paint_background(canvas, canvas_context);
    target.paint();
    snek.paint();
    snek.move();
    snek.trim();
    target = snek.check(target);
    snek.score();
};

function paint_background(canvas, canvas_context){
    canvas_context.fillStyle = "white";
    canvas_context.fillRect(0,0, canvas.width, canvas.height);
};

const Direction = {
    Right: "Right",
    Left: "Left",
    Up: "Up",
    Down: "Down"
};

class Block{
    constructor(x, y, board, color){
        this.x = x * (block_size + block_space);
        this.y = y * (block_size + block_space);
        this.board = board;
        this.color = color;
    }

    get_color(){
        return this.color;
    }

    get_block_x(){
        return this.x/(block_size + block_space);
    }

    get_block_y(){
        return this.y/(block_size + block_space);
    }

    get_true_x(){
        return this.x;
    }

    get_true_y(){
        return this.y;
    }

    get_board(){
        return this.board;
    }

    prime_color(){
        this.board.fillStyle = this.color;
    }

    paint(){
        this.prime_color();
        this.board.fillRect(this.x, this.y, block_size, block_size);
    }
}

class Snek{
    constructor(x, y, direction, board, color){
        this.head = new Block(x, y, board, color);
        this.tail = [];
        this.length = initial_tail_length;
        this.alive = 0;
        this.direction = direction;
    }

    get_direction(){
        return this.direction;
    }

    set_direction(direction){
        this.direction = direction;
    }

    paint(){
        this.head.paint();

        for(var i=0; i < this.tail.length; i++){
            this.tail[i].paint();
        }
    }

    move(){
        var new_x = this.head.get_block_x();
        var new_y = this.head.get_block_y();

        if (this.direction == Direction.Right) {
            new_x = this.head.get_block_x() + 1;
        } else if (this.direction == Direction.Left) {
            new_x = this.head.get_block_x() - 1
        } else if (this.direction == Direction.Up) {
            new_y = this.head.get_block_y() - 1
        } else {
            new_y = this.head.get_block_y() + 1;
        }

        this.tail.unshift(this.head);
        this.head = new Block(new_x, new_y, this.head.get_board(), this.head.get_color());
    }

    trim(){
        while (this.tail.length > this.length){
            this.tail.pop();
        }
    }

    head_is_in_tail(){
        for(var i=0; i < this.tail.length; i++){
            if(this.tail[i].get_block_x() == this.head.get_block_x() && 
               this.tail[i].get_block_y() == this.head.get_block_y()){
                return true;
            }
        }
        return false;
    }

    head_is_out_of_bounds(){
        return this.head.get_true_x() < 0 || this.head.get_true_y() < 0 || 
               this.head.get_true_x() > this.head.get_board().canvas.width || 
               this.head.get_true_y() > this.head.get_board().canvas.height;
    }
    
    check(){
        this.alive++;
        if (target.get_block_x() == this.head.get_block_x() && target.get_block_y() == this.head.get_block_y()){
            this.length++;
            this.alive = 0;
            var canvas_context = this.head.get_board();
            var canvas = canvas_context.canvas;
            return new Block(Math.floor(Math.random() * (canvas.width/(block_size + block_space) - 1)),
                             Math.floor(Math.random() * (canvas.height/(block_size + block_space) - 1)),
                             canvas_context, "green");
        } else if (this.head_is_in_tail() || this.head_is_out_of_bounds()){
            clearInterval(game);
            window.removeEventListener("keypress", function(e){take_input(this, e)}, true);
            setup();
        }
        return target;
    }

    score(){
        var score_element = document.getElementsByClassName("points_scored")[0];
        var score_rate_element = document.getElementsByClassName("point_rate")[0];

        score_element.innerHTML = (this.length - initial_tail_length).toString();
        score_rate_element.innerHTML = ((this.length - initial_tail_length) * 200/this.alive).toPrecision(5).toString();
    }
};

