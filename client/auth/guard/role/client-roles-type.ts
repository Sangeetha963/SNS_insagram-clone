export type ClientRoleType =
    | 'customer' // 一般ユーザー
    | 'email-not-confirm' // メールアドレス未認証ユーザ
    | 'withdrawal' // 退会
    | 'force-withdrawal' // 強制退会
    | 'disabled' // 無効化ユーザー
    | 'antisocial' // 反社
