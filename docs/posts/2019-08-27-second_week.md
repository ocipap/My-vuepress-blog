---
type: PostLayout
title: 두번째 회고 (팔월 넷째주)
subtitle: 뜻깊은 일을 한 주
category: life
thumbnail: /default/thumbnail.png
meta:
 - name: description
	content: 두번째 회고
date: 2019-08-27
---

이번 주는 금요일 오후 반차를 써서 그런지 또 시간이 너무 빨리 지나갔다. 빨리 지나갔다고 해서 의미 없게 보낸 것은 아니니 이번 한 주를 정리해보도록 하겠다.  


## React 공부  

이번 주 월, 화는 조금 한가로웠다. 관리자 댓글 관리 기능은 어느 정도 안정화가 되어 잘 배포했고, React를 관리자에 도입하려는 조짐이 보여서 천천히 공부하였다. 기본적인 **Hooks API** 부터 **Context API** 까지 내가 아는 선에서 천천히 곱씹어가면서 공부를 했다. 그 후 얼마나 바빠질 줄 모르는 빠삐코였다.

## 첫번째 임무  

드디어 나에게 실무적인 요소가 담긴 미션을 주었다. 미션의 주된 목표는 일반 리스트로 보이는 강좌 리스트를 아코디언 강좌 리스트로 생성하는 것이었다. 처음에는 너무 막막하다가 조금씩 데이터 구조와 파일 구조를 파악해서 필요한 데이터를 추려서 후딱 개발하였다. 은근히 시간이 오래 걸리지 않고 내가 정했던 기간보다 빨리 끝나서 test를 오랫동안 진행할 수 있었다.  

## 첫번째 실수  


너무 오만했었다. 분명히 테스트의 테스트를 거듭하고, 분명 간단한 기능이었음에도 막상 첫 배포를 하니 CS가 난무했다. "페이지가 안 들어가 져요.", "404 에러가 떠요." 내가 잡지 못한 에러가 실 서비스에서 눈덩이처럼 굴러가는 모습을 보니 손에서 땀이 나다 못해 흘렀다. 나는 에러가 발생하는 원인을 파악한 후 해당 부분을 `hotfix` 하여 올렸다. 덕분에 야근도 하고 치킨도 먹었다. 문제의 원인은 **사용자의 행동을 예측하지 못해 예측하지 못한 데이터의 구조가 생겨났고, 그 데이터를 분석하는 과정에서의 에러** 였다. 업무상 관련된 일이니 자세히는 적지 못하지만, 어떤 로직을 작성할 때는 항상 정답만 들어간다고 생각하지 말고, 방어코드를 자주 작성해야겠다는 생각이 들었다.  

## 고등학교 멘토링  

금요일에 오후 반차를 내고 고등학교에 갔었다. 졸업하고 나서 처음 오는 학교여서 그런지 설렘 반 걱정 반이었다. 학교에 가서 선생님들도 뵙고, 후배들도 만났다. 그러면서 학교에 있는 후배들에게 나의 이야기를 해주었다. 내가 학교를 졸업하고 나서 있었던 일들, 회사를 그만둔 일, 코드스쿼드라는 교육기관에서 정말 좋은 사람들과 공부한 일, 여러 고민 끝에 회사에 들어간 일등 등 별로 중요한 이야기는 아니었지만, 정말 잘 경청해주고, 호응해주었다. 나도 학교에 다닐 때 막연한 미래에 대한 걱정이 있었고, 그 걱정의 압박에 못 이겨 원하지 않는 회사에서 일하는 일도 겪었다. 그렇기에 후배들은 좀 더 신중하게 자신이 하고 싶은 일을 찾았으면 하는 마음이 컸다. 멘토링이 끝난 후에 집에 돌아가면서 후배들에게 오늘 좋은 이야기 감사하다는 문자를 받았다. 혼자 문자에 취해서 집으로 돌아가는 내내 기분이 좋았다.  

## 나태해지지말자

분명 입사 전에는 하루에 강좌를 하나씩 들으면서 마구마구 성장하는 나의 모습을 상상했었다. 어림도 없었다 ㅋㅋㅋㅋ... 집에만 오면 일단 눕는 기적 때문에 모든 일이 다 틀어졌다. 조금 고칠 필요가 있는 것 같다. 금요일 날 **유인동** 님께서 회사에 들리셨다고 한다... 하필 오후 반차를 쓴 날... 꼭 한번 뵙고 싶다.
