const DATA = {
ctw: [
  { title: "Bees and pollination", text: "Bees play an essential role in many ecosystems. As they [move] from flower [to] flower, they [carry] pollen that [allows] plants to [produce] seeds and [fruit]. Many of [the] crops that [humans] depend on [would] produce far [less] food without [this] help. Scientists are therefore concerned about recent declines in bee populations." },
  { title: "The rise of public libraries", text: "Public libraries became common in the nineteenth century. Before [that] time, most [books] were expensive, [and] only wealthy [families] could afford [large] collections. Free [libraries] gave ordinary [people] access to [knowledge] that had [once] been reserved [for] a small elite. Today, many libraries also offer digital resources and community programs." },
  { title: "How glaciers shape land", text: "Glaciers are large masses of ice that move slowly over land. They [form] when snow [builds] up over [many] years and [is] compressed into [solid] ice. As [they] move, glaciers [shape] the landscape [by] carving valleys [and] pushing rocks. Studying glaciers helps scientists understand climates of the distant past." }
],
daily: [
  { title: "Pool schedule notice", kind: "Notice", text: "CAMPUS RECREATION CENTER\nPool Schedule Change\n\nStarting Monday, March 9, the indoor pool will close at 7:00 p.m. instead of 9:00 p.m. on weekdays while the heating system is replaced. Weekend hours (10:00 a.m. to 6:00 p.m.) are not affected.\n\nLap swimmers who usually come in the evening may use the pool at the Westfield Community Center at no charge by showing a valid student ID. The work is expected to finish by April 3. We apologize for the inconvenience.",
    questions: [
      { q: "Why is the pool schedule changing?", options: ["A heating system is being replaced", "More swimming classes are being added", "There are not enough lifeguards", "The pool is being cleaned"], answer: 0, why: "The notice says hours change \"while the heating system is replaced.\"" },
      { q: "What can students who usually swim in the evening do?", options: ["Get a refund for their membership", "Swim at another center for free", "Reserve a weekend time slot", "Swim until 9:00 p.m. on Saturdays"], answer: 1, why: "Evening swimmers can use the Westfield pool \"at no charge,\" which means free." },
      { q: "What is true about the weekend hours?", options: ["They will be extended", "They will start later", "They will stay the same", "They will end on April 3"], answer: 2, why: "\"Weekend hours \u2026 are not affected,\" so they stay the same." }
    ] },
  { title: "Room inspection email", kind: "Email", text: "From: Dana Okafor, Housing Office\nTo: Maple Hall residents\nSubject: Room inspections next week\n\nHi everyone,\n\nAs part of our regular safety checks, staff will inspect all rooms in Maple Hall on Wednesday, October 14, between 10 a.m. and 2 p.m. You do not need to be present, but please make sure the area around your window and heater is clear and that no extension cords are plugged into each other. Candles and hot plates are not permitted and will be removed if found.\n\nIf you have a maintenance issue you would like us to look at, reply to this email by Monday and we'll check it during the visit.\n\nThanks,\nDana",
    questions: [
      { q: "What is the main purpose of the email?", options: ["To announce new rules for guests", "To inform residents about an upcoming safety check", "To ask residents to move to another building", "To explain how to pay for repairs"], answer: 1, why: "Staff will inspect all rooms \"as part of our regular safety checks.\" The other options are never mentioned." },
      { q: "What are residents asked to do?", options: ["Be in their rooms during the inspection", "Buy new extension cords", "Keep the area near the window and heater clear", "Remove all electrical devices"], answer: 2, why: "Residents should keep \"the area around your window and heater\" clear. They don't need to be present." },
      { q: "Why might a resident reply to the email?", options: ["To report something that needs repair", "To change the inspection date", "To request permission to use candles", "To volunteer to help with inspections"], answer: 0, why: "Residents can reply \"if you have a maintenance issue,\" meaning something that needs repair." }
    ] },
  { title: "Textbooks for sale", kind: "Online post", text: "USED TEXTBOOKS FOR SALE\n\nIntro to Psychology (9th edition), $30\nCalculus: Early Transcendentals, $45, some highlighting in chapters 1 to 3\n\nBoth books are in good condition. I'm graduating in May, so I'd like to sell them before then. I can meet anywhere on campus on Tuesdays or Thursdays after 3 p.m. Text Jordan at 555-0142. Prices are firm.",
    questions: [
      { q: "What is mentioned about the calculus book?", options: ["It is the newest edition", "It has some marks in the early chapters", "It is cheaper than the psychology book", "It is missing several pages"], answer: 1, why: "It has \"some highlighting in chapters 1 to 3.\" Highlighting is a kind of mark." },
      { q: "Why is Jordan selling the books?", options: ["Jordan is changing majors", "Jordan needs money for a trip", "Jordan will graduate soon", "Jordan bought newer editions"], answer: 2, why: "Jordan is \"graduating in May\" and wants to sell them before then." },
      { q: "What does \"Prices are firm\" most likely mean?", options: ["The seller will not lower the prices", "The books are in strong condition", "The prices include delivery", "Payment must be made in cash"], answer: 0, why: "\"Firm\" here means fixed and not open to bargaining. It doesn't describe the books' condition." }
    ] }
],
academic: [
  { title: "The urban heat island effect", paras: [
    "Cities are often several degrees warmer than the surrounding countryside, a phenomenon known as the urban heat island effect. The difference is usually greatest at night. During the day, materials such as asphalt, concrete, and brick absorb large amounts of solar energy. After sunset, these surfaces slowly release the stored heat, keeping city air warm long after rural areas have cooled.",
    "Several features of urban design intensify the effect. Tall buildings trap heat between them and reduce wind speeds that would otherwise carry warm air away. Vegetation, which cools its surroundings by releasing water vapor through its leaves, is relatively scarce in dense city centers. In addition, cars, air conditioners, and factories generate waste heat directly.",
    "The consequences are significant. Higher temperatures increase demand for air conditioning, which in turn raises energy consumption and, in many regions, air pollution from power plants. During heat waves, urban residents, particularly the elderly, face greater health risks than people living in rural areas.",
    "Cities have begun experimenting with solutions. Some have painted roofs white or light gray so that they reflect rather than absorb sunlight. Others have expanded parks and planted trees along streets. Green roofs, covered with soil and plants, provide both insulation and cooling. Although no single strategy eliminates the heat island effect, studies suggest that combining several of them can lower peak urban temperatures noticeably."],
    questions: [
      { q: "The word \"intensify\" in paragraph 2 is closest in meaning to", options: ["strengthen", "reduce", "explain", "delay"], answer: 0, why: "To intensify is to make stronger. Paragraph 2 lists features that make the effect worse." },
      { q: "According to paragraph 1, why is the temperature difference usually greatest at night?", options: ["Rural areas receive more sunlight at night", "City surfaces release heat they stored during the day", "Factories operate mainly at night", "Wind speeds increase in rural areas after sunset"], answer: 1, why: "Surfaces absorb solar energy by day and \"slowly release the stored heat\" after sunset." },
      { q: "Which of the following is NOT mentioned as a cause of higher city temperatures?", options: ["Tall buildings that block wind", "A lack of plants", "Heat produced by machines", "Moisture from nearby rivers"], answer: 3, why: "Paragraph 2 mentions buildings, missing plants, and waste heat from machines. Rivers are never mentioned." },
      { q: "Why does the author mention the elderly in paragraph 3?", options: ["To give an example of a group especially at risk from heat", "To explain why cities use more energy", "To argue that older people should move to rural areas", "To show who designs city buildings"], answer: 0, why: "They are an example of residents who \"face greater health risks\" in heat waves." },
      { q: "What can be inferred about the solutions in paragraph 4?", options: ["Painting roofs is the most effective solution", "They are too expensive for most cities", "They work best when used together", "They have completely solved the problem in some cities"], answer: 2, why: "The last sentence says combining several strategies helps most. No single one is called the best." }
    ] },
  { title: "The invention of standard time", paras: [
    "Before the late nineteenth century, most towns set their clocks by the sun. Noon was the moment the sun reached its highest point in the sky, so a town just a few miles to the west would keep a slightly different time from its neighbor. For centuries this caused few problems, because travel between towns was slow.",
    "The spread of railroads changed this. A train moving quickly across a region passed through dozens of local times, and each railroad company tended to use the time of its own headquarters. Stations sometimes displayed several clocks at once, and printed timetables were confusing for passengers and dangerous for operators, who needed to know exactly where trains on the same track would be.",
    "In 1883, railroads in the United States and Canada adopted a system of standard time zones, each covering a wide band of territory in which all clocks showed the same hour. The following year, delegates at the International Meridian Conference chose Greenwich, England, as the starting point for measuring longitude, which provided a reference for time zones around the world.",
    "Acceptance was not immediate. Some communities objected that the railroads had no right to change the time, and certain cities continued to use local time for years. Over the following decades, however, the convenience of a shared standard became difficult to ignore, and governments gradually made time zones official by law."],
    questions: [
      { q: "The word \"adopted\" in paragraph 3 is closest in meaning to", options: ["rejected", "began using", "designed", "argued about"], answer: 1, why: "To adopt a system is to start using it. The railroads began using time zones." },
      { q: "According to paragraph 1, why did local time cause few problems for centuries?", options: ["Most people did not own clocks", "Towns agreed to use the same noon", "Travel between towns was slow", "The sun was easy to observe everywhere"], answer: 2, why: "It caused few problems \"because travel between towns was slow.\"" },
      { q: "According to paragraph 2, why were train timetables dangerous?", options: ["Operators needed to know exactly where trains were", "Passengers often missed their trains", "Stations had too few clocks", "Trains moved too slowly to follow a schedule"], answer: 0, why: "Operators \"needed to know exactly where trains on the same track would be.\"" },
      { q: "What was the significance of the 1884 conference?", options: ["It created the first railroad", "It established a worldwide reference point for time zones", "It required all cities to follow railroad time", "It ended the use of solar time in England"], answer: 1, why: "Choosing Greenwich gave a reference point \"for time zones around the world.\"" },
      { q: "What can be inferred about the communities described in paragraph 4?", options: ["They had no railroads", "They saw standard time as something imposed on them by companies", "They wanted even more time zones", "They were located near Greenwich"], answer: 1, why: "They \"objected that the railroads had no right to change the time,\" so they saw it as forced on them." }
    ] }
],
respond: [
  { title: "Campus questions, set A", items: [
    { say: "Do you know if the library is open on Sunday?", options: ["I think it opens at noon.", "I returned the book yesterday.", "Yes, it's a big library.", "Sunday was really busy for me."], answer: 0, why: "Only \"It opens at noon\" answers whether it's open. The others reuse \"library\" or \"Sunday\" without answering." },
    { say: "Would you mind if I borrowed your notes from Tuesday's lecture?", options: ["No, I didn't take the bus.", "Sure, I'll email them to you tonight.", "The lecture was on Tuesday.", "I mind it very much, thanks."], answer: 1, why: "\"Would you mind\u2026?\" asks permission, and agreeing to send the notes is the natural reply." },
    { say: "Why didn't you come to the study group last night?", options: ["We study every Wednesday.", "Yes, I came a little early.", "I had to finish a lab report.", "The group has five members."], answer: 2, why: "A \"why\" question needs a reason, and finishing a lab report is one." },
    { say: "The printer on the second floor is out of paper again.", options: ["It's made of recycled paper.", "I printed it on the first try.", "The second floor is quieter.", "Again? I'll let the front desk know."], answer: 3, why: "This reports a problem, so a natural reply reacts and offers help. The others just repeat words." },
    { say: "How long did it take you to finish the reading?", options: ["About two hours.", "I read it in the library.", "Chapters four and five.", "It's due on Friday."], answer: 0, why: "\"How long\" asks for an amount of time, and \"About two hours\" is the only one." }
  ] },
  { title: "Campus questions, set B", items: [
    { say: "Have you decided which elective you're taking next semester?", options: ["The semester starts in August.", "I'm leaning toward photography.", "No, I decided yesterday.", "Electives are worth three credits."], answer: 1, why: "\"Leaning toward photography\" names an elective. \"No, I decided yesterday\" contradicts itself." },
    { say: "Isn't the deadline for the scholarship application this Friday?", options: ["Friday works for lunch.", "The application is two pages long.", "No, they extended it to next week.", "I applied for a part-time job."], answer: 2, why: "The speaker is checking a fact, and the reply corrects it: the deadline moved." },
    { say: "Could you show me how to reserve a study room?", options: ["Sure, it's on the library website. I'll walk you through it.", "The study room was very quiet.", "I reserved my seat on the train.", "Yes, the rooms are on the third floor."], answer: 0, why: "It's a request for help, and only this reply agrees and explains how." },
    { say: "I can't believe how crowded the cafeteria was today.", options: ["The food there is pretty cheap.", "I know, I ended up eating outside.", "It's open until eight.", "I believe you can."], answer: 1, why: "A comment invites a shared reaction. \"I believe you can\" misreads \"I can't believe.\"" },
    { say: "Should we meet before class or after?", options: ["Yes, we should.", "The class is in Room 204.", "I met him after class.", "Before works better for me."], answer: 3, why: "A choice question needs a choice. \"Yes, we should\" doesn't pick one." }
  ] }
],
convo: [
  { title: "Narrowing a paper topic", lines: [
    { s: 1, name: "Student", t: "Hi Professor Lee, do you have a minute? It's about my research paper." },
    { s: 0, name: "Professor", t: "Of course, come in. What's on your mind?" },
    { s: 1, name: "Student", t: "I wanted to write about renewable energy, but when I started searching, I found hundreds of sources. I'm kind of overwhelmed." },
    { s: 0, name: "Professor", t: "That's a common problem. Renewable energy is a huge topic. Is there one part of it that interests you most?" },
    { s: 1, name: "Student", t: "Well, my hometown just installed a lot of solar panels on school buildings." },
    { s: 0, name: "Professor", t: "That's a great starting point. Why not focus on solar panels in public schools? You could look at costs, savings, and how students learn from them." },
    { s: 1, name: "Student", t: "That sounds much more manageable. Should I still use general sources about renewable energy?" },
    { s: 0, name: "Professor", t: "A few, for background. But most of your sources should be specific to your narrower topic. And bring me an outline by next Friday so we can check you're on track." }],
    questions: [
      { q: "What problem does the student have?", options: ["She missed the deadline for her paper", "Her topic is too broad", "She cannot find any sources", "She disagrees with her grade"], answer: 1, why: "She found hundreds of sources and feels overwhelmed; the professor calls the topic \"huge.\"" },
      { q: "What does the professor suggest?", options: ["Changing to a completely different subject", "Interviewing people in her hometown", "Focusing on solar panels in public schools", "Using only general sources"], answer: 2, why: "The professor says, \"Why not focus on solar panels in public schools?\"" },
      { q: "What will the student probably do next?", options: ["Prepare an outline by next Friday", "Visit her hometown", "Start writing the final paper", "Meet with a librarian"], answer: 0, why: "The professor asks for an outline \"by next Friday.\"" }
    ] },
  { title: "Returning a textbook", lines: [
    { s: 0, name: "Student", t: "Hi, I'd like to return this textbook. I dropped the class." },
    { s: 1, name: "Clerk", t: "Okay. Do you have your receipt?" },
    { s: 0, name: "Student", t: "I have it on my phone. Here." },
    { s: 1, name: "Clerk", t: "Thanks. You're still within the full refund period. But I see some writing inside the cover." },
    { s: 0, name: "Student", t: "Oh, that's just my name. I wrote it in pencil." },
    { s: 1, name: "Clerk", t: "If you can erase it, I can give you a full refund. Otherwise it counts as used, and you'd get sixty percent back." },
    { s: 0, name: "Student", t: "I'll erase it right now. Do you have an eraser?" },
    { s: 1, name: "Clerk", t: "Sure, here you go. And since you dropped the class, you might want to check with the registrar about whether you need another course to stay full-time." },
    { s: 0, name: "Student", t: "Good point. I hadn't thought about that." }],
    questions: [
      { q: "Why does the student go to the bookstore?", options: ["To buy a new textbook", "To return a book for a class he dropped", "To ask about a part-time job", "To find a lost receipt"], answer: 1, why: "His first line: he wants to return the book because he dropped the class." },
      { q: "What could prevent the student from getting a full refund?", options: ["He lost his receipt", "The refund period has ended", "His name is written in the book", "The book is damaged"], answer: 2, why: "His name is written inside the cover. Unless he erases it, the book counts as used." },
      { q: "What does the clerk suggest the student do?", options: ["Sell the book online", "Check with the registrar about his course load", "Buy a used copy instead", "Come back next week"], answer: 1, why: "The clerk suggests checking with the registrar about staying full-time." }
    ] }
],
announce: [
  { title: "Science building entrance", lines: [
    { s: 0, name: "Speaker", t: "Good morning, everyone. This is a reminder that the main entrance to the science building will be closed starting tomorrow for repairs to the front steps. Please use the side entrance on Elm Street. If you need an accessible entrance, the ramp at the back of the building near the parking lot remains open. The repairs should take about two weeks. Classes will not be moved, so please allow a few extra minutes to reach your rooms." }],
    questions: [
      { q: "What is the announcement mainly about?", options: ["A change in class locations", "A temporary closure of a building entrance", "A new parking policy", "The opening of a new science building"], answer: 1, why: "The main entrance closes for repairs, and listeners are told which entrances to use instead." },
      { q: "What are listeners advised to do?", options: ["Allow extra time to get to class", "Park behind the building", "Attend classes online", "Report problems with the steps"], answer: 0, why: "Classes are not moving, so people should \"allow a few extra minutes\" to reach their rooms." }
    ] },
  { title: "Midterm date change", lines: [
    { s: 1, name: "Professor", t: "Before you leave, a quick change to the schedule. The midterm exam, which was planned for next Thursday, has been moved to the following Monday because the lecture hall is needed for a university event. The format stays the same: multiple-choice questions and two short essays. I'll hold an extra review session this Friday at four in Room 110. Attendance isn't required, but I strongly recommend it, especially if you missed any classes." }],
    questions: [
      { q: "Why was the exam moved?", options: ["The professor will be away", "Students asked for more time", "The room is needed for another event", "The exam format changed"], answer: 2, why: "The lecture hall \"is needed for a university event.\"" },
      { q: "What does the professor say about the review session?", options: ["It is required for all students", "It is optional but recommended", "It will be held online", "It replaces next Monday's class"], answer: 1, why: "\"Attendance isn't required, but I strongly recommend it\" means optional but recommended." }
    ] }
],
talk: [
  { title: "Do bears really hibernate?", lines: [
    { s: 0, name: "Professor", t: "Today let's talk about how some animals survive the winter. You might assume bears hibernate the same way small mammals do, but biologists actually debate that. True hibernators, like ground squirrels, drop their body temperature close to freezing, and their heart rate falls dramatically. Waking them up takes hours. Bears, on the other hand, only lower their body temperature by a few degrees. They can wake relatively quickly if disturbed, which is why you should never assume a sleeping bear in a den is harmless. Some scientists use the term torpor for this lighter state, while others argue that bears are simply a special kind of hibernator. What everyone agrees on is that bears can go months without eating or drinking, and they recycle waste products in their bodies into proteins. Researchers are studying this ability for clues about treating kidney disease in humans." }],
    questions: [
      { q: "What is the talk mainly about?", options: ["Why bears are dangerous", "How the winter state of bears differs from true hibernation", "How ground squirrels find food in winter", "Treatments for kidney disease"], answer: 1, why: "The talk compares bears' lighter winter state with true hibernation, as in ground squirrels." },
      { q: "What does the professor say about ground squirrels?", options: ["Their body temperature drops close to freezing", "They wake up quickly when disturbed", "They eat throughout the winter", "They are a kind of bear"], answer: 0, why: "True hibernators \"drop their body temperature close to freezing.\"" },
      { q: "Why does the professor mention kidney disease?", options: ["To explain why bears sleep so long", "To show that bears often get sick", "To point out that bear biology may help medical research", "To compare bears with ground squirrels"], answer: 2, why: "Researchers study how bears recycle waste \"for clues about treating kidney disease in humans.\"" }
    ] },
  { title: "Opportunity cost", lines: [
    { s: 1, name: "Professor", t: "In economics, we often talk about opportunity cost. The opportunity cost of a choice is the value of the best alternative you give up. Let's say you have Saturday free. You could work a shift at a café and earn eighty dollars, or you could go to a concert. The ticket is fifty dollars. Many people would say the concert costs fifty dollars. But an economist would say the true cost is one hundred and thirty: the fifty you pay, plus the eighty you gave up by not working. This idea explains some decisions that otherwise seem strange. For example, why do highly paid professionals often hire someone to clean their homes, even though they're perfectly able to do it themselves? Because every hour spent cleaning is an hour not spent earning at a much higher rate." }],
    questions: [
      { q: "How does the professor define opportunity cost?", options: ["The price written on a ticket", "The value of the best alternative that is given up", "The money earned from a part-time job", "The cost of hiring another person"], answer: 1, why: "The definition is \"the value of the best alternative you give up.\"" },
      { q: "According to the professor, what is the true cost of the concert in the example?", options: ["$50", "$80", "$130", "$30"], answer: 2, why: "$50 for the ticket plus the $80 given up by not working = $130." },
      { q: "Why does the professor mention professionals who hire cleaners?", options: ["To show that the concept explains choices about time", "To criticize people who earn high salaries", "To describe a typical weekend job", "To explain how cleaners set their prices"], answer: 0, why: "Hiring a cleaner frees time for better-paid work, so the idea explains choices about time." }
    ] }
],
build: [
  { title: "Everyday replies, set A", items: [
    { context: "Did you finish the lab report?", answer: "I still need to write the conclusion", end: ".", distractor: "already", why: "\"Still\" goes before the main verb: \"I still need to\u2026\". \"Already\" doesn't fit an unfinished task." },
    { context: "Where did you find that book?", answer: "I borrowed it from the library downstairs", end: ".", distractor: "borrow", why: "Past tense \"borrowed\" matches \"Where did you find\u2026?\" \"Borrow\" is the wrong tense." },
    { context: "Why was the meeting canceled?", answer: "The manager had to leave for an emergency", end: ".", distractor: "has", why: "\"Had to\" is the past of \"have to.\" \"Has\" doesn't fit a past event." },
    { context: "What did the professor say about the exam?", answer: "She told us that it would be postponed", end: ".", distractor: "will", why: "Reported speech shifts \"will\" to \"would\": \"She told us that it would be postponed.\"" },
    { context: "Are you coming to the review session tonight?", answer: "I would come if I didn't have work", alts: ["If I didn't have work I would come"], end: ".", distractor: "will", why: "Imagined situation: \"would + verb\" with \"if + past\" (\"if I didn't have work\"), not \"will.\"" }
  ] },
  { title: "Everyday replies, set B", items: [
    { context: "How was your trip to Seoul?", answer: "It was much more relaxing than I expected", end: ".", distractor: "most", why: "Comparatives use \"more \u2026 than.\" \"Most\" is the superlative and can't go with \"than.\"" },
    { context: "Did you ask the librarian for help?", answer: "I asked her where the journals are kept", end: ".", distractor: "do", why: "In an embedded question the subject comes first: \"where the journals are kept.\"" },
    { context: "Have you started the group project?", answer: "We have been working on it since Monday", alts: ["Since Monday we have been working on it"], end: ".", distractor: "for", why: "\"Since\" takes a starting point (Monday). \"For\" would need a length of time." },
    { context: "Why are you studying so late?", answer: "I want to be ready for tomorrow's quiz", end: ".", distractor: "being", why: "After \"want to,\" use the base verb \"be,\" not \"being.\"" },
    { context: "What do you think of the new café?", answer: "The coffee is good but the prices are high", alts: ["The prices are high but the coffee is good"], end: ".", distractor: "price", why: "\"But\" joins two contrasting clauses. \"Price\" is singular and can't go with \"are.\"" }
  ] }
],
email: [
  { title: "Feedback for an instructor", scenario: "You recently took a class at a community center. The instructor, Ms. Rivera, has asked students for feedback. Write an email to Ms. Rivera.", points: ["Describe what you enjoyed about the class", "Explain one thing that was difficult for you", "Suggest an improvement for future classes"],
    model: "Dear Ms. Rivera,\n\nThank you for asking for feedback on the beginner pottery class. I really enjoyed it, especially the way you demonstrated each technique slowly before we tried it ourselves. The relaxed atmosphere made it easy to ask questions.\n\nThe most difficult part for me was centering the clay on the wheel. Even after several attempts, my pieces kept collapsing, and I sometimes felt that I was falling behind the rest of the group.\n\nFor future classes, I would suggest adding a short practice session focused only on centering, or a handout with step-by-step photos that students can review at home.\n\nThank you again for a wonderful class. I hope to join the intermediate course next season.\n\nBest regards,\nMin-jun" },
  { title: "Noise from a neighbor", scenario: "Your neighbor has been playing loud music late at night, and you have an important exam next week. Write an email to your neighbor, Mr. Park.", points: ["Explain the situation", "Describe how it is affecting you", "Propose a solution"],
    model: "Dear Mr. Park,\n\nI hope you are doing well. I live in the apartment next to yours, and I wanted to talk to you about something. For the past few nights, I have been able to hear music from your apartment until around midnight.\n\nI have a very important exam next Thursday, and I have been trying to study and sleep well before it. Unfortunately, the noise has made it hard for me to concentrate, and I have been waking up tired.\n\nWould it be possible to keep the volume lower after 10 p.m., at least until my exam is over? Using headphones in the evening might also be an option. I would really appreciate your understanding.\n\nThank you very much,\nJi-woo (Apartment 4B)" },
  { title: "A damaged delivery", scenario: "You ordered a desk lamp online, but it arrived damaged. Write an email to the store's customer service team.", points: ["Describe what you ordered and when", "Explain the problem", "Say what you would like the store to do"],
    model: "Dear Customer Service Team,\n\nOn September 22, I ordered a black adjustable desk lamp from your website (order number 58213). The package arrived yesterday, but unfortunately the lamp was damaged.\n\nThe base is cracked, and one of the joints in the arm is broken, so the lamp cannot stand up or be adjusted. The box was also dented, so I believe it was damaged during shipping. I have attached photos of the lamp and the packaging.\n\nI would like you to send me a replacement as soon as possible. If the item is out of stock, I would prefer a full refund instead. Please let me know whether I need to return the damaged lamp, and if so, how.\n\nThank you for your help.\n\nSincerely,\nSora Kim" }
],
discuss: [
  { title: "Smartphones in school", professor: "Dr. Gupta", prompt: "This week we're discussing technology in education. Some schools have started banning smartphones during the school day, while others encourage students to use them as learning tools. Which approach do you think is better, and why?",
    students: [
      { name: "Claire", post: "I think schools should ban smartphones during the day. Even when students aren't using them, notifications pull their attention away from lessons. Without phones, students would also talk to each other more during breaks instead of staring at screens." },
      { name: "Andrew", post: "A ban seems unrealistic to me. Students will just hide their phones. Schools should teach responsible use instead, since phones are useful for looking up words, doing quick research, or using educational apps. Learning self-control is an important skill too." }],
    model: "I understand Andrew's point that phones can be useful learning tools, but I agree more with Claire that limiting them during class is the better choice. In my experience, simply having a phone on the desk makes it hard to focus, even if it is turned face down. However, I don't think a complete ban for the whole day is necessary. A better approach would be for students to keep their phones in lockers during lessons but be allowed to use them at lunch and between classes. Teachers could also bring out school tablets when an activity actually requires the internet. This way, students get the benefits of technology without the constant distraction, and they still practice managing their own devices during free time." },
  { title: "Transit or roads?", professor: "Dr. Alvarez", prompt: "Many growing cities face serious traffic problems. Some people argue that the best solution is to invest heavily in public transportation, such as buses and subways. Others believe cities should focus on improving roads and building more parking. If a city had limited money, which should it prioritize, and why?",
    students: [
      { name: "Priya", post: "Public transportation is clearly better. One bus can carry fifty people, which takes many cars off the road. It also reduces pollution, which affects everyone's health." },
      { name: "Marcus", post: "I'd focus on roads. In many cities, buses and trains don't reach the suburbs, so people need cars no matter what. Better roads would help everyone right away, while a new subway line can take ten years to build." }],
    model: "Marcus makes a fair point that subway projects take a long time, but I still believe a city with limited money should prioritize public transportation. Building more roads often doesn't solve traffic for long, because new lanes encourage more people to drive, and the roads fill up again. A city doesn't have to start with an expensive subway, either. It could quickly add dedicated bus lanes and run buses more often, especially to the suburbs Marcus mentioned. This is relatively cheap and can be done in a year or two. Over time, as more people choose buses, there would be fewer cars on the road, which would also benefit the drivers who still need to use them." },
  { title: "Grades or experience?", professor: "Dr. Chen", prompt: "Employers have different ideas about what makes a strong job candidate straight out of university. Some focus on grades, since they show how hard a student worked over several years. Others care more about internships and work experience. Which should employers value more when hiring new graduates? Why?",
    students: [
      { name: "Hana", post: "Grades matter most to me. A high GPA proves that a person can meet deadlines and learn difficult material consistently for four years, which is exactly what a new job requires." },
      { name: "Leo", post: "I'd value internships more. Some people are good at tests but struggle to work in teams or talk to clients. An internship shows how someone actually behaves in a workplace." }],
    model: "I agree with Leo that work experience should matter more, although Hana is right that grades show discipline. The main reason is that a classroom and an office are very different environments. In class, students usually work alone and are told exactly what to do, but at work they must cooperate with colleagues and solve problems with no clear answer. An internship gives employers direct evidence of these skills, often through a reference from a real supervisor. For example, my cousin had average grades, but because she had interned at a design firm, she was hired quickly and promoted within a year. Grades can still help employers choose between candidates with similar experience, but they shouldn't be the main factor." }
],
repeat: [
  { title: "Campus library tour", context: "You are learning to give tours of the campus library. Listen to your trainer and repeat exactly what you hear.", sentences: [
    "Welcome to the library.",
    "The front desk is on your left.",
    "You can borrow up to ten books at a time.",
    "Quiet study rooms are located on the third floor.",
    "Please remember to scan your student card when you enter.",
    "If you need help finding a book, ask any of the staff members.",
    "Laptops can be checked out for four hours, but they must be returned before closing time."] },
  { title: "Fitness center orientation", context: "You are training to lead orientations at a fitness center. Listen to your supervisor and repeat exactly what you hear.", sentences: [
    "Thanks for joining us today.",
    "Lockers are next to the showers.",
    "Please wipe down machines after use.",
    "Group classes start every hour on the hour.",
    "You'll need to sign up online at least a day in advance.",
    "Our trainers can create a personal workout plan for you at no cost.",
    "If you have any injuries, let the instructor know before class begins so they can adjust the exercises."] },
  { title: "Science museum guide", context: "You are volunteering as a guide at a science museum. Listen to the head guide and repeat exactly what you hear.", sentences: [
    "Let's begin the tour.",
    "This hall shows the history of flight.",
    "The plane above you is nearly a hundred years old.",
    "Please don't touch the displays in this room.",
    "The next exhibit explains how weather satellites collect data.",
    "Feel free to take photos, but please turn off your camera's flash.",
    "At the end of the tour, you can try the flight simulator, which lets you experience a takeoff and landing."] }
],
interview: [
  { title: "Free time and student life", intro: "You have agreed to take part in a research study about how university students spend their free time. An interviewer will ask you four questions.", questions: [
    "Tell me about how you usually spend your weekends.",
    "Do you prefer spending free time alone or with other people? Why?",
    "Some people say students today have too little free time. Do you agree? Please explain.",
    "If your school wanted to help students relax more, what should it do, and why?"] },
  { title: "Technology in daily life", intro: "You have agreed to take part in a study about how people use technology. An interviewer will ask you four questions.", questions: [
    "What piece of technology do you use most in your daily life, and what do you use it for?",
    "Has technology made it easier or harder for you to concentrate on studying? Please explain.",
    "Some people think children should not have smartphones until they are teenagers. What is your opinion?",
    "Imagine a new app could help students with one part of their lives. What should it do, and why would it be useful?"] },
  { title: "Travel and learning", intro: "You have agreed to take part in a study about travel and education. An interviewer will ask you four questions.", questions: [
    "Tell me about a place you have visited that you remember well.",
    "Do you think people learn more from traveling or from reading books? Why?",
    "Many universities offer study-abroad programs. What are the main benefits and challenges for students?",
    "If you could spend one month living in any city in the world, where would you go and what would you do there?"] }
]
};

DATA.skim = [
  { title: "Sleep and memory", paras: [
    "For a long time, scientists viewed sleep mainly as a period of rest for the body. Research over the past few decades, however, has shown that the sleeping brain is remarkably active. One of its most important tasks appears to be strengthening memories formed during the day.",
    "This process, known as memory consolidation, seems to depend on different stages of sleep. During deep, slow-wave sleep, the brain repeatedly replays patterns of activity from recent experiences. Researchers believe this replay helps transfer information from the hippocampus, a region that stores memories temporarily, to the cortex, where they can be kept for the long term.",
    "Experiments support this idea. In typical studies, participants learn a list of word pairs or a new motor skill, such as a finger-tapping sequence, and are tested again after either a night of sleep or an equal period awake. Those who sleep usually perform better, even though they have had no additional practice.",
    "These findings have practical implications for students. Staying up all night before an exam may provide extra study time, but it also deprives the brain of the very process that would help preserve what was learned. Spreading study sessions over several days, with sleep in between, is therefore likely to be more effective."],
    questions: [
      { q: "What is the passage mainly about?", options: ["How sleep helps strengthen memories", "Why people need less sleep as they age", "How to fall asleep more quickly", "The parts of the brain that control dreams"], answer: 0, why: "The last sentence of paragraph 1 states the thesis: sleep strengthens memories. Writers often put the main idea at the end of the introduction." },
      { q: "Which paragraph would you read to find evidence from experiments?", options: ["Paragraph 1", "Paragraph 2", "Paragraph 3", "Paragraph 4"], answer: 2, why: "Paragraph 3 opens with \"Experiments support this idea.\" That topic sentence tells you exactly what the paragraph contains." },
      { q: "Which paragraph most likely explains how the process works inside the brain?", options: ["Paragraph 1", "Paragraph 2", "Paragraph 3", "Paragraph 4"], answer: 1, why: "Paragraph 2 names the process (memory consolidation) and says it depends on stages of sleep, so the mechanism is explained there." },
      { q: "What is the purpose of the final paragraph?", options: ["To question the experiments", "To apply the findings to students' study habits", "To introduce a new theory", "To describe the history of sleep research"], answer: 1, why: "\"Practical implications for students\" signals that the writer is applying the research to real life." }
    ] },
  { title: "The urban heat island effect", paras: DATA.academic[0].paras,
    questions: [
      { q: "What is the passage mainly about?", options: ["Why cities are warmer than rural areas, the effects, and possible solutions", "How to design taller buildings", "The history of air conditioning", "Why rural areas are cooling down"], answer: 0, why: "The four topic sentences outline the whole passage: the effect, its causes (\"several features\"), its consequences, and solutions." },
      { q: "Where would you look to find what cities are doing about the problem?", options: ["Paragraph 1", "Paragraph 2", "Paragraph 3", "Paragraph 4"], answer: 3, why: "Paragraph 4 begins \"Cities have begun experimenting with solutions.\"" },
      { q: "Where would you find why tall buildings make cities warmer?", options: ["Paragraph 1", "Paragraph 2", "Paragraph 3", "Paragraph 4"], answer: 1, why: "Paragraph 2 is about \"features of urban design\" that intensify the effect. Buildings are part of urban design." },
      { q: "Paragraph 3 is mainly about", options: ["the causes of the effect", "the consequences of the effect", "a solution to the effect", "a definition of the effect"], answer: 1, why: "Its topic sentence is \"The consequences are significant.\" You don't need the details to know its job." }
    ] },
  { title: "The invention of standard time", paras: DATA.academic[1].paras,
    questions: [
      { q: "What is the passage mainly about?", options: ["How and why standard time zones were created and accepted", "How railroads were built in North America", "Why the sun is highest at noon", "How clocks were invented"], answer: 0, why: "The topic sentences move from local sun time, to railroads changing it, to the 1883 system, to its acceptance." },
      { q: "According to the skim, what caused towns to move away from local time?", options: ["New scientific discoveries", "The spread of railroads", "A government law in 1883", "International trade"], answer: 1, why: "Paragraph 2's topic sentence: \"The spread of railroads changed this.\" The word \"changed\" links back to local time in paragraph 1." },
      { q: "Where would you find information about opposition to the new system?", options: ["Paragraph 1", "Paragraph 2", "Paragraph 3", "Paragraph 4"], answer: 3, why: "\"Acceptance was not immediate\" signals resistance, so details about objections follow in paragraph 4." },
      { q: "How is the passage mainly organized?", options: ["In time order", "As a list of advantages and disadvantages", "As a comparison of two countries", "As a problem with several competing solutions"], answer: 0, why: "Time words in the topic sentences (\"Before the late nineteenth century,\" \"In 1883\") show a chronological structure." }
    ] }
];

DATA.trans = [
  { title: "Learning a language as an adult",
    text: "Many adults believe they are too old to learn a new language well. [[contrast:However|Therefore|For instance|Similarly]], research suggests that adults often learn grammar faster than children in the early stages. [[cause:This is because|In contrast|Finally|Otherwise]] adults can use strategies such as comparing new rules with their first language. [[contrast:On the other hand|Therefore|For example|As a result]], children usually achieve more native-like pronunciation over time. [[result:Consequently|Nevertheless|Meanwhile|For example]], the best age to start may depend on which skills a learner values most.",
    predict: [
      { q: "\"Online courses are convenient and flexible. However, …\" What most likely comes next?", options: ["many students find it hard to stay motivated without a teacher present.", "they let students study at any time of day.", "many universities now offer them.", "they are becoming more popular every year."], answer: 0, why: "\"However\" signals a contrast, so expect a drawback after the positive point. The other options continue the positive idea." },
      { q: "\"Bees are important pollinators. For example, …\" What most likely comes next?", options: ["their populations have declined in recent years.", "almond farms rely heavily on honeybees to produce a crop.", "other insects also carry pollen.", "this is why farmers are worried."], answer: 1, why: "\"For example\" introduces a specific case of the idea just stated: a crop that depends on bees." }
    ] },
  { title: "The limits of recycling",
    text: "Recycling is often presented as the solution to plastic waste. [[concession:Although|Because|Unless|Since]] it does help, only a small share of plastic is actually recycled. [[cause:One reason is that|For this reason|In conclusion|Similarly]] many types of plastic cannot be processed easily. [[example:For example|However|Therefore|Instead]], food containers mixed with leftover food are often sent to landfills. [[result:As a result|In contrast|Likewise|For instance]], many experts argue that reducing plastic use is more important than recycling it.",
    predict: [
      { q: "\"The new policy reduced traffic downtown. As a result, …\" What most likely comes next?", options: ["some drivers opposed it at first.", "air quality in the city center improved.", "the policy was introduced last spring.", "traffic in the suburbs was already low."], answer: 1, why: "\"As a result\" introduces an effect of the previous sentence. Cleaner air is a consequence of less traffic." },
      { q: "\"Although the experiment was carefully designed, …\" What most likely comes next?", options: ["the researchers controlled every variable.", "it was published in a respected journal.", "its sample was too small to support firm conclusions.", "the scientists were very experienced."], answer: 2, why: "\"Although\" admits a strength and then sets up a weakness. The writer's real point comes after the comma." }
    ] },
  { title: "The first cities",
    text: "The first cities appeared in Mesopotamia more than five thousand years ago. [[time:Before this|However|For example|As a result]], most people lived in small farming villages. [[cause:Because|Although|Unless|Whereas]] farmers began producing more food than they needed, some people were free to work as craftsmen, priests, or traders. [[addition:In addition|In contrast|Nevertheless|Otherwise]], the need to store and record extra grain encouraged the development of writing. [[time:Over time|Instead|For instance|On the contrary]], these settlements grew into complex urban centers.",
    predict: [
      { q: "\"Many people assume that deserts are always hot. In fact, …\" What most likely comes next?", options: ["some deserts are extremely hot during the day.", "some deserts, such as Antarctica, are extremely cold.", "deserts receive very little rain.", "camels are well adapted to desert life."], answer: 1, why: "\"In fact\" after a common assumption usually corrects it. Expect the surprising truth." },
      { q: "\"Dolphins use sound to locate food. Similarly, …\" What most likely comes next?", options: ["bats find insects by listening to echoes.", "dolphins also have excellent eyesight.", "sharks rely mainly on smell.", "this ability took millions of years to develop."], answer: 0, why: "\"Similarly\" introduces something that works the same way, usually a different subject with the same pattern." }
    ] }
];

DATA.vic = [
 {
  "title": "PrepScholar words, set 1",
  "items": [
   {
    "text": "Despite hours of debate, the senator remained {{adamant}}, [[refusing to change her opinion no matter what evidence was shown]].",
    "options": [
     "openly confused",
     "quietly hopeful",
     "firmly unwilling to change one's mind",
     "easily persuaded"
    ],
    "answer": 2,
    "clue": "definition",
    "why": "The phrase after the comma explains the word directly: refusing to change her opinion."
   },
   {
    "text": "The student took {{copious}}, or [[very plentiful]], notes during the two-hour lecture.",
    "options": [
     "careless",
     "large in amount",
     "neat and organized",
     "brief"
    ],
    "answer": 1,
    "clue": "synonym",
    "why": "\"Or\" followed by a simpler word usually gives a synonym."
   },
   {
    "text": "Unlike the [[warm and patient]] receptionist, the manager was {{brusque}}, answering in two words and walking away.",
    "options": [
     "extremely helpful",
     "nervous",
     "talkative",
     "abrupt and unfriendly"
    ],
    "answer": 3,
    "clue": "contrast",
    "why": "\"Unlike\" signals the opposite of warm and patient, and the behavior confirms it."
   },
   {
    "text": "The street was a {{cacophony}} of sounds, [[such as car horns, barking dogs, and drilling machines all at once]].",
    "options": [
     "a harsh mixture of noises",
     "a quiet atmosphere",
     "a type of music",
     "a large crowd"
    ],
    "answer": 0,
    "clue": "example",
    "why": "\"Such as\" lists examples, and all of them are loud, clashing sounds."
   },
   {
    "text": "The judge dismissed the lawsuit as {{frivolous}}, [[saying it was not worth the court's time]].",
    "options": [
     "of little importance",
     "illegal",
     "very expensive",
     "carefully prepared"
    ],
    "answer": 0,
    "clue": "general sense",
    "why": "If something isn't worth the court's time, it must be unimportant."
   }
  ]
 },
 {
  "title": "PrepScholar words, set 2",
  "items": [
   {
    "text": "There is a {{paucity}} of research on deep-sea creatures; [[in other words, very little information exists]].",
    "options": [
     "a small amount; scarcity",
     "a large collection",
     "a serious error",
     "a new discovery"
    ],
    "answer": 0,
    "clue": "definition",
    "why": "\"In other words\" introduces a restatement of the word's meaning."
   },
   {
    "text": "Whereas her brother [[decides quickly and sticks to his choice]], she tends to {{vacillate}} for weeks.",
    "options": [
     "complain loudly",
     "compare prices",
     "keep changing one's mind",
     "act quickly"
    ],
    "answer": 2,
    "clue": "contrast",
    "why": "\"Whereas\" sets up an opposite: she does the reverse of deciding quickly and sticking to it."
   },
   {
    "text": "He was famously {{parsimonious}}; [[for example, he reused tea bags and refused to turn on the heat in winter]].",
    "options": [
     "extremely unwilling to spend money",
     "very generous",
     "lazy",
     "forgetful"
    ],
    "answer": 0,
    "clue": "example",
    "why": "Both examples show someone avoiding spending money."
   },
   {
    "text": "The {{irascible}} old professor [[shouted at students who arrived even a minute late]].",
    "options": [
     "forgetful",
     "easily angered",
     "highly respected",
     "soft-spoken"
    ],
    "answer": 1,
    "clue": "general sense",
    "why": "Shouting over one minute shows someone who gets angry very easily."
   },
   {
    "text": "The radio message was {{garbled}}, or [[distorted]], so the pilot asked for it to be repeated.",
    "options": [
     "mixed up and hard to understand",
     "very loud",
     "secret",
     "very short"
    ],
    "answer": 0,
    "clue": "synonym",
    "why": "\"Or distorted\" gives a synonym, and asking for a repeat confirms it."
   }
  ]
 },
 {
  "title": "PrepScholar words, set 3",
  "items": [
   {
    "text": "Critics called the film's ending {{hackneyed}}, [[meaning it had been used so many times that it no longer surprised anyone]].",
    "options": [
     "overused and unoriginal",
     "shocking",
     "confusing",
     "beautifully filmed"
    ],
    "answer": 0,
    "clue": "definition",
    "why": "\"Meaning\" introduces a direct definition."
   },
   {
    "text": "While most travelers [[avoided the dangerous mountain pass]], a few {{intrepid}} explorers crossed it alone.",
    "options": [
     "lost",
     "experienced in medicine",
     "exhausted",
     "fearless"
    ],
    "answer": 3,
    "clue": "contrast",
    "why": "\"While\" contrasts them with travelers who avoided danger, so they are brave."
   },
   {
    "text": "The workers lived in {{squalid}} conditions, [[with overflowing garbage, broken windows, and no clean water]].",
    "options": [
     "crowded but comfortable",
     "temporary",
     "expensive",
     "dirty and unpleasant"
    ],
    "answer": 3,
    "clue": "example",
    "why": "Every detail listed describes dirt and neglect."
   },
   {
    "text": "After losing the final, the players sat in the locker room, {{morose}} and [[gloomy]], saying nothing.",
    "options": [
     "sad and silent",
     "angry",
     "excited",
     "relieved"
    ],
    "answer": 0,
    "clue": "synonym",
    "why": "Words joined by \"and\" in a description often share a meaning."
   },
   {
    "text": "Digital cameras quickly {{supplanted}} film cameras, [[and within a decade most film factories had closed]].",
    "options": [
     "improved",
     "replaced",
     "copied",
     "advertised"
    ],
    "answer": 1,
    "clue": "general sense",
    "why": "If film factories closed, digital cameras must have taken film's place."
   }
  ]
 },
 {
  "title": "PrepScholar words, set 4",
  "items": [
   {
    "text": "The stone wall is the last {{vestige}} of the castle, [[that is, the only small trace that remains of it]].",
    "options": [
     "a small remaining trace",
     "the main entrance",
     "a modern copy",
     "the original plan"
    ],
    "answer": 0,
    "clue": "definition",
    "why": "\"That is\" introduces a definition."
   },
   {
    "text": "[[Mr. Park is a strict grader]], but Ms. Lee is {{lenient}} and often accepts late homework without penalty.",
    "options": [
     "very organized",
     "unfair",
     "demanding",
     "not strict; forgiving"
    ],
    "answer": 3,
    "clue": "contrast",
    "why": "\"But\" contrasts her with a strict grader, and accepting late work confirms it."
   },
   {
    "text": "With no fresh water flowing in, the pond became {{stagnant}} and [[began to smell]].",
    "options": [
     "still and not flowing",
     "frozen",
     "very deep",
     "clean"
    ],
    "answer": 0,
    "clue": "general sense",
    "why": "Water that has no flow and starts to smell is still and unmoving."
   },
   {
    "text": "The claim that the moon is made of cheese is {{ludicrous}}, or simply [[ridiculous]].",
    "options": [
     "absurd",
     "scientific",
     "popular",
     "ancient"
    ],
    "answer": 0,
    "clue": "synonym",
    "why": "\"Or simply\" gives an easier synonym."
   },
   {
    "text": "Small groups of protesters began to {{coalesce}}; [[for instance, three separate marches joined into one large crowd downtown]].",
    "options": [
     "argue",
     "come together into one",
     "break apart",
     "disappear"
    ],
    "answer": 1,
    "clue": "example",
    "why": "The example shows separate groups joining into one."
   }
  ]
 },
 {
  "title": "PrepScholar words, set 5",
  "items": [
   {
    "text": "Although the other runners [[looked nervous before the race]], Ana seemed {{nonchalant}}, chatting and laughing.",
    "options": [
     "calm and unconcerned",
     "worried",
     "injured",
     "competitive"
    ],
    "answer": 0,
    "clue": "contrast",
    "why": "\"Although\" contrasts her with nervous runners."
   },
   {
    "text": "The speech turned into a {{diatribe}}, [[a bitter attack on the government that lasted almost an hour]].",
    "options": [
     "a celebration",
     "a short summary",
     "a joke",
     "an angry, critical speech"
    ],
    "answer": 3,
    "clue": "definition",
    "why": "The phrase after the comma restates what the word means."
   },
   {
    "text": "Plants are {{sparse}} in this desert; [[travelers can walk for miles without seeing a single tree]].",
    "options": [
     "thinly scattered",
     "colorful",
     "poisonous",
     "thick"
    ],
    "answer": 0,
    "clue": "general sense",
    "why": "Walking miles without seeing a tree means plants are few and far apart."
   },
   {
    "text": "His plans were {{grandiose}}; [[for example, he wanted to build the world's tallest tower and a private airport on his small farm]].",
    "options": [
     "practical",
     "far too ambitious and showy",
     "secret",
     "inexpensive"
    ],
    "answer": 1,
    "clue": "example",
    "why": "The examples are huge, unrealistic projects."
   },
   {
    "text": "Drivers must be {{cognizant}}, or [[aware]], of children walking near schools.",
    "options": [
     "aware",
     "afraid",
     "tired",
     "respectful"
    ],
    "answer": 0,
    "clue": "synonym",
    "why": "\"Or aware\" gives a direct synonym."
   }
  ]
 },
 {
  "title": "Academic Word List, set 1",
  "items": [
   {
    "text": "The instructions were {{ambiguous}}, [[meaning they could be understood in more than one way]].",
    "options": [
     "too long",
     "unclear; having more than one meaning",
     "strict",
     "well written"
    ],
    "answer": 1,
    "clue": "definition",
    "why": "\"Meaning\" introduces a direct definition."
   },
   {
    "text": "Instead of [[being based on clear rules]], the fines seemed {{arbitrary}}: some drivers paid $20 and others $200 for the same mistake.",
    "options": [
     "fair",
     "expensive",
     "based on chance, not reason",
     "temporary"
    ],
    "answer": 2,
    "clue": "contrast",
    "why": "\"Instead of\" shows the opposite of clear rules, and the uneven fines confirm it."
   },
   {
    "text": "The theory sounded convincing, but it lacked {{empirical}} support; [[no one had actually tested it through observation]].",
    "options": [
     "financial",
     "political",
     "written",
     "based on observation or experiment"
    ],
    "answer": 3,
    "clue": "general sense",
    "why": "The second half explains what kind of support is missing: real testing."
   },
   {
    "text": "Risk is an {{inherent}}, or [[built-in]], part of investing.",
    "options": [
     "unusual",
     "naturally part of something",
     "avoidable",
     "minor"
    ],
    "answer": 1,
    "clue": "synonym",
    "why": "\"Or built-in\" gives a synonym."
   },
   {
    "text": "Online learning created a new {{paradigm}} for education; [[for example, students now watch lectures at home and solve problems in class]].",
    "options": [
     "a model or way of doing things",
     "a type of computer",
     "a legal rule",
     "a short course"
    ],
    "answer": 0,
    "clue": "example",
    "why": "The example describes a whole new pattern of teaching."
   }
  ]
 },
 {
  "title": "Academic Word List, set 2",
  "items": [
   {
    "text": "The team won the final, {{albeit}} [[by only one point]].",
    "options": [
     "because",
     "therefore",
     "although",
     "especially"
    ],
    "answer": 2,
    "clue": "general sense",
    "why": "Winning \"by only one point\" adds a limit to the win, which is what \"although\" does."
   },
   {
    "text": "She studies for {{intrinsic}} reasons, [[not for grades or prizes]]; she simply enjoys learning.",
    "options": [
     "financial",
     "coming from within; natural",
     "outside",
     "temporary"
    ],
    "answer": 1,
    "clue": "contrast",
    "why": "\"Not for grades or prizes\" rules out outside rewards."
   },
   {
    "text": "Warm air rises; {{conversely}}, [[cool air sinks]].",
    "options": [
     "in the opposite way",
     "similarly",
     "as a result",
     "for example"
    ],
    "answer": 0,
    "clue": "general sense",
    "why": "Rising and sinking are opposites, so the word links opposite ideas."
   },
   {
    "text": "The rule was never [[written down or stated directly]], but there was an {{implicit}} agreement that no one would work on Sundays.",
    "options": [
     "official",
     "understood without being stated",
     "temporary",
     "written"
    ],
    "answer": 1,
    "clue": "contrast",
    "why": "\"But\" contrasts it with being stated directly."
   },
   {
    "text": "The essay lacked {{coherence}}; [[its ideas did not connect logically from one paragraph to the next]].",
    "options": [
     "length",
     "vocabulary",
     "logical connection and consistency",
     "neat handwriting"
    ],
    "answer": 2,
    "clue": "definition",
    "why": "The second half explains exactly what was missing."
   }
  ]
 },
 {
  "title": "Academic Word List, set 3",
  "items": [
   {
    "text": "{{Notwithstanding}} [[the heavy rain]], the outdoor concert went ahead as planned.",
    "options": [
     "despite",
     "because of",
     "before",
     "during"
    ],
    "answer": 0,
    "clue": "general sense",
    "why": "A concert going ahead in heavy rain happened in spite of it."
   },
   {
    "text": "The city introduced a system {{whereby}} [[residents can report broken streetlights through an app]].",
    "options": [
     "by which",
     "unless",
     "where",
     "after"
    ],
    "answer": 0,
    "clue": "general sense",
    "why": "The phrase describes how the system works, so the word means \"by which\"."
   },
   {
    "text": "He was {{reluctant}} to speak in class, [[unlike his classmates, who eagerly raised their hands]].",
    "options": [
     "unwilling; hesitant",
     "eager",
     "prepared",
     "forbidden"
    ],
    "answer": 0,
    "clue": "contrast",
    "why": "\"Unlike\" contrasts him with eager classmates."
   },
   {
    "text": "Coastal {{erosion}} is visible everywhere here; [[for instance, a road that once ran along the cliff has fallen into the sea]].",
    "options": [
     "flooding",
     "the gradual wearing away of land",
     "construction",
     "pollution"
    ],
    "answer": 1,
    "clue": "example",
    "why": "The example shows land slowly being worn away by the sea."
   },
   {
    "text": "Both companies agreed to {{mediation}}, or [[help from a neutral third party]], to settle the dispute.",
    "options": [
     "a court trial",
     "a public vote",
     "a merger",
     "help from a neutral person to settle a conflict"
    ],
    "answer": 3,
    "clue": "definition",
    "why": "\"Or\" introduces an explanation of the word."
   }
  ]
 }
];

// Word bank for new vocabulary sets from Claude: the PrepScholar
// "327 TOEFL Words" list plus the Academic Word List flashcards.
DATA.vicWords = ["abundant", "accompanied", "accumulate", "accumulation", "accurate", "accustomed", "acknowledged", "acquire", "acquisition", "adamant", "adequate", "adjacent", "adjust", "adjustment", "administration", "adults", "advantage", "adverse", "advocate", "affect", "aggregate", "aggressive", "aid", "albeit", "allocate", "allocation", "alter", "alternative", "amateur", "ambiguous", "ambitious", "amend", "amendment", "ample", "analogous", "annual", "anomaly", "antagonize", "anticipated", "apparent", "appendix", "appreciation", "approach", "appropriate", "approximated", "arbitrary", "arduous", "area", "aspects", "assembly", "assessment", "assigned", "assistance", "assuage", "assume", "assurance", "attached", "attained", "attitude", "attitudes", "attribute", "attributed", "augment", "author", "authority", "automatically", "available", "aware", "behalf", "benefit", "berate", "bestow", "bias", "boast", "bond", "boost", "brash", "brief", "brusque", "bulk", "cacophony", "capable", "capacity", "categories", "cease", "ceases", "censure", "challenge", "channel", "chapter", "chart", "chemical", "chronological", "circumstances", "cited", "civil", "clarify", "clarity", "classical", "clause", "coalesce", "code", "coerce", "cognizant", "coherence", "cohesion", "coincide", "collapse", "colleagues", "collide", "commenced", "comments", "commission", "commitment", "commodity", "communication", "community", "compensation", "compiled", "complement", "complex", "components", "compounds", "comprehensive", "comprise", "computer", "conceal", "conceived", "concentration", "concept", "conclusion", "concur", "concurrent", "conduct", "conference", "confined", "confirmed", "conflict", "conformity", "consent", "consequences", "considerable", "consistent", "constant", "constitutional", "constrain", "constraints", "construction", "consultation", "consumer", "contact", "contemplate", "contemporary", "context", "continuously", "contract", "contradict", "contradiction", "contrary", "contrast", "contribute", "contribution", "controversy", "convention", "conversely", "converted", "convey", "convinced", "cooperative", "coordination", "copious", "core", "corporate", "corresponding", "corrode", "couple", "create", "credit", "criteria", "crucial", "cultural", "cumbersome", "currency", "curriculum", "cycle", "data", "debate", "decades", "decay", "deceive", "decipher", "declaration", "decline", "deduction", "definite", "definition", "degrade", "demonstrate", "denote", "deny", "deplete", "deposit", "depression", "derived", "design", "desirable", "despise", "despite", "detect", "detected", "deter", "deviate", "deviation", "device", "devise", "devoted", "diatribe", "differentiation", "digress", "dilemma", "dimensions", "diminish", "diminished", "discretion", "discrimination", "displacement", "display", "disposal", "dispose", "disproportionate", "disrupt", "distinction", "distort", "distorted", "distribute", "distribution", "diverse", "diversity", "divert", "document", "domain", "domestic", "dominant", "draft", "dramatic", "duration", "dynamic", "ease", "economic", "edition", "efficient", "elements", "eliminate", "elite", "eloquent", "emerged", "emphasis", "emphasize", "empirical", "enable", "encountered", "endure", "energy", "enforcement", "enhance", "enhanced", "enormous", "ensure", "entities", "environment", "epitome", "equation", "equipment", "equivalent", "erosion", "erroneous", "error", "established", "estate", "estimate", "ethical", "ethnic", "evade", "evaluate", "evaluation", "eventually", "evidence", "evolution", "evolve", "exceed", "exclude", "excluded", "exclusive", "exemplary", "exhibit", "expand", "expansion", "expert", "expertise", "explicit", "exploit", "exploitation", "export", "expose", "exposure", "extension", "external", "extract", "facilitate", "factors", "famine", "feasible", "features", "federal", "fees", "file", "final", "financial", "finite", "flaw", "flexibility", "fluctuate", "fluctuations", "focus", "format", "formula", "forthcoming", "fortify", "foundation", "founded", "framework", "frivolous", "function", "fundamental", "funds", "furthermore", "gap", "garbled", "gender", "generate", "generated", "generation", "global", "goals", "grade", "grandiose", "granted", "guarantee", "guidelines", "hackneyed", "haphazard", "harsh", "hasty", "hazardous", "hence", "hesitate", "hierarchical", "hierarchy", "highlighted", "hindrance", "hollow", "horror", "hostile", "hypothesis", "identical", "identified", "ideology", "ignored", "illiterate", "illustrate", "illustrated", "image", "immigration", "impact", "impair", "implement", "implementation", "implications", "implicit", "implies", "imply", "impose", "imposed", "impoverish", "incentive", "incessant", "incidence", "incidental", "incite", "inclination", "inclined", "income", "incompatible", "incompetent", "inconsistent", "incorporated", "indefatigable", "index", "indicate", "indisputable", "individual", "induced", "ineffective", "inevitable", "inevitably", "infer", "inferred", "inflate", "influence", "infrastructure", "inherent", "inhibit", "inhibition", "initial", "initiatives", "injury", "innovation", "input", "inquiry", "insert", "insights", "inspection", "instance", "institute", "instructions", "integral", "integrate", "integration", "integrity", "intelligence", "intensity", "interaction", "intermediate", "internal", "interpret", "interpretation", "interval", "intervene", "intervention", "intrepid", "intricate", "intrinsic", "invasive", "investigate", "investigation", "investment", "invoked", "involved", "irascible", "irony", "irresolute", "isolated", "issues", "items", "jargon", "job", "jointly", "journal", "justification", "knack", "label", "labor", "labour", "lag", "lampoon", "languish", "layer", "lecture", "leery", "legal", "legislation", "legitimate", "lenient", "levy", "liberal", "licence", "likely", "likewise", "link", "location", "logic", "ludicrous", "maintain", "maintenance", "major", "manipulate", "manipulation", "manual", "marginal", "mature", "maximize", "maximum", "measure", "mechanism", "media", "mediation", "medical", "mediocre", "medium", "mend", "mental", "method", "migrate", "migration", "military", "minimal", "minimised", "minimum", "ministry", "minorities", "misleading", "mode", "modified", "modify", "monitoring", "morose", "motivation", "mutual", "negative", "negligent", "network", "neutral", "nevertheless", "nonchalant", "nonetheless", "normal", "norms", "notion", "notwithstanding", "nuclear", "obey", "objective", "obtain", "obtained", "obvious", "occupational", "occur", "odd", "offset", "ongoing", "opponent", "oppress", "option", "orientation", "origin", "outcomes", "output", "overall", "overlap", "overseas", "panel", "paradigm", "paragraph", "parallel", "parameters", "parsimonious", "partake", "partial", "participation", "partnership", "passive", "paucity", "peak", "perceived", "percent", "period", "peripheral", "permeate", "persist", "persistent", "perspective", "pertain", "phase", "phenomenon", "philosophy", "physical", "plus", "policy", "poll", "portion", "posed", "positive", "potent", "potential", "practitioners", "pragmatic", "praise", "precede", "preceding", "precise", "predicted", "predominantly", "preliminary", "prestigious", "presumption", "prevalent", "previous", "primary", "prime", "principal", "principle", "prior", "priority", "procedure", "proceed", "process", "professional", "progeny", "prohibited", "project", "promote", "proportion", "prospect", "prosper", "protocol", "proximity", "psychology", "publication", "published", "purchase", "pursue", "qualitative", "quarrel", "quotation", "radical", "random", "range", "rank", "ratio", "rational", "reaction", "rebuke", "recapitulate", "recede", "recommend", "recovery", "refine", "reform", "regime", "region", "registered", "regulate", "regulations", "reinforce", "reinforced", "reject", "rejected", "relaxed", "release", "relevant", "reliance", "reluctant", "rely", "removed", "reproach", "require", "required", "research", "resent", "resident", "resign", "resist", "resolution", "resolve", "resources", "response", "restore", "restraints", "restrict", "restricted", "retain", "retained", "retract", "retrieve", "revealed", "revenue", "reverse", "revision", "revolution", "rhetorical", "rigid", "role", "rotate", "route", "safeguard", "scenario", "schedule", "scheme", "scope", "scrutinize", "section", "sector", "security", "select", "sequence", "series", "severe", "sex", "shallow", "shelter", "shift", "shrink", "significant", "similar", "simulation", "site", "so-called", "solely", "solitary", "somber", "somewhat", "soothe", "sought", "source", "sparse", "specific", "specified", "specify", "speculate", "sphere", "squalid", "stability", "stable", "stagnant", "statistics", "status", "straightforward", "strategies", "strategy", "stress", "structure", "styles", "submitted", "subordinate", "subsequent", "subsidiary", "substitute", "substitution", "subtle", "successive", "sufficient", "sum", "summarize", "summary", "supervise", "supplant", "supplementary", "survey", "survive", "suspend", "suspended", "suspicious", "sustain", "sustainable", "symbolic", "tapes", "target", "task", "team", "technical", "techniques", "technology", "temporary", "tension", "terminal", "termination", "text", "theme", "theory", "thereby", "thesis", "tolerate", "topic", "trace", "traditional", "transfer", "transformation", "transition", "transmission", "transparent", "transport", "trend", "trigger", "tuition", "ultimately", "undergo", "underlying", "undertaken", "unified", "uniform", "unique", "unjust", "unobtrusive", "unscathed", "upbeat", "utility", "vacillate", "valid", "validity", "vanish", "variables", "vary", "vehicle", "verdict", "version", "vestige", "via", "vial", "vilify", "violation", "virtually", "visible", "vision", "visual", "volume", "voluminous", "voluntary", "welfare", "whereas", "whereby", "wholly", "widespread", "wilt"];

DATA.notes = [
  { title: "Is multitasking a myth?", lines: [{ s: 1, name: "Professor", t: "Okay, so today I want to talk about multitasking. A lot of you probably think you're good at it. You study with music on, check your phone, maybe keep a video running in the background. And honestly, I used to believe I could do it too. But the research here is pretty clear, and frankly, it's not good news. What we call multitasking is usually task switching. The brain moves attention back and forth very quickly, and every switch has a cost. Psychologists call it a switch cost: a small delay and a drop in accuracy each time you change tasks. Those small costs add up. In several studies, people who switched between tasks took noticeably longer and made more errors than people who did the same tasks one after another. Now, some people claim they're the exception, that they're natural multitaskers. I'm skeptical. In one well-known study, the people who multitasked the most actually did worse on tests of attention than light multitaskers. In other words, confidence isn't the same as ability. So what's my advice? Put the phone in another room when you study. It sounds simple, maybe even a little old-fashioned, but it works." }],
    attitude: ["honestly", "frankly, it's not good news", "I'm skeptical", "confidence isn't the same as ability", "but it works"],
    model: "TOPIC: is multitasking a myth? Prof: negative\n- multitasking is really task SWITCHING\n- each switch has a \"switch cost\": slower + less accurate; costs add up\n- studies: switchers slower, more errors than one task at a time\n- \"natural multitaskers\"? prof skeptical\n   heavy multitaskers did WORSE on attention tests than light ones\n   so confidence is not ability (key point)\n- advice: phone in another room (simple, old-fashioned, but works)",
    questions: [
      { q: "What is the main idea of the talk?", options: ["Music helps students concentrate", "What people call multitasking is task switching, which hurts performance", "Some people are naturally better at multitasking", "Phones should be banned from universities"], answer: 1, why: "Everything in the talk supports one claim: switching between tasks has a cost." },
      { q: "According to the professor, what is a switch cost?", options: ["The price of new study technology", "Time lost by turning off a phone", "A small delay and drop in accuracy each time attention changes", "The effort of learning a new task"], answer: 2, why: "She defines it directly. In your notes: switch cost = slower + less accurate." },
      { q: "What is the professor's attitude toward people who say they are natural multitaskers?", options: ["She is impressed by them", "She is skeptical of their claim", "She has no opinion", "She wishes she were like them"], answer: 1, why: "She says \"I'm skeptical\" and then gives evidence. Note her doubt in a word, such as \"skeptical.\"" },
      { q: "Why does the professor mention the study of people who multitask the most?", options: ["To show that confidence in multitasking doesn't mean skill at it", "To explain how the brain stores memories", "To recommend a type of attention test", "To show that light multitaskers study less"], answer: 0, why: "She concludes it herself: \"confidence isn't the same as ability.\" Conclusions after evidence are worth marking as key points." },
      { q: "What does the professor imply about her final advice?", options: ["It is a new scientific discovery", "It may seem unexciting, but she is confident it is effective", "Most students already follow it", "It only works for some students"], answer: 1, why: "\"It sounds simple, maybe even old-fashioned, but it works\" — she admits it's plain, then shows confidence after \"but.\"" }
    ] },
  { title: "Wind turbines and birds", lines: [{ s: 0, name: "Professor", t: "Let's turn to a question that comes up whenever wind farms are proposed: do wind turbines kill a lot of birds? The short answer is yes, turbines do kill birds, and I don't want to pretend otherwise. But the scale is often misunderstood. Estimates for the United States suggest that turbines kill a few hundred thousand birds a year. That sounds like a lot, and it is. Compare it, though, with buildings and glass windows, which kill hundreds of millions, or with pet cats, which kill well over a billion. So if your main concern is bird deaths, wind turbines are, frankly, a fairly small part of the picture. That said, location really matters. A badly placed wind farm on a migration route, or near places where eagles nest, can do serious local damage. And here's what I find encouraging: some newer approaches are reducing collisions. For instance, a small study in Norway found that painting one of the three blades black reduced bird deaths substantially, apparently because birds could see the moving blades more easily. We need bigger studies before we celebrate, but it's a promising start." }],
    attitude: ["I don't want to pretend otherwise", "often misunderstood", "frankly, a fairly small part of the picture", "That said", "what I find encouraging", "We need bigger studies before we celebrate", "a promising start"],
    model: "TOPIC: do wind turbines kill many birds? Yes, but scale misunderstood\n- US turbines: a few hundred thousand birds/yr\n   compare: buildings/glass hundreds of millions; pet cats over 1 billion\n   so turbines = small part of the problem\n- BUT location matters (key point): migration routes, eagle nests = serious local damage\n- new idea: Norway study, 1 blade painted black, fewer deaths (birds see blades)\n   prof: hopeful but wants bigger studies",
    questions: [
      { q: "What is the talk mainly about?", options: ["How wind turbines generate electricity", "How serious the threat of wind turbines to birds is, compared with other causes", "Why cats are dangerous to birds", "How eagles choose places to nest"], answer: 1, why: "The opening question sets the topic; the rest weighs turbine deaths against other causes." },
      { q: "Why does the professor mention buildings and pet cats?", options: ["To suggest new ways to protect birds", "To put the number of birds killed by turbines in perspective", "To argue that cats should be kept indoors", "To explain where birds migrate"], answer: 1, why: "Comparisons signaled by \"Compare it, though, with…\" usually serve to put a number in perspective." },
      { q: "What does the professor say about the location of wind farms?", options: ["It does not affect bird deaths", "Poorly placed wind farms can cause serious local harm", "Wind farms should only be built near cities", "Location matters more for cats than for birds"], answer: 1, why: "\"That said\" marks a shift: after downplaying the problem, she adds an important exception." },
      { q: "What is the professor's attitude toward the Norway study?", options: ["Dismissive", "Hopeful but cautious", "Completely convinced", "Confused"], answer: 1, why: "\"Encouraging\" and \"promising\" are positive, but \"we need bigger studies before we celebrate\" adds caution." },
      { q: "Which best describes the professor's overall view?", options: ["Turbines are harmless to birds", "Turbines are a major threat that should stop wind energy", "Turbines do kill birds, but the problem is often exaggerated and can be reduced", "Nobody knows how many birds turbines kill"], answer: 2, why: "She admits the harm (\"I don't want to pretend otherwise\") and then argues the scale is small and manageable." }
    ] },
  { title: "The 10,000-hour rule", lines: [{ s: 1, name: "Professor", t: "You've probably heard of the ten-thousand-hour rule: the idea that anyone can become an expert at anything with ten thousand hours of practice. It's a great story, and it's sold a lot of books. Unfortunately, it's a bit of a distortion. The idea came from research by the psychologist Anders Ericsson, who studied violin students in Berlin. He found that the best performers had, on average, practiced far more by age twenty than the others. But Ericsson himself objected to the rule. For one thing, ten thousand was an average, not a magic number. Some of the top students had practiced much less. More importantly, his work was about a specific kind of practice, what he called deliberate practice: focused effort on your weaknesses, with feedback from a teacher. Simply repeating something you already do well doesn't count. Later research has also suggested that practice explains less of the difference between people than the popular version claims, especially outside structured fields like music and chess. So should you stop practicing? Of course not. Practice clearly matters. Just don't expect hours alone to do the work. How you practice matters at least as much as how long." }],
    attitude: ["It's a great story, and it's sold a lot of books", "Unfortunately, it's a bit of a distortion", "Ericsson himself objected", "Of course not", "Practice clearly matters", "Just don't expect hours alone to do the work"],
    model: "TOPIC: the 10,000-hour rule: popular but distorted (prof critical)\n- origin: Ericsson, violin students in Berlin; best ones practiced more by age 20\n- Ericsson himself rejected the \"rule\":\n   1. 10,000 = average, not a magic number; some top students practiced less\n   2. deliberate practice (key term) = focus on weaknesses + teacher feedback\n      just repeating does not count\n- later research: practice explains less than claimed, esp. outside music/chess\n- conclusion: practice matters, but HOW you practice matters as much as how long",
    questions: [
      { q: "What is the main point of the talk?", options: ["Practice is not useful for becoming an expert", "The popular 10,000-hour rule oversimplifies research on expertise", "Violin students in Berlin practice more than others", "Experts are born, not made"], answer: 1, why: "\"It's a bit of a distortion\" states her thesis early. The rest explains why." },
      { q: "According to the professor, what is deliberate practice?", options: ["Practicing for at least 10,000 hours", "Repeating skills you already have", "Focused work on weaknesses, with feedback from a teacher", "Practicing only music or chess"], answer: 2, why: "A defined term (\"what he called…\") is almost always tested. Always note definitions." },
      { q: "Why does the professor mention that Ericsson objected to the rule?", options: ["To show that even the original researcher disagreed with the popular version", "To criticize Ericsson's research methods", "To explain why the rule became popular", "To compare Ericsson with other psychologists"], answer: 0, why: "Mentioning the original researcher's objection makes her criticism of the rule stronger." },
      { q: "What is the professor's attitude toward the 10,000-hour rule?", options: ["Enthusiastic", "Critical of how it simplifies the research", "Indifferent", "She believes practice is useless"], answer: 1, why: "\"Unfortunately… a distortion\" is negative about the rule, but she still says practice matters." },
      { q: "Why does the professor say, \"So should you stop practicing? Of course not\"?", options: ["To change the topic", "To prevent listeners from drawing the wrong conclusion", "To admit she was wrong earlier", "To introduce a new study"], answer: 1, why: "After criticizing the rule, she heads off the mistaken idea that practice doesn't matter." }
    ] }
];
DATA.byo = [{ title: "Your own lecture or podcast" }];

DATA.guided = [
  { title: "Why do we yawn?", lines: [{ s: 1, name: "Professor", t: "Today, a question that sounds simple: why do we yawn? For a long time, the most popular explanation was that yawning brings more oxygen into the body. It's a reasonable guess, but experiments didn't support it. When researchers had people breathe air with extra oxygen, they yawned just as often. A newer idea is the brain-cooling hypothesis. According to this view, a yawn pulls in a large amount of air and increases blood flow, which helps cool the brain slightly. Supporters point out that people tend to yawn more when the air around them is cooler than their bodies, and less in very hot conditions. Then there's contagious yawning, the fact that seeing someone else yawn makes you yawn. Interestingly, this seems to be stronger between friends and family than between strangers, which has led some researchers to link it to empathy. Personally, I think the brain-cooling idea is promising, but the honest answer is that we still don't fully know." }],
    skeleton: "TOPIC: why do we [[yawn|yawning]]?\nOld theory: yawning brings more [[oxygen|o2]]\n   experiments did [[not|n't|no]] support it: with extra oxygen, people yawned just as [[often|much]]\nNew theory: brain-[[cooling|cool]] hypothesis\n   yawn pulls in air and more [[blood]] flow\n   evidence: more yawning when air is [[cooler|cool|cold]], less when very [[hot|warm|heat]]\nContagious yawning: stronger with [[friends|family]] than strangers\n   possibly linked to [[empathy|empath]]\nSpeaker's view: brain-cooling = [[promising|hopeful|good|likely|interesting]], but we still don't fully [[know|understand]]" },
  { title: "The placebo effect", lines: [{ s: 0, name: "Professor", t: "Let's look at the placebo effect. A placebo is a treatment with no active ingredient, like a sugar pill. Yet in many studies, patients who receive a placebo report real improvements, especially for pain, nausea, and tiredness. Why? One major factor is expectation. If you believe a treatment will help, your brain can actually reduce how strongly it processes pain signals. Context matters too. Studies have found that larger pills, more expensive-looking packaging, and a warm, confident doctor can all make a placebo work better. Now here's the surprising part. In some experiments, patients were told openly that they were taking a placebo, and many still felt better. These are called open-label placebos. I'll be honest, I was doubtful when I first read about them, but the results have been repeated several times, mostly for conditions like long-term back pain. That said, placebos don't shrink tumors or cure infections. They mainly change how we experience symptoms." }],
    skeleton: "TOPIC: the [[placebo|placebos]] effect\nPlacebo = treatment with no active [[ingredient|ingredients]], e.g. a sugar [[pill]]\nReal improvements, esp. for [[pain|nausea|tired]], nausea, tiredness\nWhy? 1. [[expectation|expect|belief|believe]]: brain reduces pain signals\n     2. [[context]]: larger pills, expensive [[packaging|package|price|looking]], confident [[doctor|doctors]]\nSurprise: [[open-label|open label|open]] placebos: patients KNOW, but many still feel [[better]]\nSpeaker's view: at first [[doubtful|skeptical|doubted|doubt]], but results repeated\nLimit: don't cure [[infections|infection|tumors|tumours|disease]]; mainly change how we [[experience|feel]] symptoms" },
  { title: "The Silk Road wasn't a road", lines: [{ s: 1, name: "Professor", t: "When people hear the Silk Road, they often imagine a single highway running from China to Rome. That picture is misleading. The term was actually invented in the nineteenth century by a German geographer, Ferdinand von Richthofen. In reality, it was a shifting network of routes, both over land and by sea. And very few traders traveled the whole distance. Instead, goods passed from merchant to merchant, city to city, a bit like a relay race. Silk was important, of course, but it was only one product among many. Spices, paper, horses, glass, and precious metals all moved along these routes. And honestly, I'd argue the most valuable things exchanged weren't goods at all. Ideas traveled too. Religions like Buddhism spread along these routes, as did technologies such as papermaking. So the name isn't exactly wrong, but it hides how complex, and how human, this network really was." }],
    skeleton: "TOPIC: Silk Road was not a single [[road|highway|route]]\nName invented in the [[19th|nineteenth|1800s|19c]] century by a German [[geographer]]\nReality: a [[network|web]] of routes, over land and by [[sea|water]]\nFew traders went the whole way; goods passed on like a [[relay]] race\nSilk = only one [[product|good|item|thing]] among many (spices, paper, horses…)\nSpeaker's view: most valuable exchange = [[ideas|idea]]\n   e.g. religions like [[buddhism|buddhist]], technologies like [[papermaking|paper]]\nConclusion: name hides how [[complex|complicated]] and human it was" }
];

DATA.segment = [
  { title: "How tides work", segments: [
    { t: "Today we're looking at tides, the regular rise and fall of sea level along coasts. Most places see two high tides and two low tides roughly every day.", keys: [["tide"], ["two", "2", "twice"], ["rise", "high", "fall", "low", "up", "down"]], model: "tides: sea rises/falls, 2 highs and 2 lows daily" },
    { t: "The main cause is the moon's gravity. It pulls on the ocean nearest to it, creating a bulge of water on that side of Earth.", keys: [["moon"], ["gravity", "pull"], ["bulge", "pile", "bump"]], model: "cause: moon's gravity pulls water into near-side bulge" },
    { t: "What surprises many students is that there's a second bulge on the opposite side of Earth. That happens because the moon pulls the Earth itself slightly away from the water on the far side.", keys: [["second", "second", "opposite", "far", "other"], ["away", "pull", "earth"]], model: "second bulge far side: Earth pulled away from water" },
    { t: "As Earth rotates, coastlines pass through both bulges, which is why we get two high tides a day.", keys: [["rotat", "spin", "turn"], ["both", "two", "2"]], model: "Earth rotates through both bulges: 2 high tides" },
    { t: "The sun matters too, though its effect is a bit less than half of the moon's. When the sun and moon line up, at new moon and full moon, we get especially large tides called spring tides. And no, they have nothing to do with the season.", keys: [["sun"], ["less", "half", "smaller", "weaker"], ["spring"], ["line", "align", "full", "new"]], model: "sun: under half moon's effect; aligned = spring tides" }
  ] },
  { title: "Why invasive species succeed", segments: [
    { t: "An invasive species is one that's introduced to a new region and spreads quickly, often harming native species. But not every introduced species becomes invasive. In fact, most fail to establish themselves at all.", keys: [["invasive"], ["new", "introduc"], ["most", "fail", "not every", "not all"]], model: "invasive = new region, spreads fast; most introduced fail" },
    { t: "So why do some succeed? One leading explanation is the enemy release hypothesis. At home, a species is kept in check by predators, parasites, and diseases. In a new region, those enemies are often missing.", keys: [["enemy", "enemies", "predator"], ["release"], ["missing", "absent", "gone", "left", "lack", "without"]], model: "enemy release: predators/parasites missing in new region" },
    { t: "Take the cane toad in Australia. It was introduced in the 1930s to control beetles on sugar cane farms. With few natural predators, its population exploded, and it has now spread across much of northern Australia.", keys: [["toad"], ["australia"], ["predator", "exploded", "spread"]], model: "example: cane toad, Australia; few predators, spread" },
    { t: "Another factor is what ecologists call propagule pressure, which simply means how many individuals are introduced, and how often. More releases mean a better chance that some survive.", keys: [["propagule", "pressure"], ["how many", "number", "more", "often", "releases"]], model: "propagule pressure: more released, more often = survival" },
    { t: "Personally, I think enemy release gets too much attention. It explains some cases well, but in many studies, the number of individuals released predicts success at least as well. So if we want to prevent invasions, controlling what gets moved around may matter most.", keys: [["too much", "overrated", "overemphas", "skeptic", "doubt", "attention"], ["number", "propagule", "released"], ["prevent", "control", "moved", "moving"]], model: "prof: enemy release overrated; control what's moved" }
  ] }
];
