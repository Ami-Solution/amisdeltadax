// https://github.com/etherdelta/etherdelta.github.io/blob/master/docs/API.md

import config from './EtherDeltaConfig.json'
import io from 'socket.io-client'
import BigNumber from 'bignumber.js'

import ABIEtherDelta from './EtherDeltaABI.json'
import ABIToken from './TokenABI.json'
import sha256 from'js-sha256'

import ethjs from 'ethjs'

// const ethUtil = require('ethereumjs-util');
// const Tx = require('ethereumjs-tx');

class EtherDelta {
  constructor() {
    // this.w3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/Ky03pelFIxoZdAUsr82w"))

    if(typeof web3 !== 'undefined') {
      this.w3 = new Web3(web3.currentProvider)
      this.contractAddr = "0x8d12a197cb00d4747a1fe03395095ce2a5cc6819"
      this.contract = this.w3.eth.contract(ABIEtherDelta).at(this.contractAddr)
      this.contractToken = this.w3.eth.contract(ABIToken)
    } else {
      this.w3 = {
        eth: {

        }
      }
    }

    this.connectionAttempts = 0
    this.ed_abi = ABIEtherDelta
    this.token_abi = ABIToken
    this.dateFormatter = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
    })
  }

  initSocket(){
    return new Promise((resolve, reject) => {
      this.socket = io.connect(config.socketServers[this.connectionAttempts], { transports: ['websocket'] })
      this.socket.on('connect', () => {
        resolve(this.socket)
      })

      this.socket.on('connect_failed', () => {
        console.log('Connection Failed!!!!!!')
        this.connectionAttempts++
        this.socket = io.connect(config.socketServers[this.connectionAttempts], { transports: ['websocket'] })
      })

      this.socket.on('error', error => {
        console.log("EtherDelta socket error: ", error)
      })
      this.socket.on('disconnect', disconnect => {
        console.log("EtherDelta socket disconnect: ", disconnect)
        this.socket = io.connect(config.socketServer, { transports: ['websocket'] })
        // this.socket.open();
      })

    });
  }

  getEtherDeltaBalance(tokenAddress, userAddress){
    return new Promise((resolve, reject) => {
      this.contract.balanceOf(tokenAddress, userAddress, (err, result) => {
        if (err) reject(err);
        resolve(this.w3.fromWei(result.toNumber(), 'ether'))
      });
    });
  }

  getBalance(tokenAddress, userAddress){
    return new Promise((resolve, reject) => {
      if (tokenAddress === '0x0000000000000000000000000000000000000000') {
        this.w3.eth.getBalance(userAddress, (err, result) => {
          if (err) reject(err);
          resolve(this.w3.fromWei(result.toNumber(), 'ether'))
        });
      } else {
        this.contractToken.at(tokenAddress).balanceOf(userAddress, (err, result) => {
          if (err) reject(err);
          resolve(this.w3.fromWei(result.toNumber(), 'ether'))
        })
      }
    })
  }

  depositEth(amount){
    amount = this.w3.toWei(amount, 'ether')
    let data = {
      value: amount
    }
    return new Promise((resolve, reject) => {
      this.contract.deposit(data, function(error, result){
        if(!error){
          resolve(result)
        } else {
          reject(error)
        }
      })
    })
  }

  withdrawEth(amount){
    amount = this.w3.toWei(amount, 'ether')
    return new Promise((resolve, reject) => {
      this.contract.withdraw(amount, function(error, result){
        if(!error){
          resolve(result)
        } else {
          reject(error)
        }
      })
    })
  }

  approve(token, amount){
    amount = this.w3.toWei(amount, 'ether')
    return new Promise((resolve, reject) => {
      this.contractToken.at(token).approve(this.contractAddr, amount, function(error, result){
        if(!error){
          resolve(result)
        } else {
          reject(error)
        }
      })
    })
  }

  depositToken(token, amount){
    amount = this.w3.toWei(amount, 'ether')
    return new Promise((resolve, reject) => {
      this.contract.depositToken(token, amount, function(error, result){
        if(!error){
          resolve(result)
        } else {
          reject(error)
        }
      })
    })
  }

  withdrawToken(token, amount){
    amount = this.w3.toWei(amount, 'ether')
    return new Promise((resolve, reject) => {
      this.contract.withdrawToken(token, amount, function(error, result){
        if(!error){
          resolve(result)
        } else {
          reject(error)
        }
      })
    })
  }

  trade(tokenGet, amountGet, tokenGive, amountGive, expires, nonce, user, v, r, s, amount){
    amount = this.w3.toWei(amount, 'ether')
    return new Promise((resolve, reject) => {
      this.contract.trade(tokenGet, amountGet, tokenGive, amountGive, expires, nonce, user, v, r, s, amount, function(error, result){
        if(!error){
          resolve(result)
        } else {
          reject(error)
        }
      })
    })
  }

  toWei(amount, decimals){
    return new BigNumber(String(amount)).times(new BigNumber(10 ** decimals)).floor()
  }

  placeOrder(tokenGet, amountGet, tokenGive, amountGive, expires, nonce){
    // This places an Order off-chain
    // log("tokenGet: ", tokenGet)
    // log("amountGet: ", amountGet)
    // log("tokenGive: ", tokenGive)
    // log("amountGive: ", amountGive)
    // log("expires: ", expires)
    // log("nonce: ", nonce)

    return new Promise((resolve, reject) => {
      web3.eth.getBlockNumber((error, result)=> {
        expires = parseInt(result) + parseInt(expires)

        let data_to_pack = [
          this.contractAddr,
          tokenGet,
          amountGet,
          tokenGive,
          amountGive,
          expires,
          nonce
        ]
        let packed_data = this._pack(data_to_pack, [160, 160, 256, 160, 256, 256, 256])
        let hash = `0x${sha256(new Buffer(packed_data, 'hex'))}`
        let msg = this._prefixMessage(hash);

        this.w3.eth.sign(this.w3.eth.defaultAccount, msg, (error, result)=>{
          if(error){
            reject(error)
          } else {
            let sig = result.substr(2, result.length)
            let r = "0x" + sig.substr(0, 64)
            let s = "0x" + sig.substr(64, 64)
            let v = parseInt("0x" + sig.substr(128, 2))

            let data = {
              tokenGet,
              amountGet: amountGet.toString(),
              tokenGive,
              amountGive: amountGive.toString(),
              expires,
              nonce,
              contractAddr: this.contractAddr,
              user: this.w3.eth.defaultAccount,
              r,
              s,
              v,
            }

            this.submitOrder(data).then(results => {
              // log("success: ", results)
              resolve(results)
            }, error => {
              // log("error: ", error)
              reject(error)
            })
          }
        })
      })
    })
  }

  submitOrder(data){
    return new Promise((resolve, reject) =>{
      this.socket.emit('message', data)
      this.socket.once('messageResult', (result) => {
        if(Array.isArray(result)){
          if(result[0] == "Added/updated order."){
            resolve(result)
          }
        } else {
          reject(result)
        }
      })
    })
  }

  cancelOrder(tokenGet, amountGet, tokenGive, amountGive, expires, nonce, v, r, s){
    return new Promise((resolve, reject) =>{
      this.contract.cancelOrder(tokenGet,  amountGet, tokenGive, amountGive, expires, nonce, v, r, s, function(error, result){
        if(!error){
          resolve(result)
        } else {
          reject(error)
        }
      })
    })
  }

  donateEth(amount){
    return new Promise((resolve, reject) =>{
      this.w3.eth.sendTransaction({
        from: this.w3.eth.coinbase,
        to:   "0xe26fd1375535967504475bd07df0293ee5d41695",
        value: this.w3.toWei(amount, "ether")
      }, function(error, result){
        if(!error){
          // log("RESULT: ", result)
          resolve(result)
        } else {
          // log("ERROR: ", error)
          reject(error)
        }
      })
    })
  }

  _pack(dataIn, lengths){
      let packed = '';
      const data = dataIn.map(x => x);
      for (let i = 0; i < lengths.length; i += 1) {
        if (typeof (data[i]) === 'string' && data[i].substring(0, 2) === '0x') {
          if (data[i].substring(0, 2) === '0x') data[i] = data[i].substring(2);
          packed += this._zeroPad(data[i], lengths[i] / 4);
        } else if (typeof (data[i]) !== 'number' && !(data[i] instanceof BigNumber) && /[a-f]/.test(data[i])) {
          if (data[i].substring(0, 2) === '0x') data[i] = data[i].substring(2);
          packed += this._zeroPad(data[i], lengths[i] / 4);
        } else {
          packed += this._zeroPad(this._decToHex(data[i], lengths[i]), lengths[i] / 4);
        }
      }
    return packed;
  }
  _parseToDigitsArray(str, base){
    const digits = str.split('');
    const ary = [];
    for (let i = digits.length - 1; i >= 0; i -= 1) {
      const n = parseInt(digits[i], base);
      if (isNaN(n)) return null;
      ary.push(n);
    }
    return ary;
  }
  _add(x, y, base){
    const z = [];
    const n = Math.max(x.length, y.length);
    let carry = 0;
    let i = 0;
    while (i < n || carry) {
      const xi = i < x.length ? x[i] : 0;
      const yi = i < y.length ? y[i] : 0;
      const zi = carry + xi + yi;
      z.push(zi % base);
      carry = Math.floor(zi / base);
      i += 1;
    }
    return z;
  }
  _multiplyByNumber(numIn, x, base){
    let num = numIn;
    if (num < 0) return null;
    if (num === 0) return [];
    let result = [];
    let power = x;
    while (true) { // eslint-disable-line no-constant-condition
      if (num & 1) { // eslint-disable-line no-bitwise
        result = this._add(result, power, base);
      }
      num = num >> 1; // eslint-disable-line operator-assignment, no-bitwise
      if (num === 0) break;
      power = this._add(power, power, base);
    }
    return result;
  }
  _convertBase(str, fromBase, toBase){
    const digits = this._parseToDigitsArray(str, fromBase);
    if (digits === null) return null;
    let outArray = [];
    let power = [1];
    for (let i = 0; i < digits.length; i += 1) {
      if (digits[i]) {
        outArray = this._add(outArray, this._multiplyByNumber(digits[i], power, toBase), toBase);
      }
      power = this._multiplyByNumber(fromBase, power, toBase);
    }
    let out = '';
    for (let i = outArray.length - 1; i >= 0; i -= 1) {
      out += outArray[i].toString(toBase);
    }
    if (out === '') out = 0;
    return out;
  }
  _zeroPad(num, places){
    const zero = (places - num.toString().length) + 1;
    return Array(+(zero > 0 && zero)).join('0') + num;
  }
  _decToHex(dec, lengthIn){
    let length = lengthIn;
    if (!length) length = 32;
    if (dec < 0) {
      // return convertBase((Math.pow(2, length) + decStr).toString(), 10, 16);
      return (new BigNumber(2)).pow(length).add(new BigNumber(dec)).toString(16);
    }
    let result = null;
    try {
      result = this._convertBase(dec.toString(), 10, 16);
    } catch (err) {
      result = null;
    }
    if (result) {
      return result;
    }
    return (new BigNumber(dec)).toString(16);
  }
  _prefixMessage(msgIn){
    let msg = msgIn;
    msg = new Buffer(msg.slice(2), 'hex');
    msg = Buffer.concat([
      new Buffer(`\x19Ethereum Signed Message:\n${msg.length.toString()}`),
      msg]);
    msg = this.w3.sha3(`0x${msg.toString('hex')}`, { encoding: 'hex' });
    msg = new Buffer(msg.slice(2), 'hex');
    return `0x${msg.toString('hex')}`;
  }

  parseOrders(orders, currentToken){
    return orders.filter(order => {
      if(order.tokenGet === currentToken.addr || order.tokenGive === currentToken.addr){
        return true
      } else {
        return false
      }
    }).map(order => {
      order.amount = Math.abs(parseFloat(order.amount) / Math.pow(10, currentToken.decimals))
      if(order.amountFilled == null){
        order.amountFilled = 0
      }
      order.volume = order.amount
      order.amountFilled = Math.abs(parseFloat(order.amountFilled) / Math.pow(10, currentToken.decimals))
      order.price = Math.abs(parseFloat(order.price))
      order.formatted_date = this.dateFormatter.format(new Date(order.updated))
      return order
    })
  }
  parseTrades(trades, currentToken){
    return trades.filter(trade => {
      if(trade.tokenAddr === currentToken.addr){
        return true
      } else {
        return false
      }
    }).map(trade => {
      trade.amount = Math.abs(parseFloat(trade.amount))
      trade.price = Math.abs(parseFloat(trade.price))
      trade.date = new Date(trade.date)
      trade.formatted_date = this.dateFormatter.format(new Date(trade.date))
      return trade
    })
  }
}

export default new EtherDelta()
