const ethers = require("ethers");
const my2612 = require("./deployments/dev/My2612.json");
const my2612Abi = require("./deployments/abi/My2612.json");
const my721 = require("./deployments/dev/My721.json");
const my721Abi = require("./deployments/abi/My721.json");

const mysql = require("mysql")


function parseTransfer2612Event(event) {
  const TransferEvent = new ethers.utils.Interface(["event Transfer(address indexed from,address indexed to,uint256 value)"]);
  let decodedData = TransferEvent.parseLog(event);
  console.log("from:" + decodedData.args.from);
  console.log("to:" + decodedData.args.to);
  console.log("value:" + decodedData.args.value.toString());
  return [decodedData.args.from, decodedData.args.to, decodedData.args.value.toString()]
}

function parseTransfer721Event(event) {
  const TransferEvent = new ethers.utils.Interface(["event Transfer(address indexed from,address indexed to,uint256 indexed tokenId)"]);
  let decodedData = TransferEvent.parseLog(event);
  console.log("from:" + decodedData.args.from);
  console.log("to:" + decodedData.args.to);
  console.log("tokenId:" + decodedData.args.tokenId.toString());
  return [decodedData.args.from, decodedData.args.to, decodedData.args.tokenId.toString()]
}

function main() {
  const conn = mysql.createConnection({
    host: "192.168.78.129",
    user: "root",
    password: "111111",
    database: "test_db"
  })
  conn.connect()
  const addSql2612 = "INSERT INTO transfer20(`from`, `to`, `value`) VALUES(?,?,?)"
  const addSql721 =  "INSERT INTO transfer721(`from`, `to`, `tokenId`) VALUES(?,?,?)"

  let provider = new ethers.providers.WebSocketProvider("ws://127.0.0.1:8545")
  let erc20token = new ethers.Contract(my2612.address, my2612Abi, provider)
  let erc721token = new ethers.Contract(my721.address, my721Abi, provider)

  let filter20 = erc20token.filters.Transfer()
  let filter721 = erc721token.filters.Transfer()

  provider.on(filter20, (event)=>{
    console.log(event)
    const [from, to, value] = parseTransfer2612Event(event)
    conn.query(addSql2612, [from, to, parseInt(value)], (err, result)=>{
      if (err) {
        console.log("insert db error(2612): ", err.message)
        conn.end()
        return 
      }
      console.log(`insert db ok(2612)`);
    })
  })

  provider.on(filter721, (event)=>{
    console.log(event)
    const [from, to, tokenId] = parseTransfer721Event(event)
    conn.query(addSql721, [from, to, parseInt(tokenId)], (err, result)=>{
      if (err) {
        console.log("insert db error(721): ", err.message)
        conn.end()
        return 
      }
      console.log(`insert db ok(721)`);
    })
  })
}

main()