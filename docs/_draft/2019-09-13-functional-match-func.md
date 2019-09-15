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

지난 번에 갔던 JSConf의 발표 내용중 **Back to the future of JS II: Beyond what we can foresee** 에서 `pattern matching` 이라는 문법을 소개해줬다. 기존 자바스크립트의 조건문들의 불편함을 보완하고, 좀 더 가독성있는 코드로 바꾸려는 의도가 보였다. 내가 사용하는 라이브러리인 **fxjs** 에서는 `match` 라는 조건문을 사용한다. `match` 함수는 놀랍도록 편리한 기능과 여러가지 기능을 제공하는 조건문으로 `pattern matching` 과도 비슷한 점이 있다. 이번 포스팅에서는 `match` 함수를 구현해 보면서 내부 기능을 알아보도록 하겠다.

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

기본적으로 `match` 함수는 인자를 받아, `case` 에서 넘겨받은 함수가 참이 되는 경우를 찾아서, `case` 두번째로 넘겨받은 함수를 실행시킨다. 