---
type: PostLayout
title: 함수형 자바스크립트 - html 함수
subtitle: Tagged templates 의 똑똑한 사용법
category: vanilla javascript
thumbnail: /default/thumbnail.png
meta:
 - name: description
	content: functional-html-func
date: 2019-09-19
---

이번 포스팅에서는 `Tagged templates` 관련한 유용한 함수를 소개해볼까한다. 자바스크립트를 공부하다보면 `Tagged templates` 연관된 내용이 나오기는 하지만 어떻게 사용해야 할지 감이 오지 않는다. 이번 포스팅에 소개할 `html` 함수를 구현해보면서 조금 유용하게 사용해보자.  

우선 `Tagged templates` 에 대해서 알아보도록 빠르게 알아보도록 하자.  

## Tagged templates

템플릿 리터럴을 함수로 파싱을 할 수 있는 것으로 넘어오는 인자들을 가공해서 원하는 형태로 템플릿 리터럴을 가공할 수 있다.  

```javascript
const test = (...args) => {
  return args;
};
console.log(test`1: ${1} 2: ${'str'} 3: ${undefined} 4: ${null} 5: ${[1, 2, 3, 4]} 6: ${{a:1, b:2}}`);
```  

해당 자바스크립트 코드를 실행시켜면 어떤 결과가 나올까? 기존에 `Tagged templates` 를 알고있고 `Template literals` 의 원리를 안다면 짐작이 될것이다.  

```console
(7) [Array(7), 1, "str", undefined, null, Array(4), {…}]
```  

첫번째 인자로는 배열, 두번째 인자부터는 `${}`에 넣은 요소들이 넘어오는 것을 알 수 있다. 우리가 흔히 사용하는 코드인 `Template literals` 도 이 원리를 이용해서 구현되어 있다.  

## 문제점  
프론트엔드 단에서 `Template literals` 을 사용할 때 조금 거슬리는 것들이 있다. 첫번째는 `undefined`를 그대로 출력한다는 것이고 배열을 출력할 때 `,` 가 붙어서 나온다는 점이다.  
그래서 해당 부분을 `Tagged templates` 를 이용해 개선해 보도록하겠다.

```javascript
const html = (strs, ...vals) => {
  return _.go(
    vals,
    _.map(v => _.isArray(v) ? v.join('') : _.isUndefined(v) ? '' : v),
    (vals, i = 0) => _.reduce((res, str) => `${res}${vals[i++]}${str}`, strs)
  );
};

console.log(html`개선한 템플릿 문자열 : ${undefined}${[1,2,3,4]}`); // 개선한 템플릿 문자열 : 1234
```  

## 실제 활용 예시  

```javascript
html`${_.map(data => 
  html`<li>이름 : ${data.name}${data.email && `이메일 : ${data.email}`}</li>`, datas)}`

// <li>이름 : A이메일 : aaaa@mail.com</li><li>이름 : B이메일 : bbbb@mail.com</li><li>이름 : C이메일 : cccc@mail.com</li><li>이름 : D</li>
```  

이처럼 조금 더 간편하게 사용할 수 있다.  

만약 사용하지 않는다면 이렇게 출력이 되고 해당 코드에서 콤마를 없애는 로직이 추가되어야 한다.  

```javascript
`${_.map(data => 
  `<li>이름 : ${data.name}${data.email && `이메일 : ${data.email}`}</li>`, datas)}`

// <li>이름 : A이메일 : aaaa@mail.com</li>,<li>이름 : B이메일 : bbbb@mail.com</li>,<li>이름 : C이메일 : cccc@mail.com</li>,<li>이름 : Dundefined</li>
```

 
