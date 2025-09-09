
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from .config import settings
from .api import router as api_router

app = FastAPI(title=settings.APP_NAME, debug=settings.DEBUG)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files from the old structure (for backward compatibility)
app.mount("/static", StaticFiles(directory="app/static"), name="static")

# Include API routes
app.include_router(api_router)

# Mount Vite-built assets
if os.path.exists("dist"):
    # Production: serve built Vite assets
    app.mount("/assets", StaticFiles(directory="dist/assets"), name="assets")
    
    @app.get("/")
    async def read_index():
        return FileResponse("dist/index.html")
    
    # Catch-all route for SPA routing
    @app.get("/{full_path:path}")
    async def catch_all(full_path: str):
        # Don't interfere with API routes
        if full_path.startswith("api/"):
            return {"error": "API route not found"}
        # Serve index.html for all other routes (SPA routing)
        return FileResponse("dist/index.html")
else:
    # Development: simple fallback when dist doesn't exist
    @app.get("/")
    async def development_fallback():
        return {
            "message": "Document Digitizer",
            "status": "Development Mode",
            "frontend": "Run 'cd frontend-react && npm run dev' to start the React development server",
            "docs": "/docs"
        }
