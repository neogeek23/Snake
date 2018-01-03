window.onload=function(){
    fps = 30;
    ms_in_sec = 1000;
    paddel_h = 35;
    paddel_w = 4;
    AI_speed = 5;
    ball_speed = 6;
    setup()
};

function setup(){
    var canvas = document.getElementById("board");
    var canvas_context = canvas.getContext('2d');
    var human = new Paddel(0, 0, paddel_w, paddel_h, "green", canvas_context);
    var bot = new Paddel(canvas.width -  paddel_w, canvas.height - paddel_h, paddel_w, paddel_h, "red", canvas_context);
    var ball = new Ball(canvas.width/2, canvas.height/2, paddel_w/1.5, "blue", canvas_context);

    game = window.setInterval(function(){update(canvas, canvas_context, human, bot, ball)}, ms_in_sec/fps);
    window.addEventListener("mousemove", function(e){human.follow_mouse(e)}, false);
}

function update(canvas, canvas_context, human, bot, ball){
    paint_background(canvas, canvas_context);
    ball.paint();
    human.paint();
    bot.paint()
    bot.move(ball);
    ball.move(human, bot);
};

function paint_background(canvas, canvas_context){
    canvas_context.fillStyle = "white";
    canvas_context.fillRect(0,0, canvas.width, canvas.height);
};

class Paddel{
    constructor(x, y, w, h, color, board){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.mid_y = y + h/2;
        this.color = color;
        this.board = board;
        this.points = 0;
    }

    follow_mouse(event){
        var c = this.board.canvas.getBoundingClientRect();
        var scale_y = this.board.canvas.height/c.height;

        this.y = (event.clientY - c.top)*scale_y - this.h/2;
        this.mid_y = this.y + this.h/2;
    }

    move(ball){
        if (this.mid_y < ball.get_y()){
            this.y += AI_speed;
        } else {
            this.y -= AI_speed;
        }
        this.mid_y = this.y + this.h/2;
    }

    get_y(){
        return this.y;
    }

    get_h(){
        return this.h;
    }

    get_mid_y(){
        return this.mid_y;
    }

    paint(){
        this.board.fillStyle = this.color;
        this.board.fillRect(this.x, this.y, this.w, this.h);
    }

    score(){
        this.points++;
        if(this.color == "red"){
            document.getElementsByClassName("bot_points")[0].innerHTML = this.points.toString();
        } else{
            document.getElementsByClassName("human_points")[0].innerHTML = this.points.toString();
        }

        if(this.points == 10){
            clearInterval(game);
            window.removeEventListener("mousemove", function(e){this.follow_mouse(e)}, true);
        }
    }
}

class Ball{
    constructor(x, y, r, color, board){
        this.x = x;
        this.y = y;
        this.vx = Math.random() * ball_speed + 2;
        this.vy = Math.random() * ball_speed + 2;
        this.r = r;
        this.color = color;
        this.board = board;
    }

    get_y(){
        return this.y;
    }

    paint(){
        this.board.fillStyle = this.color;
        this.board.beginPath();
        this.board.arc(this.x, this.y, this.r, 0, Math.PI*2, true);
        this.board.closePath();
        this.board.fill();
    }

    reset(){
        this.x = this.board.canvas.width/2;
        this.y = this.board.canvas.height/2;
        this.vx = Math.random() * ball_speed + 2;
        this.vy = Math.random() * ball_speed + 2;
    }

    move(left, right){
        this.x += this.vx;
        this.y += this.vy;

        if ((this.y < 0 && this.vy < 0) || (this.y > this.board.canvas.height && this.vy > 0)){
            this.vy = -this.vy;
        }

        if (this.x < 0){
            if(this.y > left.get_y() && this.y < (left.get_y() + left.get_h())){
                this.vx = -this.vx;
                this.vy = (this.y - left.get_mid_y());
            } else {
                right.score();
                this.reset();
            }
        }

        if (this.x > this.board.canvas.width){
            if(this.y > right.get_y() && this.y < (right.get_y() + right.get_h())){
                this.vx = -this.vx;
                this.vy = (this.y - right.get_mid_y());
            } else {
                left.score();
                this.reset();
            }
        }
    }
}
