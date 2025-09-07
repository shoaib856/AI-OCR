
# Full-Stack FastAPI (Arabic RTL) — وثائق مع Bounding Boxes

- واجهة أمامية لرفع صورة وزر **"توليد النص"**.
- يستدعي `/api/extract` الذي يمرر الملف و`SUPPORTED_LANGUAGES` و`clasifier` إلى API الخارجية.
- يعرض النتائج كقائمة سطور؛ الضغط على أي سطر يرسم الـ bounding box فوق الصورة.

## التشغيل

```bash
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

افتح المتصفح على: http://127.0.0.1:8000/

## الإعداد
- لتغيير عنوان الـ API استخدم متغير البيئة `RQMNH_API_URL` أو عدل `app/config.py`.
- الواجهة RTL ومناسبة للجوال.

## Docker
```bash
docker build -t rqmnh-fullstack .
docker run --rm -p 8000:8000 rqmnh-fullstack
```
