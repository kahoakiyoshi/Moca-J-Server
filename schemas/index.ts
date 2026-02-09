import * as yup from "yup";

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("有効なメールアドレスを入力してください")
    .required("メールアドレスは必須です"),
  password: yup
    .string()
    .min(6, "パスワードは6文字以上で入力してください")
    .required("パスワードは必須です"),
});

export const changePasswordSchema = yup.object().shape({
  currentPassword: yup.string().required("現在のパスワードは必須です"),
  newPassword: yup
    .string()
    .min(6, "新しいパスワードは6文字以上で入力してください")
    .required("新しいパスワードは必須です"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "パスワードが一致しません")
    .required("パスワード(確認用)は必須です"),
});

export const patientSchema = yup.object().shape({
  uid: yup.string().optional(),
  id: yup.string().optional().max(16, "患者IDは16文字以内で入力してください"),
  lastName: yup.string().required("姓は必須です"),
  firstName: yup.string().required("名は必須です"),
  lastNameKana: yup.string().required("姓(かな)は必須です"),
  firstNameKana: yup.string().required("名(かな)は必須です"),
  gender: yup.string().required("性別を選択してください"),
  birthYear: yup.string().required("生年を選択してください"),
  birthMonth: yup.string().required("誕生月を選択してください"),
  birthDay: yup.string().required("誕生日を選択してください"),
  zip: yup.string().required("郵便番号は必須です"),
  prefecture: yup.string().required("都道府県を選択してください"),
  city: yup.string().required("市区町村は必須です"),
  address1: yup.string().required("丁目・番地は必須です"),
  building: yup.string().nullable(),
  education: yup.string().nullable(),
});

export const adminUserSchema = yup.object().shape({
  uid: yup.string().optional(),
  id: yup.string().optional(),
  lastName: yup.string().required("姓を入力してください"),
  firstName: yup.string().required("名は必須です"),
  email: yup
    .string()
    .email("有効なメールアドレスを入力してください")
    .required("メールアドレスは必須です"),
  role: yup.string().required("権限を選択してください"),
});
