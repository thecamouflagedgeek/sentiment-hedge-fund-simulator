
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

tokenizer = AutoTokenizer.from_pretrained("yiyanghkust/finbert-tone")
model = AutoModelForSequenceClassification.from_pretrained("yiyanghkust/finbert-tone")

labels =["Positive","Negative","Neutral"]

def analyze(text):
    inputs = tokenizer(text, return_tensors="pt", truncation=True,max_length=512)
    outputs =model(**inputs)
    probs = torch.nn.functional.softmax(outputs.logits,dim =-1)
    sentiment = labels[torch.argmax(probs)]
    score = torch.max(probs).item()
    return {"sentiment":sentiment,"confidence":round(score,3)}

