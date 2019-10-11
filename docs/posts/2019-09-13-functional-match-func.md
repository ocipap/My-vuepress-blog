---
type: PostLayout
title: 함수형 자바스크립트 - match 함수
subtitle: 미래형 조건문 match
category: vanilla javascript
thumbnail: /default/thumbnail.png
meta:
 - name: description
	content: functional-match-func
date: 2019-09-13
---

지난 번에 갔던 JSConf의 발표 내용중 **Back to the future of JS II: Beyond what we can foresee** 에서 `pattern matching` 이라는 문법을 소개해줬다. 기존 자바스크립트의 조건문들의 불편함을 보완하고, 좀 더 가독성있는 코드로 바꾸려는 의도가 보였다. 내가 사용하는 라이브러리인 **FxJS** 에서는 `match` 라는 조건문을 사용한다. `match` 함수는 놀랍도록 편리한 기능과 여러가지 기능을 제공하는 조건문으로 `pattern matching` 과도 비슷한 점이 있다. 이번 포스팅에서는 `match` 함수를 구현해 보면서 내부 기능을 알아보도록 하겠다.

https://github.com/tc39/proposal-pattern-matching  

## match 함수  

일단 `match` 함수를 사용 예시를 살펴보자.

```javascript
match(1)
  .case(val => val === 1)(_ => console.log(1))
  .case(val => val === 2)(_ => console.log(2))
  .case(val => val === 3)(_ => console.log(3))
  .else(_ => console.log(':P'))

// 1
```  

기본적으로 `match` 함수는 인자를 받아, `case` 에서 넘겨받은 함수가 참이 되는 경우를 찾아서, `case` 두번째로 넘겨받은 함수를 실행시킨다. 그리고 `else` 는 위의 `case` 의 조건중 참이 되는 조건이 없는 경우 실행된다.

이 기능외에 여러 부가적인 기능도 제공하는데 아래에서 정리하겠다.

### match 함수의 기능

**기본 기능**

- match 함수에서 값을 넘겨 받는다.
- case 함수의 인자로 넘어온 함수의 참이 되는 값을 찾는다.
- case 함수가 참이 되는 경우, 두번째로 넘겨받은 함수를 실행시킨다. 이때 match 에서 넘겨 받은 인자를 넘겨준다.
- case 함수에 참이 되는 경우가 없는 경우, else 에서 넘겨받은 함수를 실행시킨다. 이때 match 에서 넘겨 받은 인자를 넘겨준다.

**부가 기능**

- case 함수에서 넘겨받은 인자의 타입에 따라 동작 방식이 달라진다. 해당 동작을 isMatch 함수로 정의 (case의 인자: a, match의 인자: b) 
    - function : !!a(b)
    - array : a 의 원소가 b 배열 안에 모두 포함되어 있으면 참
    - object : a 의 원소가 b 객체에 모두 있고, 동일한 key의 value 가 동일하면 참  
    - regexp : b.match(a)
    - Primitive : a == b
- case와 else 의 모든 인자들의 pipeline 지원 (함수 체이닝 가능)
- match의 인자를 else 문 후에 넘겨줄 수 있음

## match 함수 구현

`match` 함수의 기본 기능과 부가 기능에 대해 알아보았으니 `match` 함수를 직접 구현해 보자.

### match 함수에서 값을 넘겨 받는다.  
`match` 함수가 실행되고 리턴하는 객체에는 case 함수를 체이닝할 수 있어야 한다.
```javascript
function match(target) {
  var cbs = [];
  const _case = () => {};
 
  _case.case = _case;
  return _case;
 }

match(1)
```

### case 함수의 인자로 넘어온 함수의 참이 되는 값을 찾는다.  
참이 되는 값을 찾는 로직은 `else` 가 체이닝되었을 때 실행되어야 하므로 `cbs` 배열에 `case` 함수의 체이닝된 값들을 쌓아두도록 한다.  
그리고 case 함수의 리턴 값은 함수이므로 임의의 함수를 리턴한다.  

```javascript
function match(target) {
  var cbs = [];
  function _case(f){
    cbs.push({_case: f});
    return function() {}
  }

  _case.case = _case;
  return _case;
}

match(1).case(v => v === 1)
```

### case 함수가 참이 되는 경우, 두번째로 넘겨받은 함수를 실행시킨다.   
두번째로 넘겨받은 함수를 실행시켜야 하므로 이 함수도 앞서 저장했던 함수와 짝을 맞추어 `cbs` 에 저장한다.  
그리고 해당 함수가 리턴해야 하는 것은 다시 `case` 를 체이닝할 수 있는 객체이므로 해당 객체를 리턴해준다.  

```javascript
function match(target) {
  var cbs = [];
  function _case(f){
    cbs.push({_case: f});
    return function (f2) {
      cbs[cbs.length-1]._body = f2;
      return _case;
    }
  }
  _case.case = _case;
  return _case;
}

match(1).case(v => v === 1)(val => console.log(val))
```

`_case` 에서 리턴하는 함수를 따로 빼는 것이 좋다고 판단해서 `_body` 라는 이름의 함수로 뻬준다.

```javascript
function match(target) {
  var cbs = [];

  function _case(f) {
    cbs.push({ _case: f });
    return _body;
  }

  function _body(f) {
    cbs[cbs.length - 1]._body = f;
    return _case;
  }

  _case.case = _case;
  return _case;
}

match(1).case(v => v === 1)(val => console.log(val))
```

### case 함수에 참이 되는 경우가 없는 경우, else 에서 넘겨받은 함수를 실행시킨다.  
`match` 함수의 필수요소인 `else` 함수는 지금까지 체이닝되었던 `case` 함수의 인자들을 실행시키는 역할을 한다.  
우선 `else` 로 넘어온 함수를 `cbs` 에 저장하고 실행시키는 부분까지 구현해보자.

```javascript
function match(target) {
  var cbs = [];

  function run() {
    return _.go(
      cbs,
      _.find(cb => cb._case(target)),
      cb => cb._body(target)
    )
  }

  function _case(f) {
    cbs.push({ _case: f });
    return _body;
  }

  function _body(f) {
    cbs[cbs.length - 1]._body = f;
    return _case;
  }

  _case.case = _case;
  _case.else = function (f) {
    _case(_ => true)(f);
    return run();
  };
  return _case;
}

match(1)
  .case(v => v === 1)(v => log(v))
  .case(v => v === 2)(v => log(v))
  .case(v => v === 3)(v => log(v))
  .else(v => log(v))

// 1
```

개발중에 사용한 `pipe` 나, `find` 함수는 **FxJS** 에서 제공하는 함수인데 이해하기 위해서는 커링과 함수 파이프라이닝에 관한 선수지식이 필요하다. 따라서 이번 포스팅에서는 단순히 함수를 연결하는 함수, 배열 내부 원소 중 넘겨받은 함수가 참이 되는 첫번째 원소를 반환하는 함수 정도로만 생각하면 좋다.  
 
기본적인 `match` 함수의 기능은 구현을 하였다. 이제 부가적인 기능을 개발하여 `match` 함수를 좀 더 다듬어보자.

### isMatch 함수 구현  

인자 2개를 받아 해당 인자들의 일치를 타입별로 비교하는 함수인 `isMatch` 함수를 정의해보자. (FxJS 참고)

```javascript
function isMatch(a) {
  return function (b) {
    return typeof a == 'function' ? !!a(b)
      :
    Array.isArray(a) && Array.isArray(b) ? _.every(v => b.includes(v), a)
      :
    typeof b == 'object' ? _.every(([k, v]) => b[k] == v, Object.entries(a))
      :
    a instanceof RegExp ? b.match(a)
      :
    a == b
  }
}
```

해당 함수에 커링을 적용하면 좀 더 간단하게 구현 할 수 있지만 지금 상황에서는 제외시켰다. 그리고 **FxJS**에서 제공하는 `every`를 사용한 이유는 빈 배열에 `every` 를 하는 경우에 무조건 참을 리턴하기 때문이다.  
이제 해당 함수를 `match` 함수 로직에 적용시키자. 

```javascript
function match(target) {
  var cbs = [];

  function run() {
    return _.go(
      cbs,
      _.find(cb => cb._case(target)),
      cb => cb._body(target)
    )
  }

  function _case(f) {
    cbs.push({ _case: isMatch(f) });
    return _body;
  }

  function _body(f) {
    cbs[cbs.length - 1]._body = f;
    return _case;
  }

  _case.case = _case;
  _case.else = function (f) {
    _case(_ => true)(f);
    return run();
  };
  return _case;
}

match({'a': 1, 'b': 2, 'c': 3})
  .case(1)(v => log(v))
  .case({'a': 1, 'b': 2})(v => log('obj'))
  .case(3)(v => log('3'))
  .else(v => log('nop'))

// obj
```

### case와 else 의 모든 인자들의 pipeline 지원  

**FxJS**의 `pipe` 함수를 이용해 위 기능을 구현하겠다. 단 주의할 점은 `case`에서 넘겨받은 인자가 함수인 경우 `isMatch` 의 함수 타입 실행부로 넘어가므로 해당 부분에 조건을 추가해야 한다.

```javascript
   
function match(target) {
  var cbs = [];

  function run() {
    return _.go(
      cbs,
      _.find(cb => cb._case(target)),
      cb => cb._body(target)
    )
  }

  function _case(f) {
    cbs.push({ _case: typeof f == 'function' ? _.pipe(...arguments) : isMatch(f) });
    return _body;
  }

  function _body() {
    cbs[cbs.length - 1]._body = _.pipe(...arguments);
    return _case;
  }

  _case.case = _case;
  _case.else = function () {
    _case(_ => true)(...arguments);
    return run();
  };
  return _case;
}

match(0)
  .case(
    val => val + 1,
    val => val + 2,
    val => val + 3,
    val => val == 6
  )(
    v => v + 1,
    v => v * 100,
    log
  )
  .case({'a': 1, 'b': 2})(v => log('obj'))
  .case(3)(v => log('3'))
  .else(v => log('nop'))

// 100
```

### match의 인자를 else 문 후에 넘겨줄 수 있음  

`else` 문에서 `match` 로 인자가 넘어왔는지 체크해서 없다면 인자를 받아서 실행시킬 수 있도록 한다.  
그리고 `match` 함수에 `case` 를 체이닝시켜 `match` 함수를 실행시키지 않아도 `case` 를 체이닝할 수 있도록 한다.  

```javascript
function match(target) {
  var cbs = [];

  function run() {
    return _.go(
      cbs,
      _.find(cb => cb._case(target)),
      cb => cb._body(target)
    )
  }

  function _case(f) {
    cbs.push({ _case: typeof f == 'function' ? _.pipe(...arguments) : isMatch(f) });
    return _body;
  }

  function _body() {
    cbs[cbs.length - 1]._body = _.pipe(...arguments);
    return _case;
  }

  _case.case = _case;
  _case.else = function () {
    _case(_ => true)(...arguments);
    return target ? run() : target2 => ((target = target2) , run());
  };
  return _case;
}

match.case = (...args) => match(undefined).case(...args);

match
  .case(
    val => val + 1,
    val => val + 2,
    val => val + 3,
    val => val == 6
  )(v => v + 1,
    v => v * 100,
    log
  )
  .case({'a': 1, 'b': 2})(v => log('obj'))
  .case(3)(v => log('3'))
  .else(v => log('nop'))(3)
```

## 최종 코드

```javascript
function isMatch(a) {
  return function (b) {
    return typeof a === 'function' ? !!a(b)
      :
    Array.isArray(a) && Array.isArray(b) ? _.every(v => b.includes(v), a)
      :
    typeof b == 'object' ? _.every(([k, v]) => b[k] === v, Object.entries(a))
      :
    a instanceof RegExp ? b.match(a)
      :
    a == b
  }
}
    
function match(target) {
  var cbs = [];

  function run() {
    return _.go(
      cbs,
      _.find(cb => cb._case(target)),
      cb => cb._body(target)
    )
  }

  function _case(f) {
    cbs.push({ _case: typeof f == 'function' ? _.pipe(...arguments) : isMatch(f) });
    return _body;
  }

  function _body() {
    cbs[cbs.length - 1]._body = _.pipe(...arguments);
    return _case;
  }

  _case.case = _case;
  _case.else = function () {
    _case(_ => true)(...arguments);
    return target ? run() : target2 => ((target = target2) , run());
  };
  return _case;
}

match.case = (...args) => match(undefined).case(...args);
```

## 마무리

역시 이해안될때는 분석해서 구현해보는게 최고인 것 같다. 다음 기술 포스팅에서는 프론트엔드 관련 글을 작성할 것 같다.












