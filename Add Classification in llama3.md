---

# Classification with LLaMA 3

---

## Simple Definition

**Classification with LLaMA 3** means:

> Teaching the model to **categorize input into predefined labels** (e.g., intent, sentiment, topic).

Instead of generating long answers, the model **selects the correct class**.

---

## Examples of Classification

- **Intent Detection** → "I want a refund" → `Refund Request`
    
- **Sentiment Analysis** → "This product is amazing!" → `Positive`
    
- **Topic Classification** → "Stock market crashed" → `Finance`
    

---

## Mental Model

Think of LLaMA 3 as:

> A smart assistant that reads text and **assigns it to the correct bucket (label)**.

---

# Types of Classification

---

## 1. Binary Classification

Only **2 classes**

Example:

- Spam / Not Spam
    
- Positive / Negative
    

---

## 2. Multi-Class Classification

More than **2 categories (only one correct)**

Example:

- Intent → `Order`, `Refund`, `Complaint`, `Inquiry`
    

---

## 3. Multi-Label Classification

Multiple labels can be **true at the same time**

Example:

- "The product is cheap but slow"  
    → `Positive Price`, `Negative Performance`
    

---

# 1. Dataset for Classification

---

## JSONL Format

```python
{"input": "I want my money back", "label": "Refund"}
{"input": "Where is my order?", "label": "Order Tracking"}
{"input": "This product is amazing!", "label": "Positive"}
```

---

## Instruction Format (Better for LLMs)

```python
{
  "instruction": "Classify the intent",
  "input": "I want a refund",
  "output": "Refund"
}
```

---

## Pro Tip

Always keep labels:

- Clear
    
- Consistent
    
- Limited in number
    

---

# 2. Prompt-Based Classification (No Training)

---

## Zero-Shot Example

```python
prompt = """
Classify the intent into:
[Refund, Order Tracking, Complaint]

Text: I want my money back
Answer:
"""
```

---

## Few-Shot Example

```python
prompt = """
Text: Where is my order?
Intent: Order Tracking

Text: I want refund
Intent: Refund

Text: This is bad service
Intent: Complaint

Text: I want my money back
Intent:
"""
```

---

## When to Use

- Small projects
    
- No GPU
    
- Fast prototyping
    

---

# 3. Fine-Tuning for Classification

---

## Dataset Example

```python
{"input": "I want refund", "output": "Refund"}
{"input": "Track my order", "output": "Order Tracking"}
{"input": "Bad service", "output": "Complaint"}
```

---

## Key Idea

> Model learns to map input → label

---

## Training Tip

Use **short outputs (labels only)** instead of sentences.

✔ Good:

```python
"Refund"
```

❌ Bad:

```python
"This is a refund request"
```

---

# 4. Multi-Class Classification Strategy

---

## Step 1: Define Classes

Example:

```python
classes = ["Refund", "Order Tracking", "Complaint", "Inquiry"]
```

---

## Step 2: Balanced Dataset

Avoid bias:

```python
Refund → 100 samples
Complaint → 100 samples
Inquiry → 100 samples
```

---

## Step 3: Add Variations

```python
"I want refund"
"Give my money back"
"Cancel my order and refund"
```

---

## Step 4: Train with LoRA

Same pipeline as fine-tuning:

- Load model
    
- Apply LoRA
    
- Train on labeled dataset
    

---

# 5. Improving Classification Accuracy

---

## 1. Better Data

- Add real-world queries
    
- Include typos & slang
    
- Cover edge cases
    

---

## 2. Clear Labels

Bad:

```python
"Support"
```

Good:

```python
"Technical Support"
"Billing Support"
```

---

## 3. Use Instruction Prompts

```python
"Classify the intent into one of [Refund, Complaint, Inquiry]"
```

---

## 4. Reduce Output Variance

Force model:

```python
"Answer with ONLY one label"
```

---

## 5. Temperature Control

```python
temperature = 0
```

→ More deterministic output

---

# 6. Evaluation Metrics for Classification

---

## 1. Accuracy

```python
accuracy = correct_predictions / total_predictions
```

---

## 2. Precision

> Out of predicted positives, how many are correct?

---

## 3. Recall

> Out of actual positives, how many were found?

---

## 4. F1 Score

```python
F1 = 2 * (precision * recall) / (precision + recall)
```

---

## 5. Confusion Matrix

Example:

|Actual \ Predicted|Refund|Complaint|Inquiry|
|---|---|---|---|
|Refund|90|5|5|
|Complaint|10|80|10|

---

## Python Example

```python
from sklearn.metrics import classification_report

print(classification_report(y_true, y_pred))
```

---

# 7. Testing Classification

---

## Manual Testing

```python
prompt = "I didn't receive my order"

# Expected → Order Tracking / Complaint
```

---

## Batch Testing

```python
test_data = [...]

for item in test_data:
    pred = model.generate(item["input"])
```

---

## Real-World Testing

- Use real customer queries
    
- Monitor wrong predictions
    

---

# 8. Common Mistakes

---

### ❌ Too Many Classes

- Hard to learn
    

✔ Fix: Start with 3–5 classes

---

### ❌ Overlapping Labels

```python
"Complaint"
"Bad Experience"
```

→ Confusing

---

### ❌ Imbalanced Data

- Model favors majority class
    

---

### ❌ Long Outputs

- Reduces accuracy
    

---

# 9. Advanced Techniques

---

## 1. Label Mapping

Convert output → structured format

```python
label_to_id = {
  "Refund": 0,
  "Complaint": 1
}
```

---

## 2. Chain-of-Thought (Optional)

```python
Explain reasoning, then classify
```

(Not always needed for speed)

---

## 3. Hierarchical Classification

Example:

Step 1 → Intent type  
Step 2 → Sub-intent

---

## 4. Ensemble Method

Combine:

- Prompt-based
    
- Fine-tuned model
    

---

# 10. Real-World Use Cases

---

## 1. Customer Support Router

```python
if intent == "Refund":
    route_to_refund_team()
```

---

## 2. Sentiment Monitoring

- Analyze reviews
    
- Detect negative feedback
    

---

## 3. Email Classification

- Spam
    
- Important
    
- Promotions
    

---

# 11. Key Points

- Classification = input → label
    
- Use JSONL labeled data
    
- Prefer short outputs
    
- Balance dataset
    
- Evaluate using accuracy, F1
    
- Use LoRA for efficiency
    

---

# Interview Summary

- LLaMA 3 can perform classification via prompting or fine-tuning
    
- Multi-class = one label, multi-label = multiple labels
    
- Accuracy improves with better data and clear labels
    
- Evaluation = accuracy, precision, recall, F1-score
    
- Use deterministic decoding for consistent results
    

---

If you want, I can also generate:

✅ End-to-end project (API + UI)  
✅ Hugging Face training script  
✅ Real dataset for practice  
✅ Confusion matrix visualization code