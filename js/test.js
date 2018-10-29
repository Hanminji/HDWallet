window.onload = function() {
  var mnemonics = { english: new Mnemonic("english") }
  var mnemonic = mnemonics["english"]

  document.getElementById("generateBtn").addEventListener("click", event => {
    // 1. First get the language that user select
    var language = $("select[name=language]").val()
    if (!(language in mnemonics)) {
      mnemonics[language] = new Mnemonic(language)
    }
    mnemonic = mnemonics[language]
    var numWords = 12
    var strength = (numWords / 3) * 32
    var buffer = new Uint8Array(strength / 8)
    console.log("numWords: " + numWords)
    console.log("strength: " + strength)
    console.log("buffer: " + buffer + "\n")

    // create secure entropy
    var data = crypto.getRandomValues(buffer)
    console.log("data: " + data)

    var words = mnemonic.toMnemonic(data)
    console.log(words)
    $("#wordResult").text(words)
  })
}
