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
//   var castTimer = setInterval(spellChooser, 2000)
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

  // Enemy.prototype.start = function () {
  //   // console.log('before keypress')
  //   // console.log(this)
  //   $enemyHP.text(this.name + '\'s HP ' + this.enemyHP)
  //   $playerHP.text('Your HP ' + playerHP)
  //   $playerInput.keypress(function (e) {
  //     if (e.keyCode === 13) {     // NOTE1: should change to non-enter check. player shouldnt have to press enter
  //       // console.log('after keypress')
  //       // console.log(this)
  //       this.playerInput()
  //     }
  //   }.bind(this))
  // }

  // Enemy.prototype.playerInput = function () {
  //   // console.log('check input here')
  //   // console.log(this)
  //   if ($playerInput.val() !== this.currentCounter) { // NOTE1.1: if counter is correct, then activate function
  //     // console.log('no input or wrong input sir!')
  //     $playerInput.val('')
  //   } else {
  //     // console.log('right input sir!')
  //     $playerInput.val('')
  //     // this.enemyHP -= 10
  //     $enemyHP.text(this.name + '\'s HP ' + (this.enemyHP -= 10))
  //
  //     this.cast() // NOTE2: call cast after gamecheck. else overlapping of cast
  //   }
  // }

  Enemy.prototype.start = function () {
    // console.log('before keypress')
    // console.log(this)
    $enemyHP.text(this.name + '\'s HP ' + this.enemyHP)
    $playerHP.text('Your HP ' + this.playerHP)
    $playerInput.keyup(function () {
      // console.log('keypressed!')
      this.playerInput()
    }.bind(this))
  }

  Enemy.prototype.playerInput = function () {
    // console.log('check input here')
    // console.log($playerInput.val())
    // console.log(this.currentCounter)
    // console.log(this)
    if ($playerInput.val() === this.currentCounter) { // NOTE1.1: if counter is correct, then activate function
      console.log('right input!')
      // this.playerInputReset()
      this.damage('enemyHP')
    }
  }

  Enemy.prototype.damage = function (playerOrEnemy) {
    clearInterval(this.castTimer)
    $playerInput.val('')
    // if ()
    this[playerOrEnemy] -= 10
    this[playerOrEnemy + 'Display'].text(this[playerOrEnemy])
    console.log(playerOrEnemy + this[playerOrEnemy])

    // check game status here
    this.gameEnd()
  }

  Enemy.prototype.gameEnd = function () {
    if (this.enemyHP === 0 || this.playerHP === 0) {
      $playerInput.prop('disabled', true)
      console.log('checking both enemyHP!')
      if (this.enemyHP === 0) {
        // console.log('draco lost!')
        $enemyHP.text('You\'ve defeated ' + this.name)
      } else {
        // console.log('you lost!')
        $enemyHP.text(this.name + ' has defeated you')
      }
    } else {
      this.cast()
    }
  }

  Enemy.prototype.playerDamaged = function () { // NOTE1.2: separate dmg and checks to 2 diff fn
    console.log('Enemy cast ended!')
    this.playerHP -= 10
    $playerHP.text('Your HP ' + this.playerHP)
    if (!this.gameEnd()) {
      clearInterval(this.castTimer)
      this.cast()
    }
  }

  Enemy.prototype.cast = function () {
    console.log('enemy casting!')
    // generate random spells
    var num = Math.floor(Math.random() * this.spells.length)

    this.currentCast = this.spells[num].name
    this.currentCounter = this.spells[num].counter
    this.countdown = this.spells[num].time * 1000

    $h2.text(this.currentCast)
    $counterForCurrent.text(this.currentCounter)
    this.castTimer = window.setTimeout(this.damage.bind(this, 'playerHP'), this.countdown)

    // console.log(spellToCast)
  }

  function Enemy (name, spells, quote) {
    this.name = name
    this.quote = quote
    this.castTimer = 0
    this.countdown = 0

    this.enemyHP = 50
    this.enemyHPDisplay = $('#enemyHP')
    this.playerHP = 50
    this.playerHPDisplay = $('#playerHP')

    this.currentCast = ''
    this.currentCounter = ''

    this.modifier // later stage for difficulty settings
    this.numberofspells = spells // for later stage to generate random number of spells from the compendium
    this.damageUpdate = function (whotoupdate) {

    }

    this.spells = this.getSpells(this.numberofspells, spellCompendium)
  }

  Enemy.prototype.getSpells = function (number, compendiumToGetFrom) {
    var spellsPlaceholder = compendiumToGetFrom
    var spellList = []

    while (number !== spellList.length) {
      var RNG = Math.floor(Math.random() * spellsPlaceholder.length)
      var spellToInclude = spellsPlaceholder.splice(RNG, 1)

      spellList.push(spellToInclude)
    }
    spellList = spellList.reduce(function (accu, val) {
      console.log(accu, val)
      accu = accu.concat(val)
      return accu
    })
    console.log(spellList.length)
    return spellList
  }

  var spellCompendium = [
    {name: 'magical weather',
      counter: 'meteolojinx recanto',
      time: 4},
    {name: 'darkness',
      counter: 'lumos',
      time: 3},
    {name: 'serpensortia',
      counter: 'vipera evanesca',
      time: 4},
    {name: 'dementors',
      counter: 'expecto patronum',
      time: 4},
    {name: 'stunned',
      counter: 'rennervate',
      time: 3}
  ]

  // generate spell to cast with Math.random on enemy.spells
  // output spell on page

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
  var castTimer = 0
  var seconds = 0
// adding event listener on $spellToCheck

  $spellToTest.keydown(function (e) {
    if (e.keyCode === 9) {
      console.log('time start!')
      castTimer = setInterval(counter, 1000)
    }
  })

  $spellToCheck.keypress(function (e) {
    if (e.keyCode === 13) {
      console.log('start count!')
      clearInterval(castTimer)
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
