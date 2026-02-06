export type Language = "en" | "ko" | "ja" | "zh";

export interface Translations {
  app: { title: string; subtitle: string };
  landing: {
    heroTitle: string;
    heroSubtitle: string;
    loginButton: string;
    feature1Title: string;
    feature1Desc: string;
    feature2Title: string;
    feature2Desc: string;
    feature3Title: string;
    feature3Desc: string;
  };
  stats: {
    active: string;
    monthly: string;
    monthlySub: string;
    yearly: string;
    yearlySub: string;
  };
  subs: {
    title: string;
    emptyTitle: string;
    emptyDesc: string;
    statusActive: string;
    statusCancelled: string;
    billsOn: string;
    cancelBtn: string;
    committing: string;
    cancelConfirm: string;
    cancelDialogTitle: string;
    cancelDialogCommitNote: string;
  };
  form: {
    title: string;
    cancel: string;
    addBtn: string;
    nameLabel: string;
    namePlaceholder: string;
    priceLabel: string;
    billingDayLabel: string;
    cycleLabel: string;
    monthly: string;
    yearly: string;
    submit: string;
  };
  history: {
    title: string;
    header: string;
    file: string;
    empty: string;
    prev: string;
    next: string;
  };
  currency: {
    label: string;
  };
  footer: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    app: { title: "SubLog", subtitle: 'git commit -m "track expenses"' },
    landing: {
      heroTitle: "SubLog",
      heroSubtitle:
        "Manage your subscriptions like you manage your code.\nCommit adds. Diff prices. Log cancels.",
      loginButton: "Continue with GitHub",
      feature1Title: 'git commit -m "add Netflix"',
      feature1Desc:
        "Every subscription change is a commit in your history.",
      feature2Title: "JSON Database",
      feature2Desc:
        "Your data lives in a simple JSON file in your repository.",
      feature3Title: "Analytics",
      feature3Desc: "Instant insight into monthly and yearly burn rates.",
    },
    stats: {
      active: "Active Subscriptions",
      monthly: "Monthly Burn",
      monthlySub: "Estimated Recurring",
      yearly: "Yearly Projection",
      yearlySub: "Total Annual Cost",
    },
    subs: {
      title: "Subscriptions",
      emptyTitle: "No subscriptions yet",
      emptyDesc:
        "Add your first subscription above to start tracking your expenses via commits.",
      statusActive: "Active",
      statusCancelled: "Cancelled",
      billsOn: "Bills on day",
      cancelBtn: "Cancel Subscription",
      committing: "Committing...",
      cancelConfirm: "Are you sure you want to cancel {name}?",
      cancelDialogTitle: "Cancel Subscription",
      cancelDialogCommitNote:
        "This will create a 'chore: cancel' commit on GitHub.",
    },
    form: {
      title: "New Subscription",
      cancel: "Cancel",
      addBtn: "Add New Subscription",
      nameLabel: "Service Name",
      namePlaceholder: "e.g. Netflix, Vercel",
      priceLabel: "Price",
      billingDayLabel: "Billing Day",
      cycleLabel: "Billing Cycle",
      monthly: "Monthly",
      yearly: "Yearly",
      submit: "Add Subscription",
    },
    history: {
      title: "Ledger",
      header: "Commit History",
      file: "subscriptions.json",
      empty: "No commits found. Repository is clean.",
      prev: "Previous",
      next: "Next",
    },
    currency: { label: "Currency" },
    footer: "© {year} SubLog. Powered by Git concepts.",
  },
  ko: {
    app: { title: "SubLog", subtitle: 'git commit -m "지출 추적"' },
    landing: {
      heroTitle: "SubLog",
      heroSubtitle:
        "구독을 코드처럼 관리하세요.\n추가는 커밋으로. 가격은 Diff로. 취소는 로그로.",
      loginButton: "GitHub로 계속하기",
      feature1Title: 'git commit -m "넷플릭스 추가"',
      feature1Desc: "모든 구독 변경 사항이 히스토리에 커밋으로 남습니다.",
      feature2Title: "JSON 데이터베이스",
      feature2Desc: "데이터는 저장소 내의 단순한 JSON 파일로 관리됩니다.",
      feature3Title: "지출 분석",
      feature3Desc: "월간 및 연간 예상 지출을 즉시 확인하세요.",
    },
    stats: {
      active: "구독 중인 서비스",
      monthly: "월간 지출",
      monthlySub: "예상 정기 결제액",
      yearly: "연간 예상 비용",
      yearlySub: "총 연간 비용",
    },
    subs: {
      title: "구독 목록",
      emptyTitle: "구독 내역이 없습니다",
      emptyDesc:
        "위 버튼을 눌러 첫 번째 구독을 추가하고 지출 추적을 시작하세요.",
      statusActive: "구독중",
      statusCancelled: "해지됨",
      billsOn: "결제일: 매월",
      cancelBtn: "구독 해지",
      committing: "커밋 중...",
      cancelConfirm: "{name} 구독을 해지하시겠습니까?",
      cancelDialogTitle: "구독 해지",
      cancelDialogCommitNote: "GitHub에 해지 커밋이 생성됩니다.",
    },
    form: {
      title: "새 구독 추가",
      cancel: "취소",
      addBtn: "새 구독 추가",
      nameLabel: "서비스 이름",
      namePlaceholder: "예: 넷플릭스, 쿠팡",
      priceLabel: "가격",
      billingDayLabel: "결제일",
      cycleLabel: "결제 주기",
      monthly: "월간",
      yearly: "연간",
      submit: "구독 추가",
    },
    history: {
      title: "장부 (Ledger)",
      header: "커밋 히스토리",
      file: "subscriptions.json",
      empty: "커밋이 없습니다. 저장소가 깨끗합니다.",
      prev: "이전",
      next: "다음",
    },
    currency: { label: "통화" },
    footer: "© {year} SubLog. Git 컨셉으로 제작되었습니다.",
  },
  ja: {
    app: { title: "SubLog", subtitle: 'git commit -m "経費追跡"' },
    landing: {
      heroTitle: "SubLog",
      heroSubtitle:
        "サブスクリプションをコードのように管理しましょう。\n追加はコミット。価格はDiff。キャンセルはログで。",
      loginButton: "GitHubで続ける",
      feature1Title: 'git commit -m "Netflixを追加"',
      feature1Desc: "すべての変更は履歴にコミットとして記録されます。",
      feature2Title: "JSON データベース",
      feature2Desc:
        "データはリポジトリ内のシンプルなJSONファイルに保存されます。",
      feature3Title: "分析",
      feature3Desc: "月間および年間の支出率を即座に把握できます。",
    },
    stats: {
      active: "アクティブなサブスク",
      monthly: "月間支出",
      monthlySub: "推定定期支払い額",
      yearly: "年間予測",
      yearlySub: "年間総コスト",
    },
    subs: {
      title: "サブスクリプション",
      emptyTitle: "サブスクリプションがありません",
      emptyDesc:
        "最初のサブスクリプションを追加して、コミットによる追跡を開始しましょう。",
      statusActive: "有効",
      statusCancelled: "解約済",
      billsOn: "請求日",
      cancelBtn: "解約する",
      committing: "コミット中...",
      cancelConfirm: "{name} を解約してもよろしいですか？",
      cancelDialogTitle: "サブスクリプション解約",
      cancelDialogCommitNote: "'chore: cancel' コミットが作成されます。",
    },
    form: {
      title: "新規サブスクリプション",
      cancel: "キャンセル",
      addBtn: "新規追加",
      nameLabel: "サービス名",
      namePlaceholder: "例: Netflix, Amazon Prime",
      priceLabel: "価格",
      billingDayLabel: "請求日",
      cycleLabel: "請求サイクル",
      monthly: "月次",
      yearly: "年次",
      submit: "追加する",
    },
    history: {
      title: "台帳 (Ledger)",
      header: "コミット履歴",
      file: "subscriptions.json",
      empty: "コミットが見つかりません。",
      prev: "前へ",
      next: "次へ",
    },
    currency: { label: "通貨" },
    footer: "© {year} SubLog. Powered by Git concepts.",
  },
  zh: {
    app: { title: "SubLog", subtitle: 'git commit -m "追踪开支"' },
    landing: {
      heroTitle: "SubLog",
      heroSubtitle:
        "像管理代码一样管理您的订阅。\n添加即提交。价格即差异。取消即日志。",
      loginButton: "使用 GitHub 继续",
      feature1Title: 'git commit -m "添加 Netflix"',
      feature1Desc: "每一个订阅变更都是历史记录中的一次提交。",
      feature2Title: "JSON 数据库",
      feature2Desc: "您的数据作为简单的 JSON 文件存储在仓库中。",
      feature3Title: "统计分析",
      feature3Desc: "即时洞察月度和年度支出率。",
    },
    stats: {
      active: "活跃订阅",
      monthly: "月度支出",
      monthlySub: "预计经常性支出",
      yearly: "年度预测",
      yearlySub: "年度总成本",
    },
    subs: {
      title: "订阅列表",
      emptyTitle: "暂无订阅",
      emptyDesc: "在上方添加您的第一个订阅，开始通过提交来追踪开支。",
      statusActive: "活跃",
      statusCancelled: "已取消",
      billsOn: "扣款日",
      cancelBtn: "取消订阅",
      committing: "提交中...",
      cancelConfirm: "您确定要取消 {name} 吗？",
      cancelDialogTitle: "取消订阅",
      cancelDialogCommitNote: "这将创建一个 'chore: cancel' 提交。",
    },
    form: {
      title: "新订阅",
      cancel: "取消",
      addBtn: "添加新订阅",
      nameLabel: "服务名称",
      namePlaceholder: "例如：Netflix, Vercel",
      priceLabel: "价格",
      billingDayLabel: "扣款日",
      cycleLabel: "计费周期",
      monthly: "按月",
      yearly: "按年",
      submit: "添加订阅",
    },
    history: {
      title: "账本 (Ledger)",
      header: "提交历史",
      file: "subscriptions.json",
      empty: "未找到提交。仓库是干净的。",
      prev: "上一页",
      next: "下一页",
    },
    currency: { label: "货币" },
    footer: "© {year} SubLog. 基于 Git 概念构建。",
  },
};
