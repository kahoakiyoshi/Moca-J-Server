export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

export const alls_test: Record<string, string> = {
  "node_test_sequence": "Trail Making",
  "delayed_recall": "遅延再生 設問",
  "delayed_recall_cued_recall_花": "遅延再生 設問5",
  "delayed_recall_cued_recall_建物": "遅延再生 設問4",
  "delayed_recall_cued_recall_生地": "遅延再生 設問3",
  "delayed_recall_cued_recall_体の一部": "遅延再生 設問2",
  "delayed_recall_cued_recall_色": "遅延再生 設問1",
  "delayed_recall_free_recall": "遅延再生 設問",

  "fluency_task_words": "語想起",

  "drawing_test_cube_drawing": "視空間認知機能 立方体描画",

  "shape_recall": "視空間認知機能 立方体選択 1",
  "shape_recall_selected_shape": "視空間認知機能 立方体選択 1",
  "shape_match": "視空間認知機能 立方体選択 2",
  "shape_match_selected_shape": "視空間認知機能 立方体選択 2",

  "simple_shape_selection": "視空間認知機能 時計 円選択",
  "simple_shape_selection_selected_shape": "視空間認知機能 時計 円選択",

  "clock_validation_combined": "視空間認知機能 時計 文字と針選択",

  "naming_task_animal_1": "命名 設問1",
  "naming_task_animal_2": "命名 設問2",
  "naming_task_animal_3": "命名 設問3",

  "word_recall_step_1": "記憶 試行1回目",
  "word_recall_step_2": "記憶 試行2回目",

  "sequence_recall": "記憶 試行2回目",
  "sequence_recall_task_5_numeric": "注意 順唱",
  "sequence_recall_task_3_numeric": "注意 逆唱",

  "letter_tap_task_tapped_indices": "注意 ビジランス",
  "letter_tap_task_sequence": "注意 ビジランス",

  "subtraction_task": "注意 計算",
  "subtraction_task_combined": "注意 計算",

  "subtraction_task_step_1": "注意 計算",
  "subtraction_task_step_2": "注意 計算",
  "subtraction_task_step_3": "注意 計算",
  "subtraction_task_step_4": "注意 計算",
  "subtraction_task_step_5": "注意 計算",

  "sentence_repetition": "復唱 設問1",
  "sentence_repetition_status": "復唱 設問1",

  "sentence_task_step_1": "復唱 設問2",

  "similarity_task": "抽象的思考 設問1",

  "similarity_task_step_1": "抽象的思考 設問1",
  "similarity_task_step_2": "抽象的思考 設問2",

  "cued_recall_色": "遅延再生 カテゴリー想起 (色)",
  "cued_recall_建物": "遅延再生 カテゴリー想起 (建物)",
  "recognition_建物": "遅延再生 再認 (建物)",
  "cued_recall_生地": "遅延再生 カテゴリー想起 (生地)",
  "recognition_生地": "遅延再生 再認 (生地)",
  "cued_recall_体の一部": "遅延再生 カテゴリー想起 (体の一部)",
  "recognition_体の一部": "遅延再生 再認 (体の一部)",
  "cued_recall_花": "遅延再生 カテゴリー想起 (花)",
  "recognition_花": "遅延再生 再認 (花)",

  "orientation_task_step_1": "見当識 年",
  "orientation_task_step_2": "見当識 月",
  "orientation_task_step_3": "見当識 日",
  "orientation_task_step_4": "見当識 曜日",
  "orientation_task_step_5": "見当識 時間",
  "orientation_task_step_6": "見当識 季節",
  "orientation_task_step_7": "見当識 住所",
  "orientation_task_step_8": "見当識 場所",
}