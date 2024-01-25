import multer from "multer";

const validation = {
  image: ["image/jpeg", "image/png"],
  file: ["Application/pdf"],
};

export const myMulter = ({ customValidation = validation.image } = {}) => {
  const storage = multer.diskStorage({});

  const fileFilter = (req, file, cb) => {
    if (!customValidation.includes(file.mimetype)) {
      return cb(new Error("In-valid extintions ", { cause: 409 }, false));
    }
    cb(null, true);
  };
  const upload = multer({ fileFilter, storage });
  return upload;
};
