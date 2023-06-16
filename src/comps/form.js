import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { MdKeyboardArrowRight } from "react-icons/md";
import { IoMdAddCircle } from "react-icons/io";
import { API_URL, doApiMethod } from "../services/apiService";
import { toast } from "react-toastify";
import "../css/form.css";
import "../css/uploadImage.css";

const MAX_STEPS = 3;

const Form = () => {
  //image upload states
  const [image, setImage] = useState(null);
  const [sendImage, setSendImage] = useState(false);
  const [img_url, setImg_url] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const defaultImage =
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png";

  const [formStep, setformStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const {
    watch,
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: "all" });

  const copleteFormStep = () => {
    setformStep((cur) => cur + 1);
  };

  const goToPreviousStep = () => {
    setformStep((cur) => cur - 1);
  };

  const validateImg = (e) => {
    const file = e.target.files[0];
    if (file.size >= 1048576) {
      return alert("Max file sizw is 1mb");
    } else {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "inbarImages");
    try {
      let res = await fetch(
        "https://api.cloudinary.com/v1_1/dvcomzwkd/image/upload",
        {
          method: "POST",
          body: data,
        }
      );
      const urlData = await res.json();
      return urlData.url;
    } catch (err) {
      console.log(err);
    }
  };

  const renderButton = () => {
    if (formStep > 2) {
      return undefined;
    } else if (formStep === 2) {
      return (
        <div className="form-group">
          <button
            disabled={!isValid}
            type="submit"
            className="btn btn-block col-12 create-account"
          >
            {loading ? (
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden"></span>
              </div>
            ) : (
              "שלח טופס"
            )}
          </button>
        </div>
      );
    } else {
      return (
        <div className="form-group">
          <button
            disabled={!isValid}
            onClick={copleteFormStep}
            type="button"
            className="btn btn-block col-12 create-account"
          >
            הבא
          </button>
        </div>
      );
    }
  };

  const onSubForm = async (formData) => {
    let url = API_URL + "/users";
    try {
      setLoading(true);
      // chek if the image if already uploaded to avoid multiple uploads
      if (!sendImage) {
        setImg_url(image ? await uploadImage(image) : defaultImage);
        console.log(img_url);
        setSendImage(true);
      }
      formData.img_url = img_url;
      let resp = await doApiMethod(url, "POST", formData);
      console.log(resp.data);
      if (resp.data.status === 201) {
        toast.success("הפרטים נשלחו בהצלחה");
        // toast.info(resp.data.msg);
        copleteFormStep();
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      console.log(err.response);
      if (err.response.data.code == 11000) {
        toast.error("המייל כבר קיים במערכת שלנו");
      } else {
        alert("זה לא אתה זה אנחנו יש בעייה");
      }
    }
  };

  return (
    <div className="container">
      <div className="inbar-form">
        <form onSubmit={handleSubmit(onSubForm)}>
          <div
            className="form-icon bg_img"
            style={{
              backgroundImage: `url("/images/logo.ico")`,
            }}
          ></div>
          {formStep < MAX_STEPS && (
            <div className="d-flex align-self-center">
              {formStep > 0 && (
                <MdKeyboardArrowRight
                  onClick={goToPreviousStep}
                  className="previousBtn pb-1"
                  size={"2em"}
                />
              )}
              <p className="text-muted fs-6 fw-bold">
                דף {formStep + 1} מתוך {MAX_STEPS}
              </p>
            </div>
          )}
          {formStep >= 0 && (
            <section className={formStep === 0 ? "d-block" : "d-none"}>
              {/* start info */}
              <h4 className="display-3">משודך/ת יקר/ה!</h4>
              <p className="display-7">
                חשוב לזכור! ככל שתפרט/י יותר, ככה נוכל להכיר אותך יותר טוב
                ולנסות להתאים לך את בן/בת הזוג לעתיד מהר יותר!{" "}
              </p>
              <p className="display-7">
                שאלון זה מנוסח בלשון זכר אך מיועד לשני המינים.
              </p>
              <p className="display-7">
                השאלון מותנה בשיחה טלפונית עם השדכנית.
              </p>
              <p className="display-7 mb-5 text-decoration-underline text-danger fw-bold">
                חשוב להדגיש השאלון מיועד רק לשימוש שדכנית העמותה ואיש מלבדה לא
                יראה אותו.
              </p>
              {/* end info */}
              {/* name */}
              <div className="form-group">
                <label className="mb-2 display-7 fw-bold">שם מלא *</label>
                <input
                  type="text"
                  className="form-control item"
                  placeholder="שם מלא *"
                  {...register("name", {
                    required: true,
                    minLength: 2,
                    maxLength: 20,
                  })}
                />
                {errors.name && (
                  <p className="text-danger fs-6 fw-bold">
                    שם צריך להיות מינימום 2 ומקסימום 20
                  </p>
                )}
              </div>
              {/* gender */}
              <div className="form-group">
                <label className="mb-2 display-7 fw-bold">מין *</label>
                <select
                  {...register("gender", {
                    required: true,
                  })}
                  className="form-control item"
                >
                  <option value="זכר">זכר</option>
                  <option value="נקבה">נקבה</option>
                </select>
                {errors.gender && (
                  <p className="text-danger fs-6 fw-bold">צריך לבחור אופצייה</p>
                )}
              </div>
              {/* birthDate */}
              <div className="form-group">
                <label className="mb-2 display-7 fw-bold">
                  גיל (תאריך לידה) *
                </label>
                <input
                  type="date"
                  className="form-control item"
                  placeholder="גיל (תאריך לידה) *"
                  {...register("birthDate", {
                    required: true,
                  })}
                />
                {errors.birthDate && (
                  <p className="text-danger fs-6 fw-bold">צריך לבחור אופצייה</p>
                )}
              </div>
              {/* email */}
              <div className="form-group">
                <label className="mb-2 display-7 fw-bold">דוא"ל *</label>
                <input
                  type="email"
                  className="form-control item"
                  placeholder="demoEmail@gmail.com"
                  {...register("email", {
                    required: true,
                    pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  })}
                />
                {errors.email && (
                  <p className="text-danger fs-6 fw-bold">דוא"ל לא תקין</p>
                )}
              </div>
              {/* phone */}
              <div className="form-group">
                <label className="mb-2 display-7 fw-bold">טלפון *</label>
                <input
                  type="tel"
                  className="form-control item"
                  placeholder="050-000-0000"
                  {...register("phone", {
                    required: true,
                    minLength: 10,
                    maxLength: 10,
                  })}
                />
                {errors.phone && (
                  <p className="text-danger fs-6 fw-bold">מספר טלפון לא תקין</p>
                )}
              </div>
              {/* height */}
              <div className="form-group">
                <label className="mb-2 display-7 fw-bold">
                  גובה בסנטימטרים (לדוגמה: 160)
                </label>
                <input
                  type="number"
                  defaultValue={150}
                  className="form-control item"
                  placeholder="גובה בסנטימטרים (לדוגמה: 160)"
                  {...register("height", {
                    required: true,
                  })}
                />
                {errors.height && (
                  <p className="text-danger fs-6 fw-bold">גובה לא תקין</p>
                )}
              </div>
              {/* yishuv */}
              <div className="form-group">
                <label className="mb-2 display-7 fw-bold">יישוב *</label>
                <input
                  type="text"
                  className="form-control item"
                  placeholder="יישוב"
                  {...register("yishuv", {
                    required: true,
                    minLength: 2,
                    maxLength: 50,
                  })}
                />
                {errors.yishuv && (
                  <p className="text-danger fs-6 fw-bold">יישוב לא תקין</p>
                )}
              </div>
              {/* region */}
              <div className="form-group">
                <label className="mb-2 display-7 fw-bold">איזור בארץ *</label>
                <select
                  {...register("region", {
                    required: true,
                  })}
                  className="form-control item"
                >
                  <option value="צפון">צפון</option>
                  <option value="מרכז">מרכז</option>
                  <option value="דרום">דרום</option>
                  <option value="אילת">אילת</option>
                  <option value="שומרון">שומרון</option>
                  <option value="שרון">שרון</option>
                  <option value="ירושלים">ירושלים</option>
                </select>
                {errors.region && (
                  <p className="text-danger fs-6 fw-bold">איזור בארץ לא תקין</p>
                )}
              </div>
              {/* type_of_residence */}
              <div className="form-group">
                <label className="mb-2 display-7 fw-bold">סוג מגורים *</label>
                <select
                  {...register("type_of_residence", {
                    required: true,
                  })}
                  className="form-control item"
                >
                  <option value="גר עם ההורים">גר עם ההורים</option>
                  <option value="הוסטל">הוסטל</option>
                  <option value="מסגרת תומכת">מסגרת תומכת</option>
                  <option value="לבד">לבד</option>
                  <option value="דירת שותפים">דירת שותפים</option>
                  <option value="אחר">אחר</option>
                </select>
                {errors.type_of_residence && (
                  <p className="text-danger fs-6 fw-bold">סוג מגורים לא תקין</p>
                )}
              </div>
              {/* family_status */}
              <div className="form-group">
                <label className="mb-2 display-7 fw-bold">מצב משפחתי *</label>
                <select
                  {...register("family_status", {
                    required: true,
                  })}
                  className="form-control item"
                >
                  <option value="רווק">רווק</option>
                  <option value="גרוש">גרוש</option>
                  <option value="אלמן">אלמן</option>
                </select>
                {errors.family_status && (
                  <p className="text-danger fs-6 fw-bold">מצב משפחתי לא תקין</p>
                )}
              </div>
              {/* there_are_children */}
              <div className="form-group">
                <label className="mb-2 display-7 fw-bold">
                  האם הורה לילדים *
                </label>
                <select
                  {...register("there_are_children", {
                    required: true,
                  })}
                  className="form-control item"
                >
                  <option value="כן">כן</option>
                  <option value="לא">לא</option>
                </select>
                {errors.there_are_children && (
                  <p className="text-danger fs-6 fw-bold">
                    האם הורה לילדים לא תקין
                  </p>
                )}
              </div>
              {/* current_occupation */}
              <div className="form-group">
                <label className="mb-2 display-7 fw-bold">עיסוק נוכחי *</label>
                <input
                  type="text"
                  className="form-control item"
                  placeholder="עיסוק נוכחי"
                  {...register("current_occupation", {
                    required: true,
                    minLength: 4,
                    maxLength: 100,
                  })}
                />
                {errors.current_occupation && (
                  <p className="text-danger fs-6 fw-bold">
                    עיסוק נוכחי לא תקין
                  </p>
                )}
              </div>
              {/* religious_level */}
              <div className="form-group">
                <label className="mb-2 display-7 fw-bold">רמה דתית *</label>
                <select
                  {...register("religious_level", {
                    required: true,
                  })}
                  className="form-control item"
                >
                  <option value="חרדי">חרדי</option>
                  <option value="דתי לאומי">דתי לאומי</option>
                  <option value="מסורתי">מסורתי</option>
                  <option value='דתל"ש'>דתל"ש</option>
                  <option value="חילוני">חילוני</option>
                </select>
                {errors.religious_level && (
                  <p className="text-danger fs-6 fw-bold">רמה דתית לא תקין</p>
                )}
              </div>
              {/* body_structure */}
              <div className="form-group">
                <label className="mb-2 display-7 fw-bold">מבנה גוף</label>
                <select
                  {...register("body_structure", {
                    required: false,
                  })}
                  className="form-control item"
                >
                  <option value="רזה">רזה</option>
                  <option value="ממוצע">ממוצע</option>
                  <option value="מלא">מלא</option>
                </select>
                {errors.religious_level && (
                  <p className="text-danger fs-6 fw-bold">מבנה גוף לא תקין</p>
                )}
              </div>
              {/* ethnicity */}
              <div className="form-group">
                <label className="mb-2 display-7 fw-bold">עדה</label>
                <select
                  {...register("ethnicity", {
                    required: false,
                  })}
                  className="form-control item"
                >
                  <option value="אשכנז">אשכנז</option>
                  <option value="ספרד">ספרד</option>
                  <option value="אתיופיה">אתיופיה</option>
                  <option value="תימן">תימן</option>
                  <option value="מעורב">מעורב</option>
                </select>
                {errors.religious_level && (
                  <p className="text-danger fs-6 fw-bold">עדה לא תקין</p>
                )}
              </div>
              {/* national_or_military_service */}
              <div className="form-group">
                <label className="mb-2 display-7 fw-bold">
                  שירות לאומי\צבאי *
                </label>
                <select
                  {...register("national_or_military_service", {
                    required: true,
                  })}
                  className="form-control item"
                >
                  <option value="שירות לאומי">שירות לאומי</option>
                  <option value="צבא">צבא</option>
                  <option value="קרבי">קרבי</option>
                  <option value="הסדר">הסדר</option>
                  <option value="עתודה">עתודה</option>
                  <option value="קבע">קבע</option>
                  <option value="ללא">ללא</option>
                </select>
                {errors.national_or_military_service && (
                  <p className="text-danger fs-6 fw-bold">
                    שירות לאומי\צבאי לא תקין
                  </p>
                )}
              </div>
              {/* details */}
              <div className="form-group">
                <label className="mb-2 display-7 fw-bold">פירוט</label>
                <textarea
                  {...register("details", {
                    required: false,
                  })}
                  className="form-control item"
                  placeholder="פירוט..."
                  style={{ width: "100%", height: "150px" }}
                ></textarea>
              </div>
              {/* education */}
              <div className="form-group">
                <label className="mb-2 display-7 fw-bold">השכלה *</label>
                <select
                  {...register("education", {
                    required: true,
                  })}
                  className="form-control item"
                >
                  <option value="תיכונית">תיכונית</option>
                  <option value="תעודה">תעודה</option>
                  <option value="תואר ראשון">תואר ראשון</option>
                  <option value="תואר שני">תואר שני</option>
                  <option value="דוקטורט">דוקטורט</option>
                </select>
                {errors.education && (
                  <p className="text-danger fs-6 fw-bold">השכלה לא תקין</p>
                )}
              </div>
              {/* educational_framework */}
              <div className="form-group">
                <label className="mb-2 display-7 fw-bold">
                  מסגרת לימודית *
                </label>
                <select
                  {...register("educational_framework", {
                    required: true,
                  })}
                  className="form-control item"
                >
                  <option value="רגילה">רגילה</option>
                  <option value="חינוך מיוחד">חינוך מיוחד</option>
                </select>
                {errors.educational_framework && (
                  <p className="text-danger fs-6 fw-bold">
                    מסגרת לימודית לא תקין
                  </p>
                )}
              </div>
              {/* about_my_family */}
              <div className="form-group">
                <label className="mb-2 display-7 fw-bold">על המשפחה שלי</label>
                <textarea
                  {...register("about_my_family", {
                    required: false,
                  })}
                  className="form-control item"
                  placeholder="פירוט..."
                  style={{ width: "100%", height: "150px" }}
                ></textarea>
              </div>
              {/* type_of_disability */}
              <div className="form-group">
                <label className="mb-2 display-7 fw-bold">
                  סוג מוגבלות (ניתן לבחור מספר אפשרויות) *
                </label>
                <div className="form-check">
                  <input
                    {...register("disability_Physical", {
                      required: false,
                    })}
                    className="form-check-input"
                    type="checkbox"
                  />
                  <label className="form-check-label">פיזית</label>
                </div>
                <div className="form-check">
                  <input
                    {...register("disability_intellectual", {
                      required: false,
                    })}
                    className="form-check-input"
                    type="checkbox"
                  />
                  <label className="form-check-label">שכלית</label>
                </div>
                <div className="form-check">
                  <input
                    {...register("disability_developmental", {
                      required: false,
                    })}
                    className="form-check-input"
                    type="checkbox"
                  />
                  <label className="form-check-label">התפחותית</label>
                </div>
                <div className="form-check">
                  <input
                    {...register("disability_mentally_challenged", {
                      required: false,
                    })}
                    className="form-check-input"
                    type="checkbox"
                  />
                  <label className="form-check-label">מתמודד נפש</label>
                </div>
              </div>
              {/* type_of_disability_info */}
              <div className="form-group mt-4">
                <label className="mb-2 display-7 fw-bold">
                  סוג מוגבלות פירוט
                </label>
                <textarea
                  {...register("type_of_disability_info", {
                    required: false,
                  })}
                  className="form-control item"
                  placeholder="פירוט..."
                  style={{ width: "100%", height: "150px" }}
                ></textarea>
              </div>
              {/* independent_disability */}
              <div className="form-group">
                <label className="mb-2 display-7 fw-bold">
                  האם אני עצמאי *
                </label>
                <select
                  {...register("independent_disability", {
                    required: true,
                  })}
                  className="form-control item"
                >
                  <option value="כן">כן</option>
                  <option value="לא">לא</option>
                </select>
                {errors.independent_disability && (
                  <p className="text-danger fs-6 fw-bold">
                    האם אני עצמאי לא תקין
                  </p>
                )}
              </div>
              {/* interest */}
              <div className="form-group">
                <label className="mb-2 display-7 fw-bold">תחומי עניין</label>
                <textarea
                  {...register("interest", {
                    required: false,
                  })}
                  className="form-control item"
                  placeholder="תחומי עניין..."
                  style={{ width: "100%", height: "150px" }}
                ></textarea>
              </div>
              {/* standing_out_features */}
              <div className="form-group">
                <label className="mb-2 display-7 fw-bold">תכונות בולטות</label>
                <textarea
                  {...register("standing_out_features", {
                    required: false,
                  })}
                  className="form-control item"
                  placeholder="תכונות בולטות..."
                  style={{ width: "100%", height: "150px" }}
                ></textarea>
              </div>
              {/* hobbys */}
              <div className="form-group">
                <label className="mb-2 display-7 fw-bold">תחביבים</label>
                <textarea
                  {...register("hobbys", {
                    required: false,
                  })}
                  className="form-control item"
                  placeholder="תחביבים..."
                  style={{ width: "100%", height: "150px" }}
                ></textarea>
              </div>
            </section>
          )}
          {formStep >= 1 && (
            <section className={formStep === 1 ? "d-block" : "d-none"}>
              <h4 className="display-3">מה אני מחפש?</h4>
              {/* age_min */}
              <div className="form-group">
                <label className="mb-2 display-7 fw-bold">גיל מינימום *</label>
                <input
                  type="number"
                  defaultValue={18}
                  className="form-control item"
                  placeholder="גיל מינימום"
                  {...register("age_min", {
                    required: true,
                    max: 120,
                    min: 18,
                  })}
                />
                {errors.age_min && (
                  <p className="text-danger fs-6 fw-bold">
                    גיל מינימום לא תקין
                  </p>
                )}
              </div>
              {/* age_max */}
              <div className="form-group">
                <label className="mb-2 display-7 fw-bold">גיל מקסימום *</label>
                <input
                  type="number"
                  defaultValue={120}
                  className="form-control item"
                  placeholder="גיל מקסימום"
                  {...register("age_max", {
                    required: true,
                    max: 120,
                    min: 18,
                  })}
                />
                {errors.age_max && (
                  <p className="text-danger fs-6 fw-bold">
                    גיל מקסימום לא תקין
                  </p>
                )}
              </div>
              {/* in_terms_of_character */}
              <div className="form-group">
                <label className="mb-2 display-7 fw-bold">מבחינת אופי</label>
                <textarea
                  {...register("in_terms_of_character", {
                    required: false,
                  })}
                  className="form-control item"
                  placeholder="מבחינת אופי..."
                  style={{ width: "100%", height: "150px" }}
                ></textarea>
              </div>
              {/* religiously */}
              <div className="form-group">
                <label className="mb-2 display-7 fw-bold">מבחינה דתית</label>
                <textarea
                  {...register("religiously", {
                    required: false,
                  })}
                  className="form-control item"
                  placeholder="מבחינה דתית..."
                  style={{ width: "100%", height: "150px" }}
                ></textarea>
              </div>
              {/* in_terms_of_appearance */}
              <div className="form-group">
                <label className="mb-2 display-7 fw-bold">מבחינת מראה</label>
                <textarea
                  {...register("in_terms_of_appearance", {
                    required: false,
                  })}
                  className="form-control item"
                  placeholder="מבחינת מראה..."
                  style={{ width: "100%", height: "150px" }}
                ></textarea>
              </div>
              {/* seek_for_type_of_disability */}
              <div className="form-group">
                <label className="mb-2 display-7 fw-bold">
                  מבחינת סוג מוגבלות (ניתן לבחור מספר אפשרויות) *
                </label>
                <div className="form-check">
                  <input
                    {...register("seek_for_disability_doesnt_matter", {
                      required: false,
                    })}
                    className="form-check-input"
                    type="checkbox"
                  />
                  <label className="form-check-label">לא משנה לי</label>
                </div>
                <div className="form-check">
                  <input
                    {...register("seek_for_disability_Physical", {
                      required: false,
                    })}
                    className="form-check-input"
                    type="checkbox"
                  />
                  <label className="form-check-label">פיזית</label>
                </div>
                <div className="form-check">
                  <input
                    {...register("seek_for_disability_intellectual", {
                      required: false,
                    })}
                    className="form-check-input"
                    type="checkbox"
                  />
                  <label className="form-check-label">שכלית</label>
                </div>
                <div className="form-check">
                  <input
                    {...register("seek_for_disability_developmental", {
                      required: false,
                    })}
                    className="form-check-input"
                    type="checkbox"
                  />
                  <label className="form-check-label">התפחותית</label>
                </div>
                <div className="form-check">
                  <input
                    {...register("seek_for_disability_mentally_challenged", {
                      required: false,
                    })}
                    className="form-check-input"
                    type="checkbox"
                  />
                  <label className="form-check-label">מתמודד נפש</label>
                </div>
              </div>
              {/* seek_for_type_of_disability_info */}
              <div className="form-group">
                <label className="mb-2 display-7 fw-bold">
                  מבחינת סוג מוגבלות פירוט
                </label>
                <textarea
                  {...register("seek_for_type_of_disability_info", {
                    required: false,
                  })}
                  className="form-control item"
                  placeholder="פירוט..."
                  style={{ width: "100%", height: "150px" }}
                ></textarea>
              </div>
            </section>
          )}
          {formStep >= 2 && (
            <section className={formStep === 2 ? "d-block" : "d-none"}>
              {/* Upload Image */}
              <div className="signup-profile-pic__container">
                <img
                  src={imagePreview || defaultImage}
                  className="signup-profile-pic"
                  alt="user image"
                />
                <label htmlFor="image-upload" className="image-upload-label">
                  <IoMdAddCircle className="add-picture-icon" />
                </label>
                <input
                  type="file"
                  id="image-upload"
                  hidden
                  accept="image/png, image/jpeg"
                  onChange={validateImg}
                />
              </div>
              <label className="mb-2 display-7 fw-bold my-4">תמונה *</label>
              {/* questions_on_your_own */}
              <div className="form-group">
                <label className="mb-2 mt-3 display-7 fw-bold">
                  האם מילאת את השאלון לבד ? *
                </label>
                <select
                  {...register("questions_on_your_own", {
                    required: true,
                  })}
                  className="form-control item"
                >
                  <option value="כן">כן</option>
                  <option value="לא">לא</option>
                </select>
                {errors.questions_on_your_own && (
                  <p className="text-danger fs-6 fw-bold">
                    האם מילאת את השאלון לבד לא תקין
                  </p>
                )}
              </div>
              {/* additional_notes */}
              <div className="form-group">
                <label className="mb-2 display-7 fw-bold">הערות נוספות</label>
                <textarea
                  {...register("additional_notes", {
                    required: false,
                  })}
                  className="form-control item"
                  placeholder="פירוט..."
                  style={{ width: "100%", height: "150px" }}
                ></textarea>
              </div>
              {/* Contact for more details */}
              <h4 className="display-6 text-center mb-4">
                איש קשר לפרטים נוספים
              </h4>
              {/* contact_name */}
              <div className="form-group">
                <label className="mb-2 display-7 fw-bold">שם מלא *</label>
                <input
                  type="text"
                  className="form-control item"
                  placeholder="שם מלא *"
                  {...register("contact_name", {
                    required: true,
                    minLength: 2,
                    maxLength: 20,
                  })}
                />
                {errors.contact_name && (
                  <p className="text-danger fs-6 fw-bold">
                    שם צריך להיות מינימום 2 ומקסימום 20
                  </p>
                )}
              </div>
              {/* contact_phone */}
              <div className="form-group">
                <label className="mb-2 display-7 fw-bold">טלפון *</label>
                <input
                  type="tel"
                  className="form-control item"
                  placeholder="050-000-0000"
                  {...register("contact_phone", {
                    required: true,
                    minLength: 10,
                    maxLength: 10,
                  })}
                />
                {errors.contact_phone && (
                  <p className="text-danger fs-6 fw-bold">מספר טלפון לא תקין</p>
                )}
              </div>
              {/* contact_family_relationship */}
              <div className="form-group">
                <label className="mb-2 display-7 fw-bold">קירבה *</label>
                <input
                  type="text"
                  className="form-control item"
                  placeholder="קירבה *"
                  {...register("contact_family_relationship", {
                    required: true,
                    minLength: 2,
                    maxLength: 50,
                  })}
                />
                {errors.contact_family_relationship && (
                  <p className="text-danger fs-6 fw-bold">
                    קירבה צריך להיות מינימום 2 ומקסימום 50
                  </p>
                )}
              </div>
            </section>
          )}
          {formStep === 3 && (
            <section>
              <h1 className="text-center">
                תודה רבה על מילוי השאלון במקרה ותמצא התאמה ניצור איתך קשר. 🙂{" "}
              </h1>
            </section>
          )}
          {/* btn */}
          {renderButton()}
          {/* <pre>{JSON.stringify(watch(), null, 2)}</pre> */}
        </form>
      </div>
    </div>
  );
};

export default Form;
