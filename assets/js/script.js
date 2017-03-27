$(document).ready(function () {
  console.log('linked!')

  $h2 = $('#enemycast')
  $enemyHP = $('#enemyHP') // change variable name later
  $counterForCurrent = $('#countercast')

  $playerInput = $('#playerInput')

  $testButton = $('#testButton')
  $playerHP = $('#playerHP')
  var playerHP = 50

  Enemy.prototype.start = function () {
    // console.log('before keypress')
    // console.log(this)
    $enemyHP.text(this.name + '\'s HP ' + this.enemyHP)
    $playerHP.text('Your HP ' + this.playerHP)
    $playerInput.keyup(function () {
      // console.log('keypressed!')
      this.playerInput()
    }.bind(this))
    this.counterListUpdate()
    this.gameEnd()
  }

  Enemy.prototype.counterListUpdate = function () {
    $countDiv = $('.counterlist')

    this.counters.forEach(function (counter) {
      $h4 = $('<h4>')
      $h4.attr('id', counter)
      $countDiv.append($h4.text(counter))

      console.log(counter)
      $test = $('<h4>')
      console.log($test.text())
    })
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
      this.preCast()
    }
  }

  Enemy.prototype.preCast = function () {
    var num1 = Math.floor(Math.random() * this.skillSet1.length)
    var num2 = Math.floor(Math.random() * this.skillSet2.length)

    if (num1 > num2) {
      this.cast('skillSet1')
    } else if (num2 >= num1) {
      this.cast('skillSet2')
    }
  }

  Enemy.prototype.cast = function (skillset) {
    console.log('enemy casting!')
    // generate random spells
    var num = Math.floor(Math.random() * this[skillset].length)

    this.currentCast = this[skillset][num].name
    this.currentCounter = this[skillset][num].counter
    this.countdown = this[skillset][num].time * 1000

    $h2.text(this.currentCast)
    $counterForCurrent.text(this.currentCounter)
    console.log(this.currentCounter)
    var ID = this.currentCounter
    $toShow = $('#' + ID)
    $toShow.css('color', 'red')

    this.castTimer = window.setTimeout(this.damage.bind(this, 'playerHP'), this.countdown)

    // console.log(spellToCast)
  }

  function Enemy (name, spells1, spells2, quote) {
    this.name = name
    this.quote = quote
    this.castTimer = 0
    this.countdown = 0

    this.enemyHP = 100
    this.enemyHPDisplay = $('#enemyHP')
    this.playerHP = 200
    this.playerHPDisplay = $('#playerHP')

    this.currentCast = ''
    this.currentCounter = ''

    this.modifier // later stage for difficulty settings
    this.numSkillSet1 = spells1
    this.numSkillSet2 = spells2

    this.damageUpdate = function (whotoupdate) {
    }

    this.skillSet1 = this.getSpells(this.numSkillSet1, compendium1)
    this.skillSet2 = this.getSpells(this.numSkillSet2, compendium2)
    this.counters = this.getCounters()
  }

  Enemy.prototype.getCounters = function () {
    var allSkills = this.skillSet1.concat(this.skillSet2)
    var allCounters = []

    allSkills.forEach(function (skill) {
      if (skill.counter !== 'dodge') {
        allCounters.push(skill.counter)
      }
    })
    return allCounters
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
      accu = accu.concat(val)
      return accu
    })
    console.log(spellList)
    return spellList
  }

  //
  var compendium1 = [
    {name: 'bombarda maxima',
      counter: 'dodge',
      time: 4},
    {name: 'fiendfyre',
      counter: 'dodge',
      time: 3},
    {name: 'baubillious',
      counter: 'dodge',
      time: 3},
    {name: 'immobulus',
      counter: 'dodge',
      time: 3},
    {name: 'glacius tria',
      counter: 'dodge',
      time: 3},
    {name: 'confringo',
      counter: 'confringo',
      time: 3},
    {name: 'levicorpus',
      counter: 'liberacorpus',
      time: 4},
    {name: 'serpensortia',
      counter: 'vipera evanesca',
      time: 4},
    {name: 'dementors',
      counter: 'expecto patronum',
      time: 4},
    {name: 'stupefy',
      counter: 'rennervate',
      time: 3},
    {name: 'sectumsempra',
      counter: 'vulnera sanentur',
      time: 3},
    {name: 'expelliarmus',
      counter: 'expelliarmus',
      time: 3},
    {name: 'incendio tria',
      counter: 'incendio tria',
      time: 3}
  ]

  // var compendium2 = [
  // ]
  // insta death spells
  var compendium2 = [
    {name: 'avada kedavra',
      counter: 'dodge',
      time: 3},
    {name: 'expulso',
      counter: 'dodge',
      time: 4},
    {name: 'reducto',
      counter: 'dodge',
      time: 4}
  ]

  // for later stages extra effects
  var compendium4 = [
    {name: 'darkness',
      counter: 'lumos',
      time: 3},

    {name: 'darkness',
      counter: 'lumos',
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

  var draco = new Enemy('Draco Malfoy', 10, 3, 'Wait \'til my father hears about this!')
  // draco.cast()
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
