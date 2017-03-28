$(document).ready(function () {
  console.log('linked!')

  // $textbox = $('#textbox')
  // $enemyHP = $('#enemyHP') // change variable name later
  // $counterForCurrent = $('#countercast')
  // $playerHP = $('#playerHP')
  $playerInput = $('#playerInput')
  $startButton = $('#startbutton')
  $overlay = $('.overlay')
  $momo = $('#momo2 img')
  $evilmomo = $('#momo img')
  $restart = $('.restart')
  $winscreen = $('.winscreen')
  $losescreen = $('.losescreen')
  $textbox1 = $('p.textbox1')
  $textbox2 = $('p.textbox2')

  function Enemy (name, spells1, spells2, modifier, quote) {
    this.name = name
    this.quote = quote
    this.castTimer = 0
    this.timerId = 0
    this.countdown = 0

    this.enemyHP = 60
    this.enemyHPDisplay = $('#enemyHP')
    this.playerHP = 60
    this.playerHPDisplay = $('#playerHP')

    this.currentCast = ''
    this.currentCounter = ''
    this.currentDMG = 0

    this.modifier = modifier
    this.numSkillSet1 = spells1
    this.numSkillSet2 = spells2

    // this.damageUpdate = function (whotoupdate) {
    // }

    this.skillSet1 = this.getSpells(this.numSkillSet1, compendium1)

    this.skillSet2 = this.getSpells(this.numSkillSet2, compendium2)
    this.counters = this.getCounters()
  }

  Enemy.prototype.start = function () {
    $playerInput.keyup(function () {
      this.playerInput()
    }.bind(this))
    this.heartsDisplay('playerHP')
    this.heartsDisplay('enemyHP')
    this.counterListUpdate()
    this.gameEnd()
  }

  Enemy.prototype.counterListUpdate = function () {
    $countDiv = $('.counterlist')

    $countDiv.empty()

    this.counters.forEach(function (counter) {
      $div = $('<div>')
      $td = $('<td>').text(counter)
      $div.append($td)
      // $td.attr('id', counter)
      $countDiv.append($div)

      console.log(counter)
    })
  }

  Enemy.prototype.playerInput = function () {
    // $textbox2 = $('p.textbox2')
    if ($playerInput.val() === this.currentCounter) {
      console.log('right input!')
      $textbox2.text($playerInput.val())
      $textbox2.css('display', 'inline')
      $textbox2.css('color', 'black')

      this.damage('enemyHP')
    }
  }

  Enemy.prototype.damage = function (playerOrEnemy) {
    // $textbox1 = $('p.textbox1')
    // $textbox2 = $('p.textbox2')
    $countdownDisplay = $('#countdown')

    $countdownDisplay.toggleClass('animate')

    if (playerOrEnemy === 'playerHP') {
      // $textbox1.css('color', 'red')
      $textbox2.css('display', 'none')
    } else if (playerOrEnemy === 'enemyHP') {
      $textbox1.css('display', 'none')
      // $textbox2.css('color', 'red')
    }

    this.toggleDisplayOff(this.currentCounter)
    clearInterval(this.castTimer)
    $playerInput.val('')

    if (playerOrEnemy === 'playerHP') {
      $evilmomo.attr('src', 'assets/image/evil-momo-cast.gif')
      $momo.attr('src', 'assets/image/momo-hurt.gif')
      this[playerOrEnemy] += this.currentDMG
    } else if (playerOrEnemy === 'enemyHP') {
      $momo.attr('src', 'assets/image/momo-cast.gif')
      $evilmomo.attr('src', 'assets/image/evil-momo-hurt.gif')
      this[playerOrEnemy] -= 10
    }
    this.heartsDisplay(playerOrEnemy)
    // check game status here
    this.gameEnd()
  }

  Enemy.prototype.heartsDisplay = function (playerOrEnemy) {
    console.log(playerOrEnemy)
    $lifebar = $('#' + playerOrEnemy)
    $lifebar.empty()

    var fullHeart = (this[playerOrEnemy] - this[playerOrEnemy] % 20) / 20

    var halfHeart = (this[playerOrEnemy] % 20) / 10

    for (var i = fullHeart; i > 0; i--) {
      $div = $('<div>')
      // $div.attr('id', 'life')
      $div.addClass('life')

      $img = $('<img>').attr('src', 'assets/image/full-heart.png')
      $div.append($img)
      $lifebar.append($div)
    }

    for (var j = halfHeart; j > 0; j--) {
      $div = $('<div>')
      $div.addClass('life')
      $img = $('<img>').attr('src', 'assets/image/half-heart.png')
      $div.append($img)
      $lifebar.append($div)
    }
  }

  function winscreen () {
    $winscreen.css('display', 'block')
  }

  function losescreen () {
    $losescreen.css('display', 'block')
  }

  Enemy.prototype.gameEnd = function () {
    if (this.enemyHP <= 0 || this.playerHP <= 0) {
      console.log(this)
      console.log(this.enemyHP)
      console.log(this.playerHP)
      $playerInput.prop('disabled', true)
      console.log('checking both enemyHP!')
      if (this.enemyHP <= 0) {
        this.timerId = setTimeout(winscreen, 2000)
        // $momo.attr('src', 'assets/image/momo-victorypose.gif')
        console.log('momo won!')
      } else if (this.playerHP <= 0) {
        this.timerId = setTimeout(losescreen, 2000)

        console.log('momo lost!')
      }
    } else {
      this.timerId = setTimeout(this.preCast.bind(this), 800)
      // this.preCast()
    }
  }

  Enemy.prototype.preCast = function () {
    $momo.attr('src', 'assets/image/momo-standby.gif')
    $evilmomo.attr('src', 'assets/image/evil-momo-standby.gif')
    var num1 = Math.floor(Math.random() * this.skillSet1.length)
    var num2 = Math.floor(Math.random() * this.skillSet2.length)

    $textbox1 = $('p.textbox1')
    $textbox2 = $('p.textbox2')
    $textbox1.css('display', 'none')
    $textbox2.css('display', 'none')

    if (num1 > num2) {
      this.timerId = setTimeout(this.cast.bind(this, 'skillSet1'), 2000)
    } else if (num2 >= num1) {
      this.timerId = setTimeout(this.cast.bind(this, 'skillSet2'), 2000)
    }
  }

  Enemy.prototype.cast = function (skillset) {
    // $textbox1 = $('p.textbox1')
    $countdownDisplay = $('#countdown')
    console.log('enemy casting!')
    // generate random spells
    var num = Math.floor(Math.random() * this[skillset].length)

    this.currentCast = this[skillset][num].name
    this.currentCounter = this[skillset][num].counter
    this.currentDMG = this[skillset][num].dmg
    this.countdown = (this[skillset][num].time + this.modifier) * 1000

    $textbox1.css('display', 'inline')
    $textbox1.css('color', 'black')

    $textbox1.text(this.currentCast + '!')
    $countdownDisplay.css('animation-duration', (this[skillset][num].time + this.modifier) + 's')
    $countdownDisplay.toggleClass('animate')

    // $counterForCurrent.text(this.currentCounter)
    // console.log(this.currentCounter)

    this.toggleDisplayOn(this.currentCounter)

    this.castTimer = window.setTimeout(this.damage.bind(this, 'playerHP'), this.countdown)

    // console.log(spellToCast)
  }

  Enemy.prototype.toggleDisplayOn = function (counterToDisplay) {
    $td = $('.counterlist td')

    $td.each(function (index, element) {
      if ($(this).text() === counterToDisplay) {
        $(this).addClass('toggle1')
      }
    })
  }

  Enemy.prototype.toggleDisplayOff = function (counterToRemoveDisplay) {
    $td = $('.counterlist td')

    $td.each(function (index, element) {
      if ($(this).text() === counterToRemoveDisplay) {
        $(this).removeClass('toggle1')
      }
    })
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
    var spellsPlaceholder = compendiumToGetFrom.slice(0)
    var spellList = []

    while (number !== spellList.length) {
      var RNG = Math.floor(Math.random() * spellsPlaceholder.length)

      var spellToInclude = spellsPlaceholder.splice(RNG, 1)

      spellList.push(spellToInclude)
    }
    return spellList.reduce(function (accu, val) {
      accu = accu.concat(val)
      return accu
    })
    // console.log(spellList.length)
    // return this.spellList
  }

  //
  var compendium1 = [{
    name: 'bombarda maxima',
    counter: 'protego maxima',
    time: 5,
    dmg: -20
  },
    {
      name: 'fiendfyre',
      counter: 'fiendfyre',
      time: 5,
      dmg: -10
    },
    {
      name: 'baubillious',
      counter: 'protego',
      time: 4,
      dmg: -10
    },
    {
      name: 'immobulus',
      counter: 'protego duo',
      time: 5,
      dmg: -10
    },
    {
      name: 'glacius tria',
      counter: 'bombarda maxima',
      time: 5,
      dmg: -10
    },
    {
      name: 'confringo',
      counter: 'confringo',
      time: 4,
      dmg: -10
    },
    {
      name: 'levicorpus',
      counter: 'liberacorpus',
      time: 5,
      dmg: -10
    },
    {
      name: 'serpensortia',
      counter: 'vipera evanesca',
      time: 5,
      dmg: -10
    },
    {
      name: 'dementors',
      counter: 'expecto patronum',
      time: 5,
      dmg: -20
    },
    {
      name: 'stupefy',
      counter: 'rennervate',
      time: 4,
      dmg: -10
    },
    {
      name: 'sectumsempra',
      counter: 'vulnera sanentur',
      time: 5,
      dmg: -20
    },
    {
      name: 'expelliarmus',
      counter: 'expelliarmus',
      time: 5,
      dmg: -10
    },
    {
      name: 'incendio tria',
      counter: 'incendio tria',
      time: 5,
      dmg: -10
    }
  ]

  // var compendium2 = [
  // ]
  // insta death spells
  var compendium2 = [{
    name: 'avada kedavra',
    counter: 'dodge',
    time: 3,
    dmg: -100
  },
    {
      name: 'expulso',
      counter: 'dodge',
      time: 3,
      dmg: -100
    },
    {
      name: 'reducto',
      counter: 'dodge',
      time: 3,
      dmg: -100
    }
  ]

  // for later stages extra effects
  var compendium4 = [{
    name: 'darkness',
    counter: 'lumos',
    time: 3
  },

    {
      name: 'darkness',
      counter: 'lumos',
      time: 3
    }
  ]

  var preStart = new Enemy('', 4, 1, 0)
  preStart.counterListUpdate()
  $startButton.on('click', function () {
    // console.log('clicked!')
    var evilmomo = new Enemy('Evil Momo', 13, 3, 0)
    evilmomo.start()
    $startButton.css('display', 'none')
    $overlay.hide()
  })

  $restart.on('click', function () {
    $winscreen.css('display', 'none')
    $losescreen.css('display', 'none')
    $textbox1.css('display', 'none')
    $textbox2.css('display', 'none')
    $momo.attr('src', 'assets/image/momo-standby.gif')
    $evilmomo.attr('src', 'assets/image/evil-momo-standby.gif')
    $playerInput.prop('disabled', false)
    evilmomo = null
    evilmomo = new Enemy('Evil Momo', 13, 3, 0)
    evilmomo.start()
  })
})
