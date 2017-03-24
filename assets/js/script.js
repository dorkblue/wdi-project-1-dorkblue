$(document).ready(function () {
  console.log('linked!')

  $h2 = $('#enemycast')
  $enemyHP = $('#enemyHP') // change variable name later
  $counterForCurrent = $('#countercast')

  $playerInput = $('#playerInput')

  $testButton = $('#testButton')
  $playerHP = $('#playerHP')
  var playerHP = 50

//
// var enemySpells = ['magical weather', 'darkness', 'serpensortia', 'dementors', 'stunned']
//
//
//
// var enemySpells = [
//   {name: 'magical weather',
//   counter: 'meteolojinx recanto'},
//   {name: 'darkness',
//   counter: 'lumos'},
//   {name: 'serpensortia',
//   counter: 'vipera evanesca'},
//   {name: 'dementors',
//   counter: 'expecto patronum'},
//   {name: 'stunned',
//   counter: 'rennervate'}
// ]

// function startGame () {
//   var timerId = setInterval(spellChooser, 2000)
// }
//
// function spellChooser (spellArr) {
//   var number = Math.floor(Math.random()) * spellArr.length
//
//   var spellToCast = spellArr[number].name
//
//   spellCast(spellToCast)
//
// }
//
// function spellCast (spell) {
//   $h2.text(spell)
// }
// // var counterSpells =
//
// // enemySpells.forEach(function(spell){
// //   console.log(spell.name, spell.counter)
// // })
//
// startGame()

  Enemy.prototype.start = function () {
    // console.log('before keypress')
    // console.log(this)
    $enemyHP.text(this.name + '\'s HP ' + this.hp)
    $playerHP.text('Your HP ' + playerHP)
    $playerInput.keypress(function (e) {
      if (e.keyCode === 13) {     // NOTE1: should change to non-enter check. player shouldnt have to press enter
        // console.log('after keypress')
        // console.log(this)
        this.playerInput()
      }
    }.bind(this))
  }

  Enemy.prototype.playerInput = function () {
    // console.log('check input here')
    // console.log(this)
    if ($playerInput.val() !== this.currentCounter) { // NOTE1.1: if counter is correct, then activate function
      // console.log('no input or wrong input sir!')
      $playerInput.val('')
    } else {
      // console.log('right input sir!')
      $playerInput.val('')
      // this.hp -= 10
      $enemyHP.text(this.name + '\'s HP ' + (this.hp -= 10))

      this.cast() // NOTE2: call cast after gamecheck. else overlapping of cast
    }
  }


  function Enemy (name, spells, quote) {
    this.name = name
    this.numberofspells = spells // for later stage to generate random number of spells from the compendium
    this.quote = quote
    this.timerId = 0
    this.countdown = 0
    this.hp = 50
    this.modifier // later stage for difficulty settings
    this.currentCast = ''
    this.currentCounter = ''
    this.spells = [
      {name: 'magical weather',
        counter: 'meteolojinx recanto',
        time: 4},
      {name: 'darkness',
        counter: 'lumos',
        time: 4},
      {name: 'serpensortia',
        counter: 'vipera evanesca',
        time: 4},
      {name: 'dementors',
        counter: 'expecto patronum',
        time: 4},
      {name: 'stunned',
        counter: 'rennervate',
        time: 4}
    ]
  }

  // generate spell to cast with Math.random on enemy.spells
  // output spell on page
  Enemy.prototype.cast = function () {
    console.log('enemy casting!')
    // generate random spells
    var num = Math.floor(Math.random() * this.spells.length)

    this.currentCast = this.spells[num].name
    this.currentCounter = this.spells[num].counter
    this.countdown = this.spells[num].time * 1000

    $h2.text(this.currentCast)
    $counterForCurrent.text(this.currentCounter)
    this.timerId = window.setTimeout(this.playerDamaged.bind(this), this.countdown)
    // console.log(spellToCast)
  }

  Enemy.prototype.playerDamaged = function () { // NOTE1.2:
    console.log('Enemy cast ended!')
    playerHP -= 10
    $playerHP.text('Your HP ' + playerHP)
    if (!this.gameEnd()) {
      clearInterval(this.timerId)
      this.cast()
    }
  }

  Enemy.prototype.gameEnd = function () {
    if (this.hp === 0 || playerHP === 0) {
      $playerInput.prop('disabled', true)
      console.log('checking both hp!')
      if (this.hp === 0) {
        console.log('draco lost!')
        $enemyHP.text('You\'ve defeated ' + this.name)
      } else {
        console.log('you lost!')
        $enemyHP.text(this.name + ' has defeated you')
      }
      return true
    } else {
      return false
    }
  }

  // $testButton.on('click', function () {
  //   var test = draco.cast()
  //   // console.log(test)
  //   // console.log($h2)
  //   $h2.text(draco.cast())
  // })

  var draco = new Enemy('Draco Malfoy', 5, 'Wait \'til my father hears about this!')
  draco.cast()
  draco.start()

 // ////////////// SPELL SPEED TEST ///////////////
  $divTest = $('div.test')

  $spellToTest = $divTest.find('input').eq(0)
  $spellToCheck = $divTest.find('input').eq(1)
  var timerId = 0
  var seconds = 0
// adding event listener on $spellToCheck

  $spellToTest.keydown(function (e) {
    if (e.keyCode === 9) {
      console.log('time start!')
      timerId = setInterval(counter, 1000)
    }
  })

  $spellToCheck.keypress(function (e) {
    if (e.keyCode === 13) {
      console.log('start count!')
      clearInterval(timerId)
      console.log(seconds)
      seconds = 0
    }
  })

  function counter () {
    seconds++
    console.log(seconds)
  }

// ///////////////////////////////////////////

// magical weather < Meteolojinx Recanto
// darkness < Lumos
// Serpensortia < Vipera Evanesca
// Dementors < Patronus
// Stunned < Rennervate
})
