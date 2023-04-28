console.log(vocab_pairs)
const terms = vocab_pairs["terms"]
const definitions = vocab_pairs["definitions"]
let items_missed_once_index = []
let score = 0

num_terms = terms.length
console.log(num_terms)

class Gameplay extends Phaser.Scene {
    constructor() {
        super("Gameplay")
        this.printText;
        this.asteroids;
        this.scoreText;
        this.difficulty = 0;
    }
    preload() {
        var url;
        url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexbbcodetextplugin.min.js';
        this.load.plugin('rexbbcodetextplugin', url, true);
      
        url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rextexteditplugin.min.js';
        this.load.plugin('rextexteditplugin', url, true);

        this.load.image('background', 'static/background.jpg');
        this.load.image("asteroid", "static/asteroid.png");
    }

    create() {
        //setting background image to length of whole screen
        let background = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'background')
        let scaleX = this.cameras.main.width / background.width
        let scaleY = this.cameras.main.height / background.height
        let scale = Math.max(scaleX, scaleY)
        background.setScale(scale).setScrollFactor(0)
        this.scoreText = this.add.text(16, 16, `score: ${score}`, { fontSize: '32px', fill: '#000' });

        this.asteroids = this.physics.add.group({
            key: "asteroid",
            setScale: {x: .25, y: .25},
            repeat: 0,
            setXY: {x: Phaser.Math.FloatBetween(50, 750), y: 0}
        });

        let self = this
        this.asteroids.children.iterate(function (child){

            reset_asteroid(child, self)
        })

        this.printText = this.add.rexBBCodeText(400, 550, 'Type the Definition Here', {
            color: 'black',
            fontSize: '24px',
            fixedWidth: 400,
            fixedHeight: 40,
            backgroundColor: '#EFFEFF',
            valign: 'center',
            // rtl: true
        })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', function () {
                var config = {
                    onOpen: function (textObject) {
                    },
                    onTextChanged: function (textObject, text) {
                        textObject.text = text;
                    },
                    onClose: function (textObject) {
                    },
                    selectAll: true,
                    // enterClose: false
                }
                this.plugins.get('rextexteditplugin').edit(this.printText, config);
            }, this);

    }

    update() {
        self = this
        this.asteroids.children.iterate(function (child){
            child.text.x = child.x - 50
            child.text.y = child.y
            if(self.printText.text.toLowerCase() === child.definition.toLowerCase())
            {
                score += 10;
                self.difficulty += 1;
                
                self.scoreText.setText("Score: " + score);
                child.text.setVisible(false)
                reset_asteroid(child, self)
                document.querySelector("input").value = "";
                
                if(self.difficulty % 10 === 0)
                {
                    child = self.asteroids.create(0, 0, "asteroid").setScale(.25)
                    reset_asteroid(child, self)
                }
                
            }
            if(child.y > 600)
            {
                //game over
                self.physics.pause();
                self.scene.start('GotItemWrong', {termIndex: child.term_number});
                //redirect to play again page with score
                //window.location.replace("/");
            }
        })
     }



}

class GotItemWrong extends Phaser.Scene {
    constructor() {
        super("GotItemWrong")
        this.text;
    }
    init(data)
    {
        console.log('init', data);
        this.termIndex = data.termIndex;
        this.term = terms[this.termIndex];
        this.definition = definitions[this.termIndex];
        console.log(this.def)
    }
    preload()
    {
        var url;
        url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexbbcodetextplugin.min.js';
        this.load.plugin('rexbbcodetextplugin', url, true);
      
        url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rextexteditplugin.min.js';
        this.load.plugin('rextexteditplugin', url, true);

        this.load.image('background', 'static/background.jpg');
        
       

    }

    create()
    {
        console.log(items_missed_once_index)
        let background = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'background')
        let scaleX = this.cameras.main.width / background.width
        let scaleY = this.cameras.main.height / background.height
        let scale = Math.max(scaleX, scaleY)
        background.setScale(scale).setScrollFactor(0)

        this.text = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, `The correct definition of ${this.term} is ${this.definition}`,
        { fontSize: '32px', fill: 'red', align: "center", wordWrap: { width: 600, useAdvancedWrap: true }})
        .setBackgroundColor("white")
        .setOrigin(0.5, 0.5);

        this.printText = this.add.rexBBCodeText(400, 550, 'Retype the correct definition', {
            color: 'black',
            fontSize: '24px',
            fixedWidth: 400,
            fixedHeight: 40,
            backgroundColor: '#EFFEFF',
            valign: 'center',
            // rtl: true
        })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', function () {
                var config = {
                    onOpen: function (textObject) {
                    },
                    onTextChanged: function (textObject, text) {
                        textObject.text = text;
                    },
                    onClose: function (textObject) {
                    },
                    selectAll: true,
                    // enterClose: false
                }
                this.plugins.get('rextexteditplugin').edit(this.printText, config);
            }, this);
    }

    update() 
    {
        if(this.printText.text.toLowerCase() == this.definition.toLowerCase())
        {
            if(items_missed_once_index.includes(this.termIndex))
            {
                //game over
                console.log("game over")
                this.text.text = "Game Over"
            }
            else
            {
                items_missed_once_index.push(this.termIndex)
                this.scene.start("Gameplay");
            }
        }
    }
}

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    physics: {
            default: "arcade",
            arcade: {
                gravity: {y: 25},
                debug: false
            }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    dom: {
        createContainer: true
    },
    
    scene: [Gameplay, GotItemWrong]
};
function reset_asteroid(child, self) {
            child.setVelocityY(-self.difficulty/20)
            child.x = Phaser.Math.Between(50, 750)
            child.y = 0

            if(Phaser.Math.Between(0, 4))
            {
                //with 10% probability select random item from list of items that have already been missed once
                if (items_missed_once_index.length > 0) {
                    child.term_number = items_missed_once_index[Phaser.Math.Between(0, items_missed_once_index.length - 1)] 
                    console.log("Getting item missed once")
                }
                else {
                    child.term_number = Phaser.Math.Between(0, num_terms - 1)
                }
            }
            else
            {
                child.term_number = Phaser.Math.Between(0, num_terms - 1)
            }
            child.term = terms[child.term_number]
            child.definition = definitions[child.term_number]

            if(items_missed_once_index.includes(child.term_number))
            {
                child.text = self.add.text(child.x, child.y, child.term, { fontSize: '25px', fill: 'red', backgroundColor: "white", wordWrap: { width: 450, useAdvancedWrap: true }});
            }
            else
            {
                child.text = self.add.text(child.x, child.y, child.term, { fontSize: '25px', fill: 'black', backgroundColor: "white", wordWrap: { width: 450, useAdvancedWrap: true }});
            }
    }

var game = new Phaser.Game(config);