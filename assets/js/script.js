$(document).ready(function () {
  console.log('linked!')

  $h2 = $('#enemycast')
  $enemyHP = $('#enemyHP') // change variable name later
  $counterForCurrent = $('#countercast')

  $playerInput = $('#playerInput')

  $testButton = $('#testButton')

  var playerHP = 100

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
    console.log('before keypress')
    console.log(this)
    $enemyHP.text('HP ' + this.hp)
    $playerInput.keypress(function (e) {
      if (e.keyCode === 13) {
        console.log('after keypress')
        console.log(this)
        this.playerInput()
      }
    }.bind(this))
  }

  Enemy.prototype.playerInput = function () {
    console.log('check input here')
    console.log(this)
    if ($playerInput.val() !== this.currentCounter) {
      console.log('no input or wrong input sir!')
      $playerInput.val('')
    } else {
      console.log('right input sir!')
      $playerInput.val('')
      // this.hp -= 10
      $enemyHP.text('HP ' + (this.hp -= 10))
      this.cast()
    }
  }



  // function checkInput () {
  //   console.log('check input here')
  //   console.log(this)
  // }

  function Enemy (name, spells, quote) {
    this.name = name
    this.numberofspells = spells // for later stage to generate random number of spells from the compendium
    this.quote = quote
    this.timerId = 0
    this.countdown = 0
    this.hp = 100
    this.modifier // later stage for difficulty settings
    this.currentCast = ''
    this.currentCounter = ''
    this.spells = [
      {name: 'magical weather',
        counter: 'meteolojinx recanto',
        time: 3},
      {name: 'darkness',
        counter: 'lumos',
        time: 3},
      {name: 'serpensortia',
        counter: 'vipera evanesca',
        time: 3},
      {name: 'dementors',
        counter: 'expecto patronum',
        time: 3},
      {name: 'stunned',
        counter: 'rennervate',
        time: 3}
    ]
  }

  // generate spell to cast with Math.random on enemy.spells
  // output spell on page
  Enemy.prototype.cast = function () {
    // generate random spells
    var num = Math.floor(Math.random() * this.spells.length)

    this.currentCast = this.spells[num].name
    this.currentCounter = this.spells[num].counter
    this.countdown = this.spells[num].time * 1000

    $h2.text(this.currentCast)
    $counterForCurrent.text(this.currentCounter)
    this.timerId = window.setTimeout(this.endCast.bind(this), this.countdown)
    // console.log(spellToCast)
  }

  Enemy.prototype.endCast = function () {
    console.log('Enemy cast ended!')
    clearInterval(this.timerId)
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
