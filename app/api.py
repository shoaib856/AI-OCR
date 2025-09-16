import httpx
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Query, Body
from fastapi.responses import JSONResponse
from .config import settings
from typing import Union
from openai import OpenAI


router = APIRouter(prefix="/api", tags=["api"])

JSON = Union[dict, list, str, int, float, bool, None]


@router.get("/health")
def health():
    return {"status": "ok"}


@router.post("/extract")
async def extract_text(
    file: UploadFile = File(...),
    SUPPORTED_LANGUAGES: str = Form(default=settings.DEFAULT_LANG),
    clasifier: bool = Form(default=settings.DEFAULT_CLASIFIER),
):
    """
    Proxy to the external RQMNH API with multipart form.
    Returns JSON with fields: status, signal, document_type, line_datas...
    """
    # Prepare multipart fields
    form_data = {
        "SUPPORTED_LANGUAGES": SUPPORTED_LANGUAGES,
        "clasifier": "true"
        if str(clasifier).lower() in ("true", "1", "yes")
        else "false",
    }

    content = await file.read()
    files = {
        "file": (
            file.filename,
            content,
            file.content_type or "application/octet-stream",
        )
    }

    params = {
        "SUPPORTED_LANGUAGES": SUPPORTED_LANGUAGES,
        "clasifier": form_data["clasifier"],
    }

    try:
        timeout = httpx.Timeout(30.0, connect=10.0)
        async with httpx.AsyncClient(timeout=timeout) as client:
            resp = await client.post(
                settings.RQMNH_API_URL, params=params, data=form_data, files=files
            )
            resp.raise_for_status()
            return JSONResponse(resp.json())
    except httpx.HTTPStatusError as e:
        return JSONResponse(
            {
                "status": "Error",
                "detail": f"Upstream error {e.response.status_code}",
                "body": e.response.text,
            },
            status_code=502,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/chat")
async def chat(
    query: str = Query(..., description="What's name in the ID"),
    payload: JSON = Body(..., description="Any Json Payload"),
):
    endpoint = "https://ai-foundry-muller.openai.azure.com/openai/v1/"
    deployment_name = "gpt-4o"
    api_key = "BOpAwR5PJnS5RhY49bLIQ8DQn2BRjOJn37L7q6FZMBOnxJVqGlf7JQQJ99BIACYeBjFXJ3w3AAAAACOGJt3k"

    client = OpenAI(base_url=endpoint, api_key=api_key)

    completion = client.chat.completions.create(
        model=deployment_name,
        messages=[
            {
                "role": "system",
                "content": "You are an AI assistant analyzing OCR documents.Please respond in Arabic only. without any special characters.",
            },
            {"role": "user", "content": f"OCR Data:\n{payload}"},
            {"role": "user", "content": query},
        ],
    )

    return completion.choices[0].message.content
