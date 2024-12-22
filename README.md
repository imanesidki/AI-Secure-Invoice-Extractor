# AI-Secure-Invoice-Extractor
A Dockerized full-stack web app that uses the llama3 LLM for secure extraction of structured data from invoices and receipts.<br>All data processing takes place on the server (or locally if self-hosted), ensuring that sensitive information never leaves your controlled environment.<br>

#### Features
Local-Only Privacy: No external API calls. Everything runs within your controlled environment using the pulled llama3 model from ollama, ensuring your documents remain private at all times.<br>
Simple UI: Upload your file and view structured extracted data in one click.<br>
Dockerized: Easy to deploy anywhere Docker is supported.<br>

#### Note 
The app is not currently publicly hosted. You can run it locally or in your private server. If publicly hosted in the future, all processing will still occur on the server side, safeguarding data privacy.<br>

<br/>
### How It Works
Home Page: The first screenshot (below) shows the initial home page before uploading a file.
<img width="945" alt="Home Page" src="https://github.com/user-attachments/assets/d77fff68-657a-4547-90a0-1dd12e7cdbce" />

File Upload: The second screenshot demonstrates uploading an invoice or receipt.
<img width="958" alt="Uploading File" src="https://github.com/user-attachments/assets/df3f8824-e124-461b-90aa-2bae3e355c98" />

Extracted Data: After the file is processed, the app displays structured data extracted from the document.
<img width="955" alt="Extracted Information" src="https://github.com/user-attachments/assets/2da132f7-dff2-4353-8f1d-2aa54800bfd7" />
<br/>
Note: The invoice shown uses dummy data to maintain privacy.
