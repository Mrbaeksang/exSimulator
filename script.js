// 전여친 붙잡기 시뮬레이션 - 현실 버전
class ExGirlfriendSimulator {
    constructor() {
        this.gameState = {
            currentScenario: 0,
            approach: null,
            affection: 15, // 더 낮게 시작
            trust: 8,
            anger: 45, // 더 높게 시작
            attempts: 0,
            gameOver: false,
            currentPath: [],
            timeOfDay: 'evening', // 저녁, 밤, 새벽 등
            location: 'home'
        };
        
        this.character = {
            name: '박주현',
            age: 30,
            job: '경찰관',
            mood: 'annoyed',
            currentEmotion: '😒',
            mentalState: 'guarded', // 완전 경계 상태
            lastSeen: '3개월 전'
        };
        
        this.player = {
            name: '류정원',
            age: 31,
            job: '경찰관',
            desperation: 'high' // 절망적 상태
        };
        
        this.scenarios = this.initializeScenarios();
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.showMainMenu();
        this.updateUI();
        this.addRealisticEffects();
    }
    
    getCurrentKST() {
        const now = new Date();
        // 한국 시간대로 직접 변환
        const kst = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Seoul"}));
        
        const year = kst.getFullYear();
        const month = kst.getMonth() + 1;
        const day = kst.getDate();
        const hours = kst.getHours();
        const minutes = kst.getMinutes();
        
        const period = hours >= 12 ? '오후' : '오전';
        const displayHours = hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours);
        
        return `${year}년 ${month}월 ${day}일 ${period} ${displayHours}시 ${minutes.toString().padStart(2, '0')}분`;
    }
    
    bindEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('choice-btn')) {
                const choice = e.target.dataset.choice;
                this.handleChoice(parseInt(choice));
                this.playSound('click');
            }
            
            if (e.target.id === 'restartBtn') {
                this.restartGame();
            }
        });
        
        // 키보드 지원
        document.addEventListener('keydown', (e) => {
            if (e.key >= '1' && e.key <= '4') {
                const choice = parseInt(e.key);
                const btn = document.querySelector(`[data-choice="${choice}"]`);
                if (btn) btn.click();
            }
        });
    }
    
    addRealisticEffects() {
        // 시간 흐름 표시
        setInterval(() => {
            this.updateTimeDisplay();
        }, 30000); // 30초마다 시간 업데이트
        
        // 랜덤 방해 요소
        if (Math.random() < 0.1) {
            setTimeout(() => {
                this.addRandomDistraction();
            }, Math.random() * 10000 + 5000);
        }
    }
    
    showMainMenu() {
        const dialogueText = document.getElementById('dialogueText');
        const choices = document.getElementById('choices');
        
        dialogueText.innerHTML = `
            <div style="text-align: left; line-height: 1.8; padding: 20px;">
                <div style="background: rgba(0,0,0,0.4); padding: 15px; border-radius: 10px; margin-bottom: 15px;">
                    <strong>📅 ${this.getCurrentKST()}</strong><br>
                    <strong>📍 위치: 류정원의 원룸</strong>
                </div>
                
                "아... 또 주현이 생각이 나네."<br><br>
                
                휴대폰을 들었다 놨다 반복한 지 벌써 2시간째다.<br>
                3개월 전 그날의 차가운 표정이 아직도 생생하다.<br><br>
                
                <span style="color: #e74c3c;">"류정원, 우리 이제 정말 끝이야. 연락하지 마."</span><br><br>
                
                그렇게 말했지만... 정말 끝일까?<br>
                <em style="color: #f39c12;">오늘 밤, 마지막으로 한 번만 더 시도해볼까?</em>
            </div>
        `;
        
        choices.innerHTML = `
            <button class="choice-btn" data-choice="1">
                📱 전화 걸기 - "목소리라도 들어보자..."
            </button>
            <button class="choice-btn" data-choice="2">
                💬 카톡 보내기 - "부담스럽지 않게..."
            </button>
            <button class="choice-btn" data-choice="3">
                🚗 아파트로 직접 가기 - "직접 만나야 해"
            </button>
            <button class="choice-btn" data-choice="4">
                😔 포기하고 잠들기 - "그냥... 잊자"
            </button>
        `;
    }
    
    handleChoice(choice) {
        this.gameState.attempts++;
        
        if (choice === 4 && this.gameState.currentScenario === 0) {
            this.showGiveUpEnding();
            return;
        }
        
        if (this.gameState.currentScenario === 0) {
            this.handleApproachChoice(choice);
        } else {
            this.handleScenarioChoice(choice);
        }
        
        this.updateUI();
    }
    
    handleApproachChoice(choice) {
        const approaches = {
            1: 'phone',
            2: 'kakao',
            3: 'visit'
        };
        
        this.gameState.approach = approaches[choice];
        this.gameState.currentScenario = 1;
        
        // 실제같은 지연 효과
        this.showTransition(() => {
            switch(this.gameState.approach) {
                case 'phone':
                    this.startPhoneScenario();
                    break;
                case 'kakao':
                    this.startKakaoScenario();
                    break;
                case 'visit':
                    this.startVisitScenario();
                    break;
            }
        });
    }
    
    showTransition(callback) {
        const dialogueText = document.getElementById('dialogueText');
        const choices = document.getElementById('choices');
        
        dialogueText.innerHTML = '<div style="text-align: center; padding: 40px;"><div class="loading">결심을 굳히는 중...</div></div>';
        choices.innerHTML = '';
        
        setTimeout(() => {
            callback();
        }, 2000);
    }
    
    startPhoneScenario() {
        const scenario = {
            dialogue: `
                <div style="text-align: left; line-height: 1.8; padding: 20px;">
                    <div style="background: rgba(0,0,0,0.4); padding: 15px; border-radius: 10px; margin-bottom: 15px;">
                        <strong>📱 박주현에게 전화 거는 중...</strong><br>
                        <em style="color: #f39c12;">따르릉... 따르릉...</em>
                    </div>
                    
                    손이 떨린다. 심장이 너무 빨리 뛴다.<br>
                    3번째 신호음이 울리고...<br><br>
                    
                    <div style="background: rgba(233, 69, 96, 0.2); padding: 15px; border-radius: 10px; border-left: 4px solid #e94560;">
                        <strong style="color: #e94560;">"네, 여보세요?"</strong><br>
                        <em>(목소리가 차갑다. 확실히 내 번호를 보고 받았다.)</em>
                    </div><br>
                    
                    뭐라고 말해야 할까? 목소리가 떨린다...
                </div>
            `,
            choices: [
                { 
                    text: "주현아... 나야. 잘 지내?", 
                    result: { affection: -5, trust: -2, anger: +3 },
                    response: "awkward_silence"
                },
                { 
                    text: "혹시... 바쁘지 않으면 잠깐만 얘기할 수 있을까?", 
                    result: { affection: -2, trust: +1, anger: +1 },
                    response: "cold_response"
                },
                { 
                    text: "미안해... 갑자기 전화했어. 그냥... 목소리가 듣고 싶었어.", 
                    result: { affection: +1, trust: -1, anger: +2 },
                    response: "annoyed_sigh"
                }
            ]
        };
        
        this.showScenario(scenario);
    }
    
    startKakaoScenario() {
        const scenario = {
            dialogue: `
                <div style="text-align: left; line-height: 1.8; padding: 20px;">
                    <div style="background: rgba(0,0,0,0.4); padding: 15px; border-radius: 10px; margin-bottom: 15px;">
                        <strong>💬 카카오톡</strong><br>
                        <strong>박주현</strong> <span style="color: #888;">마지막 접속: 5분 전</span>
                    </div>
                    
                    프로필 사진이 바뀌었다. 혼자 찍은 셀카...<br>
                    예전엔 항상 우리 둘이 함께 찍은 사진이었는데.<br><br>
                    
                    <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px; margin: 10px 0;">
                        "메시지를 입력하세요..."<br>
                        <span style="color: #666; font-size: 0.9em;">차단되지는 않은 상태입니다.</span>
                    </div>
                    
                    뭐라고 보낼까? 너무 길면 부담스럽고, 너무 짧으면 성의 없어 보이고...
                </div>
            `,
            choices: [
                { 
                    text: "주현아 안녕, 잘 지내? 요즘 어때?", 
                    result: { affection: +1, trust: +2, anger: 0 },
                    response: "read_no_reply"
                },
                { 
                    text: "갑자기 연락해서 미안해. 할 얘기가 있는데 시간 될 때 연락줄 수 있어?", 
                    result: { affection: +2, trust: +3, anger: -1 },
                    response: "delayed_cold_reply"
                },
                { 
                    text: "[사진] 우리 처음 만났던 그 카페... 지나가다 생각나서", 
                    result: { affection: -2, trust: -3, anger: +4 },
                    response: "very_annoyed"
                },
                {
                    text: "주현아, 미안해. 그때 내가 정말 잘못했어. 한 번만 더 기회를 줄 수 없을까?",
                    result: { affection: -3, trust: +1, anger: +2 },
                    response: "frustrated_reply"
                }
            ]
        };
        
        this.showScenario(scenario);
    }
    
    startVisitScenario() {
        const scenario = {
            dialogue: `
                <div style="text-align: left; line-height: 1.8; padding: 20px;">
                    <div style="background: rgba(0,0,0,0.4); padding: 15px; border-radius: 10px; margin-bottom: 15px;">
                        <strong>🚗 밤 10시 30분, 주현이 아파트로 향하는 중</strong><br>
                        <strong>📍 서울시 강남구 ○○아파트</strong>
                    </div>
                    
                    차 안에서 계속 망설였다. 정말 가야 할까?<br>
                    하지만 이미 아파트 주차장에 도착했다.<br><br>
                    
                    엘리베이터를 타고 15층으로 올라간다.<br>
                    복도는 조용하다. 다행히 사람은 없고...<br><br>
                    
                    <div style="background: rgba(15, 52, 96, 0.3); padding: 15px; border-radius: 10px; border-left: 4px solid #0f3460;">
                        <strong>1503호</strong> 문패: <strong>박주현</strong><br>
                        문 안에서 TV 소리가 들린다. 집에 있는 것 같다.
                    </div><br>
                    
                    어떻게 할까? 심장이 터질 것 같다...
                </div>
            `,
            choices: [
                { 
                    text: "정중하게 초인종을 누른다", 
                    result: { affection: +1, trust: +2, anger: +1 },
                    response: "intercom_shock"
                },
                { 
                    text: "문을 살짝 두드리며 '주현아...' 하고 부른다", 
                    result: { affection: -1, trust: -2, anger: +3 },
                    response: "door_knock_anger"
                },
                { 
                    text: "일단 복도에서 기다려보자", 
                    result: { affection: 0, trust: -1, anger: +2 },
                    response: "waiting_creepy"
                },
                {
                    text: "아니다... 이건 너무 심한 것 같다. 돌아가자",
                    result: { affection: +2, trust: +1, anger: -1 },
                    response: "retreat_ending"
                }
            ]
        };
        
        this.showScenario(scenario);
    }
    
    showScenario(scenario) {
        const dialogueText = document.getElementById('dialogueText');
        const choices = document.getElementById('choices');
        
        // 현실적인 로딩 효과
        dialogueText.innerHTML = '<div style="text-align: center; padding: 40px;"><div class="loading">...</div></div>';
        choices.innerHTML = '';
        
        setTimeout(() => {
            dialogueText.innerHTML = scenario.dialogue;
            
            choices.innerHTML = '';
            scenario.choices.forEach((choice, index) => {
                const button = document.createElement('button');
                button.className = 'choice-btn';
                button.dataset.choice = index + 1;
                button.innerHTML = `<span style="color: #ffd700;">${index + 1}.</span> ${choice.text}`;
                choices.appendChild(button);
            });
        }, 1500);
        
        this.currentScenario = scenario;
    }
    
    handleScenarioChoice(choice) {
        // 선택지 유효성 검사
        if (!this.currentScenario || !this.currentScenario.choices || choice < 1 || choice > this.currentScenario.choices.length) {
            console.error(`잘못된 선택지: ${choice}`);
            return;
        }
        
        const selectedChoice = this.currentScenario.choices[choice - 1];
        
        // selectedChoice 유효성 검사
        if (!selectedChoice || !selectedChoice.result) {
            console.error(`선택지 데이터가 없습니다: ${choice}`);
            return;
        }
        
        // 스탯 업데이트
        this.gameState.affection += selectedChoice.result.affection || 0;
        this.gameState.trust += selectedChoice.result.trust || 0;
        this.gameState.anger += selectedChoice.result.anger || 0;
        
        // 범위 제한
        this.gameState.affection = Math.max(0, Math.min(100, this.gameState.affection));
        this.gameState.trust = Math.max(0, Math.min(100, this.gameState.trust));
        this.gameState.anger = Math.max(0, Math.min(100, this.gameState.anger));
        
        this.updateCharacterMood();
        this.showResponse(selectedChoice.response);
    }
    
    showResponse(responseType) {
        const responses = {
            awkward_silence: {
                dialogue: `
                    <div style="text-align: left; line-height: 1.8; padding: 20px;">
                        <div style="background: rgba(233, 69, 96, 0.2); padding: 15px; border-radius: 10px; border-left: 4px solid #e94560;">
                            <strong style="color: #e94560;">"..."</strong><br>
                            <em>(5초간의 정적. 숨소리만 들린다.)</em><br><br>
                            <strong style="color: #e94560;">"정원아... 우리 이미 끝난 얘기 아니야?"</strong><br>
                            <em>(목소리에 짜증이 섞여있다.)</em>
                        </div><br>
                        
                        예상했던 반응이다. 그래도 끊지는 않았다.<br>
                        이제 뭐라고 말해야 할까?
                    </div>
                `,
                choices: [
                    { text: "알아... 그래도 한 번만 더 기회를 줄 수 없을까?", result: { affection: -8, trust: -3, anger: +5 } },
                    { text: "미안해. 그냥... 네가 잘 지내는지 궁금했어.", result: { affection: +2, trust: +1, anger: -1 } },
                    { text: "5분만... 5분만 시간을 줘.", result: { affection: -5, trust: -2, anger: +4 } }
                ],
                final: false
            },
            
            cold_response: {
                dialogue: `
                    <div style="text-align: left; line-height: 1.8; padding: 20px;">
                        <div style="background: rgba(233, 69, 96, 0.2); padding: 15px; border-radius: 10px; border-left: 4px solid #e94560;">
                            <strong style="color: #e94560;">"바쁘지 않으면 얘기하자고?"</strong><br>
                            <em>(한숨 소리가 들린다.)</em><br><br>
                            <strong style="color: #e94560;">"정원아... 우리 얘기할 게 뭐가 있어? 이미 다 끝난 얘기잖아."</strong><br>
                            <em>(목소리가 점점 차가워진다.)</em>
                        </div><br>
                        
                        예상했던 반응이다. 하지만 포기하기엔 너무 일찍이다.<br>
                        마지막으로 뭔가 말해야 할 것 같다...
                    </div>
                `,
                choices: [
                    { text: "그래도... 한 번만 더 기회를 줄 수 없을까?", result: { affection: -6, trust: -2, anger: +4 } },
                    { text: "알겠어. 그냥... 잘 지내라는 말 하고 싶었어.", result: { affection: +1, trust: +1, anger: -1 } },
                    { text: "5분만... 정말 5분만 시간을 줘.", result: { affection: -4, trust: -3, anger: +3 } }
                ],
                final: true
            },
            
            annoyed_sigh: {
                dialogue: `
                    <div style="text-align: left; line-height: 1.8; padding: 20px;">
                        <div style="background: rgba(233, 69, 96, 0.2); padding: 15px; border-radius: 10px; border-left: 4px solid #e94560;">
                            <strong style="color: #e94560;">"하아..."</strong><br>
                            <em>(깊은 한숨소리. 3초간의 침묵.)</em><br><br>
                            <strong style="color: #e94560;">"정원아, 진짜... 이러지 마. 나도 힘들어."</strong><br>
                            <em>(목소리에 피로감이 묻어난다.)</em>
                        </div><br>
                        
                        주현이도 힘들어하고 있다는 걸 알 수 있다.<br>
                        하지만 이게 마지막 기회일지도 모른다...
                    </div>
                `,
                choices: [
                    { text: "나도 힘들어... 하지만 너 없이는 안 되겠어.", result: { affection: -3, trust: -1, anger: +2 } },
                    { text: "미안해. 힘들게 해서... 그냥 끊을게.", result: { affection: +2, trust: +2, anger: -2 } },
                    { text: "그럼... 친구로라도 다시 시작할 수 없을까?", result: { affection: +1, trust: +1, anger: 0 } }
                ],
                final: true
            },
            
            read_no_reply: {
                dialogue: `
                    <div style="text-align: left; line-height: 1.8; padding: 20px;">
                        <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px;">
                            <strong>💬 박주현</strong><br>
                            <div style="color: #888; font-size: 0.9em; margin-top: 10px;">
                                읽음 22:47
                            </div>
                        </div><br>
                        
                        읽었다. 하지만 답장이 없다.<br>
                        10분이 지났다... 20분이 지났다...<br><br>
                        
                        프로필을 다시 확인해본다. 마지막 접속: 방금 전<br>
                        온라인 상태인데 답장을 안 하는 거다.<br><br>
                        
                        <em style="color: #f39c12;">어떻게 할까?</em>
                    </div>
                `,
                choices: [
                    { text: "한 번 더 메시지를 보낸다", result: { affection: -4, trust: -3, anger: +4 } },
                    { text: "전화를 걸어본다", result: { affection: -3, trust: -2, anger: +3 } },
                    { text: "그냥 기다린다", result: { affection: +1, trust: +2, anger: 0 } },
                    { text: "포기하고 잠든다", result: { affection: 0, trust: 0, anger: 0 } }
                ],
                final: false
            },
            
            delayed_cold_reply: {
                dialogue: `
                    <div style="text-align: left; line-height: 1.8; padding: 20px;">
                        <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px;">
                            <strong>💬 박주현</strong> <span style="color: #888;">1시간 후</span><br>
                            <div style="color: #e94560; margin-top: 10px; padding: 10px; background: rgba(233, 69, 96, 0.1); border-radius: 8px;">
                                "바쁘다. 연락하지 마."
                            </div>
                            <div style="color: #888; font-size: 0.9em; margin-top: 5px;">
                                읽음 00:15
                            </div>
                        </div><br>
                        
                        1시간을 기다린 끝에 온 답장이 이것뿐이다.<br>
                        차갑고 단호하다. 더 이상 대화할 여지가 없어 보인다.<br><br>
                        
                        <em style="color: #f39c12;">어떻게 할까? 이대로 포기해야 할까?</em>
                    </div>
                `,
                choices: [
                    { text: "알겠어... 미안해. 더 이상 연락 안 할게.", result: { affection: +1, trust: +1, anger: -1 } },
                    { text: "그래도 마지막으로 한 번만...", result: { affection: -5, trust: -3, anger: +4 } },
                    { text: "행복하게 살아. 잘 지내.", result: { affection: +2, trust: +2, anger: -2 } }
                ],
                final: true
            },
            
            very_annoyed: {
                dialogue: `
                    <div style="text-align: left; line-height: 1.8; padding: 20px;">
                        <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px;">
                            <strong>💬 박주현</strong> <span style="color: #888;">즉시</span><br>
                            <div style="color: #e94560; margin-top: 10px; padding: 10px; background: rgba(233, 69, 96, 0.2); border-radius: 8px;">
                                "정원아 진짜 그만해"<br>
                                "왜 이런 사진을 보내는 거야"<br>
                                "정말 기분 나빠"<br>
                                "더 이상 연락하지 마"
                            </div>
                            <div style="color: #888; font-size: 0.9em; margin-top: 5px;">
                                읽음 22:50
                            </div>
                        </div><br>
                        
                        완전히 화났다. 과거의 추억을 들먹이는 것이 역효과였다.<br>
                        주현이의 화난 연타 메시지를 보니 가슴이 아프다.<br><br>
                        
                        <div style="background: rgba(233, 69, 96, 0.1); padding: 10px; border-radius: 8px; border-left: 3px solid #e94560;">
                            ⚠️ <strong>경고:</strong> 상대방이 매우 화났습니다. 신중하게 행동하세요.
                        </div>
                    </div>
                `,
                choices: [
                    { text: "미안해... 정말 미안해. 그냥 보고 싶었어.", result: { affection: -2, trust: -1, anger: +1 } },
                    { text: "알겠어. 더 이상 연락 안 할게.", result: { affection: +1, trust: +2, anger: -3 } }
                ],
                final: true
            },
            
            frustrated_reply: {
                dialogue: `
                    <div style="text-align: left; line-height: 1.8; padding: 20px;">
                        <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px;">
                            <strong>💬 박주현</strong> <span style="color: #888;">10분 후</span><br>
                            <div style="color: #e94560; margin-top: 10px; padding: 10px; background: rgba(233, 69, 96, 0.1); border-radius: 8px;">
                                "정원아..."<br>
                                "우리 정말 많이 얘기했잖아"<br>
                                "그때도 말했지만 우리는 안 되는 것 같아"<br>
                                "계속 이러면 더 힘들어져"<br>
                                "제발... 이제 그만 하자"
                            </div>
                            <div style="color: #888; font-size: 0.9em; margin-top: 5px;">
                                읽음 23:05
                            </div>
                        </div><br>
                        
                        주현이의 메시지에서 절망감이 느껴진다.<br>
                        화가 나서가 아니라, 정말 지쳐서 하는 말 같다.<br><br>
                        
                        이번에는 정말 마지막인 것 같다...
                    </div>
                `,
                choices: [
                    { text: "알겠어... 정말 미안했어. 행복해.", result: { affection: +3, trust: +3, anger: -3 } },
                    { text: "그래도... 우리 좋았던 시간도 있었잖아", result: { affection: -4, trust: -2, anger: +3 } }
                ],
                final: true
            },
            
            intercom_shock: {
                dialogue: `
                    <div style="text-align: left; line-height: 1.8; padding: 20px;">
                        <div style="background: rgba(15, 52, 96, 0.3); padding: 15px; border-radius: 10px;">
                            <strong>📞 인터폰</strong><br>
                            띵동~ 띵동~
                        </div><br>
                        
                        TV 소리가 갑자기 작아진다.<br>
                        누군가 인터폰 쪽으로 다가오는 발소리...<br><br>
                        
                        <div style="background: rgba(233, 69, 96, 0.2); padding: 15px; border-radius: 10px; border-left: 4px solid #e94560;">
                            <strong style="color: #e94560;">"누구세요?"</strong><br>
                            <em>(목소리로 이미 알아챈 것 같다. 경계심이 느껴진다.)</em>
                        </div><br>
                        
                        <div style="background: rgba(233, 69, 96, 0.2); padding: 15px; border-radius: 10px; border-left: 4px solid #e94560;">
                            <strong style="color: #e94560;">"...정원아? 뭐하는 거야? 왜 여기까지 와?"</strong><br>
                            <em>(당황스럽고 화난 목소리다.)</em>
                        </div>
                    </div>
                `,
                choices: [
                    { text: "문 열어줘. 잠깐만 얘기하자.", result: { affection: -6, trust: -4, anger: +6 } },
                    { text: "미안해... 그냥 보고 싶었어.", result: { affection: +1, trust: -1, anger: +2 } },
                    { text: "5분만... 5분만 시간을 줘.", result: { affection: -4, trust: -3, anger: +4 } },
                    { text: "미안해, 돌아갈게.", result: { affection: +3, trust: +2, anger: -2 } }
                ],
                final: false
            },
            
            door_knock_anger: {
                dialogue: `
                    <div style="text-align: left; line-height: 1.8; padding: 20px;">
                        <div style="background: rgba(15, 52, 96, 0.3); padding: 15px; border-radius: 10px;">
                            <strong>🚪 똑똑똑...</strong><br>
                            "주현아..."
                        </div><br>
                        
                        문 뒤에서 발소리가 멈췄다.<br>
                        5초 후...<br><br>
                        
                        <div style="background: rgba(233, 69, 96, 0.2); padding: 15px; border-radius: 10px; border-left: 4px solid #e94560;">
                            <strong style="color: #e94560;">"정원아? 미쳤어? 왜 여기서 이러는 거야!"</strong><br>
                            <em>(문을 사이에 두고 화난 목소리가 들린다.)</em><br><br>
                            <strong style="color: #e94560;">"이웃들 다 들어! 제발 그만하고 돌아가!"</strong><br>
                            <em>(당황하고 분노한 목소리다.)</em>
                        </div><br>
                        
                        <div style="background: rgba(255, 165, 0, 0.1); padding: 10px; border-radius: 8px; border-left: 3px solid #ffa500;">
                            ⚠️ 복도에서 다른 집 문이 열리는 소리가 들린다...
                        </div>
                    </div>
                `,
                choices: [
                    { text: "미안해... 5분만 얘기하자. 제발.", result: { affection: -8, trust: -4, anger: +6 } },
                    { text: "알겠어. 돌아갈게. 미안해.", result: { affection: +1, trust: +1, anger: -2 } },
                    { text: "주현아... 나 정말 힘들어.", result: { affection: -5, trust: -3, anger: +4 } }
                ],
                final: true
            },
            
            waiting_creepy: {
                dialogue: `
                    <div style="text-align: left; line-height: 1.8; padding: 20px;">
                        <div style="background: rgba(15, 52, 96, 0.3); padding: 15px; border-radius: 10px;">
                            <strong>🕐 복도에서 기다리는 중...</strong><br>
                            <em>10분째... 20분째...</em>
                        </div><br>
                        
                        복도 구석에서 조용히 기다리고 있다.<br>
                        가끔 다른 집에서 나오는 사람들이 이상하게 쳐다본다.<br><br>
                        
                        30분이 지났을 때...<br><br>
                        
                        <div style="background: rgba(233, 69, 96, 0.2); padding: 15px; border-radius: 10px; border-left: 4px solid #e94560;">
                            <strong>딸깍... (문 열리는 소리)</strong><br><br>
                            <strong style="color: #e94560;">"정원아... 뭐하는 거야? 왜 거기서 기다리고 있어?"</strong><br>
                            <em>(문틈으로 보이는 주현이의 놀란 얼굴)</em><br><br>
                            <strong style="color: #e94560;">"진짜... 무서워. 이러지 마."</strong><br>
                            <em>(목소리가 떨리고 있다.)</em>
                        </div><br>
                        
                        <div style="background: rgba(255, 0, 0, 0.1); padding: 10px; border-radius: 8px; border-left: 3px solid #ff0000;">
                            ⚠️ <strong>위험:</strong> 스토킹으로 오해받을 수 있습니다.
                        </div>
                    </div>
                `,
                choices: [
                    { text: "미안해... 그냥 보고 싶었어.", result: { affection: -6, trust: -5, anger: +5 } },
                    { text: "미안해. 바로 갈게.", result: { affection: -2, trust: -1, anger: +1 } },
                    { text: "5분만... 정말 5분만 얘기하자.", result: { affection: -8, trust: -6, anger: +7 } }
                ],
                final: true
            },
            
            retreat_ending: {
                dialogue: `
                    <div style="text-align: left; line-height: 1.8; padding: 20px;">
                        <div style="background: rgba(15, 52, 96, 0.3); padding: 15px; border-radius: 10px;">
                            <strong>🚶‍♂️ 돌아가는 중...</strong><br>
                            <em>엘리베이터로 향한다.</em>
                        </div><br>
                        
                        "그래... 이건 너무 심했어."<br><br>
                        
                        엘리베이터를 기다리며 뒤돌아본다.<br>
                        1503호 문은 여전히 닫혀있다.<br><br>
                        
                        <div style="background: rgba(46, 204, 113, 0.2); padding: 15px; border-radius: 10px; border-left: 4px solid #2ecc71;">
                            <strong style="color: #2ecc71;">현명한 선택이었다.</strong><br>
                            <em>때로는 포기하는 것이 더 용기 있는 행동일 수 있다.</em>
                        </div><br>
                        
                        차 안에서 마지막으로 휴대폰을 꺼내 본다.<br>
                        그리고... 주현이의 번호를 삭제한다.<br><br>
                        
                        "잘 살아, 주현아..."
                    </div>
                `,
                choices: [
                    { text: "집으로 돌아간다.", result: { affection: +5, trust: +3, anger: -5 } }
                ],
                final: true
            }
        };
        
        const response = responses[responseType];
        if (response) {
            setTimeout(() => {
                this.showScenario(response);
                
                // 게임 오버 체크
                if (this.checkGameOver() || response.final) {
                    setTimeout(() => {
                        this.endGame();
                    }, 1000);
                }
            }, 2000);
        } else {
            // 정의되지 않은 응답 타입에 대한 fallback
            console.error(`정의되지 않은 응답 타입: ${responseType}`);
            setTimeout(() => {
                this.endGame();
            }, 1000);
        }
    }
    
    updateCharacterMood() {
        let mood = 'angry';
        let emotion = '😡';
        
        if (this.gameState.anger > 80) {
            mood = 'furious';
            emotion = '🤬';
        } else if (this.gameState.anger > 60) {
            mood = 'angry';
            emotion = '😡';
        } else if (this.gameState.affection < 20) {
            mood = 'disappointed';
            emotion = '😔';
        } else if (this.gameState.trust > 60 && this.gameState.affection > 60) {
            mood = 'softening';
            emotion = '🤔';
        } else if (this.gameState.affection > 30) {
            mood = 'conflicted';
            emotion = '😐';
        } else {
            mood = 'annoyed';
            emotion = '😒';
        }
        
        this.character.mood = mood;
        this.character.currentEmotion = emotion;
        
        document.getElementById('moodIndicator').textContent = emotion;
    }
    
    checkGameOver() {
        return (
            this.gameState.anger >= 90 ||
            this.gameState.affection <= 0 ||
            this.gameState.attempts >= 6
        );
    }
    
    endGame() {
        this.gameState.gameOver = true;
        
        let result = 'failure';
        let title = '완전한 실패...';
        let image = '💔';
        let text = '';
        
        // 극도로 어려운 성공 조건
        if (this.gameState.affection >= 60 && this.gameState.trust >= 50 && this.gameState.anger <= 30) {
            result = 'success';
            title = '믿을 수 없는 결과!';
            image = '💕';
            text = `"정원아... 정말 많이 생각해봤어. 너도 많이 변한 것 같고... 아주 천천히, 친구부터 다시 시작해볼까?" 주현이가 조심스럽게 말했다. 기적이 일어났다.`;
        } else if (this.gameState.affection >= 25 && this.gameState.anger <= 70) {
            result = 'neutral';
            title = '그래도 나쁘지 않은 마무리';
            image = '😔';
            text = `"정원아, 고마워... 그래도 우리는 여기서 끝내는 게 맞는 것 같아. 좋은 사람 만나서 행복해." 차가웠지만 악의는 없었다.`;
        } else {
            // 현실적인 실패들
            const failures = [
                `"정원아, 이제 정말 그만해줘. 이러면 정말 신고할 거야. 연락하지 마." 주현이가 차갑게 말하며 전화를 끊었다.`,
                `주현이가 번호를 차단했다. 카톡도 차단되었다. 더 이상 연락할 방법이 없다.`,
                `"왜 이렇게 집착하는 거야? 정말 무서워... 다시는 연락하지 마." 목소리가 떨리고 있었다.`,
                `경비실에서 연락이 왔다. "민원이 들어왔습니다. 더 이상 방문하시면 안 됩니다." 경찰인 당신에게는 치명적이다.`,
                `"정원아... 이렇게 하지 마. 제발... 이제 정말 그만해줘." 주현이의 목소리에 절망이 느껴졌다.`
            ];
            
            text = failures[Math.floor(Math.random() * failures.length)];
        }
        
        this.showGameOver(result, title, image, text);
    }
    
    showGiveUpEnding() {
        this.showGameOver('giveup', '현명한 선택', '😴', 
            '그래... 이미 끝난 일이야. 주현이도 새로운 삶을 살고 있을 거고. 나도 이제 정말 놓아주자. 잠들기 전 마지막으로 한 번 더 생각했지만, 결국 아무것도 하지 않았다.');
    }
    
    showGameOver(result, title, image, text) {
        document.getElementById('gameScreen').style.display = 'none';
        const gameOverScreen = document.getElementById('gameOverScreen');
        gameOverScreen.classList.remove('hidden');
        
        document.getElementById('resultTitle').textContent = title;
        document.getElementById('resultTitle').className = `result-title ${result}`;
        document.getElementById('resultImage').textContent = image;
        document.getElementById('resultText').textContent = text;
        
        // 결과에 따른 사운드
        if (result === 'success') {
            this.playSound('success');
        } else {
            this.playSound('failure');
        }
    }
    
    updateUI() {
        document.getElementById('affectionBar').style.width = `${this.gameState.affection}%`;
        document.getElementById('affectionValue').textContent = `${this.gameState.affection}/100`;
        
        document.getElementById('trustBar').style.width = `${this.gameState.trust}%`;
        document.getElementById('trustValue').textContent = `${this.gameState.trust}/100`;
        
        document.getElementById('moodIndicator').textContent = this.character.currentEmotion;
        
        // 스탯에 따른 바 색상 변경
        const affectionBar = document.getElementById('affectionBar');
        const trustBar = document.getElementById('trustBar');
        
        if (this.gameState.affection <= 20) {
            affectionBar.style.background = 'linear-gradient(90deg, #e74c3c, #c0392b)';
        } else if (this.gameState.affection >= 60) {
            affectionBar.style.background = 'linear-gradient(90deg, #27ae60, #2ecc71)';
        }
        
        if (this.gameState.trust <= 20) {
            trustBar.style.background = 'linear-gradient(90deg, #e74c3c, #c0392b)';
        } else if (this.gameState.trust >= 60) {
            trustBar.style.background = 'linear-gradient(90deg, #3498db, #2ecc71)';
        }
    }
    
    updateTimeDisplay() {
        // 시간 흐름 표시 (선택사항)
        const timeElements = document.querySelectorAll('[data-time]');
        timeElements.forEach(el => {
            const currentTime = el.dataset.time;
            // 시간 업데이트 로직
        });
    }
    
    addRandomDistraction() {
        // 랜덤 방해요소 (현실감 증대)
        const distractions = [
            "옆집에서 아기 우는 소리가 들린다...",
            "밖에서 사이렌 소리가 지나간다...",
            "휴대폰 배터리가 부족하다는 알림이 뜬다...",
            "누군가 복도를 지나가는 발소리..."
        ];
        
        if (Math.random() < 0.3) {
            const distraction = distractions[Math.floor(Math.random() * distractions.length)];
            this.showTemporaryMessage(distraction);
        }
    }
    
    showTemporaryMessage(message) {
        const temp = document.createElement('div');
        temp.style.cssText = `
            position: fixed; top: 20px; right: 20px; 
            background: rgba(0,0,0,0.8); color: white; 
            padding: 10px 20px; border-radius: 8px; 
            font-size: 0.9em; z-index: 1000;
            animation: fadeInOut 3s ease-in-out;
        `;
        temp.textContent = message;
        document.body.appendChild(temp);
        
        setTimeout(() => {
            temp.remove();
        }, 3000);
    }
    
    playSound(type) {
        // 웹 오디오 효과음
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            switch(type) {
                case 'click':
                    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.1);
                    break;
                case 'success':
                    // 행복한 멜로디
                    oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
                    oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.2);
                    oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.4);
                    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.6);
                    break;
                case 'failure':
                    // 슬픈 멜로디
                    oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(150, audioContext.currentTime + 1);
                    gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 1);
                    break;
            }
        } catch (e) {
            // 오디오 지원하지 않는 경우 무시
        }
    }
    
    restartGame() {
        this.gameState = {
            currentScenario: 0,
            approach: null,
            affection: 15,
            trust: 8,
            anger: 45,
            attempts: 0,
            gameOver: false,
            currentPath: [],
            timeOfDay: 'evening',
            location: 'home'
        };
        
        this.character.mood = 'annoyed';
        this.character.currentEmotion = '😒';
        
        document.getElementById('gameScreen').style.display = 'flex';
        document.getElementById('gameOverScreen').classList.add('hidden');
        
        this.showMainMenu();
        this.updateUI();
    }
    
    initializeScenarios() {
        // 추후 확장을 위한 시나리오 데이터
        return {};
    }
}

// 게임 시작
document.addEventListener('DOMContentLoaded', () => {
    // 페이드인 효과
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 1s ease-in';
        document.body.style.opacity = '1';
    }, 100);
    
    window.game = new ExGirlfriendSimulator();
});

// CSS 애니메이션 추가
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0%, 100% { opacity: 0; transform: translateY(-20px); }
        50% { opacity: 1; transform: translateY(0); }
    }
    
    .loading {
        animation: pulse 1.5s ease-in-out infinite;
    }
    
    .choice-btn {
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
    }
    
    .choice-btn:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.3);
    }
    
    .choice-btn:active {
        transform: translateY(-1px);
    }
`;
document.head.appendChild(style);