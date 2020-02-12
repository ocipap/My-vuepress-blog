---
type: PostLayout
title: 함수형 자바스크립트 - constant 함수
subtitle: 값을 받아 그 값을 리턴하는 함수를 리턴하는 함수
category: vanilla javascript
thumbnail: /default/thumbnail.png
meta:
 - name: description
	content: functional-constant-func
date: 2019-12-07
---

회사에서 코드를 작성할 때 자주 사용하는 함수가 있는데 이`constant` 라는 함수이다. 이 함수의 동작은 값을 받아서 그 값을 리턴하는 함수를 리턴한다. 얼핏보면 정말 간단한 함수지만 이 함수를 사용할 때 조심해야될 점이 있다. 그것을 정리하려고 한다. 



## constant 함수

`constant` 함수의 구현은 정말 간단하다.

```javascript
const constant => a => () => a;
```

 `constant` 함수는 주로 받은 인자와 상관없이 고정된 값을 리턴해야하는 경우 많이 사용한다.



```javascript
const result = match(70)
	.case(a => a >= 90)(constant('A'))
	.case(a => a >= 80)(constant('B'))
	.case(a => a >= 70)(constant('C'))
	.else(constant('D'));

console.log(result);
```

지난번에 만들었던 `match` 함수에 `constant` 를 적용시켜 보았다. 이런 `constant` 함수는 사용할 때 조심해야할 것이 있다.



## 첫번째. constant는 실행될 때 인자로 받은 값을 평가한다.

`constant` 가 평가될 시점에 `constant` 에 넘긴 값은 존재해야 된다는 뜻이다.

이런 상황이 발생할 수도 있다는 것을 보여주기 위해 조금 억지스러운 코드일 수 있다. 하지만 코드를 작성하다 보면 자주 일어나는 일이므로 느낌으로만 받아들이길 바란다.

```javascript
let param_num;

const foo = match
  .case(a => a > 0)(() => `${param_num}은 양수입니다.`)
  .case(a => a < 0)(() => `${param_num}은 음수입니다.`)
  .else(() => '0입니다.');

const test = value => {
  param_num = value;
  return foo(value);
};

log(test(1));
log(test(-1));
log(test(0));
```

인자로 넘겨 받은 값이 양수인지, 음수인지, 0인지 판단하는 코드이다.

해당 코드의 결과는 다음과 같다.

```bash
1은 양수입니다.
-1은 음수입니다.
0입니다.
```



코드를 보니 `case` 함수의 두번째 인자가 인자를 받지 않고 바로 값을 리턴하는 형태여서 `constant` 함수를 적용시켜보았다.

```javascript
let param_num;

const foo = match
  .case(a => a > 0)(constant(`${param_num}은 양수입니다.`))
  .case(a => a < 0)(() => `${param_num}은 음수입니다.`)
  .else(constant('0입니다.'));

const test = value => {
  param_num = value;
  return foo(value);
};

log(test(1));
log(test(-1));
log(test(0));
```

위 코드의 실행 결과는 다음과 같다.

```bash
undefined은 양수입니다.
-1은 음수입니다.
0입니다.
```

`foo` 함수가 평가될 당시 `constant` 의 인자도 평가가 되는데 평가 당시 `param_num` 에 할당된 값이 없기 때문에 `undefined` 를 리턴하게 된다.

**따라서 constant 함수를 사용할 때는 인자로 넘기는 값이 유동적인지 확인해야 한다. **



## 두번째. constant에 주소값을 넘겨 만든 함수는 해당 값을 공유한다.

```javascript
const user = () => ({ is_login: true });

const papico = user();
const ocipap = user();

log({papico});
log({ocipap});

ocipap.is_login = false;

log({papico});
log({ocipap});
```

두 명의 유저가 생성이 되었고, 그 중에 ocipap 이라는 유저가 로그아웃을 했다는 코드를 간소화한 것이다.

해당 코드의 출력은 다음과 같다.

```bash
{ papico: { is_login: true } }
{ ocipap: { is_login: true } }
{ papico: { is_login: true } }
{ ocipap: { is_login: false } }
```

위에 있는 `user` 함수는 단순히 오브젝트를 리턴하는 방식이므로 `constant` 함수를 적용시켜보겠다.



```javascript
const user = constant({ is_login: true });

const papico = user();
const ocipap = user();

log({ papico });
log({ ocipap });

ocipap.is_login = false;

log({ papico });
log({ ocipap });
```



위 코드의 실행 결과는 다음과 같다.

```bash	
{ papico: { is_login: true } }
{ ocipap: { is_login: true } }
{ papico: { is_login: false } }
{ ocipap: { is_login: false } }
```

`constant` 에 넘겨진 주소값은 해당 코드를 사용하는 모든 곳에서 동일한 값을 가르킨다. 따라서 `constant` 를 통해 주소값을 넘겨줄 경우에 해당 코드가 후에 수정될 가능성을 고려해야한다.

## 마무리

`constant` 함수를 사용할 경우에는 항상 인자의 값의 변화 가능성을 염두해두고 코딩을 해야 한다.

