import os
import base64
import uvicorn
import requests
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

class LogoGenerationRequest(BaseModel):
    prompt: str
    style: str = "modern"
    background: str = "transparent"

@app.post("/generate-logo")
async def generate_logo(request: LogoGenerationRequest):
    try:
        # Retrieve FAL API key from environment variable
        fal_key = os.getenv('FAL_KEY')
        if not fal_key:
            raise HTTPException(status_code=500, detail="FAL API key not configured")

        # Detailed prompt for logo generation
        detailed_prompt = f"""
        Design a professional logo icon for CodeQual.dev:
        - Shield-shaped logo with clean, modern design
        - Two angle brackets `<` and `>` as stylized 'eyes'
        - Centered green checkmark `✓` as a 'smile'
        - Dark grey outline
        - White background
        - Flat, vector-style illustration
        Convey code quality, trust, and positivity
        """

        # FAL AI API endpoint for Flux image generation
        api_url = "https://fal.ai/api/fal/fast/flux1"
        
        # Prepare headers and payload
        headers = {
            "Authorization": f"Key {fal_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "prompt": detailed_prompt,
            "negative_prompt": "photorealistic, 3D, complex, busy, text, words",
            "width": 512,
            "height": 512,
            "num_inference_steps": 20,
            "guidance_scale": 7.5
        }
        
        # Make API request
        response = requests.post(api_url, json=payload, headers=headers)
        
        # Check if request was successful
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail=response.text)
        
        # Extract image data
        result = response.json()
        image_url = result.get('images', [{}])[0].get('url')
        
        if not image_url:
            raise HTTPException(status_code=500, detail="No image generated")

        return {"logo": image_url}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {"message": "Logo Generation Server for CodeQual.dev"}

if __name__ == "__main__":
    print(f"FAL Key {'is configured' if os.getenv('FAL_KEY') else 'is NOT configured'}")
    uvicorn.run(app, host="0.0.0.0", port=7777)
