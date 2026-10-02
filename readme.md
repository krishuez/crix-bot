Install deps: npm install.
Configure .env with your IDs and keys.
Run node deploy-commands.js to register commands.
Run node index.js to start.
Note on Guardrails:
The /exchange modal logic checks if amount < 1 and rejects it.
The Gemini AI system prompt specifically instructs the AI to tell users that rates are fixed and no negotiation is allowed.
The /rates command explicitly mentions "Fixed. No negotiation."