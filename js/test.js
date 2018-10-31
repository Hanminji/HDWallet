window.onload = function() {
  var mnemonics = { english: new Mnemonic("english") }
  var mnemonic = mnemonics["english"]
  var network = bitcoinjs.bitcoin.networks.bitcoin
  var bip32RootKey

  document.getElementById("generateBtn").addEventListener("click", event => {
    $("#resultDiv").show()
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

    //FIXME: 지금 현재는 passphrase가 공백인 상태, 사용자가 passphrase를 입력할 수 도 있게 수정해야함
    calcBip32RootKeyFromSeed(words, "")
    // getBitcoinAddress(words, "")
  })

  var calcBip32RootKeyFromSeed = (phrase, passphrase) => {
    // console.log(phrase + " " + passphrase)
    var seed = mnemonic.toSeed(phrase, passphrase)
    bip32RootKey = bitcoinjs.bitcoin.HDNode.fromSeedHex(seed, network)
    $("#bipRootKey").text(JSON.stringify(bip32RootKey))
    getBitcoinAddress()
  }

  var getBitcoinAddress = () => {
    // purpose: standard BIP num
    // coin: coinType(bitcoin:0)
    var purpose = "44"
    var coin = "0"
    var account = "0"
    var change = "0"

    var path = "m/"
    path += purpose + "'/"
    path += coin + "'/"
    path += account + "'/"
    path += change

    var keyPair = bip32RootKey.keyPair
    var address = keyPair.getAddress().toString()
    var privKey = keyPair.toWIF()
    var pubKey = keyPair.getPublicKeyBuffer().toString("hex")
    $("#btcPath").text(path)
    $("#btcPubKey").text(pubKey)
    $("#btcAddress").text(address)
    $("#btcPrivKey").text(privKey)
  }
}
