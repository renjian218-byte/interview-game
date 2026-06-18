const imagePaths = {
  interviewer: {
    normal: "assets/images/miyuki_normal.png",
    smile: "assets/images/miyuki_smile.png",
    softsmile: "assets/images/miyuki_softsmile.png",
    thinking: "assets/images/miyuki_thinking.png",
    confused: "assets/images/miyuki_confused.png",
    displeased: "assets/images/miyuki_displeased.png",
    embarrassed: "assets/images/miyuki_embarrassed.png",
    angry: "assets/images/miyuki_angry.png"
  }
};

const expressionBasePath = "assets/images/";
const expressionFileNames = {
  "normal.png": "miyuki_normal.png",
  "smile.png": "miyuki_smile.png",
  "softsmile.png": "miyuki_softsmile.png",
  "serious.png": "miyuki_thinking.png",
  "strict.png": "miyuki_angry.png",
  "interested.png": "miyuki_softsmile.png",
  "pleased.png": "miyuki_softsmile.png",
  "disappointed.png": "miyuki_displeased.png",
  "surprised.png": "miyuki_confused.png",
  "suspicious.png": "miyuki_confused.png",
  "thinking.png": "miyuki_thinking.png",
  "confused.png": "miyuki_confused.png",
  "displeased.png": "miyuki_displeased.png",
  "embarrassed.png": "miyuki_embarrassed.png",
  "angry.png": "miyuki_angry.png",
  "relieved.png": "miyuki_softsmile.png"
};

const expressionPreloadCache = new Map();
const expressionSwapTokens = new WeakMap();
const expressionFadeDelay = 90;

function getAllExpressionPaths() {
  return [...new Set([
    ...Object.values(imagePaths.interviewer),
    ...Object.values(expressionFileNames).map((fileName) => `${expressionBasePath}${fileName}`)
  ])];
}

function preloadExpressionImage(src) {
  const cached = expressionPreloadCache.get(src);
  if (cached) {
    return cached.promise;
  }

  const image = new Image();
  image.decoding = "async";

  const promise = new Promise((resolve, reject) => {
    image.addEventListener("load", async () => {
      try {
        if (image.decode) {
          await image.decode();
        }
      } catch (error) {
        // The image is already loaded; keep going even if decode() cannot be used.
      }

      resolve(image);
    }, { once: true });

    image.addEventListener("error", () => {
      reject(new Error(`Failed to preload image: ${src}`));
    }, { once: true });
  });

  expressionPreloadCache.set(src, { image, promise });
  image.src = src;

  return promise;
}

function preloadExpressionImages() {
  return Promise.allSettled(getAllExpressionPaths().map((src) => preloadExpressionImage(src)));
}

async function decodeExpressionBeforeDisplay(src) {
  await preloadExpressionImage(src);
}

void preloadExpressionImages();

const beginnerQuestions = [
  {
    id: 1,
    title: "入室前：ノックと入室",
    scene: "あなたは面接室の前に着きました。中には面接官がいます。最初にどう行動しますか？",
    choices: [
      {
        text: "ドアを3回ノックし、「どうぞ」と言われてから「失礼いたします」と言って入室する。",
        rank: "正解",
        score: 3,
        expression: "smile.png",
        interviewerComment: "落ち着いていますね。基本的なマナーがしっかりできています。",
        feedback: "基本マナーができており、落ち着いた第一印象を与えられます。"
      },
      {
        text: "ドアを2回ノックし、少し間を置いてから「失礼します」と言って入室する。",
        rank: "普通",
        score: 2,
        expression: "normal.png",
        interviewerComment: "大きな問題はありませんが、面接ではもう少し丁寧さを意識したいですね。",
        feedback: "大きな失礼ではありませんが、面接では3回ノックの方が無難です。"
      },
      {
        text: "ノック後、返事が聞こえる前に「失礼します」と言って入室する。",
        rank: "少し悪い",
        score: 1,
        expression: "serious.png",
        interviewerComment: "少し急いでいる印象を受けますね。",
        feedback: "相手の返事を待つ余裕がほしいです。"
      },
      {
        text: "遅れそうで焦っていたので、ノックを短くしてすぐ入室する。",
        rank: "かなり悪い",
        score: 0,
        expression: "strict.png",
        interviewerComment: "最初の印象としては、少し落ち着きに欠けるかもしれません。",
        feedback: "第一印象で礼儀や落ち着きに不安を持たれやすい行動です。"
      }
    ]
  },
  {
    id: 2,
    title: "入室後：ドアの閉め方と最初のお辞儀",
    scene: "入室しました。次にドアを閉め、面接官に向き直る場面です。",
    choices: [
      {
        text: "ドアの方を向いて静かに閉め、面接官に向き直って一礼する。",
        rank: "正解",
        score: 3,
        expression: "smile.png",
        interviewerComment: "丁寧で自然な所作ですね。",
        feedback: "ドアの閉め方と一礼が丁寧で、基本的な所作ができています。"
      },
      {
        text: "ドアを静かに閉めるが、すぐ椅子の近くまで進んでから一礼する。",
        rank: "普通",
        score: 2,
        expression: "normal.png",
        interviewerComment: "大きな問題はありませんが、入室直後の一礼があるとより丁寧です。",
        feedback: "悪くはありませんが、入室直後に一礼するとさらに印象が良くなります。"
      },
      {
        text: "面接官に背を向けすぎないよう意識した結果、後ろ手でドアを閉める。",
        rank: "少し悪い",
        score: 1,
        expression: "serious.png",
        interviewerComment: "配慮は感じますが、少し雑に見えてしまうかもしれません。",
        feedback: "後ろ手で閉めると雑な印象になりやすいです。"
      },
      {
        text: "ドアを閉めながら「お願いします」と言い、歩きながら軽く頭を下げる。",
        rank: "かなり悪い",
        score: 0,
        expression: "strict.png",
        interviewerComment: "少し動作が流れてしまっていますね。",
        feedback: "動作と言葉が流れていて、落ち着きがない印象になります。"
      }
    ]
  },
  {
    id: 3,
    title: "椅子の横：名乗りと着席",
    scene: "椅子の横まで来ました。面接官はまだ「座ってください」とは言っていません。",
    choices: [
      {
        text: "椅子の横に立ち、「〇〇大学の〇〇です。本日はよろしくお願いいたします」と挨拶し、促されてから座る。",
        rank: "正解",
        score: 3,
        expression: "pleased.png",
        interviewerComment: "とても自然で丁寧ですね。",
        feedback: "名乗り・挨拶・着席の順番が自然で、好印象です。"
      },
      {
        text: "椅子の横で名乗り、「失礼いたします」と言って、相手の反応を見ながら座る。",
        rank: "普通",
        score: 2,
        expression: "normal.png",
        interviewerComment: "悪くありません。ただ、こちらから促されてから座るとより安心です。",
        feedback: "大きな問題はありませんが、明確に促されてから座る方が安全です。"
      },
      {
        text: "緊張しているので、先に座ってから姿勢を正して名乗る。",
        rank: "少し悪い",
        score: 1,
        expression: "serious.png",
        interviewerComment: "少し順番が惜しいですね。",
        feedback: "勝手に座った印象になりやすいため、促されてから座るのが基本です。"
      },
      {
        text: "荷物を置いて座り、「あ、〇〇大学の〇〇です」と後から名乗る。",
        rank: "かなり悪い",
        score: 0,
        expression: "disappointed.png",
        interviewerComment: "少し準備不足な印象を受けます。",
        feedback: "準備不足や緊張に飲まれている印象が強くなります。"
      }
    ]
  },
  {
    id: 4,
    title: "冒頭の自己紹介",
    scene: "面接官の質問：「では、まず簡単に自己紹介をお願いします。」",
    choices: [
      {
        text: "「〇〇大学〇〇学部の〇〇です。大学ではゼミで地域活性化を学び、サークルでは新入生対応を担当しました。本日はよろしくお願いいたします。」",
        rank: "正解",
        score: 3,
        expression: "interested.png",
        interviewerComment: "簡潔で、あなたの背景も伝わりますね。",
        feedback: "所属・経験・挨拶が簡潔にまとまっています。"
      },
      {
        text: "「〇〇大学の〇〇です。大学ではゼミとアルバイトを頑張ってきました。本日はよろしくお願いします。」",
        rank: "普通",
        score: 2,
        expression: "normal.png",
        interviewerComment: "分かりやすいですが、もう少し具体性があると印象に残りやすいです。",
        feedback: "簡潔ですが、少し情報が薄いため、もう一言具体性がほしいです。"
      },
      {
        text: "「〇〇です。緊張していますが、頑張って話します。よろしくお願いします。」",
        rank: "少し悪い",
        score: 1,
        expression: "thinking.png",
        interviewerComment: "人柄は伝わりますが、自己紹介としては少し情報が少ないですね。",
        feedback: "人柄は伝わりますが、自己紹介としての情報が足りません。"
      },
      {
        text: "「履歴書に書いてある通りですが、〇〇大学の〇〇です。よろしくお願いします。」",
        rank: "かなり悪い",
        score: 0,
        expression: "strict.png",
        interviewerComment: "少し受け身な印象を受けます。",
        feedback: "話す意欲が弱く見え、面接での印象が下がりやすいです。"
      }
    ]
  },
  {
    id: 5,
    title: "自己PR",
    scene: "面接官の質問：「あなたの強みを教えてください。」",
    choices: [
      {
        text: "「私の強みは、相手の状況を見て行動を調整できることです。アルバイト先で新人によって教え方を変えた結果、定着率の改善に貢献しました。御社でも相手目線を大切にして働きたいです。」",
        rank: "正解",
        score: 3,
        expression: "pleased.png",
        interviewerComment: "具体例があり、入社後の活かし方も見えますね。",
        feedback: "結論・具体例・入社後の活かし方があり、説得力があります。"
      },
      {
        text: "「私の強みはコミュニケーション力です。アルバイトでも周りと協力して働いてきたので、社会人になっても活かせると思います。」",
        rank: "普通",
        score: 2,
        expression: "normal.png",
        interviewerComment: "方向性は良いですが、もう少し具体的なエピソードがあるとよいですね。",
        feedback: "方向性は良いですが、具体例が弱く印象に残りにくいです。"
      },
      {
        text: "「強みは真面目なところです。遅刻をしないようにしていて、提出物もなるべく早く出すようにしています。」",
        rank: "少し悪い",
        score: 1,
        expression: "serious.png",
        interviewerComment: "真面目さは伝わりますが、仕事でどう活きるかが少し見えにくいです。",
        feedback: "悪くはありませんが、仕事でどう活きるかが見えにくいです。"
      },
      {
        text: "「特別な強みはまだ分かりませんが、入社してから身につけたいです。」",
        rank: "かなり悪い",
        score: 0,
        expression: "disappointed.png",
        interviewerComment: "自己分析がまだ不足しているように感じます。",
        feedback: "自己分析不足に見えるため、現時点の強みを言語化する必要があります。"
      }
    ]
  },
  {
    id: 6,
    title: "ガクチカ",
    scene: "面接官の質問：「学生時代に力を入れたことを教えてください。」",
    choices: [
      {
        text: "「ゼミ活動で地域イベントの来場者アンケートを分析したことです。最初は回答数が少なかったため、質問数を減らし、声かけ方法を変えました。その結果、前年より多くの回答を集め、改善提案につなげました。」",
        rank: "正解",
        score: 3,
        expression: "interested.png",
        interviewerComment: "課題に対して工夫した流れが分かりやすいですね。",
        feedback: "課題・工夫・結果があり、行動の再現性が伝わります。"
      },
      {
        text: "「ゼミ活動です。メンバーと協力して発表資料を作り、最後までやり切りました。」",
        rank: "普通",
        score: 2,
        expression: "normal.png",
        interviewerComment: "分かりやすいですが、あなた自身の役割がもう少し知りたいですね。",
        feedback: "分かりやすいですが、本人の工夫や役割が少し弱いです。"
      },
      {
        text: "「アルバイトを頑張りました。忙しい日も休まず働いたので、責任感はあると思います。」",
        rank: "少し悪い",
        score: 1,
        expression: "thinking.png",
        interviewerComment: "努力は伝わりますが、そこから何を学んだかも聞きたいですね。",
        feedback: "努力は伝わりますが、成長や工夫が見えにくいです。"
      },
      {
        text: "「正直、学生時代はそこまで力を入れたことはありません。単位を取ることを優先していました。」",
        rank: "かなり悪い",
        score: 0,
        expression: "strict.png",
        interviewerComment: "経験の大小より、取り組みから何を学んだかが大切です。",
        feedback: "経験の大小よりも、取り組みから何を学んだかを話す必要があります。"
      }
    ]
  },
  {
    id: 7,
    title: "志望動機",
    scene: "面接官の質問：「なぜ当社を志望したのですか？」",
    choices: [
      {
        text: "「人の選択を支えるサービスに関わりたいと考えています。大学で進路選択に悩む友人を支援した経験から、情報提供の重要性を感じました。中でも御社は利用者目線の改善に力を入れている点に魅力を感じています。」",
        rank: "正解",
        score: 3,
        expression: "pleased.png",
        interviewerComment: "ご自身の経験と当社への関心がつながっていますね。",
        feedback: "自分の経験と企業理解がつながっており、志望理由に説得力があります。"
      },
      {
        text: "「御社の事業内容に興味があり、成長できる環境だと感じたため志望しました。」",
        rank: "普通",
        score: 2,
        expression: "normal.png",
        interviewerComment: "悪くありませんが、もう少し具体的に聞きたいですね。",
        feedback: "無難ですが、他社ではなくこの会社である理由が弱いです。"
      },
      {
        text: "「業界に将来性があると思ったからです。安定して働けそうな点にも魅力を感じました。」",
        rank: "少し悪い",
        score: 1,
        expression: "serious.png",
        interviewerComment: "条件面だけでなく、仕事内容への関心も知りたいですね。",
        feedback: "条件面に寄りすぎると、仕事への関心が弱く見えます。"
      },
      {
        text: "「正直、いろいろな会社を受けていて、その中で御社も合いそうだと思いました。」",
        rank: "かなり悪い",
        score: 0,
        expression: "disappointed.png",
        interviewerComment: "志望度が少し伝わりにくいですね。",
        feedback: "本音に近くても、志望度が低く見えてしまいます。"
      }
    ]
  },
  {
    id: 8,
    title: "深掘り質問：失敗経験",
    scene: "面接官の質問：「これまでの失敗経験と、そこから学んだことを教えてください。」",
    choices: [
      {
        text: "「ゼミ発表で準備不足のまま本番を迎え、質問に十分答えられなかったことです。以後は想定質問を事前に作り、第三者に見てもらうようにしました。失敗後の準備の質が大切だと学びました。」",
        rank: "正解",
        score: 3,
        expression: "interested.png",
        interviewerComment: "失敗を認めたうえで、改善行動まで話せている点が良いですね。",
        feedback: "失敗を認め、改善行動まで話せているため好印象です。"
      },
      {
        text: "「アルバイトで一度ミスをしたことがあります。その後は同じミスをしないように確認を増やしました。」",
        rank: "普通",
        score: 2,
        expression: "normal.png",
        interviewerComment: "改善しようとした姿勢は伝わります。もう少し具体的だとさらに良いですね。",
        feedback: "悪くありませんが、状況や学びが少し浅いです。"
      },
      {
        text: "「大きな失敗はあまりありません。慎重な性格なので、失敗しないように行動しています。」",
        rank: "少し悪い",
        score: 1,
        expression: "suspicious.png",
        interviewerComment: "失敗経験がないというより、そこから何を学んだかを聞きたい質問です。",
        feedback: "失敗から学ぶ姿勢が見えにくい回答です。"
      },
      {
        text: "「失敗は周りとの連携不足が原因だったと思います。自分だけでは防げなかった部分もあります。」",
        rank: "かなり悪い",
        score: 0,
        expression: "strict.png",
        interviewerComment: "少し他責に聞こえてしまうかもしれません。",
        feedback: "他責に聞こえやすいため、自分の改善点を話す必要があります。"
      }
    ]
  },
  {
    id: 9,
    title: "逆質問",
    scene: "面接官の質問：「最後に、何か質問はありますか？」",
    choices: [
      {
        text: "「御社で若手のうちから活躍している方に共通する行動や考え方があれば教えていただきたいです。入社までに意識して準備したいです。」",
        rank: "正解",
        score: 3,
        expression: "pleased.png",
        interviewerComment: "入社後を見据えた良い質問ですね。",
        feedback: "入社意欲と成長意欲が伝わる逆質問です。"
      },
      {
        text: "「入社までに勉強しておいた方がよいことはありますか？」",
        rank: "普通",
        score: 2,
        expression: "normal.png",
        interviewerComment: "前向きな質問ですね。企業理解を絡めるとさらに良くなります。",
        feedback: "良い質問ですが、もう少し企業理解を絡めるとさらに強くなります。"
      },
      {
        text: "「残業時間や休みの取りやすさについて教えてください。」",
        rank: "少し悪い",
        score: 1,
        expression: "serious.png",
        interviewerComment: "大切な確認ですが、質問の順番や聞き方には注意したいですね。",
        feedback: "大事な確認ですが、面接終盤の最初の逆質問としては条件面が前に出すぎます。"
      },
      {
        text: "「特にありません。説明でだいたい分かりました。」",
        rank: "かなり悪い",
        score: 0,
        expression: "disappointed.png",
        interviewerComment: "関心が薄いように受け取られる可能性があります。",
        feedback: "関心が薄く見えます。疑問が解消した場合も言い方を工夫したいです。"
      }
    ]
  },
  {
    id: 10,
    title: "面接終了・退出",
    scene: "面接官が「本日の面接は以上です」と言いました。退出までどう行動しますか？",
    choices: [
      {
        text: "座ったままお礼を述べ、立ち上がって椅子の横で一礼し、ドア前で再度「失礼いたします」と言って退出する。",
        rank: "正解",
        score: 3,
        expression: "relieved.png",
        interviewerComment: "最後まで丁寧で、とても良い締め方です。",
        feedback: "最後まで丁寧で、面接全体の印象を崩しません。"
      },
      {
        text: "立ち上がって「本日はありがとうございました」と言い、軽く一礼して退出する。",
        rank: "普通",
        score: 2,
        expression: "normal.png",
        interviewerComment: "悪くありません。ドア前でもう一度一礼できるとより丁寧です。",
        feedback: "悪くありませんが、ドア前での一礼まであるとより丁寧です。"
      },
      {
        text: "お礼を言った後、荷物を急いでまとめながら「失礼します」と言って退出する。",
        rank: "少し悪い",
        score: 1,
        expression: "serious.png",
        interviewerComment: "最後に少し気が抜けた印象になってしまいますね。",
        feedback: "面接が終わって気が抜けた印象になります。"
      },
      {
        text: "面接が終わった安心感で、ドアを出ながらスマホを確認する。",
        rank: "かなり悪い",
        score: 0,
        expression: "strict.png",
        interviewerComment: "退出後まで見られている意識を持ちたいですね。",
        feedback: "退出後まで見られている意識が必要です。最後の印象を大きく下げます。"
      }
    ]
  }
];

const intermediateQuestions = [
  {
    id: 1,
    level: "中級",
    title: "自己PRの深掘り",
    scene: "面接官の質問：「あなたの強みは分かりました。その強みが一番発揮された場面を、具体的に教えてください。」",
    choices: [
      {
        text: "「アルバイトで新人教育を任されたときです。相手によって理解度が違ったため、説明の順番やメモの渡し方を変えました。その結果、新人が独り立ちするまでの期間を短くできました。」",
        rank: "正解",
        score: 3,
        expression: "pleased.png",
        interviewerComment: "具体的な場面と工夫が分かりやすいですね。",
        feedback: "強みを具体的な行動と結果で説明できています。再現性も伝わります。"
      },
      {
        text: "「アルバイトやゼミなど、いろいろな場面で発揮できたと思います。周りからも頼られることが多かったです。」",
        rank: "普通",
        score: 2,
        expression: "normal.png",
        interviewerComment: "方向性は良いですが、もう少し一つの場面に絞ると伝わりやすいです。",
        feedback: "悪くはありませんが、具体的なエピソードが弱く、印象に残りにくいです。"
      },
      {
        text: "「正直、どの場面が一番かは分かりません。ただ、自分では普段から意識しているつもりです。」",
        rank: "少し悪い",
        score: 1,
        expression: "thinking.png",
        interviewerComment: "少し準備不足に感じますね。",
        feedback: "強みを裏付ける経験が出てこないと、説得力が下がります。"
      },
      {
        text: "「強みなので、特別な場面というより、どんなときでも自然にできています。」",
        rank: "かなり悪い",
        score: 0,
        expression: "strict.png",
        interviewerComment: "抽象的で、判断が難しい回答ですね。",
        feedback: "具体例を避けているように聞こえます。面接では実際の行動で説明する必要があります。"
      }
    ]
  },
  {
    id: 2,
    level: "中級",
    title: "ガクチカの本人の役割",
    scene: "面接官の質問：「その取り組みの中で、あなた自身はどのような役割を担いましたか？」",
    choices: [
      {
        text: "「私は進行管理を担当しました。メンバーごとの作業状況に差があったため、締切を細かく分け、週1回の確認時間を作りました。」",
        rank: "正解",
        score: 3,
        expression: "interested.png",
        interviewerComment: "あなた自身の役割と行動が具体的ですね。",
        feedback: "チームの話だけでなく、自分が何をしたかが明確に伝わっています。"
      },
      {
        text: "「みんなで協力して進めました。私はできる範囲で資料作成や話し合いに参加しました。」",
        rank: "普通",
        score: 2,
        expression: "normal.png",
        interviewerComment: "協調性は伝わりますが、あなたならではの動きがもう少し知りたいです。",
        feedback: "チームワークは伝わりますが、本人の貢献がややぼやけています。"
      },
      {
        text: "「リーダーではなかったので、大きな役割はありませんでしたが、迷惑をかけないようにしました。」",
        rank: "少し悪い",
        score: 1,
        expression: "serious.png",
        interviewerComment: "役職がなくても、主体的に動いた部分を聞きたいですね。",
        feedback: "役職の有無に頼りすぎています。小さくても自分の工夫を話すべきです。"
      },
      {
        text: "「正直、他のメンバーの方が中心でした。私は指示されたことをやっていました。」",
        rank: "かなり悪い",
        score: 0,
        expression: "disappointed.png",
        interviewerComment: "主体性が少し伝わりにくいですね。",
        feedback: "受け身な印象が強く、評価されにくい回答です。"
      }
    ]
  },
  {
    id: 3,
    level: "中級",
    title: "志望動機の深掘り",
    scene: "面接官の質問：「同じ業界の中でも、なぜ当社を選んだのですか？」",
    choices: [
      {
        text: "「同業他社も見ましたが、御社は若手でも顧客課題の分析から改善提案まで関われる点に魅力を感じました。自分の強みである相手目線の行動を活かしやすいと考えています。」",
        rank: "正解",
        score: 3,
        expression: "pleased.png",
        interviewerComment: "他社比較と自分の強みがつながっていますね。",
        feedback: "企業理解と自己分析がつながっており、志望度が伝わります。"
      },
      {
        text: "「説明会で雰囲気が良いと感じたからです。社員の方も話しやすく、自分に合っていると思いました。」",
        rank: "普通",
        score: 2,
        expression: "normal.png",
        interviewerComment: "雰囲気も大切ですが、事業や仕事内容にも触れられるとより良いです。",
        feedback: "悪くありませんが、雰囲気中心だと志望理由として少し弱いです。"
      },
      {
        text: "「有名な会社なので、成長できると思いました。大手で働ける点にも魅力を感じています。」",
        rank: "少し悪い",
        score: 1,
        expression: "serious.png",
        interviewerComment: "会社名だけで選んでいるようにも聞こえますね。",
        feedback: "知名度や規模だけでは、企業理解が浅く見えます。"
      },
      {
        text: "「正直、他社との違いはまだ詳しく分かっていませんが、入社後に理解していきたいです。」",
        rank: "かなり悪い",
        score: 0,
        expression: "strict.png",
        interviewerComment: "事前準備が足りない印象を受けます。",
        feedback: "志望動機の深掘りに対応できておらず、志望度が低く見えます。"
      }
    ]
  },
  {
    id: 4,
    level: "中級",
    title: "短所と改善",
    scene: "面接官の質問：「あなたの短所と、それを改善するために意識していることを教えてください。」",
    choices: [
      {
        text: "「慎重になりすぎて判断に時間がかかる点です。そのため、まず期限を決め、必要な情報と後から確認できる情報を分けて考えるようにしています。」",
        rank: "正解",
        score: 3,
        expression: "interested.png",
        interviewerComment: "短所を理解したうえで、改善行動まで話せていますね。",
        feedback: "短所・課題・改善策の流れが自然で、自己理解が伝わります。"
      },
      {
        text: "「少し心配性なところです。ただ、確認を丁寧にできるという意味では長所でもあると思っています。」",
        rank: "普通",
        score: 2,
        expression: "normal.png",
        interviewerComment: "前向きに捉えられていますが、改善の工夫も聞きたいですね。",
        feedback: "悪くありませんが、改善行動が弱いです。"
      },
      {
        text: "「短所は優柔不断なところです。最近はなるべく早く決めるようにしています。」",
        rank: "少し悪い",
        score: 1,
        expression: "thinking.png",
        interviewerComment: "もう少し具体的な対策があると良いですね。",
        feedback: "短所は言えていますが、改善方法が抽象的です。"
      },
      {
        text: "「短所はあまりないと思います。周りからも特に指摘されたことはありません。」",
        rank: "かなり悪い",
        score: 0,
        expression: "suspicious.png",
        interviewerComment: "自己分析が少し浅く見えてしまいますね。",
        feedback: "短所がないと言い切ると、自己理解や改善意識が弱く見えます。"
      }
    ]
  },
  {
    id: 5,
    level: "中級",
    title: "周囲との対立",
    scene: "面接官の質問：「チームで意見が対立したとき、あなたはどう対応しますか？」",
    choices: [
      {
        text: "「まず相手の意見の背景を確認します。そのうえで、目的に対してどちらの案が合っているかを整理し、必要なら両方の案を組み合わせる方法を考えます。」",
        rank: "正解",
        score: 3,
        expression: "pleased.png",
        interviewerComment: "感情ではなく目的に戻って考えられている点が良いですね。",
        feedback: "協調性と論理的な調整力が伝わる回答です。"
      },
      {
        text: "「なるべく相手の意見を尊重します。対立が長引くと雰囲気が悪くなるので、話し合いで解決したいです。」",
        rank: "普通",
        score: 2,
        expression: "normal.png",
        interviewerComment: "姿勢は良いですが、具体的な進め方もあるとさらに良いです。",
        feedback: "協調性は伝わりますが、問題解決の具体性が少し弱いです。"
      },
      {
        text: "「自分の意見に自信がある場合は、できるだけ説得します。正しいと思うことは曲げたくありません。」",
        rank: "少し悪い",
        score: 1,
        expression: "serious.png",
        interviewerComment: "熱意はありますが、少し一方的に聞こえるかもしれません。",
        feedback: "主体性はありますが、相手の考えを受け止める姿勢が弱く見えます。"
      },
      {
        text: "「対立するのは苦手なので、基本的には相手に合わせます。」",
        rank: "かなり悪い",
        score: 0,
        expression: "disappointed.png",
        interviewerComment: "衝突を避けるだけでは、チームに貢献しにくいかもしれません。",
        feedback: "受け身で、問題解決力が伝わりにくい回答です。"
      }
    ]
  },
  {
    id: 6,
    level: "中級",
    title: "失敗後の行動",
    scene: "面接官の質問：「失敗したあと、周囲にどのように対応しましたか？」",
    choices: [
      {
        text: "「まず関係者に状況を正直に共有し、影響範囲を確認しました。その後、再発防止として確認リストを作り、同じ作業をするメンバーにも共有しました。」",
        rank: "正解",
        score: 3,
        expression: "interested.png",
        interviewerComment: "失敗後の対応が具体的で、信頼できますね。",
        feedback: "報告・対応・再発防止まで話せており、社会人としての姿勢が伝わります。"
      },
      {
        text: "「すぐに謝って、次は気をつけるようにしました。同じミスをしないよう意識しました。」",
        rank: "普通",
        score: 2,
        expression: "normal.png",
        interviewerComment: "反省は伝わりますが、具体的な再発防止策もあると良いです。",
        feedback: "誠実さはありますが、改善策の具体性がやや弱いです。"
      },
      {
        text: "「自分なりに反省しました。周りにはあまり迷惑をかけたくなかったので、自分で何とかしました。」",
        rank: "少し悪い",
        score: 1,
        expression: "serious.png",
        interviewerComment: "一人で抱え込むと、かえって問題が大きくなることもあります。",
        feedback: "責任感はありますが、報告・相談の姿勢が弱く見えます。"
      },
      {
        text: "「失敗はありましたが、原因は状況が悪かった部分も大きいと思います。」",
        rank: "かなり悪い",
        score: 0,
        expression: "strict.png",
        interviewerComment: "少し他責に聞こえてしまいますね。",
        feedback: "自分の改善点が見えず、成長意欲が伝わりにくいです。"
      }
    ]
  },
  {
    id: 7,
    level: "中級",
    title: "他社選考状況",
    scene: "面接官の質問：「現在、他社の選考状況はいかがですか？」",
    choices: [
      {
        text: "「同じく人の選択を支えるサービスに関わる企業を中心に受けています。現在は2社が一次選考中です。その中でも御社は、利用者目線の改善に関われる点で特に志望度が高いです。」",
        rank: "正解",
        score: 3,
        expression: "pleased.png",
        interviewerComment: "就活の軸と当社への志望度が分かりやすいですね。",
        feedback: "他社状況を正直に伝えつつ、志望軸と志望度も示せています。"
      },
      {
        text: "「何社か受けています。まだ選考途中ですが、御社にも強く興味があります。」",
        rank: "普通",
        score: 2,
        expression: "normal.png",
        interviewerComment: "大きな問題はありませんが、就活の軸もあるとより伝わります。",
        feedback: "無難ですが、選考企業の共通点や志望軸が弱いです。"
      },
      {
        text: "「いろいろ受けています。まだ決めきれていないので、受かったところから考えたいです。」",
        rank: "少し悪い",
        score: 1,
        expression: "serious.png",
        interviewerComment: "少し軸が定まっていないように聞こえます。",
        feedback: "本音に近くても、志望度や就活の軸が弱く見えます。"
      },
      {
        text: "「他社のことはあまり言わない方がよいと思うので、控えさせてください。」",
        rank: "かなり悪い",
        score: 0,
        expression: "suspicious.png",
        interviewerComment: "隠している印象になってしまうかもしれません。",
        feedback: "必要以上に拒むと不自然です。具体社名を避けても、状況や軸は話した方が自然です。"
      }
    ]
  },
  {
    id: 8,
    level: "中級",
    title: "希望職種とのミスマッチ確認",
    scene: "面接官の質問：「もし希望していない部署に配属された場合、どう考えますか？」",
    choices: [
      {
        text: "「まずは配属先で求められる役割を理解し、成果を出すことを優先します。そのうえで、将来的に希望分野へつながる経験を積めるよう主体的に学びたいです。」",
        rank: "正解",
        score: 3,
        expression: "pleased.png",
        interviewerComment: "柔軟性と主体性の両方が伝わりますね。",
        feedback: "希望を持ちつつ、配属先で貢献する姿勢が示せています。"
      },
      {
        text: "「最初は戸惑うと思いますが、決まった以上は頑張りたいです。」",
        rank: "普通",
        score: 2,
        expression: "normal.png",
        interviewerComment: "前向きさはあります。もう少し具体的に考えられると良いですね。",
        feedback: "悪くありませんが、主体的にどう学ぶかがやや弱いです。"
      },
      {
        text: "「できれば希望部署がよいです。違う部署だとモチベーションが下がるかもしれません。」",
        rank: "少し悪い",
        score: 1,
        expression: "serious.png",
        interviewerComment: "正直ですが、柔軟性に少し不安が残ります。",
        feedback: "希望は大切ですが、配属への適応力が低く見える可能性があります。"
      },
      {
        text: "「希望と違うなら、入社する意味があまりないかもしれません。」",
        rank: "かなり悪い",
        score: 0,
        expression: "strict.png",
        interviewerComment: "かなり限定的な考え方に聞こえますね。",
        feedback: "柔軟性や組織で働く姿勢に不安を持たれやすい回答です。"
      }
    ]
  },
  {
    id: 9,
    level: "中級",
    title: "入社後に挑戦したいこと",
    scene: "面接官の質問：「入社後、どのようなことに挑戦したいですか？」",
    choices: [
      {
        text: "「まずは顧客の課題を正確に理解できる力を身につけたいです。そのうえで、将来的にはデータや現場の声をもとに、サービス改善の提案ができる人材になりたいです。」",
        rank: "正解",
        score: 3,
        expression: "interested.png",
        interviewerComment: "段階的に成長するイメージが持てていますね。",
        feedback: "入社直後と将来の目標がつながっており、現実的です。"
      },
      {
        text: "「早く成長して、会社に貢献できるようになりたいです。」",
        rank: "普通",
        score: 2,
        expression: "normal.png",
        interviewerComment: "前向きですが、どのように貢献したいかがもう少し知りたいです。",
        feedback: "意欲は伝わりますが、仕事内容への理解がやや浅く見えます。"
      },
      {
        text: "「自分に合う仕事を見つけながら、できることを増やしていきたいです。」",
        rank: "少し悪い",
        score: 1,
        expression: "thinking.png",
        interviewerComment: "少し受け身に聞こえるかもしれません。",
        feedback: "成長意欲はありますが、挑戦したい方向性が曖昧です。"
      },
      {
        text: "「まだ具体的には分かりません。入社してから考えたいです。」",
        rank: "かなり悪い",
        score: 0,
        expression: "disappointed.png",
        interviewerComment: "入社後のイメージが少し不足していますね。",
        feedback: "企業研究や職種理解が足りない印象を与えます。"
      }
    ]
  },
  {
    id: 10,
    level: "中級",
    title: "中級逆質問",
    scene: "面接官の質問：「最後に、何か質問はありますか？」",
    choices: [
      {
        text: "「若手のうちに成果を出している方は、入社後の最初の半年でどのような行動を意識されていますか？」",
        rank: "正解",
        score: 3,
        expression: "pleased.png",
        interviewerComment: "入社後を具体的に考えた良い質問ですね。",
        feedback: "成長意欲と入社後の行動イメージが伝わる逆質問です。"
      },
      {
        text: "「入社までに勉強しておくとよいことはありますか？」",
        rank: "普通",
        score: 2,
        expression: "normal.png",
        interviewerComment: "前向きな質問です。もう少し職種に合わせるとさらに良いですね。",
        feedback: "悪くありませんが、やや定番で差別化は弱めです。"
      },
      {
        text: "「配属先はいつ分かりますか？希望はどのくらい通りますか？」",
        rank: "少し悪い",
        score: 1,
        expression: "serious.png",
        interviewerComment: "大切な確認ですが、聞き方には少し工夫が必要ですね。",
        feedback: "条件確認に寄りすぎると、仕事への関心が弱く見える場合があります。"
      },
      {
        text: "「質問は特にありません。ホームページを見たので大丈夫です。」",
        rank: "かなり悪い",
        score: 0,
        expression: "disappointed.png",
        interviewerComment: "関心が薄い印象になってしまいますね。",
        feedback: "逆質問なしは志望度が低く見えやすいです。"
      }
    ]
  }
];

const advancedQuestions = [
  {
    id: 1,
    level: "上級",
    title: "価値観の深掘り",
    scene: "面接官の質問：「あなたが働くうえで、最も大切にしたい価値観は何ですか？」",
    choices: [
      {
        text: "「相手にとって本当に役立つ行動を取ることです。成果だけを追うのではなく、相手の課題を理解したうえで提案する姿勢を大切にしたいです。」",
        rank: "正解",
        score: 3,
        expression: "pleased.png",
        interviewerComment: "仕事への向き合い方が具体的で、当社の仕事にもつながりそうですね。",
        feedback: "価値観が仕事での行動に結びついており、説得力があります。"
      },
      {
        text: "「成長できることです。社会人として早く力をつけて、周囲から信頼される人になりたいです。」",
        rank: "普通",
        score: 2,
        expression: "normal.png",
        interviewerComment: "前向きですね。成長して何を実現したいかまで話せるとさらに良いです。",
        feedback: "意欲は伝わりますが、会社や顧客への貢献とのつながりがやや弱いです。"
      },
      {
        text: "「無理なく働けることです。長く続けるためには、自分に合う環境が大切だと思います。」",
        rank: "少し悪い",
        score: 1,
        expression: "serious.png",
        interviewerComment: "大切な考えですが、貢献意欲もあわせて聞きたいですね。",
        feedback: "働きやすさだけが前面に出ると、受け身に見えやすいです。"
      },
      {
        text: "「できるだけストレスが少ないことです。厳しい環境は自分には合わないと思います。」",
        rank: "かなり悪い",
        score: 0,
        expression: "strict.png",
        interviewerComment: "仕事への覚悟に少し不安を感じます。",
        feedback: "自己都合が強く、困難への耐性が低く見える回答です。"
      }
    ]
  },
  {
    id: 2,
    level: "上級",
    title: "困難な目標への向き合い方",
    scene: "面接官の質問：「達成が難しい目標を任された場合、どのように取り組みますか？」",
    choices: [
      {
        text: "「まず目標を分解し、何が不足しているのかを確認します。そのうえで優先順位を決め、周囲に相談しながら短いサイクルで改善していきます。」",
        rank: "正解",
        score: 3,
        expression: "interested.png",
        interviewerComment: "難しい状況でも、具体的に動けそうですね。",
        feedback: "目標分解・優先順位・相談・改善の流れがあり、実務に近い回答です。"
      },
      {
        text: "「まずは全力で頑張ります。難しくても諦めずに取り組むことが大事だと思います。」",
        rank: "普通",
        score: 2,
        expression: "normal.png",
        interviewerComment: "熱意は伝わりますが、進め方もあるとより安心です。",
        feedback: "意欲はありますが、具体的な行動計画が弱いです。"
      },
      {
        text: "「一人で抱えすぎると大変なので、早めに周囲に任せられる部分を探します。」",
        rank: "少し悪い",
        score: 1,
        expression: "thinking.png",
        interviewerComment: "協力は大切ですが、自分がどう責任を持つかも聞きたいですね。",
        feedback: "分担の意識はありますが、主体性が少し弱く聞こえます。"
      },
      {
        text: "「明らかに無理な目標なら、最初に難しいと伝えます。できないことを引き受けるのはよくないと思います。」",
        rank: "かなり悪い",
        score: 0,
        expression: "strict.png",
        interviewerComment: "現実的ではありますが、挑戦姿勢が少し見えにくいです。",
        feedback: "リスク管理だけが前面に出て、達成に向けた工夫がありません。"
      }
    ]
  },
  {
    id: 3,
    level: "上級",
    title: "第一志望確認",
    scene: "面接官の質問：「率直に、当社は第一志望ですか？」",
    choices: [
      {
        text: "「はい、現時点で第一志望です。理由は、私が大切にしたい『人の選択を支える仕事』に最も近く、若手のうちから改善提案に関われる環境だと感じているからです。」",
        rank: "正解",
        score: 3,
        expression: "pleased.png",
        interviewerComment: "理由まで明確で、志望度が伝わりますね。",
        feedback: "第一志望の理由を企業理解と自分の軸で説明できています。"
      },
      {
        text: "「かなり志望度は高いです。他社も見ていますが、御社には強く魅力を感じています。」",
        rank: "普通",
        score: 2,
        expression: "normal.png",
        interviewerComment: "大きな問題はありませんが、もう一歩踏み込んだ理由があると良いですね。",
        feedback: "無難ですが、第一志望と言い切らない分、やや弱く見えます。"
      },
      {
        text: "「まだ選考中の企業があるので、正直に言うと決めきれていません。」",
        rank: "少し悪い",
        score: 1,
        expression: "serious.png",
        interviewerComment: "正直ですが、当社への魅力も具体的に伝えてほしいですね。",
        feedback: "誠実ではありますが、志望度の高さを補足しないと不利になりやすいです。"
      },
      {
        text: "「内定をいただけたら、その時点で真剣に考えたいです。」",
        rank: "かなり悪い",
        score: 0,
        expression: "disappointed.png",
        interviewerComment: "少し受け身で、志望度が伝わりにくいです。",
        feedback: "企業側から見ると、入社意欲が低く見えます。"
      }
    ]
  },
  {
    id: 4,
    level: "上級",
    title: "企業理念への共感",
    scene: "面接官の質問：「当社の理念のどこに共感しましたか？」",
    choices: [
      {
        text: "「『利用者起点で改善を続ける』という考え方に共感しました。私もゼミ活動で、相手の声を集めて改善案を作る経験をしており、その姿勢を仕事でも大切にしたいです。」",
        rank: "正解",
        score: 3,
        expression: "interested.png",
        interviewerComment: "理念とご自身の経験がつながっていますね。",
        feedback: "企業理念を自分の経験と言葉で語れており、深い企業理解が伝わります。"
      },
      {
        text: "「挑戦を大切にしている点に共感しました。私も成長したい気持ちが強いので、合っていると思いました。」",
        rank: "普通",
        score: 2,
        expression: "normal.png",
        interviewerComment: "方向性は良いですが、もう少し具体例があると説得力が増します。",
        feedback: "理念への共感は伝わりますが、やや一般的です。"
      },
      {
        text: "「ホームページを見て、全体的に良い理念だと感じました。」",
        rank: "少し悪い",
        score: 1,
        expression: "suspicious.png",
        interviewerComment: "どの部分に共感したのか、もう少し知りたいですね。",
        feedback: "企業研究が浅く見えます。具体的な言葉や経験とつなげる必要があります。"
      },
      {
        text: "「理念は正直どの会社も似ていると思いますが、御社は雰囲気が良さそうだと思いました。」",
        rank: "かなり悪い",
        score: 0,
        expression: "strict.png",
        interviewerComment: "当社への理解が少し不足しているように感じます。",
        feedback: "企業理念を軽く扱っている印象になり、志望度が低く見えます。"
      }
    ]
  },
  {
    id: 5,
    level: "上級",
    title: "弱みを突かれた質問",
    scene: "面接官の質問：「あなたの経験は魅力的ですが、当社の仕事で求められる数字への意識は少し弱いように感じます。その点はどう考えますか？」",
    choices: [
      {
        text: "「ご指摘の通り、数字で成果を示す経験はまだ多くありません。ただ、ゼミではアンケート回答数や改善前後の変化を見るよう意識しました。入社後は数字をもとに判断する力をさらに伸ばしたいです。」",
        rank: "正解",
        score: 3,
        expression: "pleased.png",
        interviewerComment: "指摘を受け止めたうえで、成長意欲も伝わりますね。",
        feedback: "弱みを否定せず、過去の努力と今後の改善につなげられています。"
      },
      {
        text: "「確かに数字の経験は少ないですが、入社後に学べば対応できると思います。」",
        rank: "普通",
        score: 2,
        expression: "normal.png",
        interviewerComment: "前向きですが、今から意識していることもあると良いですね。",
        feedback: "受け止めはできていますが、根拠がやや弱いです。"
      },
      {
        text: "「数字は苦手ではありません。経験として話していないだけで、必要なら対応できます。」",
        rank: "少し悪い",
        score: 1,
        expression: "suspicious.png",
        interviewerComment: "少し防御的に聞こえるかもしれません。",
        feedback: "否定が強く、面接官の指摘を受け止めていない印象になります。"
      },
      {
        text: "「数字だけで判断する仕事は、自分にはあまり合わないかもしれません。」",
        rank: "かなり悪い",
        score: 0,
        expression: "strict.png",
        interviewerComment: "当社の仕事への適性に不安が残りますね。",
        feedback: "苦手意識が強く、成長しようとする姿勢が見えにくいです。"
      }
    ]
  },
  {
    id: 6,
    level: "上級",
    title: "矛盾を確認する質問",
    scene: "面接官の質問：「先ほどは挑戦したいと言っていましたが、安定した環境も重視していると話していました。この2つはあなたの中でどうつながっていますか？」",
    choices: [
      {
        text: "「私にとっての安定は、変化がないことではなく、変化に対応できる力を身につけることです。だからこそ、挑戦できる環境で経験を積むことが長期的な安定につながると考えています。」",
        rank: "正解",
        score: 3,
        expression: "interested.png",
        interviewerComment: "考え方に一貫性がありますね。",
        feedback: "一見矛盾する価値観を、自分の言葉で整理できています。"
      },
      {
        text: "「どちらも大切だと思っています。挑戦しながらも、安心して働ける環境が理想です。」",
        rank: "普通",
        score: 2,
        expression: "normal.png",
        interviewerComment: "大きな問題はありませんが、もう少しあなたなりの定義があると良いです。",
        feedback: "自然な回答ですが、少し一般論に近いです。"
      },
      {
        text: "「少し矛盾しているかもしれませんが、どちらも本音です。」",
        rank: "少し悪い",
        score: 1,
        expression: "thinking.png",
        interviewerComment: "正直ですが、整理して説明できるとより良いですね。",
        feedback: "本音は伝わりますが、考えが整理されていない印象です。"
      },
      {
        text: "「その時々で考え方が変わるので、正直まだ分かりません。」",
        rank: "かなり悪い",
        score: 0,
        expression: "disappointed.png",
        interviewerComment: "就活の軸が少し不安定に見えますね。",
        feedback: "自己分析不足に見え、志望理由全体の説得力が下がります。"
      }
    ]
  },
  {
    id: 7,
    level: "上級",
    title: "キャリアビジョン",
    scene: "面接官の質問：「5年後、どのような社会人になっていたいですか？」",
    choices: [
      {
        text: "「顧客の課題を表面的に聞くだけでなく、背景まで整理して提案できる人になりたいです。そのために、最初の数年は現場で経験を積み、課題を見つける力を磨きたいです。」",
        rank: "正解",
        score: 3,
        expression: "pleased.png",
        interviewerComment: "成長の方向性が仕事とつながっていますね。",
        feedback: "5年後の姿と、そこに向けた経験の積み方が具体的です。"
      },
      {
        text: "「周りから信頼される社会人になっていたいです。任された仕事をしっかりこなせるようになりたいです。」",
        rank: "普通",
        score: 2,
        expression: "normal.png",
        interviewerComment: "良い目標ですが、職種に合わせた具体性があるとさらに良いです。",
        feedback: "前向きですが、やや一般的で差別化しにくい回答です。"
      },
      {
        text: "「できれば自分に合った仕事を見つけて、無理なく続けられていたら良いと思います。」",
        rank: "少し悪い",
        score: 1,
        expression: "serious.png",
        interviewerComment: "少し受け身な印象がありますね。",
        feedback: "将来像が消極的で、成長意欲が弱く見えます。"
      },
      {
        text: "「5年後はまだ想像できません。入社してみないと分からないと思います。」",
        rank: "かなり悪い",
        score: 0,
        expression: "strict.png",
        interviewerComment: "将来のイメージをもう少し持っておきたいですね。",
        feedback: "キャリアの方向性が見えず、企業とのマッチ度を判断しにくい回答です。"
      }
    ]
  },
  {
    id: 8,
    level: "上級",
    title: "圧迫気味の質問",
    scene: "面接官の質問：「その経験は、正直そこまで大きな成果とは言えないように感じます。あなたはどう評価していますか？」",
    choices: [
      {
        text: "「確かに規模としては大きくありません。ただ、自分で課題を見つけ、周囲を巻き込み、改善まで進めた点に意味があったと考えています。成果の大きさだけでなく、行動の再現性を大切にしたいです。」",
        rank: "正解",
        score: 3,
        expression: "interested.png",
        interviewerComment: "落ち着いて自分の経験の価値を説明できていますね。",
        feedback: "否定に動揺せず、経験の価値を冷静に再定義できています。"
      },
      {
        text: "「大きな成果ではないかもしれませんが、自分なりには頑張った経験です。」",
        rank: "普通",
        score: 2,
        expression: "normal.png",
        interviewerComment: "素直さはあります。どの部分に価値があるかまで話せると良いです。",
        feedback: "悪くありませんが、成果以外の評価ポイントを説明しきれていません。"
      },
      {
        text: "「そう見えるかもしれませんが、私にとっては大きな経験でした。」",
        rank: "少し悪い",
        score: 1,
        expression: "thinking.png",
        interviewerComment: "気持ちは分かりますが、少し主観的に聞こえます。",
        feedback: "主観が中心で、面接官を納得させる材料が少ないです。"
      },
      {
        text: "「大きな成果ではないと言われると、少し残念です。自分では頑張ったつもりでした。」",
        rank: "かなり悪い",
        score: 0,
        expression: "disappointed.png",
        interviewerComment: "少し感情的に受け取っている印象です。",
        feedback: "指摘への耐性が弱く見え、冷静な対応力に不安が残ります。"
      }
    ]
  },
  {
    id: 9,
    level: "上級",
    title: "内定承諾の判断軸",
    scene: "面接官の質問：「最終的に入社する会社を決めるとき、何を基準に判断しますか？」",
    choices: [
      {
        text: "「自分の就活軸である『人の選択を支える仕事に関われるか』と、若手のうちから課題解決に関わる経験が積めるかを重視します。その点で御社は最も合っていると感じています。」",
        rank: "正解",
        score: 3,
        expression: "pleased.png",
        interviewerComment: "判断軸と当社への志望度がつながっていますね。",
        feedback: "入社判断の軸が明確で、企業とのマッチ度も伝わります。"
      },
      {
        text: "「仕事内容、社風、成長環境を総合的に見て判断したいです。」",
        rank: "普通",
        score: 2,
        expression: "normal.png",
        interviewerComment: "自然な考え方ですが、優先順位があるとさらに良いですね。",
        feedback: "無難ですが、判断軸としてはやや一般的です。"
      },
      {
        text: "「条件面も含めて、バランスよく判断したいです。」",
        rank: "少し悪い",
        score: 1,
        expression: "serious.png",
        interviewerComment: "条件も大切ですが、仕事面の判断軸も聞きたいですね。",
        feedback: "条件面が前に出すぎると、仕事への意欲が弱く見えます。"
      },
      {
        text: "「内定をもらった会社の中で、一番待遇が良いところを選ぶと思います。」",
        rank: "かなり悪い",
        score: 0,
        expression: "strict.png",
        interviewerComment: "待遇以外の軸も大切にしてほしいですね。",
        feedback: "待遇だけで判断している印象が強く、志望度が下がって見えます。"
      }
    ]
  },
  {
    id: 10,
    level: "上級",
    title: "上級逆質問",
    scene: "面接官の質問：「最後に、何か質問はありますか？」",
    choices: [
      {
        text: "「本日のお話を伺い、顧客課題を深く理解する力が重要だと感じました。入社後にその力を伸ばすため、若手の方が最初につまずきやすい点があれば教えていただきたいです。」",
        rank: "正解",
        score: 3,
        expression: "pleased.png",
        interviewerComment: "今日の面接内容を踏まえた、良い逆質問ですね。",
        feedback: "面接中の話を受けて質問できており、理解力と入社意欲が伝わります。"
      },
      {
        text: "「御社で活躍している人に共通する特徴を教えていただきたいです。」",
        rank: "普通",
        score: 2,
        expression: "normal.png",
        interviewerComment: "良い質問です。今日の会話と結びつけるとさらに印象的です。",
        feedback: "定番として良い逆質問ですが、上級としてはもう少し具体性がほしいです。"
      },
      {
        text: "「入社後の研修制度について、詳しく教えてください。」",
        rank: "少し悪い",
        score: 1,
        expression: "thinking.png",
        interviewerComment: "必要な確認ですが、受け身な印象にならない聞き方ができると良いですね。",
        feedback: "制度確認としては悪くありませんが、自分がどう成長したいかを添えると良くなります。"
      },
      {
        text: "「今日の面接で、私は合格できそうでしょうか？」",
        rank: "かなり悪い",
        score: 0,
        expression: "strict.png",
        interviewerComment: "その場では答えにくい質問ですね。",
        feedback: "面接官が答えにくく、逆質問としては不適切です。"
      }
    ]
  }
];

const caseInterviewQuestions = [
  {
    id: 1,
    mode: "ケース面接",
    title: "前提確認を学ぶケース",
    openingDialogues: [
      {
        speaker: "面接官",
        text: "ではケース面接を始めます。駅前カフェの売上を2倍にする施策を考えてください。"
      },
      {
        speaker: "あなた",
        text: "いきなり施策を考える前に、まず何をすべきだろう？"
      }
    ],
    firstQuestion: {
      prompt: "最初にどう対応しますか？",
      choices: [
        {
          text: "「承知しました。まず、売上を2倍にする期間、対象店舗、現在の売上構成、使える予算などの前提を確認してもよろしいでしょうか？」",
          rank: "正解",
          score: 3,
          expression: "pleased.png",
          interviewerComment: "良いですね。まず前提をそろえる姿勢は大切です。",
          feedback: "ケース面接では、いきなり施策に飛ばず、期間・対象・現状・制約を確認するのが基本です。"
        },
        {
          text: "「駅前カフェなら、新メニューとSNS集客が有効だと思います。」",
          rank: "普通",
          score: 2,
          expression: "normal.png",
          interviewerComment: "方向性はありますが、少し早いですね。前提を確認するとさらに良いです。",
          feedback: "施策自体は悪くありませんが、前提確認なしだと浅く見えやすいです。"
        },
        {
          text: "「売上を2倍にするなら、まず全商品を値上げすればよいと思います。」",
          rank: "少し悪い",
          score: 1,
          expression: "serious.png",
          interviewerComment: "一案ではありますが、少し短絡的かもしれません。",
          feedback: "値上げは売上に効く可能性がありますが、客数減少や満足度低下も考える必要があります。"
        },
        {
          text: "「カフェ経営の知識がないので、正確には分かりません。」",
          rank: "かなり悪い",
          score: 0,
          expression: "disappointed.png",
          interviewerComment: "専門知識より、考え方を見たい場面です。",
          feedback: "知らないテーマでも、仮定を置いて考える姿勢が重要です。"
        }
      ]
    },
    followUpDialogues: [
      {
        speaker: "面接官",
        text: "では、期間は3か月、対象は駅前の1店舗、予算は大きく増やせない前提とします。次に、あなたは何から考えますか？"
      }
    ],
    followUpQuestion: {
      prompt: "次にどう考えますか？",
      choices: [
        {
          text: "「売上を客数×客単価に分解し、どちらに伸びしろがあるかを考えます。」",
          rank: "正解",
          score: 3,
          expression: "interested.png",
          interviewerComment: "良いですね。売上を構造化できています。",
          feedback: "前提確認の次は、売上などの指標を分解して考えると、打ち手につながります。"
        },
        {
          text: "「まず、若者向けに映えるメニューを考えます。」",
          rank: "普通",
          score: 2,
          expression: "normal.png",
          interviewerComment: "一つの方向性ですが、なぜ若者なのかも確認したいですね。",
          feedback: "アイデアは悪くありませんが、構造化する前に施策へ行くと根拠が弱くなります。"
        },
        {
          text: "「予算が少ないなら、無料でできるSNSだけに絞ります。」",
          rank: "少し悪い",
          score: 1,
          expression: "serious.png",
          interviewerComment: "制約は見ていますが、売上への影響をもう少し考えたいですね。",
          feedback: "コスト意識は良いですが、課題に合う施策かを先に考える必要があります。"
        },
        {
          text: "「3か月では難しいので、目標を下げた方がよいと思います。」",
          rank: "かなり悪い",
          score: 0,
          expression: "strict.png",
          interviewerComment: "難しい前提でも、まずは達成に向けた仮説を出してみましょう。",
          feedback: "目標の妥当性を疑う視点はありますが、最初から諦める印象になります。"
        }
      ]
    }
  },
  {
    id: 2,
    mode: "ケース面接",
    title: "構造化を学ぶケース",
    openingDialogues: [
      {
        speaker: "面接官",
        text: "あるコンビニの売上が下がっています。原因を考えてください。"
      },
      {
        speaker: "あなた",
        text: "原因を一気に当てにいくより、まず分解した方がよさそうだ。"
      }
    ],
    firstQuestion: {
      prompt: "まず、どのように考えますか？",
      choices: [
        {
          text: "「売上を客数×客単価に分解し、客数は来店者数、客単価は購入点数と商品単価に分けて考えます。」",
          rank: "正解",
          score: 3,
          expression: "pleased.png",
          interviewerComment: "良い分解です。原因を探しやすくなりますね。",
          feedback: "売上を分解すると、どの要素が悪化しているかを考えやすくなります。"
        },
        {
          text: "「近くに競合店ができたのが原因だと思います。」",
          rank: "普通",
          score: 2,
          expression: "normal.png",
          interviewerComment: "あり得る仮説ですが、他の可能性も見たいですね。",
          feedback: "仮説としては自然ですが、いきなり一つに決めると視野が狭くなります。"
        },
        {
          text: "「商品の魅力が落ちたのだと思います。」",
          rank: "少し悪い",
          score: 1,
          expression: "thinking.png",
          interviewerComment: "可能性はありますが、少し抽象的ですね。",
          feedback: "“魅力”という言葉を、価格・品揃え・品質・陳列などに分けると考えやすくなります。"
        },
        {
          text: "「売上が下がるのは景気が悪いからだと思います。」",
          rank: "かなり悪い",
          score: 0,
          expression: "disappointed.png",
          interviewerComment: "外部要因だけで終わらせると、打ち手が考えにくいですね。",
          feedback: "外部環境も大事ですが、店舗側で改善できる要因も考える必要があります。"
        }
      ]
    },
    followUpDialogues: [
      {
        speaker: "面接官",
        text: "では、客数が減っていると分かった場合、次にどう分解しますか？"
      }
    ],
    followUpQuestion: {
      prompt: "客数減少をさらにどう考えますか？",
      choices: [
        {
          text: "「新規客が減ったのか、リピート客が減ったのかに分けます。さらに時間帯別や客層別にも確認します。」",
          rank: "正解",
          score: 3,
          expression: "interested.png",
          interviewerComment: "良いですね。原因の特定に近づきます。",
          feedback: "客数をさらに分解すると、どこに問題があるか見えやすくなります。"
        },
        {
          text: "「客数が減っているなら、広告を増やすべきです。」",
          rank: "普通",
          score: 2,
          expression: "normal.png",
          interviewerComment: "打ち手としては自然です。ただ、広告の前にどの客層が減っているかを確認できると、より精度が上がります。",
          feedback: "方向性は悪くありませんが、広告を打つ前に新規客・リピート客・時間帯などを分けて考えると、より説得力が出ます。"
        },
        {
          text: "「とりあえず値引きキャンペーンをします。」",
          rank: "少し悪い",
          score: 1,
          expression: "serious.png",
          interviewerComment: "客数は増えるかもしれませんが、利益への影響が気になります。",
          feedback: "値引きは短期的に効く可能性がありますが、根本原因の分析が不足しています。"
        },
        {
          text: "「客数が減ったなら、もう立地が悪いのだと思います。」",
          rank: "かなり悪い",
          score: 0,
          expression: "strict.png",
          interviewerComment: "立地は変えにくいので、改善可能な要因も考えたいですね。",
          feedback: "すぐに変えられない要因だけに注目すると、現実的な打ち手につながりにくいです。"
        }
      ]
    }
  },
  {
    id: 3,
    mode: "ケース面接",
    title: "仮説を置く練習",
    openingDialogues: [
      {
        speaker: "面接官",
        text: "地方の本屋の来客数を増やすにはどうすればよいでしょうか？"
      },
      {
        speaker: "あなた",
        text: "本屋か……。でも、いきなりイベントを考えるだけじゃ弱いかも。"
      }
    ],
    firstQuestion: {
      prompt: "まず、どのように考えますか？",
      choices: [
        {
          text: "「まず来客数が減っている理由を、品揃え、立地、競合、利用目的の変化に分けて考えます。そのうえで、地域住民の来店理由が弱いことに仮説を置きます。」",
          rank: "正解",
          score: 3,
          expression: "pleased.png",
          interviewerComment: "仮説の置き方が自然ですね。",
          feedback: "原因を広く見たうえで、根拠を持って仮説を絞ると説得力が出ます。"
        },
        {
          text: "「本屋なので、読書イベントを増やすのが良いと思います。」",
          rank: "普通",
          score: 2,
          expression: "normal.png",
          interviewerComment: "悪くありませんが、なぜイベントなのかを説明できると良いですね。",
          feedback: "施策としては自然ですが、課題とのつながりがまだ弱いです。"
        },
        {
          text: "「最近は本を読まない人が多いので、厳しいと思います。」",
          rank: "少し悪い",
          score: 1,
          expression: "serious.png",
          interviewerComment: "環境変化はありますが、その中でどう打つかを考えたいですね。",
          feedback: "市場環境だけで終わると、課題解決の姿勢が弱く見えます。"
        },
        {
          text: "「ネット通販に勝てないので、本屋の来客数を増やすのは無理だと思います。」",
          rank: "かなり悪い",
          score: 0,
          expression: "disappointed.png",
          interviewerComment: "難しいテーマでも、打ち手を考える姿勢が大切です。",
          feedback: "ケース面接では、制約がある中で現実的な策を考えることが求められます。"
        }
      ]
    },
    followUpDialogues: [
      {
        speaker: "面接官",
        text: "地域住民の来店理由が弱い、という仮説を置いた理由は何ですか？"
      }
    ],
    followUpQuestion: {
      prompt: "仮説の理由をどう説明しますか？",
      choices: [
        {
          text: "「地方の本屋は、通りすがりの新規客より地域住民の継続利用が重要だと考えたためです。そこで、日常的に来る理由があるかを重視しました。」",
          rank: "正解",
          score: 3,
          expression: "interested.png",
          interviewerComment: "理由が明確ですね。仮説に納得感があります。",
          feedback: "仮説は“なぜそう考えたか”まで説明できると強くなります。"
        },
        {
          text: "「なんとなく、地域密着が大事だと思ったからです。」",
          rank: "普通",
          score: 2,
          expression: "normal.png",
          interviewerComment: "方向性は良いですが、もう少し根拠があると良いですね。",
          feedback: "感覚も出発点にはなりますが、ケース面接では理由づけが必要です。"
        },
        {
          text: "「地方なので、若者は少ないと思ったからです。」",
          rank: "少し悪い",
          score: 1,
          expression: "thinking.png",
          interviewerComment: "可能性はありますが、少し決めつけに聞こえますね。",
          feedback: "属性を決めつけるより、誰の来店理由を作るかを考えると良いです。"
        },
        {
          text: "「本屋は地域住民しか使わないと思うからです。」",
          rank: "かなり悪い",
          score: 0,
          expression: "strict.png",
          interviewerComment: "その前提はかなり決めつけが強いですね。根拠なしに利用者を限定すると、分析の幅が狭くなってしまいます。",
          feedback: "仮説を置くことは大切ですが、根拠のない決めつけは危険です。地域住民以外の利用者や、来店目的の違いも考える必要があります。"
        }
      ]
    }
  },
  {
    id: 4,
    mode: "ケース面接",
    title: "フェルミ推定を会話で進める練習",
    openingDialogues: [
      {
        speaker: "面接官",
        text: "この駅前カフェの1日の来客数をざっくり推定してください。"
      },
      {
        speaker: "あなた",
        text: "数字が出た……。正確に分からなくても、分解すればいいんだよな。"
      }
    ],
    firstQuestion: {
      prompt: "どのように推定を始めますか？",
      choices: [
        {
          text: "「正確な数字ではなく概算として、営業時間、座席数、回転率、時間帯ごとの混雑度に分けて推定します。」",
          rank: "正解",
          score: 3,
          expression: "pleased.png",
          interviewerComment: "良いですね。推定の構造が見えます。",
          feedback: "フェルミ推定では、正確な答えより、分解の仕方と仮定の置き方が重要です。"
        },
        {
          text: "「駅前なので、1日300人くらいだと思います。」",
          rank: "普通",
          score: 2,
          expression: "normal.png",
          interviewerComment: "数字は出ていますが、根拠も説明できると良いですね。",
          feedback: "数字だけでは評価されにくいです。どう見積もったかを話しましょう。"
        },
        {
          text: "「カフェの来客数は見たことがないので、推定は難しいです。」",
          rank: "少し悪い",
          score: 1,
          expression: "serious.png",
          interviewerComment: "知らない数字でも、仮定を置いて考える力を見たいです。",
          feedback: "フェルミ推定は知識問題ではなく、分解して概算する練習です。"
        },
        {
          text: "「ネットで調べれば分かるので、ここでは推定しなくてもよいと思います。」",
          rank: "かなり悪い",
          score: 0,
          expression: "strict.png",
          interviewerComment: "今この場で考える力を見る問題です。",
          feedback: "ケース面接では、手元に情報がない状況での思考力が見られます。"
        }
      ]
    },
    followUpDialogues: [
      {
        speaker: "面接官",
        text: "仮に座席数が30席、営業時間が10時間だとしましょう。次に何を仮定しますか？"
      }
    ],
    followUpQuestion: {
      prompt: "次に置くべき仮定は何ですか？",
      choices: [
        {
          text: "「時間帯ごとの稼働率と平均滞在時間を仮定します。たとえば昼と夕方は混み、それ以外は低めに置きます。」",
          rank: "正解",
          score: 3,
          expression: "interested.png",
          interviewerComment: "良いですね。現実に近い推定になりそうです。",
          feedback: "フェルミ推定では、全時間帯を同じにせず、混雑の差を考えると自然です。"
        },
        {
          text: "「30席なので、1時間に30人、10時間で300人とします。」",
          rank: "普通",
          score: 2,
          expression: "normal.png",
          interviewerComment: "シンプルで良いですが、回転率や空席率も考えたいですね。",
          feedback: "ざっくりした推定としては悪くありませんが、現実の利用状況を入れると精度が上がります。"
        },
        {
          text: "「満席になる時間は少ないと思うので、100人くらいにします。」",
          rank: "少し悪い",
          score: 1,
          expression: "thinking.png",
          interviewerComment: "直感はありますが、計算の道筋がほしいですね。",
          feedback: "数字を置くなら、座席数・時間・回転率などにつなげて説明しましょう。"
        },
        {
          text: "「混雑度は分からないので、計算できません。」",
          rank: "かなり悪い",
          score: 0,
          expression: "disappointed.png",
          interviewerComment: "分からない部分こそ、仮定を置いて進めてみましょう。",
          feedback: "不確実な情報に仮定を置くことが、フェルミ推定の基本です。"
        }
      ]
    }
  },
  {
    id: 5,
    mode: "ケース面接",
    title: "打ち手を優先順位で選ぶ練習",
    openingDialogues: [
      {
        speaker: "面接官",
        text: "駅前カフェの課題は、リピート率が低いことだと分かりました。施策を考えてください。"
      },
      {
        speaker: "あなた",
        text: "施策はたくさん出せるけど、どう選ぶ？"
      }
    ],
    firstQuestion: {
      prompt: "施策をどう考えますか？",
      choices: [
        {
          text: "「リピート率向上に効く施策を、効果の大きさと実行しやすさで比較して、優先順位をつけます。」",
          rank: "正解",
          score: 3,
          expression: "pleased.png",
          interviewerComment: "良いですね。施策を評価する軸があります。",
          feedback: "ケース面接では、施策を羅列するより、優先順位づけが重要です。"
        },
        {
          text: "「スタンプカード、SNS、割引、新メニューを全部やります。」",
          rank: "普通",
          score: 2,
          expression: "normal.png",
          interviewerComment: "アイデアは多いですが、どれからやるかを決めたいですね。",
          feedback: "施策の数より、課題に効く順番で考えることが大切です。"
        },
        {
          text: "「一番目立つので、SNSキャンペーンをします。」",
          rank: "少し悪い",
          score: 1,
          expression: "serious.png",
          interviewerComment: "目立つことと課題解決は分けて考えたいですね。",
          feedback: "リピート率が課題なら、SNSが本当に効くのかを考える必要があります。"
        },
        {
          text: "「とにかく値下げすれば、また来てもらえると思います。」",
          rank: "かなり悪い",
          score: 0,
          expression: "strict.png",
          interviewerComment: "値下げは利益を下げるリスクがありますね。",
          feedback: "値下げは短期的に効く可能性がありますが、継続的なリピートにつながるかは要検討です。"
        }
      ]
    },
    followUpDialogues: [
      {
        speaker: "面接官",
        text: "では、あなたが一番優先したい施策を1つ選んでください。"
      }
    ],
    followUpQuestion: {
      prompt: "一番優先する施策はどれですか？",
      choices: [
        {
          text: "「平日夕方限定で、ドリンク購入者に次回来店時の追加注文特典を付けます。帰宅途中の利用を習慣化し、リピート率と客単価の両方を狙います。」",
          rank: "正解",
          score: 3,
          expression: "smile.png",
          interviewerComment: "ターゲット、時間帯、狙いが明確ですね。",
          feedback: "良い施策は、誰に・いつ・何を・なぜ行うかが説明できます。"
        },
        {
          text: "「スタンプカードを作ります。何度も来てもらえると思うからです。」",
          rank: "普通",
          score: 2,
          expression: "normal.png",
          interviewerComment: "方向性は良いです。もう少し対象や条件を具体化したいですね。",
          feedback: "施策としては自然ですが、設計が曖昧だと効果が見えにくいです。"
        },
        {
          text: "「若者向けに映える商品を出します。」",
          rank: "少し悪い",
          score: 1,
          expression: "thinking.png",
          interviewerComment: "若者を狙う理由と、リピート率へのつながりを説明したいですね。",
          feedback: "ターゲットと課題のつながりが弱いと、施策の説得力が下がります。"
        },
        {
          text: "「有名人に宣伝してもらいます。」",
          rank: "かなり悪い",
          score: 0,
          expression: "disappointed.png",
          interviewerComment: "費用対効果と実行可能性が気になりますね。",
          feedback: "現実性が低い施策は、ケース面接では評価されにくいです。"
        }
      ]
    }
  },
  {
    id: 6,
    mode: "ケース面接",
    title: "反論対応を学ぶケース",
    openingDialogues: [
      {
        speaker: "面接官",
        text: "あなたの施策は面白いですが、割引目当ての客だけが増えて利益が下がる可能性はありませんか？"
      },
      {
        speaker: "あなた",
        text: "反論された……。ここでムキにならない方がいいはず。"
      }
    ],
    firstQuestion: {
      prompt: "面接官の反論にどう返しますか？",
      choices: [
        {
          text: "「確かにそのリスクがあります。そのため、単純な値引きではなく、追加注文につながる特典設計にして、利益率の低下を防ぎます。」",
          rank: "正解",
          score: 3,
          expression: "pleased.png",
          interviewerComment: "良いですね。指摘を受け止めたうえで改善できています。",
          feedback: "反論されたら否定せず、リスクを認めて修正案を出すのが大切です。"
        },
        {
          text: "「利益は少し下がるかもしれませんが、まずは客数を増やす方が大事です。」",
          rank: "普通",
          score: 2,
          expression: "normal.png",
          interviewerComment: "方向性はありますが、利益への配慮も必要です。",
          feedback: "売上だけでなく、利益も見るとビジネス視点が強くなります。"
        },
        {
          text: "「そこまでは考えていませんでした。」",
          rank: "少し悪い",
          score: 1,
          expression: "thinking.png",
          interviewerComment: "気づけたのは良いので、ここからどう修正するか考えたいですね。",
          feedback: "正直なのは良いですが、修正案まで出せると強いです。"
        },
        {
          text: "「今回の問題は売上を上げることなので、利益は考えなくてもよいと思います。」",
          rank: "かなり悪い",
          score: 0,
          expression: "strict.png",
          interviewerComment: "実際のビジネスでは、売上と利益の両方を見る必要があります。",
          feedback: "面接官の指摘を切り捨てると、柔軟性が低く見えます。"
        }
      ]
    },
    followUpDialogues: [
      {
        speaker: "面接官",
        text: "では、利益を下げずにリピート率を上げるには、どのような設計にしますか？"
      }
    ],
    followUpQuestion: {
      prompt: "利益を下げずに改善するには？",
      choices: [
        {
          text: "「割引ではなく、原価率の低い追加トッピングや次回来店時のセット提案につなげます。値引きよりも購買行動を増やす設計にします。」",
          rank: "正解",
          score: 3,
          expression: "interested.png",
          interviewerComment: "利益への配慮があり、現実的ですね。",
          feedback: "反論後に施策を改善できると、柔軟な思考が伝わります。"
        },
        {
          text: "「割引率を少し下げればよいと思います。」",
          rank: "普通",
          score: 2,
          expression: "normal.png",
          interviewerComment: "改善方向はありますが、もう一歩工夫があると良いですね。",
          feedback: "割引率調整だけでも改善ですが、行動変化を設計できると強いです。"
        },
        {
          text: "「利益が下がるなら、この施策はやめます。」",
          rank: "少し悪い",
          score: 1,
          expression: "serious.png",
          interviewerComment: "やめる前に、改善できる余地を考えたいですね。",
          feedback: "リスクが見つかったときは、すぐ捨てるより修正案を考えるのが大切です。"
        },
        {
          text: "「利益を気にすると施策が弱くなるので、まずは売上を優先します。」",
          rank: "かなり悪い",
          score: 0,
          expression: "disappointed.png",
          interviewerComment: "利益を無視するのは危険ですね。",
          feedback: "ビジネス施策では、売上・利益・実行可能性をセットで考える必要があります。"
        }
      ]
    }
  },
  {
    id: 7,
    mode: "ケース面接",
    title: "面接官のヒントを受けて修正する練習",
    openingDialogues: [
      {
        speaker: "面接官",
        text: "補足すると、このカフェは昼は満席ですが、夕方以降は空席が多いです。"
      },
      {
        speaker: "あなた",
        text: "新しい情報が出た。ここで考えを変えるべきかな？"
      }
    ],
    firstQuestion: {
      prompt: "追加情報を受けて、どう考えますか？",
      choices: [
        {
          text: "「ありがとうございます。では、昼の集客よりも夕方以降の空席活用に課題があると考え直します。」",
          rank: "正解",
          score: 3,
          expression: "pleased.png",
          interviewerComment: "良いですね。新しい情報を受けて仮説を修正できています。",
          feedback: "ケース面接では、面接官の追加情報を受けて柔軟に考え直す力が見られます。"
        },
        {
          text: "「昼が満席なら、店自体の人気はあるということですね。」",
          rank: "普通",
          score: 2,
          expression: "normal.png",
          interviewerComment: "良い気づきです。では夕方をどう使うか考えたいですね。",
          feedback: "情報の意味は捉えられていますが、次の打ち手までつなげるとさらに良いです。"
        },
        {
          text: "「でも、最初に考えたSNS施策も使えると思います。」",
          rank: "少し悪い",
          score: 1,
          expression: "serious.png",
          interviewerComment: "使える可能性はありますが、新情報をもっと反映したいですね。",
          feedback: "自分の案に固執しすぎると、柔軟性が弱く見えます。"
        },
        {
          text: "「それなら、最初の仮説は全部間違っていたということですね。」",
          rank: "かなり悪い",
          score: 0,
          expression: "disappointed.png",
          interviewerComment: "少し極端に受け取りすぎていますね。新しい情報が出たときは、仮説を全否定するのではなく、必要な部分だけ修正することが大切です。",
          feedback: "ケース面接では、最初の仮説が完璧である必要はありません。面接官の追加情報を受けて、仮説を柔軟に更新する姿勢が重要です。"
        }
      ]
    },
    followUpDialogues: [
      {
        speaker: "面接官",
        text: "では、夕方以降の空席を活用する施策を考えるなら、誰をターゲットにしますか？"
      }
    ],
    followUpQuestion: {
      prompt: "ターゲットをどう設定しますか？",
      choices: [
        {
          text: "「駅を利用する会社員や学生をターゲットにします。帰宅前の短時間利用や勉強・作業利用を狙います。」",
          rank: "正解",
          score: 3,
          expression: "smile.png",
          interviewerComment: "立地と時間帯に合ったターゲットですね。",
          feedback: "ターゲットは、課題・時間帯・立地とつながっていると説得力が出ます。"
        },
        {
          text: "「若者をターゲットにします。」",
          rank: "普通",
          score: 2,
          expression: "normal.png",
          interviewerComment: "方向性はありますが、なぜ若者なのかをもう少し説明したいですね。",
          feedback: "ターゲットは広すぎると打ち手が曖昧になります。"
        },
        {
          text: "「誰でも来てほしいので、全員をターゲットにします。」",
          rank: "少し悪い",
          score: 1,
          expression: "serious.png",
          interviewerComment: "幅広く狙うと、施策がぼやける可能性があります。",
          feedback: "ターゲットを絞ることで、施策の具体性が上がります。"
        },
        {
          text: "「ターゲットは特に決めず、広告で広く知らせます。」",
          rank: "かなり悪い",
          score: 0,
          expression: "disappointed.png",
          interviewerComment: "誰に届けるかが決まらないと、広告も弱くなりますね。",
          feedback: "打ち手を考える前に、誰の行動を変えたいかを決めましょう。"
        }
      ]
    }
  },
  {
    id: 8,
    mode: "ケース面接",
    title: "最終提案をまとめる練習",
    openingDialogues: [
      {
        speaker: "面接官",
        text: "では最後に、あなたの提案を1分でまとめてください。"
      },
      {
        speaker: "あなた",
        text: "ここまでの会話を、きれいにまとめる場面だ。"
      }
    ],
    firstQuestion: {
      prompt: "最終提案をどうまとめますか？",
      choices: [
        {
          text: "「結論として、夕方以降の空席を活用するため、駅利用者向けの作業・軽食セット施策を提案します。理由は、昼は満席で伸びしろが小さく、夕方に稼働率改善の余地があるためです。」",
          rank: "正解",
          score: 3,
          expression: "pleased.png",
          interviewerComment: "結論、理由、施策がつながっていますね。",
          feedback: "最終提案は、結論→理由→施策→期待効果の順で話すと伝わりやすいです。"
        },
        {
          text: "「夕方にお客さんを増やす施策が良いと思います。」",
          rank: "普通",
          score: 2,
          expression: "normal.png",
          interviewerComment: "方向性は良いです。施策内容まで具体化できるとさらに良いですね。",
          feedback: "大枠は合っていますが、具体策と効果が少し弱いです。"
        },
        {
          text: "「SNSとスタンプカードと新メニューを組み合わせます。」",
          rank: "少し悪い",
          score: 1,
          expression: "thinking.png",
          interviewerComment: "施策が複数ありますが、主案を明確にしたいですね。",
          feedback: "最終提案では、あれもこれもより、主張を絞ることが大切です。"
        },
        {
          text: "「売上を上げるには、できることを全部やるべきです。」",
          rank: "かなり悪い",
          score: 0,
          expression: "strict.png",
          interviewerComment: "優先順位が見えにくいですね。",
          feedback: "ケース面接では、限られた時間・予算で何を優先するかが重要です。"
        }
      ]
    },
    followUpDialogues: [
      {
        speaker: "面接官",
        text: "その施策のリスクと、対策も一言で教えてください。"
      }
    ],
    followUpQuestion: {
      prompt: "リスクと対策をどう答えますか？",
      choices: [
        {
          text: "「リスクは、夕方利用者の需要が想定より小さいことです。まず1か月だけ試験導入し、利用率と客単価を見て継続判断します。」",
          rank: "正解",
          score: 3,
          expression: "interested.png",
          interviewerComment: "良いですね。リスクと検証方法がセットになっています。",
          feedback: "施策は、リスクと検証方法まで話せると実行可能性が高く見えます。"
        },
        {
          text: "「リスクはありますが、やってみないと分からないと思います。」",
          rank: "普通",
          score: 2,
          expression: "normal.png",
          interviewerComment: "試す姿勢は良いですが、どう検証するかも考えたいですね。",
          feedback: "実験の考え方は良いですが、指標を決めるとさらに強いです。"
        },
        {
          text: "「リスクは、あまり人が来ないことです。」",
          rank: "少し悪い",
          score: 1,
          expression: "serious.png",
          interviewerComment: "リスクは見えています。次に、どう抑えるかを考えたいですね。",
          feedback: "リスクを言うだけでなく、対策までセットで話す必要があります。"
        },
        {
          text: "「良い施策なので、大きなリスクはないと思います。」",
          rank: "かなり悪い",
          score: 0,
          expression: "disappointed.png",
          interviewerComment: "どんな施策にもリスクはあります。",
          feedback: "リスクを見ない回答は、実行面の視点が弱く見えます。"
        }
      ]
    }
  }
];

const questionSets = {
  beginner: {
    label: "初級",
    description: "入室から退出までの基本マナー",
    questions: beginnerQuestions
  },
  intermediate: {
    label: "中級",
    description: "自己PR・志望動機・深掘り質問",
    questions: intermediateQuestions
  },
  advanced: {
    label: "上級",
    description: "最終面接・圧迫気味の質問・価値観の深掘り",
    questions: advancedQuestions
  },
  case: {
    label: "ケース面接",
    description: "対話で進めるケース面接",
    mode: "case",
    questions: caseInterviewQuestions
  }
};

const screens = {
  start: document.getElementById("start-screen"),
  title: document.getElementById("title-screen"),
  training: document.getElementById("training-screen"),
  game: document.getElementById("game-screen"),
  finish: document.getElementById("finish-screen")
};

const homeInterviewButton = document.getElementById("home-interview-button");
const homeTrainingButton = document.getElementById("home-training-button");
const modeHomeButton = document.getElementById("mode-home-button");
const trainingHomeButton = document.getElementById("training-home-button");
const levelButtons = document.querySelectorAll("[data-level]");
const retryButton = document.getElementById("retry-button");
const resultModeButton = document.getElementById("result-mode-button");
const resultBackToStartButton = document.getElementById("result-back-to-start-button");
const backToStartButton = document.getElementById("back-to-start-button");
const nextButton = document.getElementById("next-button");
const progressText = document.getElementById("progress-text");
const speakerLabel = document.getElementById("speaker-label");
const questionText = document.getElementById("question-text");
const interviewerComment = document.getElementById("interviewer-comment");
const interviewerImage = document.getElementById("interviewer");
const interviewerFrame = document.querySelector(".interviewer-frame");
const answerList = document.getElementById("answer-list");
const evaluationText = document.getElementById("evaluation-text");
const dialogScroll = document.querySelector(".dialog-scroll");
const resultLevel = document.getElementById("result-level");
const resultTitle = document.getElementById("result-title");
const resultScore = document.getElementById("result-score");
const resultExpSummary = document.getElementById("result-exp-summary");
const resultInterviewer = document.getElementById("result-interviewer");
const resultScroll = document.querySelector(".result-scroll");
const finishComment = document.getElementById("finish-comment");
const assetWarning = document.getElementById("asset-warning");
const keigoCategoryOrder = ["sonkeigo", "kenjougo", "teineigo"];
const termsDifficultyOrder = ["beginner", "intermediate", "advanced"];
const homePlayerLevel = document.getElementById("home-player-level");
const homeNextExp = document.getElementById("home-next-exp");
const homePlayCount = document.getElementById("home-play-count");
const homeExpFill = document.getElementById("home-exp-fill");

const EXP_PER_LEVEL = 100;
const PLAYER_PROGRESS_DEFAULTS = {
  playerLevel: 1,
  playerExp: 0,
  totalPlayCount: 0,
  clearCount: 0,
  bestScores: {}
};
const INTERVIEW_EXP_REWARDS = { S: 150, A: 120, B: 80, C: 50, D: 25 };
const CASE_EXP_REWARDS = { S: 180, A: 140, B: 100, C: 60, D: 30 };
const KEIGO_EXP_REWARDS = [
  { min: 10, exp: 120 },
  { min: 8, exp: 90 },
  { min: 6, exp: 60 },
  { min: 4, exp: 35 },
  { min: 0, exp: 15 }
];
const TERMS_CLEAR_SCORE = 8;
const TERMS_UNLOCK_STORAGE_KEY = "shukatsuTermsUnlocked";
const TERMS_EXP_REWARDS = {
  beginner: [
    { min: 10, exp: 110 },
    { min: 8, exp: 80 },
    { min: 6, exp: 55 },
    { min: 4, exp: 30 },
    { min: 0, exp: 15 }
  ],
  intermediate: [
    { min: 10, exp: 140 },
    { min: 8, exp: 105 },
    { min: 6, exp: 70 },
    { min: 4, exp: 40 },
    { min: 0, exp: 20 }
  ],
  advanced: [
    { min: 10, exp: 170 },
    { min: 8, exp: 130 },
    { min: 6, exp: 90 },
    { min: 4, exp: 50 },
    { min: 0, exp: 25 }
  ]
};

let currentLevel = null;
let currentQuestions = [];
let currentQuestionIndex = 0;
let totalScore = 0;
let answered = false;
let selectedChoice = null;
let currentLevelKey = null;
let currentCaseIndex = 0;
let currentCaseDialogueIndex = 0;
let currentCaseStage = "openingDialogue";
let currentCaseQuestionType = "first";
let currentKeigoCategory = null;
let currentKeigoQuestions = [];
let currentKeigoIndex = 0;
let currentKeigoStage = "select";
let keigoAnswered = false;
let currentTermsDifficulty = null;
let currentTermsQuestions = [];
let currentTermsIndex = 0;
let currentTermsStage = "select";
let termsAnswered = false;

function showScreen(name) {
  if (name === "game" || name === "finish") {
    void preloadExpressionImages();
  }

  Object.values(screens).forEach((screen) => {
    if (screen) {
      screen.classList.add("hidden");
    }
  });

  if (screens[name]) {
    screens[name].classList.remove("hidden");
  }

  if (backToStartButton) {
    backToStartButton.classList.toggle("hidden", name !== "game");
  }
}

function showMainHub() {
  updateHomeStatus();
  showScreen("start");
}

function showInterviewModeSelect() {
  showScreen("title");
}

function showTrainingModeSelect() {
  showScreen("training");
}

function setFeedbackMode(isEnabled) {
  if (screens.game) {
    screens.game.classList.toggle("feedback-mode", isEnabled);
  }

  if (!isEnabled) {
    setTrainingJudgementState(null);
  }
}

function resetDialogScroll() {
  const scrollTarget = dialogScroll || document.querySelector(".dialog-scroll") || document.querySelector(".dialog-panel");
  if (scrollTarget) {
    scrollTarget.scrollTop = 0;
  }
}

function resetResultScroll() {
  const scrollTarget = resultScroll || document.querySelector(".result-scroll") || document.querySelector(".result-box");
  if (scrollTarget) {
    scrollTarget.scrollTop = 0;
  }
}

function setTrainingJudgementState(isCorrect) {
  if (!interviewerComment) return;

  interviewerComment.classList.remove("judgement-correct", "judgement-wrong");
}

function renderFeedbackComment(comment) {
  renderFeedbackCards([
    {
      label: "面接官コメント",
      text: comment
    }
  ]);
}

function renderFeedbackCards(cards) {
  answerList.innerHTML = "";

  cards.forEach((card) => {
    const commentBox = document.createElement("div");
    commentBox.className = `feedback-comment-card${card.variant ? ` ${card.variant}` : ""}`;

    const label = document.createElement("span");
    label.className = "feedback-comment-label";
    label.textContent = card.label;

    const body = document.createElement("p");
    body.className = "feedback-comment-text";
    body.textContent = card.text;

    commentBox.append(label, body);
    answerList.appendChild(commentBox);
  });
}

function createPlainFeedbackCard({ title, text, note = "", variant = "", extraLabels = [] }) {
  const card = document.createElement("section");
  card.className = `choice-feedback-card plain-feedback-card${variant ? ` ${variant}` : ""}`;

  const header = document.createElement("div");
  header.className = "choice-feedback-header";

  const heading = document.createElement("span");
  heading.className = "choice-feedback-title";
  heading.textContent = title;

  const meta = document.createElement("div");
  meta.className = "choice-feedback-meta";
  extraLabels.forEach((labelText) => {
    const label = document.createElement("span");
    label.className = "choice-feedback-tag";
    label.textContent = labelText;
    meta.appendChild(label);
  });

  header.appendChild(heading);
  if (meta.childElementCount > 0) {
    header.appendChild(meta);
  }

  const body = document.createElement("p");
  body.className = "choice-feedback-answer";
  body.textContent = text;

  card.append(header, body);

  if (note) {
    const noteText = document.createElement("p");
    noteText.className = "choice-feedback-note";
    noteText.textContent = note;
    card.appendChild(noteText);
  }

  return card;
}

function renderTrainingFeedback({ selectedText, answerText, explanation, isCorrect }) {
  answerList.innerHTML = "";
  answerList.appendChild(createPlainFeedbackCard({
    title: "あなたの回答",
    text: selectedText,
    variant: isCorrect ? "is-correct" : "is-wrong"
  }));
  answerList.appendChild(createPlainFeedbackCard({
    title: "正解と解説",
    text: `正解：${answerText}`,
    note: explanation,
    variant: "is-model"
  }));
  evaluationText.textContent = "";
  evaluationText.classList.add("hidden");
  resetDialogScroll();
}

function getChoiceRankClass(rank) {
  if (rank === "正解") return "rank-best";
  if (rank === "普通") return "rank-normal";
  if (rank === "少し悪い") return "rank-warning";
  return "rank-danger";
}

function getYourAnswerRankClass(rank) {
  if (rank === "正解") return "your-answer--correct";
  if (rank === "普通") return "your-answer--normal";
  if (rank === "少し悪い") return "your-answer--slightly-bad";
  return "your-answer--bad";
}

function createRankBadge(choice) {
  const badge = document.createElement("span");
  badge.className = `choice-rank-badge ${getChoiceRankClass(choice.rank)}`;
  badge.textContent = choice.rank;
  return badge;
}

function createChoiceScore(choice) {
  const score = document.createElement("span");
  score.className = "choice-score-badge";
  score.textContent = `${choice.score}点`;
  return score;
}

function createChoiceFeedbackCard({ title, choice, note, extraLabels = [], isModel = false, rankClass = "" }) {
  const card = document.createElement("section");
  card.className = `choice-feedback-card${isModel ? " is-model" : ""}${rankClass ? ` ${rankClass}` : ""}`;

  const header = document.createElement("div");
  header.className = "choice-feedback-header";

  const heading = document.createElement("span");
  heading.className = "choice-feedback-title";
  heading.textContent = title;

  const meta = document.createElement("div");
  meta.className = "choice-feedback-meta";
  extraLabels.forEach((labelText) => {
    const label = document.createElement("span");
    label.className = "choice-feedback-tag";
    label.textContent = labelText;
    meta.appendChild(label);
  });
  meta.append(createRankBadge(choice), createChoiceScore(choice));

  header.append(heading, meta);

  const text = document.createElement("p");
  text.className = "choice-feedback-answer";
  text.textContent = choice.text;

  card.append(header, text);

  if (note) {
    const noteText = document.createElement("p");
    noteText.className = "choice-feedback-note";
    noteText.textContent = note;
    card.appendChild(noteText);
  }

  return card;
}

function renderChoiceFeedback(question, selectedChoice) {
  answerList.innerHTML = "";

  const choices = Array.isArray(question?.choices) ? question.choices : [];
  const modelChoice = choices.find((choice) => choice.rank === "正解") || choices[0] || selectedChoice;
  const selectedIsModel = selectedChoice?.rank === "正解" || selectedChoice === modelChoice;

  answerList.appendChild(createChoiceFeedbackCard({
    title: "あなたの回答",
    choice: selectedChoice,
    note: selectedIsModel ? selectedChoice.feedback : "",
    rankClass: getYourAnswerRankClass(selectedChoice.rank)
  }));

  if (!selectedIsModel) {
    answerList.appendChild(createChoiceFeedbackCard({
      title: "お手本の回答",
      choice: modelChoice,
      note: modelChoice.feedback,
      isModel: true
    }));
  }

  const details = document.createElement("details");
  details.className = "choice-evaluation-details";

  const summary = document.createElement("summary");
  summary.textContent = "全選択肢の評価を見る";
  details.appendChild(summary);

  const list = document.createElement("div");
  list.className = "choice-evaluation-list";

  choices.forEach((choice) => {
    const labels = [];
    if (choice === selectedChoice || choice.text === selectedChoice.text) {
      labels.push("あなた");
    }
    if (choice === modelChoice || choice.text === modelChoice.text) {
      labels.push("お手本");
    }

    list.appendChild(createChoiceFeedbackCard({
      title: "選択肢",
      choice,
      note: choice.feedback,
      extraLabels: labels,
      isModel: choice === modelChoice || choice.text === modelChoice.text
    }));
  });

  details.appendChild(list);
  answerList.appendChild(details);
  resetDialogScroll();
}

function readStoredNumber(key, fallbackValue) {
  const value = Number(localStorage.getItem(key));
  return Number.isFinite(value) && value >= 0 ? value : fallbackValue;
}

function loadBestScores() {
  try {
    const parsed = JSON.parse(localStorage.getItem("bestScores") || "{}");
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch (error) {
    return {};
  }
}

function loadPlayerProgress() {
  try {
    return {
      playerLevel: Math.max(1, readStoredNumber("playerLevel", PLAYER_PROGRESS_DEFAULTS.playerLevel)),
      playerExp: Math.min(EXP_PER_LEVEL - 1, readStoredNumber("playerExp", PLAYER_PROGRESS_DEFAULTS.playerExp)),
      totalPlayCount: readStoredNumber("totalPlayCount", PLAYER_PROGRESS_DEFAULTS.totalPlayCount),
      clearCount: readStoredNumber("clearCount", PLAYER_PROGRESS_DEFAULTS.clearCount),
      bestScores: loadBestScores()
    };
  } catch (error) {
    return { ...PLAYER_PROGRESS_DEFAULTS, bestScores: {} };
  }
}

function savePlayerProgress(progress) {
  try {
    localStorage.setItem("playerLevel", String(progress.playerLevel));
    localStorage.setItem("playerExp", String(progress.playerExp));
    localStorage.setItem("totalPlayCount", String(progress.totalPlayCount));
    localStorage.setItem("clearCount", String(progress.clearCount));
    localStorage.setItem("bestScores", JSON.stringify(progress.bestScores || {}));
  } catch (error) {
    // localStorageが使えない環境でもゲーム本体は継続できるようにします。
  }
}

function updateHomeStatus() {
  const progress = loadPlayerProgress();
  const nextExp = Math.max(0, EXP_PER_LEVEL - progress.playerExp);
  const expPercent = Math.min(100, Math.max(0, (progress.playerExp / EXP_PER_LEVEL) * 100));

  if (homePlayerLevel) {
    homePlayerLevel.textContent = `PLAYER Lv.${progress.playerLevel}`;
  }

  if (homeNextExp) {
    homeNextExp.textContent = `次のLvまで ${nextExp} EXP`;
  }

  if (homePlayCount) {
    homePlayCount.textContent = `CLEAR ${progress.clearCount}`;
  }

  if (homeExpFill) {
    homeExpFill.style.width = `${expPercent}%`;
  }
}

function getInterviewRank(score, maxScore) {
  const rate = maxScore > 0 ? score / maxScore : 0;

  if (rate >= 0.9) return "S";
  if (rate >= 0.8) return "A";
  if (rate >= 0.6) return "B";
  if (rate >= 0.34) return "C";
  return "D";
}

function getKeigoExpReward(score) {
  const reward = KEIGO_EXP_REWARDS.find((item) => score >= item.min);
  return reward ? reward.exp : 0;
}

function loadTermsUnlocks() {
  try {
    const parsed = JSON.parse(localStorage.getItem(TERMS_UNLOCK_STORAGE_KEY) || "{}");
    return {
      beginner: true,
      intermediate: Boolean(parsed.intermediate),
      advanced: Boolean(parsed.advanced)
    };
  } catch (error) {
    return {
      beginner: true,
      intermediate: false,
      advanced: false
    };
  }
}

function saveTermsUnlocks(unlocks) {
  try {
    localStorage.setItem(TERMS_UNLOCK_STORAGE_KEY, JSON.stringify({
      beginner: true,
      intermediate: Boolean(unlocks.intermediate),
      advanced: Boolean(unlocks.advanced)
    }));
  } catch (error) {
    // localStorageが使えない環境でも、そのプレイ中の進行は継続できます。
  }
}

function unlockNextTermsDifficulty(difficultyKey) {
  const unlocks = loadTermsUnlocks();

  if (difficultyKey === "beginner") {
    unlocks.intermediate = true;
  }

  if (difficultyKey === "intermediate") {
    unlocks.advanced = true;
  }

  saveTermsUnlocks(unlocks);
}

function getTermsExpReward(score, difficultyKey) {
  const rewards = TERMS_EXP_REWARDS[difficultyKey] || TERMS_EXP_REWARDS.beginner;
  const reward = rewards.find((item) => score >= item.min);
  return reward ? reward.exp : 0;
}

function getModeBestScoreKey(modeKey) {
  if (modeKey === "keigo") {
    return `keigo:${currentKeigoCategory || "unknown"}`;
  }

  if (modeKey === "terms") {
    return `terms:${currentTermsDifficulty || "unknown"}`;
  }

  return modeKey || "unknown";
}

function grantPlayerExp({ modeKey, score, maxScore, rank, exp, cleared }) {
  const progress = loadPlayerProgress();
  const beforeLevel = progress.playerLevel;
  const previousBest = Number(progress.bestScores[getModeBestScoreKey(modeKey)] || 0);
  let gainedExp = exp;

  progress.totalPlayCount += 1;

  if (cleared) {
    progress.clearCount += 1;
  }

  progress.bestScores[getModeBestScoreKey(modeKey)] = Math.max(previousBest, score);
  progress.playerExp += gainedExp;

  while (progress.playerExp >= EXP_PER_LEVEL) {
    progress.playerExp -= EXP_PER_LEVEL;
    progress.playerLevel += 1;
  }

  savePlayerProgress(progress);
  updateHomeStatus();

  return {
    beforeLevel,
    afterLevel: progress.playerLevel,
    gainedExp,
    nextExp: Math.max(0, EXP_PER_LEVEL - progress.playerExp),
    rank,
    score,
    maxScore,
    didRankUp: progress.playerLevel > beforeLevel
  };
}

function renderResultExpSummary(progressResult) {
  if (!resultExpSummary) return;

  const levelText = progressResult.didRankUp
    ? `PLAYER Lv.${progressResult.beforeLevel} → Lv.${progressResult.afterLevel}`
    : `PLAYER Lv.${progressResult.afterLevel}`;
  const rankText = progressResult.rank ? `<span>評価ランク：${progressResult.rank}</span>` : "";
  const rankUpText = progressResult.didRankUp ? `<strong class="rank-up-label">RANK UP!</strong>` : "";

  resultExpSummary.innerHTML = `
    ${rankUpText}
    <div class="result-exp-grid">
      ${rankText}
      <span>獲得EXP：+${progressResult.gainedExp}</span>
      <span>${levelText}</span>
      <span>次のLvまで：${progressResult.nextExp} EXP</span>
    </div>
  `;
}


function startGame(levelKey) {
  currentLevelKey = levelKey;
  currentLevel = questionSets[levelKey];
  currentQuestions = currentLevel.questions;
  currentQuestionIndex = 0;
  totalScore = 0;
  answered = false;
  selectedChoice = null;
  currentCaseIndex = 0;
  currentCaseDialogueIndex = 0;
  currentCaseStage = "openingDialogue";
  currentCaseQuestionType = "first";
  setFeedbackMode(false);
  resetKeigoState();
  setKeigoScreenStage("");
  resetTermsState();
  setTermsScreenStage("");
  changeExpression("normal.png");
  setInterviewerVisible(true);
  showScreen("game");

  if (isCaseMode()) {
    showCaseOpeningDialogue();
    return;
  }

  showQuestion();
}

function showQuestion() {
  const question = currentQuestions[currentQuestionIndex];
  const shuffledChoices = shuffleArray(question.choices);
  answered = false;
  selectedChoice = null;
  setFeedbackMode(false);

  progressText.textContent = `${currentLevel.label} Q${currentQuestionIndex + 1} / ${currentQuestions.length}`;
  speakerLabel.textContent = "面接官";
  interviewerComment.textContent = question.title;
  questionText.textContent = question.scene;
  evaluationText.classList.add("hidden");
  nextButton.classList.add("hidden");
  nextButton.textContent = currentQuestionIndex === currentQuestions.length - 1 ? "結果を見る" : "次へ";
  answerList.innerHTML = "";

  setInterviewerExpression("normal.png");
  setInterviewerVisible(true);

  shuffledChoices.forEach((choice) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-button";
    button.textContent = choice.text;
    button.addEventListener("click", () => selectAnswer(choice, button));
    answerList.appendChild(button);
  });
  resetDialogScroll();
}

function selectAnswer(choice, selectedButton) {
  if (answered) {
    return;
  }

  const question = currentQuestions[currentQuestionIndex];
  answered = true;
  selectedChoice = choice;
  totalScore += choice.score;
  speakerLabel.textContent = "面接官";
  setInterviewerVisible(true);
  changeExpression(choice.expression || getExpressionByScore(choice.score));
  setFeedbackMode(true);
  interviewerComment.textContent = choice.interviewerComment;
  questionText.textContent = question.scene;
  renderChoiceFeedback(question, choice);
  evaluationText.textContent = "";
  evaluationText.classList.add("hidden");
  nextButton.classList.remove("hidden");
}

function goNextQuestion() {
  if (isKeigoMode()) {
    goNextKeigoStep();
    return;
  }

  if (isTermsMode()) {
    goNextTermsStep();
    return;
  }

  if (isCaseMode()) {
    goNextCaseStep();
    return;
  }

  if (!answered) {
    return;
  }

  currentQuestionIndex += 1;

  if (currentQuestionIndex >= currentQuestions.length) {
    showResult();
    return;
  }

  showQuestion();
}

function showResult() {
  const maxScore = isCaseMode() ? currentQuestions.length * 6 : currentQuestions.length * 3;
  const result = isCaseMode() ? getCaseFinalResult(totalScore) : getFinalResult(totalScore);
  const resultClass = result.status === "合格"
    ? "result-pass"
    : result.status === "条件付き合格"
      ? "result-conditional"
      : "result-fail";

  const rank = getInterviewRank(totalScore, maxScore);
  const progressResult = grantPlayerExp({
    modeKey: currentLevelKey,
    score: totalScore,
    maxScore,
    rank,
    exp: isCaseMode() ? CASE_EXP_REWARDS[rank] : INTERVIEW_EXP_REWARDS[rank],
    cleared: result.status === "合格"
  });

  changeExpression(result.expression);
  changeResultExpression(result.expression);
  screens.finish.classList.remove("result-pass", "result-conditional", "result-fail");
  screens.finish.classList.add(resultClass);
  resultLevel.textContent = `${isCaseMode() ? "モード" : "難易度"}：${currentLevel.label}`;
  resultTitle.textContent = `判定：${result.status}`;
  resultScore.textContent = `あなたのスコア：${totalScore} / ${maxScore}点`;
  renderResultExpSummary(progressResult);
  finishComment.textContent = result.comment;
  showScreen("finish");
  resetResultScroll();
}

function restartGame() {
  currentLevelKey = null;
  currentLevel = null;
  currentQuestions = [];
  currentQuestionIndex = 0;
  totalScore = 0;
  answered = false;
  selectedChoice = null;
  currentCaseIndex = 0;
  currentCaseDialogueIndex = 0;
  currentCaseStage = "openingDialogue";
  currentCaseQuestionType = "first";
  resetKeigoState();
  setKeigoScreenStage("");
  resetTermsState();
  setTermsScreenStage("");
  screens.finish.classList.remove("result-pass", "result-conditional", "result-fail");
  answerList.innerHTML = "";
  evaluationText.classList.add("hidden");
  nextButton.classList.add("hidden");
  speakerLabel.textContent = "面接官";
  setInterviewerVisible(true);
  changeExpression("normal.png");
  changeResultExpression("normal.png");
  showMainHub();
}

function replayCurrentMode() {
  if (currentLevelKey === "keigo") {
    const categoryKey = currentKeigoCategory;
    showKeigoModeSelect();

    if (categoryKey) {
      currentKeigoCategory = categoryKey;
      totalScore = 0;
      startKeigoRound();
    }

    return;
  }

  if (currentLevelKey === "terms") {
    const difficultyKey = currentTermsDifficulty;
    showTermsModeSelect();

    if (difficultyKey) {
      currentTermsDifficulty = difficultyKey;
      totalScore = 0;
      startTermsRound();
    }

    return;
  }

  if (currentLevelKey && questionSets[currentLevelKey]) {
    startGame(currentLevelKey);
    return;
  }

  restartGame();
}

function isCaseMode() {
  return currentLevel && currentLevel.mode === "case";
}

function isKeigoMode() {
  return currentLevel && currentLevel.mode === "keigo";
}

function isTermsMode() {
  return currentLevel && currentLevel.mode === "terms";
}

function getCurrentCase() {
  return currentQuestions[currentCaseIndex];
}

function showCaseOpeningDialogue() {
  currentCaseStage = "openingDialogue";
  currentCaseDialogueIndex = 0;
  renderCaseDialogue(getCurrentCase().openingDialogues[currentCaseDialogueIndex], "次へ");
}

function showCaseFollowUpDialogue() {
  currentCaseStage = "followUpDialogue";
  currentCaseDialogueIndex = 0;
  const followUpDialogues = getCurrentCase().followUpDialogues || [];

  if (followUpDialogues.length === 0) {
    showCaseQuestion("followUp");
    return;
  }

  renderCaseDialogue(followUpDialogues[currentCaseDialogueIndex], "回答を選ぶ");
}

function renderCaseDialogue(dialogue, nextLabel) {
  answered = false;
  selectedChoice = null;
  setFeedbackMode(false);
  progressText.textContent = `${currentLevel.label} CASE ${currentCaseIndex + 1} / ${currentQuestions.length}`;
  speakerLabel.textContent = dialogue.speaker;
  interviewerComment.textContent = getCurrentCase().title;
  questionText.textContent = dialogue.text;
  answerList.innerHTML = "";
  evaluationText.classList.add("hidden");
  nextButton.textContent = nextLabel;
  nextButton.classList.remove("hidden");

  setInterviewerVisible(true);
  changeExpression("normal.png");
  resetDialogScroll();
}

function showCaseQuestion(questionType) {
  const currentCase = getCurrentCase();
  const caseQuestion = questionType === "first" ? currentCase.firstQuestion : currentCase.followUpQuestion;
  const shuffledChoices = shuffleArray(caseQuestion.choices);
  currentCaseStage = "question";
  currentCaseQuestionType = questionType;
  answered = false;
  selectedChoice = null;
  setFeedbackMode(false);

  progressText.textContent = `${currentLevel.label} CASE ${currentCaseIndex + 1} / ${currentQuestions.length} - ${questionType === "first" ? "1問目" : "2問目"}`;
  speakerLabel.textContent = "あなた";
  interviewerComment.textContent = currentCase.title;
  questionText.textContent = caseQuestion.prompt;
  answerList.innerHTML = "";
  evaluationText.classList.add("hidden");
  nextButton.classList.add("hidden");
  setInterviewerVisible(true);
  changeExpression("normal.png");

  shuffledChoices.forEach((choice) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-button";
    button.textContent = choice.text;
    button.addEventListener("click", () => selectCaseAnswer(choice, button));
    answerList.appendChild(button);
  });
  resetDialogScroll();
}

function selectCaseAnswer(choice, selectedButton) {
  if (answered) {
    return;
  }

  const currentCase = getCurrentCase();
  const caseQuestion = currentCaseQuestionType === "first" ? currentCase.firstQuestion : currentCase.followUpQuestion;
  answered = true;
  selectedChoice = choice;
  totalScore += choice.score;
  currentCaseStage = "feedback";
  speakerLabel.textContent = "面接官";
  setFeedbackMode(true);
  interviewerComment.textContent = choice.interviewerComment;
  questionText.textContent = caseQuestion.prompt;
  renderChoiceFeedback(caseQuestion, choice);
  evaluationText.textContent = "";
  evaluationText.classList.add("hidden");
  nextButton.textContent = currentCaseQuestionType === "first"
    ? "追加質問へ"
    : currentCaseIndex === currentQuestions.length - 1
      ? "結果を見る"
      : "次のケースへ";
  nextButton.classList.remove("hidden");
  setInterviewerVisible(true);
  changeExpression(choice.expression || getExpressionByScore(choice.score));
}

function goNextCaseStep() {
  const currentCase = getCurrentCase();

  if (currentCaseStage === "openingDialogue") {
    const openingDialogues = currentCase.openingDialogues || [];
    if (currentCaseDialogueIndex < openingDialogues.length - 1) {
      currentCaseDialogueIndex += 1;
      renderCaseDialogue(openingDialogues[currentCaseDialogueIndex], "回答を選ぶ");
      return;
    }

    showCaseQuestion("first");
    return;
  }

  if (currentCaseStage === "followUpDialogue") {
    const followUpDialogues = currentCase.followUpDialogues || [];
    if (currentCaseDialogueIndex < followUpDialogues.length - 1) {
      currentCaseDialogueIndex += 1;
      renderCaseDialogue(followUpDialogues[currentCaseDialogueIndex], "回答を選ぶ");
      return;
    }

    showCaseQuestion("followUp");
    return;
  }

  if (currentCaseStage !== "feedback" || !answered) {
    return;
  }

  if (currentCaseQuestionType === "first") {
    showCaseFollowUpDialogue();
    return;
  }

  currentCaseIndex += 1;
  if (currentCaseIndex >= currentQuestions.length) {
    showResult();
    return;
  }

  showCaseOpeningDialogue();
}

function showKeigoModeSelect() {
  setFeedbackMode(false);
  currentLevelKey = "keigo";
  currentLevel = {
    label: "敬語クイズ",
    mode: "keigo"
  };
  currentQuestions = [];
  currentQuestionIndex = 0;
  totalScore = 0;
  answered = false;
  selectedChoice = null;
  resetKeigoState();
  setKeigoScreenStage("select");
  resetTermsState();
  setTermsScreenStage("");
  screens.finish.classList.remove("result-pass", "result-conditional", "result-fail");

  progressText.textContent = "敬語クイズ";
  speakerLabel.textContent = "櫻みゆき";
  interviewerComment.textContent = "挑戦する敬語を選んでください";
  questionText.textContent = "各カテゴリ20問の中から、毎回ランダムで10問を出題します。同じプレイ中に同じ問題は出ません。";
  evaluationText.classList.add("hidden");
  nextButton.classList.add("hidden");
  answerList.innerHTML = "";

  changeExpression("softsmile.png");
  setInterviewerVisible(true);
  showScreen("game");

  keigoCategoryOrder.forEach((categoryKey) => {
    const guide = window.keigoQuizGuides[categoryKey];
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-button keigo-category-button";
    button.innerHTML = `<strong>${guide.title}</strong><span>${guide.point}</span>`;
    button.addEventListener("click", () => showKeigoGuide(categoryKey));
    answerList.appendChild(button);
  });
  resetDialogScroll();
}

function showKeigoGuide(categoryKey) {
  const guide = window.keigoQuizGuides[categoryKey];
  setFeedbackMode(false);
  currentKeigoCategory = categoryKey;
  currentKeigoStage = "guide";
  setKeigoScreenStage("guide");

  progressText.textContent = `敬語クイズ / ${guide.label}`;
  speakerLabel.textContent = "櫻みゆき";
  interviewerComment.textContent = `${guide.label}の基本`;
  questionText.textContent = `${guide.description}\n\n例文：\n${guide.examples.join("\n\n")}\n\nポイント：\n${guide.point}`;
  answerList.innerHTML = "";
  evaluationText.classList.add("hidden");
  nextButton.textContent = "START";
  nextButton.classList.remove("hidden");
  changeExpression("softsmile.png");
  setInterviewerVisible(true);
  resetDialogScroll();
}

function startKeigoRound() {
  const sourceQuestions = window.keigoQuizData[currentKeigoCategory] || [];
  currentKeigoQuestions = shuffleArray(sourceQuestions)
    .slice(0, 10)
    .map(prepareKeigoQuestion);
  currentKeigoIndex = 0;
  totalScore = 0;
  keigoAnswered = false;
  showKeigoQuestion();
}

function prepareKeigoQuestion(question) {
  const answerText = question.choices[question.answerIndex];
  const choices = shuffleArray(question.choices).map((text) => ({
    text,
    isCorrect: text === answerText
  }));

  return {
    ...question,
    answerText,
    shuffledChoices: choices
  };
}

function showKeigoQuestion() {
  const guide = window.keigoQuizGuides[currentKeigoCategory];
  const question = currentKeigoQuestions[currentKeigoIndex];
  setFeedbackMode(false);
  currentKeigoStage = "question";
  keigoAnswered = false;
  answered = false;
  selectedChoice = null;
  setKeigoScreenStage("question");

  progressText.textContent = `${guide.label} Q${currentKeigoIndex + 1} / ${currentKeigoQuestions.length}`;
  speakerLabel.textContent = "問題";
  interviewerComment.textContent = guide.title;
  questionText.textContent = question.question;
  answerList.innerHTML = "";
  evaluationText.classList.add("hidden");
  nextButton.classList.add("hidden");
  changeExpression("normal.png");
  setInterviewerVisible(true);

  question.shuffledChoices.forEach((choice) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-button keigo-choice-button";
    button.textContent = choice.text;
    button.addEventListener("click", () => selectKeigoAnswer(choice, button));
    answerList.appendChild(button);
  });
  resetDialogScroll();
}

function selectKeigoAnswer(choice, selectedButton) {
  if (keigoAnswered) {
    return;
  }

  const question = currentKeigoQuestions[currentKeigoIndex];
  keigoAnswered = true;
  answered = true;
  selectedChoice = choice;
  currentKeigoStage = "feedback";
  setKeigoScreenStage("feedback");
  setFeedbackMode(true);

  if (choice.isCorrect) {
    totalScore += 1;
  }

  speakerLabel.textContent = "櫻みゆき";
  interviewerComment.textContent = choice.isCorrect ? "正解です。" : "惜しいです。";
  questionText.textContent = question.question;
  renderTrainingFeedback({
    selectedText: choice.text,
    answerText: question.answerText,
    explanation: question.explanation,
    isCorrect: choice.isCorrect
  });
  nextButton.textContent = currentKeigoIndex === currentKeigoQuestions.length - 1 ? "結果を見る" : "次へ";
  nextButton.classList.remove("hidden");
  changeExpression(choice.isCorrect ? "softsmile.png" : "confused.png");
  setInterviewerVisible(true);
}

function goNextKeigoStep() {
  if (currentKeigoStage === "guide") {
    startKeigoRound();
    return;
  }

  if (currentKeigoStage !== "feedback" || !keigoAnswered) {
    return;
  }

  currentKeigoIndex += 1;

  if (currentKeigoIndex >= currentKeigoQuestions.length) {
    showKeigoResult();
    return;
  }

  showKeigoQuestion();
}

function showKeigoResult() {
  const guide = window.keigoQuizGuides[currentKeigoCategory];
  const result = getKeigoFinalResult(totalScore);
  const resultClass = result.status === "敬語マスター"
    ? "result-pass"
    : result.status === "あと少し"
      ? "result-conditional"
      : "result-fail";

  const progressResult = grantPlayerExp({
    modeKey: "keigo",
    score: totalScore,
    maxScore: 10,
    rank: null,
    exp: getKeigoExpReward(totalScore),
    cleared: totalScore >= 8
  });

  changeExpression(result.expression);
  changeResultExpression(result.expression);
  screens.finish.classList.remove("result-pass", "result-conditional", "result-fail");
  screens.finish.classList.add(resultClass);
  resultLevel.textContent = `モード：敬語クイズ / ${guide.label}`;
  resultTitle.textContent = `結果：${result.status}`;
  resultScore.textContent = `正解数：${totalScore} / 10問`;
  renderResultExpSummary(progressResult);
  finishComment.textContent = result.comment;
  showScreen("finish");
  resetResultScroll();
}

function getKeigoFinalResult(score) {
  if (score >= 8) {
    return {
      status: "敬語マスター",
      expression: "pleased.png",
      comment: "かなり良い結果です。敬語の種類を見分ける力がついています。この調子で面接やビジネス会話でも自然に使えるように練習しましょう。"
    };
  }

  if (score >= 5) {
    return {
      status: "あと少し",
      expression: "thinking.png",
      comment: "基本はつかめています。尊敬語は相手の行動、謙譲語は自分側の行動、丁寧語は言葉を丁寧にする表現だと整理して復習しましょう。"
    };
  }

  return {
    status: "復習しましょう",
    expression: "confused.png",
    comment: "まずは敬語の3分類から確認しましょう。相手を立てる尊敬語、自分を下げる謙譲語、です・ますで整える丁寧語を分けて覚えるのが近道です。"
  };
}

function showTermsModeSelect() {
  setFeedbackMode(false);
  currentLevelKey = "terms";
  currentLevel = {
    label: "就活専門用語トレーニング",
    mode: "terms"
  };
  currentQuestions = [];
  currentQuestionIndex = 0;
  totalScore = 0;
  answered = false;
  selectedChoice = null;
  resetKeigoState();
  setKeigoScreenStage("");
  resetTermsState();
  setTermsScreenStage("select");
  screens.finish.classList.remove("result-pass", "result-conditional", "result-fail");

  progressText.textContent = "就活専門用語";
  speakerLabel.textContent = "櫻みゆき";
  interviewerComment.textContent = "難易度を選んでください";
  questionText.textContent = "各難易度10問の中から、毎回ランダムで10問を出題します。8問以上正解でCLEARとなり、次の難易度が解放されます。";
  evaluationText.classList.add("hidden");
  nextButton.classList.add("hidden");
  answerList.innerHTML = "";

  changeExpression("softsmile.png");
  setInterviewerVisible(true);
  showScreen("game");
  renderTermsDifficultyButtons();
  resetDialogScroll();
}

function renderTermsDifficultyButtons() {
  const unlocks = loadTermsUnlocks();
  answerList.innerHTML = "";

  termsDifficultyOrder.forEach((difficultyKey) => {
    const guide = window.shukatsuTermsGuides[difficultyKey];
    const isUnlocked = Boolean(unlocks[difficultyKey]);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-button terms-difficulty-button";
    button.disabled = !isUnlocked;
    button.innerHTML = `
      <strong>${guide.title}</strong>
      <span>${guide.point}</span>
      ${isUnlocked ? "" : "<small>LOCKED / 前の難易度をCLEARで解放</small>"}
    `;

    if (isUnlocked) {
      button.addEventListener("click", () => showTermsGuide(difficultyKey));
    }

    answerList.appendChild(button);
  });
}

function showTermsGuide(difficultyKey) {
  const guide = window.shukatsuTermsGuides[difficultyKey];
  setFeedbackMode(false);
  currentTermsDifficulty = difficultyKey;
  currentTermsStage = "guide";
  setTermsScreenStage("guide");

  progressText.textContent = `就活専門用語 / ${guide.label}`;
  speakerLabel.textContent = "櫻みゆき";
  interviewerComment.textContent = `${guide.label}の準備`;
  questionText.textContent = `${guide.description}\n\n${guide.point}\n\n10問中8問以上でCLEARです。落ち着いて、一つずつ確認していきましょう。`;
  answerList.innerHTML = "";
  evaluationText.classList.add("hidden");
  nextButton.textContent = "START";
  nextButton.classList.remove("hidden");
  changeExpression("softsmile.png");
  setInterviewerVisible(true);
  resetDialogScroll();
}

function startTermsRound() {
  const sourceQuestions = window.shukatsuTermsData[currentTermsDifficulty] || [];
  currentTermsQuestions = shuffleArray(sourceQuestions)
    .slice(0, 10)
    .map(prepareTermsQuestion);
  currentTermsIndex = 0;
  totalScore = 0;
  termsAnswered = false;
  showTermsQuestion();
}

function prepareTermsQuestion(question) {
  const answerText = question.choices[question.answerIndex];
  const choices = shuffleArray(question.choices).map((text) => ({
    text,
    isCorrect: text === answerText
  }));

  return {
    ...question,
    answerText,
    shuffledChoices: choices
  };
}

function showTermsQuestion() {
  const guide = window.shukatsuTermsGuides[currentTermsDifficulty];
  const question = currentTermsQuestions[currentTermsIndex];
  setFeedbackMode(false);
  currentTermsStage = "question";
  termsAnswered = false;
  answered = false;
  selectedChoice = null;
  setTermsScreenStage("question");

  progressText.textContent = `${guide.label} Q${currentTermsIndex + 1} / ${currentTermsQuestions.length}`;
  speakerLabel.textContent = "問題";
  interviewerComment.textContent = guide.title;
  questionText.textContent = question.question;
  answerList.innerHTML = "";
  evaluationText.classList.add("hidden");
  nextButton.classList.add("hidden");
  changeExpression("normal.png");
  setInterviewerVisible(true);

  question.shuffledChoices.forEach((choice) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-button terms-choice-button";
    button.textContent = choice.text;
    button.addEventListener("click", () => selectTermsAnswer(choice, button));
    answerList.appendChild(button);
  });
  resetDialogScroll();
}

function selectTermsAnswer(choice, selectedButton) {
  if (termsAnswered) {
    return;
  }

  const question = currentTermsQuestions[currentTermsIndex];
  termsAnswered = true;
  answered = true;
  selectedChoice = choice;
  currentTermsStage = "feedback";
  setTermsScreenStage("feedback");
  setFeedbackMode(true);

  if (choice.isCorrect) {
    totalScore += 1;
  }

  speakerLabel.textContent = "櫻みゆき";
  interviewerComment.textContent = choice.isCorrect
    ? getRandomTermsCorrectComment()
    : question.incorrectComment;
  questionText.textContent = question.question;
  renderTrainingFeedback({
    selectedText: choice.text,
    answerText: question.answerText,
    explanation: question.explanation,
    isCorrect: choice.isCorrect
  });
  nextButton.textContent = currentTermsIndex === currentTermsQuestions.length - 1 ? "結果を見る" : "次へ";
  nextButton.classList.remove("hidden");
  changeExpression(choice.isCorrect ? "softsmile.png" : "thinking.png");
  setInterviewerVisible(true);
}

function getRandomTermsCorrectComment() {
  const comments = [
    "正解です。よく理解できています。",
    "正解です。その調子で進めましょう。",
    "正解です。基礎が身についてきていますね。",
    "正解です。覚えた言葉は、就活でしっかり役に立ちます。"
  ];
  return comments[Math.floor(Math.random() * comments.length)];
}

function goNextTermsStep() {
  if (currentTermsStage === "guide") {
    startTermsRound();
    return;
  }

  if (currentTermsStage !== "feedback" || !termsAnswered) {
    return;
  }

  currentTermsIndex += 1;

  if (currentTermsIndex >= currentTermsQuestions.length) {
    showTermsResult();
    return;
  }

  showTermsQuestion();
}

function showTermsResult() {
  const guide = window.shukatsuTermsGuides[currentTermsDifficulty];
  const result = getTermsFinalResult(totalScore, currentTermsDifficulty);
  const cleared = totalScore >= TERMS_CLEAR_SCORE;
  const resultClass = cleared
    ? "result-pass"
    : totalScore >= 6
      ? "result-conditional"
      : "result-fail";

  if (cleared) {
    unlockNextTermsDifficulty(currentTermsDifficulty);
  }

  const progressResult = grantPlayerExp({
    modeKey: "terms",
    score: totalScore,
    maxScore: 10,
    rank: null,
    exp: getTermsExpReward(totalScore, currentTermsDifficulty),
    cleared
  });

  changeExpression(result.expression);
  changeResultExpression(result.expression);
  screens.finish.classList.remove("result-pass", "result-conditional", "result-fail");
  screens.finish.classList.add(resultClass);
  resultLevel.textContent = `モード：就活専門用語 / ${guide.label}`;
  resultTitle.textContent = `結果：${result.status}`;
  resultScore.textContent = `正解数：${totalScore} / 10問`;
  renderResultExpSummary(progressResult);
  finishComment.textContent = result.comment;
  showScreen("finish");
  resetResultScroll();
}

function getTermsFinalResult(score, difficultyKey) {
  const levelPrefix = difficultyKey === "advanced" && score >= 8
    ? "上級でこの結果なら十分です。"
    : difficultyKey === "beginner" && score <= 5
      ? "初級でつまずいても問題ありません。"
      : "";

  if (score === 10) {
    return {
      status: "CLEAR",
      expression: "pleased.png",
      comment: `${levelPrefix}全問正解です。就活用語はしっかり身についています。自信を持って次へ進みましょう。`
    };
  }

  if (score >= 8) {
    return {
      status: "CLEAR",
      expression: "softsmile.png",
      comment: `${levelPrefix}よくできています。あと少しです。間違えた問題を見直すと、さらに確実になります。`
    };
  }

  if (score >= 6) {
    return {
      status: "あと少し",
      expression: "thinking.png",
      comment: "基本は理解できています。もう一歩です。曖昧だった用語を、もう一度確認しておきましょう。"
    };
  }

  if (score >= 4) {
    return {
      status: "復習しましょう",
      expression: "thinking.png",
      comment: `${levelPrefix}ここまで来られました。大丈夫です。一つずつ、用語を確認していきましょう。`
    };
  }

  return {
    status: "ここからです",
    expression: "normal.png",
    comment: "ここがスタートです。焦らなくて大丈夫です。少しずつ覚えていけば、必ず力になります。"
  };
}

function resetKeigoState() {
  currentKeigoCategory = null;
  currentKeigoQuestions = [];
  currentKeigoIndex = 0;
  currentKeigoStage = "select";
  keigoAnswered = false;
}

function resetTermsState() {
  currentTermsDifficulty = null;
  currentTermsQuestions = [];
  currentTermsIndex = 0;
  currentTermsStage = "select";
  termsAnswered = false;
}

function setKeigoScreenStage(stage) {
  const stages = ["select", "guide", "question", "feedback"];
  screens.game.classList.toggle("keigo-quiz-screen", Boolean(stage));
  stages.forEach((stageName) => {
    screens.game.classList.toggle(`keigo-stage-${stageName}`, stage === stageName);
  });
}

function setTermsScreenStage(stage) {
  const stages = ["select", "guide", "question", "feedback"];
  screens.game.classList.toggle("terms-training-screen", Boolean(stage));
  stages.forEach((stageName) => {
    screens.game.classList.toggle(`terms-stage-${stageName}`, stage === stageName);
  });
}

function getFinalResult(score) {
  if (score >= 24) {
    return {
      status: "合格",
      expression: "pleased.png",
      comment: "面接全体を通して、基本的なマナーと回答の組み立てがしっかりできています。入室から退出まで落ち着いて対応できており、面接官に良い印象を与えられる内容です。"
    };
  }

  if (score >= 18) {
    return {
      status: "条件付き合格",
      expression: "thinking.png",
      comment: "大きな問題はありませんが、回答の具体性や一部のマナーに改善の余地があります。基本はできているので、自己PRや志望動機をもう少し具体的にすると、より合格に近づきます。"
    };
  }

  return {
    status: "不合格",
    expression: "disappointed.png",
    comment: "入退室のマナーや回答内容に不安が残ります。まずは基本的な面接マナーと、自己紹介・自己PR・志望動機の答え方を練習しましょう。"
  };
}

function getCaseFinalResult(score) {
  if (score >= 39) {
    return {
      status: "合格",
      expression: "pleased.png",
      comment: "ケース面接の基本である前提確認、構造化、仮説設定、施策提案、反論対応がよくできています。面接官と対話しながら考えを深める姿勢もあり、実践に近い対応ができています。"
    };
  }

  if (score >= 29) {
    return {
      status: "条件付き合格",
      expression: "thinking.png",
      comment: "大きな流れは理解できていますが、前提確認や構造化、施策の優先順位づけに改善の余地があります。答えを急がず、面接官と認識を合わせながら進める意識をさらに高めましょう。"
    };
  }

  return {
    status: "不合格",
    expression: "disappointed.png",
    comment: "施策に飛びついたり、前提確認や構造化が不足している場面が目立ちます。まずは、前提確認→分解→仮説→施策→リスク確認というケース面接の基本の流れを練習しましょう。"
  };
}

function shuffleArray(array) {
  const copied = [...array];
  for (let i = copied.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copied[i], copied[j]] = [copied[j], copied[i]];
  }
  return copied;
}

function setInterviewerVisible(isVisible) {
  if (!interviewerFrame) {
    return;
  }

  interviewerFrame.classList.toggle("hidden", !isVisible);
  interviewerFrame.setAttribute("aria-hidden", String(!isVisible));
}

function setInterviewerExpression(expressionName) {
  const expressionFileName = expressionName.endsWith(".png") ? expressionName : `${expressionName}.png`;
  changeExpression(expressionFileName);
}

function changeExpression(expressionFileName) {
  swapExpressionImage(interviewerImage, getExpressionPath(expressionFileName));
}

function changeResultExpression(expressionFileName) {
  swapExpressionImage(resultInterviewer, getExpressionPath(expressionFileName));
}

async function swapExpressionImage(imageElement, src) {
  if (!imageElement || imageElement.getAttribute("src") === src) {
    return;
  }

  const token = (expressionSwapTokens.get(imageElement) || 0) + 1;
  expressionSwapTokens.set(imageElement, token);

  try {
    await decodeExpressionBeforeDisplay(src);
  } catch (error) {
    // Keep the existing image error fallback path alive by assigning the src below.
  }

  if (expressionSwapTokens.get(imageElement) !== token) {
    return;
  }

  imageElement.classList.add("is-expression-fading");

  window.setTimeout(() => {
    if (expressionSwapTokens.get(imageElement) !== token) {
      return;
    }

    imageElement.src = src;
    window.requestAnimationFrame(() => {
      if (expressionSwapTokens.get(imageElement) === token) {
        imageElement.classList.remove("is-expression-fading");
      }
    });
  }, expressionFadeDelay);
}

function getExpressionByScore(score) {
  if (score === 3) {
    return "pleased.png";
  }

  if (score === 2) {
    return "normal.png";
  }

  if (score === 1) {
    return "serious.png";
  }

  return "disappointed.png";
}

function getExpressionPath(expressionFileName) {
  const fileName = expressionFileName.endsWith(".png") ? expressionFileName : `${expressionFileName}.png`;
  return `${expressionBasePath}${expressionFileNames[fileName] || fileName}`;
}

interviewerImage.addEventListener("load", () => {
  assetWarning.classList.add("is-hidden");
});

interviewerImage.addEventListener("error", () => {
  assetWarning.classList.remove("is-hidden");
});

levelButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.level === "keigo") {
      showKeigoModeSelect();
      return;
    }

    if (button.dataset.level === "terms") {
      showTermsModeSelect();
      return;
    }

    startGame(button.dataset.level);
  });
});
if (homeInterviewButton) {
  homeInterviewButton.addEventListener("click", showInterviewModeSelect);
}
if (homeTrainingButton) {
  homeTrainingButton.addEventListener("click", showTrainingModeSelect);
}
if (modeHomeButton) {
  modeHomeButton.addEventListener("click", restartGame);
}
if (trainingHomeButton) {
  trainingHomeButton.addEventListener("click", restartGame);
}
retryButton.addEventListener("click", replayCurrentMode);
if (resultModeButton) {
  resultModeButton.addEventListener("click", restartGame);
}
if (resultBackToStartButton) {
  resultBackToStartButton.addEventListener("click", restartGame);
}
if (backToStartButton) {
  backToStartButton.addEventListener("click", restartGame);
}
nextButton.addEventListener("click", goNextQuestion);
updateHomeStatus();
