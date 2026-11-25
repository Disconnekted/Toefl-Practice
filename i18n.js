// Korean interface (the 한/EN button in the header).
// Only the app's own labels and instructions change. Test content (passages,
// recordings, questions, answer choices) stays in English, like the real test.
// Text is matched exactly; anything not listed stays in English.
(function () {
  // Whole sentences or labels (a text node, or an element's full text).
  const KO = {
    // Navigation and header
    'Home': '홈', 'Reading': '읽기', 'Listening': '듣기', 'Writing': '쓰기', 'Speaking': '말하기', 'Words': '단어',
    'Settings': '설정', 'Progress': '학습 기록', '📈 Progress': '📈 학습 기록', 'Your progress': '나의 학습 기록',
    'Back': '뒤로', 'Next': '다음', 'Skip': '건너뛰기', 'Start': '시작', 'Save': '저장', 'Clear': '지우기', 'Review': '복습',
    'Done': '완료', 'Stay': '머무르기', 'Leave': '나가기', 'Tips': '팁', 'Useful phrases': '유용한 표현',

    // Home
    'Ready to practice?': '오늘도 연습해 볼까요?',
    'Every task type on the current TOEFL iBT (the format in use since January 21, 2026), plus strategy drills.': '2026년 1월 21일부터 시행된 새 TOEFL iBT의 모든 과제 유형과 전략 연습이 있습니다.',
    'Daily 15': '데일리 15', "Start today's 15-minute mix": '오늘의 15분 학습 시작',
    'Words, mistakes, reading, listening, writing, and speaking, picked from your weakest areas.': '단어, 오답, 읽기, 듣기, 쓰기, 말하기를 약한 영역 위주로 골라 줍니다.',
    'Done for today ✓ · Start another mix': '오늘 학습 완료 ✓ · 한 번 더 하기',
    'Suggested next': '추천 학습', 'Continue': '이어서 하기', 'Your skills': '나의 실력',
    'Not started': '시작 전', 'Weak spot': '약점', 'Mistake review': '오답 복습',
    'Questions you got wrong come back after 1, 3, and 7 days.': '틀린 문제는 1일, 3일, 7일 뒤에 다시 나옵니다.',
    'Academic Word List': 'Academic Word List (학술 어휘)',
    'Practice a short set of them, with a strategy tip.': '전략 팁과 함께 짧게 연습해 보세요.',
    'Practice Complete the Words.': '단어 완성하기를 연습하세요.',
    'You haven\'t tried this one yet.': '아직 해 보지 않은 과제입니다.',
    'Install it as an app:': '앱으로 설치하기:',
    'Level check': '레벨 테스트', 'Find your starting level': '나의 시작 레벨 알아보기',
    'A short Reading and Listening mix gives a rough band for each, and shows which question types to work on.': '읽기와 듣기 문제를 짧게 풀고 영역별 대략적인 밴드 점수와 보완할 문제 유형을 확인하세요.',
    'Retake level check': '레벨 테스트 다시 보기', 'Change goal': '목표 바꾸기', 'Set a goal': '목표 정하기',
    'not checked yet': '아직 측정 전', 'goal reached ✓': '목표 달성 ✓',
    'Test day. Good luck!': '시험 날입니다. 파이팅!',

    // Section groups
    'Practice test': '실전 모의고사', 'Test tasks': '시험 과제', 'Strategy drills': '전략 연습', 'Note-taking drills': '노트 필기 연습',
    'full section, timed': '전체 섹션, 시간 제한', 'about 30 min, adaptive': '약 30분, 적응형', 'about 29 min, adaptive': '약 29분, 적응형',
    'skills practice': '기술 연습', '23 min': '23분', '8 min': '8분',
    'not started': '시작 전', 'Reading strategies': '읽기 전략', 'Listening strategies': '듣기 전략',

    // Task names
    'Complete the Words': '단어 완성하기', 'Read in Daily Life': '일상 글 읽기', 'Read an Academic Passage': '학술 지문 읽기',
    'Skim for structure': '구조 훑어 읽기', 'Signal words': '연결어', 'Vocabulary in context': '문맥 속 어휘',
    'Listen and Choose a Response': '듣고 응답 고르기', 'Listen to a Conversation': '대화 듣기', 'Listen to an Announcement': '안내 방송 듣기',
    'Listen to an Academic Talk': '강의 듣기', 'Guided notes': '빈칸 노트', 'One note per chunk': '한 부분씩 노트하기',
    'Lecture notes and tone': '강의 노트와 어조', 'Notes on your own podcast': '나만의 팟캐스트 노트',
    'Build a Sentence': '문장 만들기', 'Write an Email': '이메일 쓰기', 'Academic Discussion': '학술 토론',
    'Listen and Repeat': '듣고 따라 말하기', 'Take an Interview': '인터뷰 하기',
    'Full Reading test': '읽기 전체 모의고사', 'Full Listening test': '듣기 전체 모의고사',
    'Reading practice test': '읽기 모의고사', 'Listening practice test': '듣기 모의고사',

    // Task blurbs
    'Fill in missing letters in an academic paragraph.': '학술 단락에서 빠진 철자를 채웁니다.',
    'Notices, emails, posts and ads with short questions.': '공지, 이메일, 게시글, 광고와 짧은 질문.',
    'A ~250-word passage with 5 questions.': '약 250단어 지문과 5문항.',
    'See only topic sentences for a few seconds, then answer.': '주제문만 몇 초 동안 보고 답합니다.',
    'Choose transitions and predict what comes next.': '연결어를 고르고 다음 내용을 예측합니다.',
    'Work out unfamiliar words from clues around them.': '주변 단서로 모르는 단어의 뜻을 알아냅니다.',
    'Hear one line, pick the best reply.': '한 문장을 듣고 가장 알맞은 대답을 고릅니다.',
    'Two speakers on campus, then questions.': '캠퍼스 대화를 듣고 문제를 풉니다.',
    'A short campus or class announcement.': '캠퍼스나 수업의 짧은 안내 방송.',
    'A short lecture, then questions.': '짧은 강의를 듣고 문제를 풉니다.',
    'Fill in an outline while the talk plays once.': '강의가 한 번 재생되는 동안 개요의 빈칸을 채웁니다.',
    'Hear a talk in short pieces; note each in 8 words.': '강의를 짧게 나누어 듣고 각각 8단어로 정리합니다.',
    'Hear a full talk once, take free notes, answer from them.': '강의를 한 번 듣고 자유롭게 노트한 뒤 노트로 답합니다.',
    'Take notes on any real lecture or podcast, then check them.': '실제 강의나 팟캐스트로 노트하고 확인합니다.',
    'Put word tiles in order to make a correct reply.': '단어 카드를 순서대로 놓아 올바른 대답을 만듭니다.',
    '7 minutes to answer a real-life situation.': '실생활 상황에 7분 안에 답장합니다.',
    '10 minutes to add your view to a class forum.': '수업 게시판에 10분 안에 의견을 씁니다.',
    'Repeat 7 sentences that get longer.': '점점 길어지는 7문장을 따라 말합니다.',
    'Answer 4 questions, about 45 seconds each.': '4개 질문에 각각 약 45초 동안 답합니다.',
    'All three task types in order, about 25 minutes. Estimated band at the end.': '세 가지 과제를 순서대로, 약 25분. 마지막에 예상 밴드.',
    'All four task types, each recording plays once. Estimated band at the end.': '네 가지 과제, 녹음은 한 번만 재생. 마지막에 예상 밴드.',
    'A 15-minute mix of Reading and Listening with a rough band for each.': '읽기와 듣기 15분 혼합 테스트, 영역별 대략적인 밴드.',

    // Task screen
    '◀ Previous': '◀ 이전', 'Next set ▶': '다음 세트 ▶', 'Check answers': '정답 확인', 'Check': '확인',
    '✨ New set from Claude': '✨ Claude로 새 세트 만들기', 'Score in Claude ↗': 'Claude로 채점 ↗', 'Ask Claude why ↗': 'Claude에게 이유 묻기 ↗',
    'Score my writing with Claude': 'Claude로 내 글 채점하기', 'Show model answer': '모범 답안 보기', '📝 Answer template': '📝 답안 틀',
    'Insert template': '틀 넣기', '📄 Passage': '📄 지문', 'Transcript': '대본',
    '▶ Play audio': '▶ 오디오 재생', '▶ Play': '▶ 재생', '▶ Play the recording': '▶ 녹음 재생', '▶ Play the recording (once)': '▶ 녹음 재생 (한 번만)',
    '▶ Start the talk (plays once)': '▶ 강의 시작 (한 번만 재생)', '↺ 5s': '↺ 5초',
    'Questions appear after the audio ends.': '오디오가 끝나면 문제가 나타납니다.',
    'Questions appear after the recording ends.': '녹음이 끝나면 문제가 나타납니다.',
    'Show questions now': '지금 문제 보기', 'Tip: try answering before you read the transcript.': '팁: 대본을 보기 전에 먼저 답해 보세요.',
    'Done skimming': '훑어보기 끝', 'Start listening': '듣기 시작', "I've finished listening": '다 들었어요', 'Check my notes': '노트 확인',
    'Start interview': '인터뷰 시작', 'Start speaking': '말하기 시작', 'Start practicing': '연습 시작',
    'Timer starts when you begin typing': '입력을 시작하면 타이머가 시작됩니다', 'Target: 100+ words': '목표: 100단어 이상',
    'Signal word guide': '연결어 안내', 'How to skim:': '훑어 읽는 법:', 'Which kind of clue helped?': '어떤 단서가 도움이 되었나요?',
    'Part 1. Choose the signal word that fits': '1부. 알맞은 연결어 고르기', 'Part 2. Predict what comes next': '2부. 다음 내용 예측하기',
    'Choose the best response.': '가장 알맞은 응답을 고르세요.', 'Choose an answer first.': '먼저 답을 고르세요.',
    'Correct': '정답', 'Not yet': '아직이에요', 'It will come back tomorrow.': '내일 다시 나옵니다.',
    'Cleared from your review list. 🎉': '복습 목록에서 지웠어요. 🎉', 'See results': '결과 보기', 'Next ▶': '다음 ▶',
    'Added to your mistake review. It comes back tomorrow.': '오답 복습에 추가되었습니다. 내일 다시 나옵니다.',
    'Practice more': '더 연습하기', 'All correct.': '모두 정답입니다.',
    'No mistakes are due for review. Nice work.': '오늘 복습할 오답이 없습니다. 잘했어요.',
    'definition': '정의', 'contrast': '대조', 'synonym': '동의어', 'example': '예시', 'general sense': '문장 전체 의미',
    'addition': '추가', 'cause': '원인', 'concession': '양보', 'time': '시간', 'result': '결과', 'or': '또는',
    'What are you listening to? (optional)': '무엇을 듣고 있나요? (선택)', 'Use real speakers.': '실제 화자로 연습하세요.',
    'You can check after the talk ends.': '강의가 끝나면 확인할 수 있습니다.', 'Short phrases, not full sentences': '완전한 문장 말고 짧은 구로',
    '8 words or fewer': '8단어 이하', 'You have 45 seconds': '45초가 주어집니다', 'You will hear it once': '한 번만 들을 수 있습니다',
    'Guided notes.': '빈칸 노트.', 'One note per chunk.': '한 부분씩 노트하기.', 'Listen once.': '한 번만 들으세요.',


    // Strategy notes and templates
    'An explanation is coming. Useful for "why" questions.': '이유 설명이 이어집니다. "why" 문제에 유용합니다.',
    'An effect or conclusion is coming. Useful for inference questions.': '결과나 결론이 이어집니다. 추론 문제에 유용합니다.',
    'A specific case of the idea just stated. If you understood the idea, you can read examples quickly.': '방금 말한 생각의 구체적인 예입니다. 생각을 이해했다면 예시는 빠르게 읽어도 됩니다.',
    'More of the same kind of point.': '같은 종류의 내용이 더 나옵니다.',
    'Steps or history in order.': '단계나 역사가 순서대로 나옵니다.',
    "The next idea goes against the last one. The writer's main point often follows.": '다음 내용은 앞 내용과 반대입니다. 글쓴이의 요점이 뒤따르는 경우가 많습니다.',
    'The writer admits one point, then makes a stronger one after the comma.': '글쓴이가 한 가지를 인정한 뒤 쉼표 뒤에서 더 강한 주장을 합니다.',
    'Strong readers guess the next idea from the signal word before they read it.': '잘 읽는 사람은 다음 내용을 읽기 전에 연결어로 미리 짐작합니다.',
    'Cover all three points in order: missing one costs the most.': '세 가지 요점을 순서대로 모두 다루세요. 하나를 빠뜨리면 감점이 가장 큽니다.',
    'Match the tone to the reader: formal for a professor or a company, friendly for a classmate.': '읽는 사람에 맞는 어조를 쓰세요. 교수나 회사에는 격식 있게, 친구에게는 친근하게.',
    'Aim for 100 to 150 words and keep the last minute to proofread.': '100~150단어를 목표로 하고 마지막 1분은 검토에 쓰세요.',
    "Add an idea your classmates didn't mention; repeating them adds little.": '다른 학생이 말하지 않은 생각을 더하세요. 반복은 도움이 거의 안 됩니다.',
    'One clear, specific example beats several vague ones.': '분명하고 구체적인 예시 하나가 막연한 예시 여러 개보다 낫습니다.',
    'Aim for 100 to 140 words.': '100~140단어를 목표로 하세요.',
    'Start speaking within two or three seconds.': '2~3초 안에 말하기 시작하세요.',
    "Don't memorize whole answers; use the structure and speak naturally.": '답 전체를 외우지 말고 구조를 활용해 자연스럽게 말하세요.',
    'About 80 to 110 words fills 45 seconds. If you make a mistake, keep going.': '45초는 약 80~110단어입니다. 실수해도 계속 말하세요.',
    'Self-check: did you cover every point, use a clear opening and closing, connect your ideas with transitions, and proofread for verb tense and articles?': '자가 점검: 모든 요점을 다뤘나요? 시작과 끝이 분명한가요? 연결어로 생각을 이었나요? 동사 시제와 관사를 검토했나요?',
    'Answer each question as soon as it ends. You have about 45 seconds per answer.': '질문이 끝나면 바로 답하세요. 답변마다 약 45초가 있습니다.',
    'Study a sublist below to add words to your review. · 0 known': '아래 서브리스트를 공부하면 복습 목록에 단어가 추가됩니다. · 0개 암기',
    'Install app': '앱 설치', 'Fill in the missing letters.': '빠진 철자를 채우세요.',

    // Practice tests
    'Start the test': '시험 시작', 'Finish test': '시험 끝내기', 'Next part ▶': '다음 파트 ▶', 'Next part': '다음 파트',
    'All answered': '모두 답함', 'Take another test': '다른 모의고사 보기', 'Take it again': '다시 보기', 'Back to Home': '홈으로',
    'Back to Reading': '읽기로 돌아가기', 'Back to Listening': '듣기로 돌아가기',
    "You can't come back to this part. Continue anyway?": '이 파트로 다시 돌아올 수 없습니다. 계속할까요?',
    'minutes': '분', 'By question type': '문제 유형별', 'By task type': '과제 유형별', 'Review every question': '모든 문제 다시 보기',
    'Use headphones, and keep the screen on. Note-taking on paper is allowed, like the real test.': '헤드폰을 사용하고 화면을 켜 두세요. 실제 시험처럼 종이에 노트할 수 있습니다.',
    'The real test is adaptive: its second half gets easier or harder depending on the first. This practice test uses a fixed mix, so treat the band as a rough estimate.': '실제 시험은 적응형이라 앞부분 결과에 따라 뒷부분이 쉬워지거나 어려워집니다. 이 모의고사는 고정된 구성이므로 밴드는 대략적인 추정으로 보세요.',
    'A rough practice estimate on the 1 to 6 scale, not an official score. Real bands come from ETS\'s adaptive test.': '1~6점 척도의 대략적인 연습 추정치이며 공식 점수가 아닙니다. 실제 밴드는 ETS의 적응형 시험에서 나옵니다.',
    'Set a target band and your test date in Settings to see how far you have to go.': '설정에서 목표 밴드와 시험 날짜를 정하면 목표까지 얼마나 남았는지 볼 수 있습니다.',
    "Time's up. Your test has been submitted.": '시간이 끝나 시험이 제출되었습니다.',

    // Question types and tips
    'Main idea': '중심 내용', 'Detail': '세부 정보', 'Vocabulary': '어휘', 'Inference': '추론', 'Purpose': '의도·목적',
    'NOT / EXCEPT': '불일치 (NOT / EXCEPT)', 'Attitude': '태도', 'Locating info': '정보 위치 찾기', 'Best response': '알맞은 응답',
    'Predicting next': '다음 내용 예측', 'Word completion': '단어 완성',
    'Ask what the whole text is about. Wrong options are often true details that are too narrow.': '글 전체가 무엇에 관한 것인지 생각하세요. 오답은 맞는 내용이지만 너무 좁은 세부 사항인 경우가 많습니다.',
    'Find the exact spot in the text. The right option usually says the same thing in different words.': '본문에서 정확한 위치를 찾으세요. 정답은 보통 같은 내용을 다른 말로 표현합니다.',
    'Reread the sentence with each option in place of the word. Keep the one that keeps the meaning.': '각 선택지를 단어 자리에 넣어 문장을 다시 읽고, 의미가 유지되는 것을 고르세요.',
    "The answer isn't stated, but it must follow from what is. Reject options that go further than the text.": '답이 직접 나오지는 않지만 본문 내용에서 반드시 따라 나와야 합니다. 본문보다 지나친 선택지는 버리세요.',
    'Ask why the writer or speaker includes this point: as an example, a contrast, or support for a claim.': '글쓴이나 화자가 왜 이 내용을 넣었는지 생각하세요: 예시, 대조, 주장의 근거인가요?',
    "Check each option against the text. Three are there; the answer is the one that isn't.": '각 선택지를 본문과 대조하세요. 세 개는 본문에 있고, 없는 하나가 정답입니다.',
    'Listen for opinion words and tone: praise, doubt ("I\'m not convinced"), or a hedge ("in some cases").': '의견을 나타내는 말과 어조에 주목하세요: 칭찬, 의심("I\'m not convinced"), 단서 달기("in some cases").',
    'Use the first sentence of each paragraph to decide where a topic is discussed.': '각 단락의 첫 문장으로 어떤 주제가 어디서 다뤄지는지 판단하세요.',
    "Pick the reply that fits the speaker's purpose, not one that just repeats their words.": '화자의 말을 반복만 하는 대답이 아니라 화자의 의도에 맞는 대답을 고르세요.',
    'Transition words signal what comes next: a contrast, an example, or a result.': '연결어는 다음에 올 내용(대조, 예시, 결과)을 알려 줍니다.',
    'Use the grammar around the blank (article, verb form, plural) as well as the meaning.': '의미뿐 아니라 빈칸 주변의 문법(관사, 동사 형태, 복수형)도 이용하세요.',

    // Progress
    'sets this week': '이번 주 세트', 'days practiced in the last 30': '최근 30일 중 공부한 날', 'No scores yet': '아직 점수 없음',
    'Each line shows your last 12 scores for a task. The dotted line marks 80%.': '각 줄은 과제별 최근 12회 점수입니다. 점선은 80%입니다.',
    'Your last 40 answers of each type, weakest first. Tap one to practice it.': '유형별 최근 40개 답변 기준, 약한 순서입니다. 눌러서 연습하세요.',
    'Check a few Reading or Listening sets and your accuracy by question type (main idea, detail, inference, and more) shows up here.': '읽기나 듣기 세트를 몇 개 풀면 문제 유형별(중심 내용, 세부 정보, 추론 등) 정답률이 여기에 나타납니다.',

    // Words
    'How to practice': '연습 방법', 'Sublists': '서브리스트', 'known / total': '암기 / 전체', 'Nothing due today': '오늘 복습할 단어 없음',
    'Meaning → type the word': '뜻 → 단어 입력', 'Sentence → type the missing word': '문장 → 빠진 단어 입력',
    '🔊 Hear it → type the word': '🔊 듣고 → 단어 입력', 'Word → recall the meaning': '단어 → 뜻 떠올리기',
    '▶ Study': '▶ 공부하기', '👀 Preview': '👀 미리 보기',
    '570 words in 10 sublists, with Korean meanings and example sentences. Words you miss come back sooner; words you know come back less often.': '10개 서브리스트, 570개 단어와 한국어 뜻, 예문. 틀린 단어는 더 빨리, 아는 단어는 더 늦게 다시 나옵니다.',

    // Settings
    'Your goal': '나의 목표', 'Test date': '시험 날짜', 'None': '없음',
    'The test reports each section on a 1 to 6 band scale. Check the score your university or program asks for.': '시험은 각 섹션을 1~6 밴드로 보고합니다. 지원하는 대학이나 프로그램의 요구 점수를 확인하세요.',
    'Text size for passages and questions': '지문과 문제 글자 크기',
    'Show task instructions in Korean too (과제 설명을 한국어로도 보기)': '영어 모드에서도 과제 설명을 한국어로 보기',
    'Speaking speed of the audio': '오디오 말하기 속도', 'Slower': '느리게', 'Natural': '보통', 'Test pace': '시험 속도',
    'Recorded voices': '녹음된 음성', 'Use recorded studio voices when available. New sets from Claude use your phone\'s voices.': '가능하면 스튜디오 녹음 음성을 사용합니다. Claude로 만든 새 세트는 휴대폰 음성을 사용합니다.',
    'Save all audio for offline use': '오프라인용으로 모든 오디오 저장', 'Phone voices (used when there\'s no recording)': '휴대폰 음성 (녹음이 없을 때 사용)',
    'Speaker 1': '화자 1', 'Speaker 2': '화자 2', '🔊 Hear a sample conversation': '🔊 샘플 대화 듣기',
    'Exam mode: each listening audio plays only once, like the real test.': '시험 모드: 실제 시험처럼 듣기 오디오를 한 번만 재생합니다.',
    'Vibrate briefly when answers are checked.': '정답 확인 시 짧게 진동합니다.',
    'Claude features (optional)': 'Claude 기능 (선택)', 'Claude features are off.': 'Claude 기능이 꺼져 있습니다.', 'Claude features are on.': 'Claude 기능이 켜져 있습니다.',
    "Add short Korean notes to Claude's feedback.": 'Claude 피드백에 짧은 한국어 설명을 추가합니다.',
    'Backup and restore': '백업 및 복원', '⬇ Save backup': '⬇ 백업 저장', '⬆ Restore from file': '⬆ 파일에서 복원',
    'Show the welcome guide': '시작 안내 다시 보기', 'Clear my progress': '학습 기록 지우기', 'Tap again to clear all scores': '한 번 더 누르면 모든 점수가 지워집니다',
    'Progress cleared': '학습 기록을 지웠습니다',
    'Speech-to-text in the speaking tasks needs an internet connection and works best in Chrome. Your progress is saved on this device.': '말하기 과제의 음성 인식은 인터넷 연결이 필요하며 Chrome에서 가장 잘 작동합니다. 학습 기록은 이 기기에 저장됩니다.',
    'New sets and scoring for writing, speaking, and notes need your own Anthropic API key (from console.anthropic.com). It\'s saved only on this device and sent only to Anthropic. Usage is billed to your Anthropic account. Leave it empty to turn these features off.': '쓰기, 말하기, 노트의 새 세트와 채점에는 본인의 Anthropic API 키(console.anthropic.com)가 필요합니다. 키는 이 기기에만 저장되고 Anthropic에만 전송됩니다. 사용료는 본인 Anthropic 계정에 청구됩니다. 비워 두면 이 기능이 꺼집니다.',
    'No English voices found yet. If this stays empty, try reloading the page.': '아직 영어 음성을 찾지 못했습니다. 계속 비어 있으면 페이지를 새로고침하세요.',

    // Welcome guide
    'Practice the whole TOEFL': 'TOEFL 전체를 연습하세요', 'Install it on your phone': '휴대폰에 설치하기', 'Save the audio for offline use': '오프라인용 오디오 저장',
    'Save audio now': '지금 오디오 저장', 'You can do this later in Settings (⚙️).': '나중에 설정(⚙️)에서도 할 수 있습니다.',
    'Show task instructions in Korean too': '과제 설명을 한국어로도 보기',
    'Listening tasks use recorded voices. Save them once on Wi-Fi (about 5 to 10 MB) so they play without internet.': '듣기 과제는 녹음된 음성을 사용합니다. Wi-Fi에서 한 번 저장해 두면(약 5~10MB) 인터넷 없이 재생됩니다.'
  };
  // Whole elements whose text is split by bold words (matched on full text).
  const KO_HTML = {

    "Don't stop at an unknown word. Look around it for a clue: a definition (meaning, that is), a synonym (or), a contrast (unlike, although, rather than), examples (such as, for example), or the general sense of the sentence.":
      '<b>모르는 단어에서 멈추지 마세요.</b> 주변에서 단서를 찾으세요: 정의(<i>meaning, that is</i>), 동의어(<i>or</i>), 대조(<i>unlike, although, rather than</i>), 예시(<i>such as, for example</i>), 또는 문장 전체의 의미.',
    "One note per chunk. You'll hear the talk in 5 short pieces, each played once. After each piece, write its key idea in 8 words or fewer. This trains you to choose what matters and skip the rest.":
      '<b>한 부분씩 노트하기.</b> 강의를 5개의 짧은 부분으로 나누어 각각 한 번씩 듣습니다. 각 부분이 끝나면 핵심 내용을 <b>8단어 이하</b>로 적으세요. 중요한 것을 고르고 나머지는 건너뛰는 연습입니다.',
    'Use real speakers. Real voices carry tone (sarcasm, doubt, excitement) that synthetic voices can\'t. Open a 3 to 8 minute lecture or podcast in another tab or on another device. Good sources include TED-Ed, university lecture channels, and science podcasts. Press start, listen once without pausing, and take notes here.':
      '<b>실제 화자로 연습하세요.</b> 실제 목소리에는 컴퓨터 음성이 표현하지 못하는 어조(비꼼, 의심, 흥분)가 담겨 있습니다. 다른 탭이나 기기에서 3~8분 길이의 강의나 팟캐스트를 여세요. TED-Ed, 대학 강의 채널, 과학 팟캐스트가 좋습니다. 시작을 누르고 멈추지 않고 <b>한 번만</b> 들으며 여기에 노트하세요.',
    "How to skim: read the title, the first sentence of each paragraph, and the last sentence of the introduction and conclusion. Ask: what is each paragraph's job?":
      '<b>훑어 읽는 법:</b> 제목, 각 단락의 첫 문장, 서론과 결론의 마지막 문장을 읽으세요. 각 단락의 역할이 무엇인지 생각하세요.',
    'Guided notes. Read the outline first, so you know what to listen for. Then start the talk and fill each gap as you hear it. One or two words is enough. The talk plays once.':
      '<b>빈칸 노트.</b> 먼저 개요를 읽고 무엇을 들어야 할지 파악하세요. 그다음 강의를 시작하고 들리는 대로 빈칸을 채우세요. 한두 단어면 충분합니다. 강의는 한 번만 재생됩니다.',
    "Listen once. Write the topic, the speaker's view, the main points, and any example or term the speaker stresses. Use short phrases, not full sentences.":
      '<b>한 번만 들으세요.</b> 주제, 화자의 견해, 요점, 화자가 강조하는 예시나 용어를 적으세요. 완전한 문장 말고 짧은 구로 쓰세요.',
    'Use the tabs at the bottom: Reading, Listening, Writing, and Speaking. Each has the real test tasks, and Reading and Listening also have strategy drills. Words has the Academic Word List with spaced review.':
      '아래 탭에서 <b>읽기</b>, <b>듣기</b>, <b>쓰기</b>, <b>말하기</b>를 고르세요. 모두 실제 시험 과제가 있고, 읽기와 듣기에는 전략 연습도 있습니다. <b>단어</b> 탭에는 간격 반복 복습이 되는 Academic Word List가 있습니다.',
    'New here? Start with the Level check on Home: about 15 minutes, with a rough Reading and Listening band. Short on time? Tap Daily 15 for a 15-minute mix of everything.':
      '처음이라면 홈의 <b>레벨 테스트</b>부터 해 보세요. 약 15분이면 읽기와 듣기의 대략적인 밴드를 알 수 있습니다. 시간이 없다면 <b>데일리 15</b>로 15분 동안 모든 영역을 연습하세요.',
    'In Chrome, tap ⋮ in the top corner, then Install app (or Add to Home screen). The app then opens like any other app and works offline.':
      'Chrome에서 위쪽 구석의 <b>⋮</b>를 누른 뒤 <b>앱 설치</b>(또는 <b>홈 화면에 추가</b>)를 누르세요. 다른 앱처럼 열리고 오프라인에서도 작동합니다.',
    'Install it as an app: in Chrome, tap ⋮, then Install app. It then works offline.':
      '<b>앱으로 설치하기:</b> Chrome에서 ⋮를 누른 뒤 <b>앱 설치</b>를 누르세요. 오프라인에서도 작동합니다.',
    'A short mix of the main Reading and Listening tasks, under a time limit. Each recording plays once. At the end you get a rough band for Reading and for Listening, and the question types to work on first.':
      '주요 읽기·듣기 과제를 시간 제한 안에 짧게 풉니다. 녹음은 <b>한 번만</b> 재생됩니다. 마지막에 읽기와 듣기의 대략적인 밴드와 먼저 보완할 문제 유형을 알려 줍니다.',
    "A full Reading section in test order, under a time limit. You can't go back to earlier parts. Your score, an estimated band, and explanations for every question come at the end.":
      '실제 시험 순서대로 읽기 섹션 전체를 시간 제한 안에 풉니다. 앞 파트로 돌아갈 수 없습니다. 점수, 예상 밴드, 모든 문제의 해설은 마지막에 나옵니다.',
    "A full Listening section in test order, under a time limit. Each recording plays once, and questions appear after it ends. You can't go back to earlier parts. Your score, an estimated band, and explanations for every question come at the end.":
      '실제 시험 순서대로 듣기 섹션 전체를 시간 제한 안에 풉니다. 녹음은 <b>한 번만</b> 재생되고 끝나면 문제가 나타납니다. 앞 파트로 돌아갈 수 없습니다. 점수, 예상 밴드, 모든 문제의 해설은 마지막에 나옵니다.',
    'Rough practice estimates on the 1 to 6 scale, from a short set of questions, not official scores. For a closer estimate, take the full Reading and Listening practice tests. Writing and Speaking need a rater, so use Score in Claude on those tasks.':
      '적은 문항으로 낸 1~6점 척도의 대략적인 추정치이며 공식 점수가 아닙니다. 더 정확한 추정은 읽기·듣기 전체 모의고사를 보세요. 쓰기와 말하기는 채점자가 필요하므로 해당 과제에서 <b>Claude로 채점</b>을 이용하세요.'
  };
  // Labels built from numbers.
  const KO_RE = [
    [/^Good morning 👋$/, '좋은 아침이에요 👋'], [/^Good afternoon 👋$/, '좋은 오후예요 👋'], [/^Good evening 👋$/, '좋은 저녁이에요 👋'],
    [/^Set (\d+) of (\d+)$/, '세트 $1 / $2'], [/^Part (\d+) of (\d+)$/, '파트 $1 / $2'],
    [/^(.+) · Part (\d+) of (\d+)$/, (m, a, b, c) => `${tr(a)} · 파트 ${b} / ${c}`],
    [/^(.+) results$/, (m, a) => `${tr(a)} 결과`],
    [/^(\d+)\/(\d+) known$/, '$1/$2 암기'], [/^(\d+)% average$/, '평균 $1%'], [/^(\d+) sets? done$/, '$1세트 완료'],
    [/^(\d+) done, (\d+)%$/, '$1회 완료, $2%'], [/^(\d+) done$/, '$1회 완료'],
    [/^(\d+) days? to your test$/, '시험까지 $1일'], [/^(\d+(?:\.\d)?) to go$/, '$1 남음'],
    [/^about ([A-C][12])$/, '약 $1'], [/^Sublist (\d+)$/, '서브리스트 $1'],
    [/^questions in (\d+) parts$/, '문항 ($1개 파트)'], [/^▶ Play (\d+)$/, '▶ $1번 재생'], [/^▶ Play (\d+) \(once\)$/, '▶ $1번 재생 (한 번만)'],
    [/^(\d+) recent scores?$/, '최근 점수 $1개'], [/^(\d+) unanswered$/, '$1개 미응답'], [/^(\d+) q$/, '$1문항'],
    [/^(\d+) questions? unanswered$/, '미응답 문제 $1개'],
    [/^Level check · about 15 min(.*)$/, (m, a) => `레벨 테스트 · 약 15분${a.replace(/(\d+) days? to your test/, '시험까지 $1일')}`],
    [/^Your level · rough estimate(?: · goal (\d\.\d))?$/, (m, g) => `내 레벨 · 대략적 추정${g ? ` · 목표 ${g}` : ''}`],
    [/^Daily 15 · 🔥 (\d+)-day streak$/, '데일리 15 · 🔥 $1일 연속'],
    [/^(.+) questions · (\d+)% right$/, (m, a, b) => `${tr(a)} 문제 · 정답률 ${b}%`],
    [/^Continue: step (\d+) of (\d+)$/, '이어서 하기: $1 / $2단계'],
    [/^(\d+) words?$/, '$1단어'], [/^(\d+) recorded clips available\.$/, '녹음 클립 $1개 사용 가능.'],
    [/^Your progress is stored only on this device\. Save a backup file before changing phones or clearing browser data\. Your API key is never included\. Last backup: (.+)\.$/, (m, d) => `학습 기록은 이 기기에만 저장됩니다. 휴대폰을 바꾸거나 브라우저 데이터를 지우기 전에 백업 파일을 저장하세요. API 키는 포함되지 않습니다. 마지막 백업: ${d === 'never' ? '없음' : d}.`],
    [/^(\d+) words? due for review$/, '복습할 단어 $1개'], [/^(\d+) missed questions? to review$/, '복습할 오답 $1개'],
    [/^Mistake review · (\d+)\/(\d+)$/, '오답 복습 · $1/$2'],
    [/^Band 1 to 6, from your practice tests \(latest (.+)\)\. Writing and Speaking need a rater: use Score in Claude on those tasks\.$/, '1~6 밴드, 연습 시험 기준 (최근 $1). 쓰기와 말하기는 채점자가 필요하니 해당 과제에서 Claude로 채점을 이용하세요.'],
    [/^Your goal is band (\d\.\d)\.(.*)$/, (m, g, rest) => `목표 밴드는 ${g}입니다.${rest.replace(/Reading/g, '읽기').replace(/Listening/g, '듣기').replace(/goal reached ✓/g, '목표 달성 ✓').replace(/(\d\.\d) to go/g, '$1 남음')}`],
    [/^Reading, about ([A-C][12]) \((\d+)\/(\d+)\)$/, '읽기, 약 $1 ($2/$3)'], [/^Listening, about ([A-C][12]) \((\d+)\/(\d+)\)$/, '듣기, 약 $1 ($2/$3)'],
    [/^estimated band \(about ([A-C][12])\)$/, '예상 밴드 (약 $1)'], [/^time used of (.+)$/, '전체 $1 중 사용 시간']
  ];
  // Never translate inside test content.
  const SKIP = '.doc,.passage,fieldset.q legend,label.opt,.transcript,.ctw,.vic-text,.skim-box,.post,.model,textarea,input,.w-term,.w-def,.w-ex,.w-prompt,.trans-text,.bubble,.tile,.corr,.why,.ctw-chips,[lang=ko]:not(html),.deck-sub,.skeleton,.answer-line,.live,.heard,.diff,.tmpl-phrases,.tmpl-steps,option,select,.prompt-box,script,style,.notranslate';
  const norm = s => s.replace(/\s+/g, ' ').trim();
  function tr(s) {
    const k = norm(s);
    if (KO[k]) return KO[k];
    for (const [re, to] of KO_RE) if (re.test(k)) return k.replace(re, to);
    return null;
  }
  const textOrig = new Map(), htmlOrig = new Map();
  let on = false, busy = false;
  function translate(root) {
    if (!on || !root) return;
    busy = true;
    // Elements whose sentence is split by <b> tags.
    const sel = 'p, .hc-sub, .task-how, .strat-tip, .notice > span';
    [...(root.matches && root.matches(sel) ? [root] : []), ...root.querySelectorAll(sel)].forEach(el => {
      if (htmlOrig.has(el) || el.closest(SKIP)) return;
      const ko = KO_HTML[norm(el.textContent)];
      if (ko) { htmlOrig.set(el, el.innerHTML); el.innerHTML = ko; }
    });
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (w.nextNode()) nodes.push(w.currentNode);
    nodes.forEach(n => {
      if (textOrig.has(n)) return;
      const v = n.nodeValue; if (!/[A-Za-z]/.test(v)) return;
      const p = n.parentElement; if (!p || p.closest(SKIP)) return;
      const t = tr(v); if (t == null) return;
      textOrig.set(n, v);
      n.nodeValue = v.replace(norm(v), t);
    });
    // Accessible names and placeholders
    [...(root.hasAttribute && root.hasAttribute('aria-label') ? [root] : []), ...root.querySelectorAll('[aria-label]')].forEach(el => { const t = tr(el.getAttribute('aria-label')); if (t) { el.dataset.enLabel = el.dataset.enLabel || el.getAttribute('aria-label'); el.setAttribute('aria-label', t); } });
    busy = false;
  }
  function restore() {
    busy = true;
    htmlOrig.forEach((h, el) => { if (el.isConnected) el.innerHTML = h; });
    textOrig.forEach((v, n) => { if (n.isConnected) n.nodeValue = v; });
    htmlOrig.clear(); textOrig.clear();
    document.querySelectorAll('[data-en-label]').forEach(el => { el.setAttribute('aria-label', el.dataset.enLabel); delete el.dataset.enLabel; });
    busy = false;
  }
  // Translate only what changed (a new screen, a toast, a timer tick).
  let pending = new Set(), queued = false;
  const obs = new MutationObserver(records => {
    if (!on || busy) return;
    records.forEach(r => {
      if (r.type === 'characterData') { if (r.target.parentElement) pending.add(r.target.parentElement); }
      else r.addedNodes.forEach(n => pending.add(n.nodeType === 1 ? n : n.parentElement));
    });
    if (queued) return;
    queued = true;
    Promise.resolve().then(() => {
      queued = false;
      const roots = [...pending].filter(el => el && el.isConnected); pending = new Set();
      roots.forEach(el => { if (!roots.some(o => o !== el && o.contains(el))) translate(el); });
    });
  });
  window.I18N = {
    get on() { return on; },
    set(lang) {
      on = lang === 'ko';
      document.documentElement.lang = on ? 'ko' : 'en';
      if (on) { translate(document.body); obs.observe(document.body, { childList: true, subtree: true, characterData: true }); }
      else { obs.disconnect(); restore(); }
      // Forget nodes that have left the page.
      textOrig.forEach((v, n) => { if (!n.isConnected) textOrig.delete(n); });
      htmlOrig.forEach((v, el) => { if (!el.isConnected) htmlOrig.delete(el); });
    },
    tr: s => (on && tr(s)) || s,
    add(map) { Object.entries(map).forEach(([en, ko]) => { const k = norm(en.replace(/<[^>]+>/g, '')); if (/<[^>]+>/.test(en)) KO_HTML[k] = ko; else KO[k] = ko; }); }
  };
  // Forget nodes that have left the page, now and then.
  document.addEventListener('visibilitychange', () => { textOrig.forEach((v, n) => { if (!n.isConnected) textOrig.delete(n); }); htmlOrig.forEach((v, el) => { if (!el.isConnected) htmlOrig.delete(el); }); });
})();
