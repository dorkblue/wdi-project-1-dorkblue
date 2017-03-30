$(document).ready(function () {
  console.log('linked!')

  // $playerInput = $('#playerInput')
  var $startButton = $('#startbutton')
  var $overlay = $('.overlay')
  var $momo = $('#momo2 img')
  var $evilmomo = $('#momo img')
  var $restartButton = $('.restart')
  var $easy = $('#easy')
  var $medium = $('#medium')
  var $winscreen = $('.winscreen')
  var $losescreen = $('.losescreen')
  var $textbox1 = $('p.textbox1')
  var $textbox2 = $('p.textbox2')

// Compendium of skills that don't insta-kill, and has counters
  var compendium1 = [
    {
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
// Compendium of skills that insta-kill, and can only dodge
  var compendium2 = [
    {
      name: 'avada kedavra',
      counter: 'dodge',
      time: 4,
      dmg: -100},
    {
      name: 'expulso',
      counter: 'dodge',
      time: 4,
      dmg: -100},
    {
      name: 'reducto',
      counter: 'dodge',
      time: 4,
      dmg: -100}
  ]

// Constructor. The only one.
  function Enemy (name, spells1, spells2, enemyHP, playerHP, modifier, difficulty) {
  // takes in values from function parameter
    // name
    this.name = name
    // decides number of spellSet1
    this.numSkillSet1 = spells1
    // decides number of spellSet2
    this.numSkillSet2 = spells2
    // AI healthpoints
    this.enemyHP = enemyHP
    // player healthpoints
    this.playerHP = playerHP
    // difficulty
    this.difficulty = difficulty

    // time related properties
    this.castTimer = 0
    this.timerId = 0
    this.countdown = 0

    this.currentDMG = 0
    this.currentCast = ''
    this.currentCounter = ''

    this.modifier = modifier
    // array of spell from compendium1
    this.spellSet1 = this.getSpells(this.numSkillSet1, compendium1)

    // array of spell from compendium2
    this.spellSet2 = this.getSpells(this.numSkillSet2, compendium2)

    // array of counter spell extracted from skillSet 1 & 2
    this.counters = this.getCounters()
  }

// Method to start & set the playing area
  Enemy.prototype.start = function () {
    this.heartsDisplay('playerHP')
    this.heartsDisplay('enemyHP')
    this.counterListUpdate()
    this.gameEnd()
  }

// Method to get spells from the spell compendium 1 & 2
  Enemy.prototype.getSpells = function (number, compendiumToGetFrom) {
    // slice(0) to copy array to spellsPlaceholder
    var spellsPlaceholder = compendiumToGetFrom.slice(0)
    var spellList = []

    while (number !== spellList.length) {
      // generate random number to get random elements of the spellsPlaceholder
      var RNG = Math.floor(Math.random() * spellsPlaceholder.length)
      // splice returns array
      var spellToInclude = spellsPlaceholder.splice(RNG, 1)

      spellList.push(spellToInclude)
    }
    // to concat the arrays inside the spellList array
    return spellList.reduce(function (accu, val) {
      accu = accu.concat(val)
      return accu
    })
  }

// Method to get the list of names of the counter spells
  Enemy.prototype.getCounters = function () {
    // concat array spellSet1 with array spellSet2
    var allSkills = this.spellSet1.concat(this.spellSet2)
    var allCounters = []

    // push spell with actual counter spell to allCounters array
    allSkills.forEach(function (skill) {
      if (skill.counter !== 'dodge') {
        allCounters.push(skill.counter)
      }
    })
    return allCounters
  }

// Method to update div.counterlist with the list of counters
  Enemy.prototype.counterListUpdate = function () {
    // $countDiv is the div.counterlist with the counter spell name child
    var $countDiv = $('.counterlist')
    // empty() child in $countDiv
    $countDiv.empty()
    // updating $countDiv by appending new child
    if (this.difficulty !== 'lunatic') {
      this.counters.forEach(function (counter) {
        // creating new $div with $td child
        var $div = $('<div>')
        var $td = $('<td>').text(counter)

        $div.append($td)
        $countDiv.append($div)
      })
    }
  }

// Method to determine which skillSet (1 or 2) from the instance to output from
  Enemy.prototype.preCast = function () {
    $momo.attr('src', 'assets/image/momo-standby.gif')
    $evilmomo.attr('src', 'assets/image/evil-momo-standby.gif')
    var num1 = Math.floor(Math.random() * this.spellSet1.length)
    var num2 = Math.floor(Math.random() * this.spellSet2.length)

    $textbox1.css('display', 'none')
    $textbox2.css('display', 'none')

    if (num1 > num2) {
      this.timerId = setTimeout(this.cast.bind(this, 'spellSet1'), 2000)
      return
    } else if (num2 >= num1) {
      this.timerId = setTimeout(this.cast.bind(this, 'spellSet2'), 2000)
      return
    }
  }

// Method to output the spells selected by preCast
  Enemy.prototype.cast = function (skillset) {
    console.log(this.name + ' is casting')
    // clearTimeout(this.timerId)
    var $countdownDisplay = $('#countdown')
    // console.log('enemy casting!')
    // generate random spells
    var num = Math.floor(Math.random() * this[skillset].length)

    this.currentCast = this[skillset][num].name
    this.currentCounter = this[skillset][num].counter
    this.currentDMG = this[skillset][num].dmg
    this.countdown = (this[skillset][num].time) + this.modifier

    $textbox1.text(this.currentCast + '!')
    $textbox1.css('display', 'inline')
    $textbox1.css('color', 'black')

    console.log(this.currentCounter)
    $countdownDisplay.css('animation-duration', this.countdown + 's')
    $countdownDisplay.addClass('animate')

    // $counterForCurrent.text(this.currentCounter)
    // console.log(this.currentCounter)

    this.toggleDisplayOn(this.currentCounter)

    this.castTimer = setTimeout(this.damage.bind(this, 'playerHP'), this.countdown * 1000)
    // console.log(spellToCast)
  }

  // Enemy.prototype.playerInput = function () {
  //   $playerInput = $('#playerInput')
  //   // $textbox2 = $('p.textbox2')
  //   if ($playerInput.val() === this.currentCounter) {
  //     console.log('playerInput is ' + this.name)
  //     clearTimeout(this.castTimer)
  //     clearTimeout(this.timerId)
  //     $textbox2.text($playerInput.val())
  //     $textbox2.css('display', 'inline')
  //     $textbox2.css('color', 'black')
  //
  //     $playerInput.val('')
  //     this.damage('enemyHP')
  //   } else if ($playerInput.val() !== this.currentCounter) {
  //     return
  //   }
  // }

// Method to update the numbers on enemyHP & playerHP property of instance
  Enemy.prototype.damage = function (playerOrEnemy) {
    var $playerInput = $('#playerInput')
    $playerInput.val('')
    var $countdownDisplay = $('#countdown')
    $countdownDisplay.removeClass('animate')

    if (playerOrEnemy === 'playerHP') {
      // $textbox1.css('color', 'red')
      $textbox2.css('display', 'none')
    } else if (playerOrEnemy === 'enemyHP') {
      $textbox1.css('display', 'none')
      // $textbox2.css('color', 'red')
    }

    this.toggleDisplayOff(this.currentCounter)

    if (playerOrEnemy === 'playerHP') {
      this[playerOrEnemy] += this.currentDMG
      $evilmomo.attr('src', 'assets/image/evil-momo-cast.gif')
      $momo.attr('src', 'assets/image/momo-hurt.gif')
    } else if (playerOrEnemy === 'enemyHP') {
      $momo.attr('src', 'assets/image/momo-cast.gif')
      $evilmomo.attr('src', 'assets/image/evil-momo-hurt.gif')
      this[playerOrEnemy] -= 10
    }
    this.heartsDisplay(playerOrEnemy)
    // check game status here
    this.gameEnd()
  }

// Method to update the hearts on playing area with reference to enemyHP & playerHP property
  Enemy.prototype.heartsDisplay = function (playerOrEnemy) {
    var $lifebar = $('#' + playerOrEnemy)
    $lifebar.empty()

    var fullHeart = (this[playerOrEnemy] - this[playerOrEnemy] % 20) / 20

    var halfHeart = (this[playerOrEnemy] % 20) / 10

    for (var i = fullHeart; i > 0; i--) {
      var $div = $('<div>')
      // $div.attr('id', 'life')
      $div.addClass('life')

      var $img = $('<img>').attr('src', 'assets/image/full-heart.png')
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
    return
  }

// Method to check if gameEnds and output game end screens
// Calls cast() if game hasn't ended
  Enemy.prototype.gameEnd = function () {
    var $playerInput = $('#playerInput')
    console.log('game end enemyHP ' + this.name + ' ' + this.enemyHP)
    console.log('game end playerHP ' + this.name + ' ' + this.playerHP)

    if (this.enemyHP > 0 && this.playerHP > 0) {
      console.log('pre-cast enemyHP is ' + this.enemyHP)
      console.log('pre-cast playerHP is ' + this.playerHP)
      this.timerId = setTimeout(this.preCast.bind(this), 1000)
      return
    } else if (this.enemyHP <= 0) {
      $playerInput.remove()
      this.timerId = setTimeout(winscreen, 1000)
      console.log('momo won!')
      return
    } else if (this.playerHP <= 0) {
      $playerInput.remove()
      this.timerId = setTimeout(losescreen, 1000)
      console.log('momo lost!')
      return
    }
  }

// Method for div.counterlist. Adds css to show current counter spells
  Enemy.prototype.toggleDisplayOn = function (counterToDisplay) {
    var $td = $('.counterlist td')

    $td.each(function (index, element) {
      if ($(this).text() === counterToDisplay) {
        $(this).toggleClass('toggle1')
      }
    })
  }
// Method for div.counterlist. To remove css on current counter spells
  Enemy.prototype.toggleDisplayOff = function (counterToRemoveDisplay) {
    var $td = $('.counterlist td')

    $td.each(function (index, element) {
      if ($(this).text() === counterToRemoveDisplay) {
        $(this).toggleClass('toggle1')
      }
    })
  }
// Method to add event listener to input#playerInput
  Enemy.prototype.addListenerToInput = function () {
    console.log('listener added!')
    $('#playerInput').on('keyup', function (e) {
      console.log(this)
      console.log('detected playerinput')

      //
      // if ($('#playerInput').val()) {
      //   console.log($('#playerInput').val())
      //   console.log(this)
      //   console.log(this.currentCounter)
      // }
      if (e.keyCode === 16) {
        console.log('shift pressed')
        $('#playerInput').val('')
      } else if (($('#playerInput').val()) === this.currentCounter) {
        console.log(this)
        console.log('playerInput is ' + this.name)
        clearTimeout(this.castTimer)
        clearTimeout(this.timerId)
        $textbox2.text($('#playerInput').val() + '!')
        $textbox2.css('display', 'inline')
        $textbox2.css('color', 'black')

        $('#playerInput').val('')
        this.damage('enemyHP')
      }
    }.bind(this))
  }

  function winscreen () {
    $winscreen.css('display', 'block')
    $('#staticinstruction').css('display', 'none')
  }

  function losescreen () {
    $losescreen.css('display', 'block')
    $('#staticinstruction').css('display', 'none')
  }

  function removeListener () {
    var $playerInput = $('#playerInput')
    $('div.player').off('keyup', $playerInput)
    console.log('listener removed')
  }

  function newPlayerInput () {
    var $newPlayerInput = $('<input>')
    $newPlayerInput.attr('id', 'playerInput')
    $newPlayerInput.attr('autocorrect', 'off')
    $newPlayerInput.attr('spellcheck', 'false')
    $newPlayerInput.attr('autocomplete', 'off')
    $newPlayerInput.attr('autofocus', '')
    $('div.player').append($newPlayerInput)
  }

  function restartReset () {
    removeListener()
    newPlayerInput()
    $winscreen.css('display', 'none')
    $losescreen.css('display', 'none')
    $textbox1.css('display', 'none')
    $textbox2.css('display', 'none')
    $momo.attr('src', 'assets/image/momo-standby.gif')
    $evilmomo.attr('src', 'assets/image/evil-momo-standby.gif')
  }

  var preStart = new Enemy('', 4, 1)
  preStart.counterListUpdate()

  $startButton.on('click', function () {
    var evilmomo = new Enemy('Evil Momo', 10, 1, 60, 100, 1, 'easy')
    evilmomo.addListenerToInput()
    evilmomo.start()
    $startButton.css('display', 'none')
    $overlay.hide()
  })

  // name, spells1, spells2, enemyHP, playerHP, modifier

  $restartButton.on('click', function (e) {
    var evilmomo = null
    restartReset()
    if (e.currentTarget.id === 'easy') {
      console.log('easy')
      evilmomo = new Enemy('Evil Momo', 10, 1, 60, 100, 1, 'easy')
    } else if (e.currentTarget.id === 'medium') {
      console.log('medium')
      evilmomo = new Enemy('Evil Momo', 13, 3, 100, 100, 0, 'medium')
    } else if (e.currentTarget.id === 'hard') {
      console.log('hard')
      evilmomo = new Enemy('Evil Momo', 13, 3, 100, 60, -1, 'hard')
    } else if (e.currentTarget.id === 'lunatic') {
      evilmomo = new Enemy('Evil Momo', 13, 3, 100, 30, -2, 'lunatic')
    }
    $('#staticinstruction').css('display', 'block')

    evilmomo.addListenerToInput()
    evilmomo.start()
  })
})
