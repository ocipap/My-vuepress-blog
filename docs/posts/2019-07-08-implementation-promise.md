---
type: PostLayout
title: Implementation Promise
subtitle: 프로미스를 만들어 보자
category: vanilla javascript
thumbnail: /default/thumbnail.png
meta:
  - name: description
	  content: implementation-promise
date: 2019-07-08
---

코드스쿼드 과제중에 MyPromise 를 구현하는 과제가 있었다. 구현에 앞서 내가 여태까지 알았던 Promise 가 그렇게 단순하지 않음을 알았다. 그것을 정리해 보려고 한다.

## 여태까지 내가 생각했던 프로미스

단순히 어떤 함수의 수행을 성공과 실패 로직으로 나누어 생각(?)할 수 있게 해주고, 비동기로직을 동기적으로 처리하려고 할 때 사용하는 객체. `then` 은 성공로직, `catch` 는 실패로직을 핸들링할 수 있다. 유용한 메서드 중 `Promise.all`, `Promise.race` 가 있다.


## 공부하면서 알게된 프로미스

프로미스는 3가지의 **상태**를 가지고 있다.  
- pending(대기) : 프로미스 생성자 함수로 객체를 생성했을때의 대기 상태  
- fulfilled(이행) : 콜백 함수에서 `resolve` 를 실행한 상태   
- rejected(실패) : 콜백 함수에서 `reject` 를 실행한 상태  

```javascript
const pm = new Promise((resolve, reject) => {
	if(true) {
		resolve() // fulfilled
	} else {
		reject() // rejected
	}
})
```

`then`, `catch` 함수는 체이닝을 시킬 수 있다. 그 이유는 `then`, `catch` 의 리턴값이 `promise` 객체이기 때문이다. `then`의 콜백함수의 첫번째 인자는 만약 첫번째 `then` 이라면 `resolve` 를 실행할 때 넣은 값이고, 두번째 부터는 앞에서 실행된 `then` 의 콜백 함수의 리턴값이다. 

```javascript
somePromise().then(...)
	.then(...)
	.then(...)
	.catch(...)
```

`then` 으로 체이닝한 프로미스는 동기적으로 실행된다. 앞에 있는 `then` 의 콜백 함수가 처라되고 난후 그 다음 `then`의 콜백 함수가 실행된다.   

`then` 의 콜백함수에서 `Promise` 객체를 리턴할 수 있다. 그렇다면 그 다음 `then` 의 콜백함수의 인자로 `Promise` 객체가 리턴되어야 하지만 내부적으로 리턴한 값이 프로미스인지 판단하여 `resolve` 한 값을 넘겨준다.

```javascript
somePromise().then(() => {
		return new Promise((resolve, reject) =>{resolve(10)})
	})
	.then(val => console.log(val)) // 10
```

위 조건들을 바탕으로 테스트 코드를 작성해보았다.

```javascript
const MyPromise = require('./MyPromise')
const should = require('should')

describe('MyPromise 생성자 TEST', () => {
  it("# 프로미스 생성자 함수의 인자는 반드시 함수여야 한다.", () => {
    should(() => { new MyPromise() }).throw("Promise resolver must be a function")
  })

  it("# 프로미스 객체를 생성했을 경우 state는 pending 상태여야 한다.", () => {
    const pm = new MyPromise(() => {})
    pm.state.should.be.equal("pending")
  })

  it("# 프로미스 객체 내에서 resolve를 실행시키면 state는 resolved가 된다.", () => {
    const pm = new MyPromise((resolve, reject) => { resolve(true) })
    pm.state.should.be.equal("resolved")
  })

  it("# 프로미스 객체 내에서 reject를 실행시키면 state는 rejected가 된다.", () => {
    const pm = new MyPromise((resolve, reject) => { reject(true) })
    pm.state.should.be.equal("rejected")
  })
})

describe("MyPromise then API TEST", () => {
  it("# promise에서 resolve한 값이 then함수의 callback 함수의 인자로 넘어와야 한다.", () => {
    const pm = new MyPromise((resolve, reject) => { resolve(5) })
    return pm.then((val) => {
      val.should.be.equal(5)
    })
  })

  it("# then의 리턴값은 promise 이여야 한다.", () => {
    const pm = new MyPromise((resolve, reject) => { resolve(5) })
    const res = pm.then(val => val+1)
    
    res.should.be.instanceof(MyPromise)
  })

  it("# then 으로 체이닝된 함수는 동기적으로 실행되어야 한다.", () => {
    let flag = 1
    const pm = new MyPromise((resolve, reject) => {
      setTimeout(() => { resolve(5) }, 200)
    })
    return pm.then((val) => {
      flag += val
      flag.should.be.equal(6)
      return val
    }).then((val) => {
      flag += val
      flag.should.be.equal(11)
      return flag
    })
  })

  it("# then의 콜백 함수에서 리턴한 값이 프로미스라면 다음 then의 콜백에는 resolve 값이 들어가야 한다.", () => {
    const pm = new MyPromise((resolve, reject) => { resolve(5) })
    const res = pm.then(val => new MyPromise((resolve, reject) => {
      resolve(val + 1)
    }))

    return res.then(val => {
      val.should.be.equal(6)
    })
  })
})

describe("MyPromise catch API TEST", () => {
  it("# promise에서 reject한 값이 catch 함수의 callback 함수의 인자로 넘어와야 한다.", () => {
    const pm = new MyPromise((resolve, reject) => { reject("error") })
    return pm.catch((err) => {
      err.should.be.equal("error")
    })
  })

  it("# catch의 리턴값은 promise 이여야 한다.", () => {
    const pm = new MyPromise((resolve, reject) => { reject("error") })
    const res = pm.catch(e => console.log(e))
    
    res.should.be.instanceof(MyPromise)
  })
})
```

## 개발 시작

### 프로미스 생성자 함수의 인자는 반드시 함수여야 한다.

`MyPromise`에 `constructor` 인자로 받은 값의 타입이 함수인지 검사하는 로직 추가

```javascript
constructor (executer) {
	if(typeof executer != "function") {
		throw new Error("Promise resolver must be a function")
	}
}
```

### 프로미스 객체를 생성했을 경우 state는 pending 상태여야 한다.

초기 `state`를 `pending` 으로 설정

```javascript
constructor (executer) {
	// ... 생략
	this.state = "pending"
}
```

### 프로미스 객체 내에서 resolve를 실행시키면 state는 resolved가 된다.  

`changeState` 메서드를 만들어 `resolve`를 실행할때 메서드를 실행

```javascript
constructor (executer) {
	// ...생략
	executer(MyPromise.resolve.bind(this), MyPromise.reject.bind(this))
}

changeState(state) {
	this.state = state
}

static resolve() {
	this.changeState("resolved")
}
```

### 프로미스 객체 내에서 reject를 실행시키면 state는 rejected가 된다.

위 `resolve` 함수와 동일

```javascript
static reject(val) {
	this.changeState("rejected")
}
```

### promise에서 resolve한 값이 then함수의 callback 함수의 인자로 넘어와야 한다.  

- `resolve`에서 인자로 `value`를 받아 `this.value`로 설정  
- `then` 메서드에서 인자로 받은 콜백 함수에 `this.value` 를 넘겨주는 로직  
- `changeState` 함수를 `change` 로 변경하여 `state` 와 `value`를 모두 변경할 수 있도록 설계  

```javascript
change(state, value) {
	this.state = state
	this.value = value
}

then(func) {
	const res = func(this.value)
}

static resolve(val) {
	this.change("resolved", val)
}
```

### then의 리턴값은 promise 이여야 한다.

`then` 메서드에서 새로운 프로미스를 리턴할 수 있도록 설계

```javascript
then(func) {
	return new MyPromise((resolve) => resolve(func(this.value)))
}
```

### then 으로 체이닝된 함수는 동기적으로 실행되어야 한다.  

프로미스는 비동기 함수 패턴을 동기적으로 실행되는 것처럼 작성할 수 있다. `promise` 객체를 생성할 때 비동기 로직이 있다면 그 다음에 오는 `then` 은 해당 비동기 함수가 끝난 후에 `value` 를 받을 수 있다.

```javascript
const pm = new MyPromise((resolve, reject) => {
	setTimeout(() => resolve(5), 200)
})
pm.then(val => {
	console.log(val) // 해당 val은 위의 setTimeout의 콜백이 종료될때 받을 수 있다.
})
```

따라서 `then` 함수에서 상태가 아직 `pending` 이라면 해당 콜백 함수를 `this.laterCalls`에 저장하고 새로운 프로미스를 리턴한다. 그리고 `resolve` 가 실행될 때 해당 `this.laterCalls`에서 넣어두었던 함수를 꺼내어 실행한다.


```javascript
constructor(excuter) {
	//...생략
	this.laterCalls = []
}

then(func) {
	if(this.state == "pending") {
		return new MyPromise((resolve) => {
			this.laterCalls.push(() => resolve(func(this.value)))
		})
	}
	return new MyPromise((resolve) => resolve(func(this.value)))
}

static resolve(val) {
	this.change("resolved", val)
  this.laterCalls.forEach(laterCall => laterCall(this.value));
}
```

좀 더 자세히 설명하면 then 에서 해당 프로미스가 아직 pending 상태이면 해당 프로미스의 `this.laterCalls`에 `() => resolve(func(this.value))` 를 넣고 새로운 프로미스를 리턴한다. 화살표 함수를 사용한 이유는 해당 함수안의 `this.value`를 **현재 프로미스**를 가르키기위해서 이다.  

이때 유심히 봐야하는 것은 `resolve` 부분인데 이 `resolve`는 새롭게 만들어진 프로미스의 `resolve` 라는 것이다. 따라서 비동기 로직이 종료가 되고 `this.value`에 값을 넣은 다음에 `this.laterCalls` 를  돌면서 저장해두었던 `then` 의 콜백함수를 실행시킨다. 그러면 `this.value` 에 값이 들어가게 되고, `then` 으로 반환한 두번째 프로미스의 `resolve` 가 실행되고, 두번째에서도 위와 같은 로직으로 세번째, 네번째... `resolve` 를 실행시킨다.


### then의 콜백 함수에서 리턴한 값이 프로미스라면 다음 then의 콜백에는 resolve 값이 들어가야 한다.

이 말은 즉 `then`에서 `resolve` 한 값이 `promise`를 리턴한다는 의미이므로 `resolve` 함수에서 받은 값이 `promise` 인지 아닌지 판단해 `promise` 라면 `then` 으로 한번 풀어서 값을 셋팅해야한다.

```javascript
static resolve(val) {
	if (val instanceof MyPromise) {
		val.then((v) => {
			this.change("resolved", v)
			this.laterCalls.forEach(laterCall => laterCall(this.value));
		})
	} else {
		this.change("resolved", val)
		this.laterCalls.forEach(laterCall => laterCall(this.value));
  }
}
```

### promise에서 reject한 값이 catch 함수의 callback 함수의 인자로 넘어와야 한다.  

위 `then` 과 비슷한 과정이다.

```javascript
catch(func) {
	const res = func(this.value)
}
```

### catch의 리턴값은 promise 이여야 한다.  

```javascript
catch(func) {
	return new MyPromise((_, reject) => reject(func(this.value)))
}
```

## 전체 코드  

```javascript
module.exports = class MyPromise {
  constructor (executer) {
    if(typeof executer != "function") {
      throw new Error("Promise resolver must be a function")
    }

    this.state = "pending"
    this.value = undefined
    this.laterCalls = []

    try {
      executer(MyPromise.resolve.bind(this), MyPromise.reject.bind(this))
    } catch(e) {
      MyPromise.reject(e)
    }
  }

  change(state, value) {
    this.state = state
    this.value = value
  }

  then(func) {
    if(this.state == "pending") {
      return new MyPromise((resolve) => {
        this.laterCalls.push(() => resolve(func(this.value)))
      })
    }
    return new MyPromise((resolve) => resolve(func(this.value)))
  }

  catch(func) {
    if(this.state == "pending") {
      return new MyPromise((_, reject) => {
        this.laterCalls.push(() => reject(func(this.value)))
      })
    }
    return new MyPromise((_, reject) => reject(func(this.value)))
  }

  static resolve(val) {
    if (val instanceof MyPromise) {
      val.then((v) => {
        this.change("resolved", v)
        this.laterCalls.forEach(laterCall => laterCall(this.value));
      })
    } else {
      this.change("resolved", val)
      this.laterCalls.forEach(laterCall => laterCall(this.value));
    }
  }

  static reject(val) {
    this.change("rejected", val)
  }
}
```

## Testing

```shell
▶ npm test

> promise@1.0.0 test /Users/ocipap/workspace/2019/javascript-amazon/promise
> mocha index.spec.js
  MyPromise 생성자 TEST
    ✓ # 프로미스 생성자 함수의 인자는 반드시 함수여야 한다.
    ✓ # 프로미스 객체를 생성했을 경우 state는 pending 상태여야 한다.
    ✓ # 프로미스 객체 내에서 resolve를 실행시키면 state는 resolved가 된다.
    ✓ # 프로미스 객체 내에서 reject를 실행시키면 state는 rejected가 된다.

  MyPromise then API TEST
    ✓ # promise에서 resolve한 값이 then함수의 callback 함수의 인자로 넘어와야 한다.
    ✓ # then의 리턴값은 promise 이여야 한다.
    ✓ # then 으로 체이닝된 함수는 동기적으로 실행되어야 한다. (202ms)
    ✓ # then의 콜백 함수에서 리턴한 값이 프로미스라면 다음 then의 콜백에는 resolve 값이 들어가야 한다.

  MyPromise catch API TEST
    ✓ # promise에서 reject한 값이 catch 함수의 callback 함수의 인자로 넘어와야 한다.
error
    ✓ # catch의 리턴값은 promise 이여야 한다.


  10 passing (211ms)
```

### 느낀점  

프로미스를 단순히 콜백 지옥을 해결하기위해 사용하는 비동기처리로직으로만 생각했던 과거의 내가 부끄러워졌다. 이번 과제를 하면서 `Promise`를 한마디로 정리하면 **미래에 값을 주기로 약속한 빈 그릇**이다.  
*ps. 이번 과제를 수행할 수 있게 도와준 셀데브 감사합니다.*