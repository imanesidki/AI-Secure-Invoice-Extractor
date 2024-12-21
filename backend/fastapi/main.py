from fastapi import FastAPI, File, UploadFile, Depends, HTTPException
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from paddleocr import PaddleOCR
from colorama import Fore
from io import BytesIO
from PIL import Image
import numpy as np
import requests
import json

app = FastAPI()
ocr = PaddleOCR(use_angle_cls=True, lang="fr")
security = HTTPBasic()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def extract_text_from_image(image_file):
    print(Fore.MAGENTA + "Extracting text from the image..." + Fore.RESET)
    image = Image.open(BytesIO(image_file)).convert("RGB")
    image_np = np.array(image)
    result = ocr.ocr(image_np, cls=True)
    extracted_text = []
    for line in result:
        for word_info in line:
            extracted_text.append(word_info[1][0])

    return extracted_text


def generate_llm_response(prompt):
    url = "http://ollama:11434/api/generate"
    response = requests.post(
        url, json=
        {
            "prompt": prompt,
            "stream": False,
            "model": "llama3.1"
        }
    )

    if response.status_code == 200:
        return response.json()["response"]
    else:
        raise Exception(
            f"Failed to generate LLM response: {response.status_code} {response.text}"
        )


# Function to process invoice text and return JSON
def process_invoice(invoice_text):
    # Create the prompts for the Extractor and Responder agents
    extractor_prompt = f"""
    Extract the following details from the invoice text:
        - Invoice Client Information:
            - Name of the invoice receiver
            - ICE (Identification Code)
            - Email
            - Invoice Address
            - Shipping Address
        - Invoice Date (invoiceAt)
        - Invoice Due Date (invoiceDueAt)
        - Total Amount (amount)
        - Invoice Items:
            - Unit Price
            - Quantity
            - TVA (Tax)
            - Discount
            - Net Amount
            - Amount
            - Name of the Item.
    Invoice text: '{invoice_text}'.
    """

    responder_prompt = f"""
    Respond with a JSON containing the invoice details extracted. Respond with only JSON don't add any text, notes, requests, or explanations to the response.
    """

    # Generate the LLM responses
    extraction_result = generate_llm_response(extractor_prompt)

    # Adding expected output format
    responder_prompt_with_expected_output = f"""
    The extracted details: {extraction_result}. 
    {responder_prompt}
    The expected output is:
    {{
        "invoiceClient": {{
            "name": "string",
            "ICE": "number",
            "email": "string",
            "invoiceAddress": "string",
            "shippingAddress": "string"
        }},
        "invoiceAt": "YYYY-MM-DD",
        "invoiceDueAt": "YYYY-MM-DD",
        "amount": "number",
        "invoiceItems": [
            {{
                "unitPrice": "number",
                "quantity": "number",
                "tva": "number",
                "discount": "number",
                "netAmount": "number",
                "amount": "number",
                "name": "string"
            }}
        ]
    }}
    In case you didn't find a specific value, it should be null for strings and 0 for number values.
    """

    response_result = generate_llm_response(responder_prompt_with_expected_output)
    print(Fore.CYAN + "Response result: ", response_result, Fore.RESET)
    output_json = json.loads(response_result)
    return output_json


# Authenticate user
def authenticate_user(credentials: HTTPBasicCredentials = Depends(security)):
    correct_username = "user"
    correct_password = "pass"
    if credentials.username != correct_username or credentials.password != correct_password:
        raise HTTPException(status_code=401, detail="Incorrect username or password")


@app.get("/")
def read_root():
    return {"Invoice API": "Welcome to Invoice API"}

@app.post("/extract_invoice")
async def extract_invoice(
    image: UploadFile = File(...),
    credentials: HTTPBasicCredentials = Depends(authenticate_user),
):
    # Step 1: Extract text from image
    image_data = await image.read()
    invoice_text = extract_text_from_image(image_data)
    print(Fore.GREEN + "Extracted text: ", invoice_text, Fore.RESET)

    # Step 2: Process the extracted text and get the JSON response
    json_response = process_invoice(invoice_text)

    return JSONResponse(content=json_response)